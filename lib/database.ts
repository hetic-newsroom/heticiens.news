import AWS from 'aws-sdk/global';
import Request from 'aws-sdk/lib/request';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import {customAlphabet} from 'nanoid';
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

const tablePrefix = (process.env.stage === 'prod') ? 'PROD-' : '';

export type StoreableValue = string | number | boolean | object | any[] | Buffer | DataView | Uint8Array | null;

export type CrudOpResult = Request.PromiseResult<DynamoDB.QueryOutput, AWS.AWSError>;

export type order = 'ascending' | 'descending';

export interface Key {
	[key: string]: StoreableValue;
}

export interface QueryOptions {
	index: string;
	attributes: string[];
	startFrom: Key;
	count: number;
	order: order;
}

export default class Database {
	_client: DynamoDB.DocumentClient;

	constructor() {
		const dynamoDbRegion = 'eu-west-3';

		const localDevOptions = (process.env.NODE_ENV === 'development') ?
			{
				credentials: {
					accessKeyId: 'bogus',
					secretAccessKey: 's e c u r i t y'
				},
				endpoint: 'http://localhost:8000'
			} :
			{};

		this._client = new DynamoDB.DocumentClient({
			convertEmptyValues: true,
			region: dynamoDbRegion,
			...localDevOptions
		});
	}

	async query(TableName: string, identifier: Key, options: Partial<QueryOptions>): Promise<CrudOpResult> {
		const expressionNames = {};
		const expressionValues = {};

		const filters = [];
		Object.keys(identifier).forEach(key => {
			const nameId = nanoid();
			const valueId = nanoid();
			filters.push(`#${nameId} = :${valueId}`);
			expressionNames[`#${nameId}`] = key;
			expressionValues[`:${valueId}`] = identifier[key];
		});

		const projectionAttributes = [];
		if (options.attributes) {
			options.attributes.forEach(attr => {
				const id = nanoid();
				projectionAttributes.push(`#${id}`);
				expressionNames[`#${id}`] = attr;
			});
		}

		const filter = filters.join(' and ');
		const projection = projectionAttributes.join(', ');

		return this._client.query({
			TableName: tablePrefix + TableName,
			IndexName: options.index || null,
			KeyConditionExpression: filter || null,
			ExpressionAttributeValues: (Object.keys(expressionValues).length >= 1) ? expressionValues : null,
			ProjectionExpression: projection || null,
			ExpressionAttributeNames: (Object.keys(expressionNames).length >= 1) ? expressionNames : null,
			ExclusiveStartKey: options.startFrom || null,
			Limit: options.count || 20,
			ScanIndexForward: (options.order === 'descending')
		}).promise();
	}

	async put(TableName: string, Item: Key): Promise<CrudOpResult> {
		return this._client.put({
			TableName: tablePrefix + TableName,
			Item
		}).promise();
	}

	async borrow(TableName: string, identifier: Key, index?: string): Promise<object> {
		const res = await this.query(TableName, identifier, {
			count: 1,
			index
		});

		if (!res.Items) {
			throw new Error('Object not found');
		}

		const Item = res.Items[0];

		return new Proxy(Item, {
			get: (Item, prop) => {
				switch (prop) {
					case 'save':
						return async (): Promise<CrudOpResult> => {
							return this._client.put({
								TableName: tablePrefix + TableName,
								Item
							}).promise();
						};

					case 'drop':

						return async (): Promise<CrudOpResult> => {
							return this._client.delete({
								TableName: tablePrefix + TableName,
								Key: {
									id: Item.id
								}
							}).promise();
						};

					default:
						return Item[prop as string];
				}
			},
			set: (Item, prop, value): boolean => {
				/* eslint-disable-next-line no-return-assign */
				return Item[prop as string] = value;
			}
		});
	}
}
