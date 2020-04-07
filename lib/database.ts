import AWS from 'aws-sdk/global';
import Request from 'aws-sdk/lib/request';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import {customAlphabet} from 'nanoid';
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

type StoreableValue = string | number | boolean | object | any[] | Buffer | DataView | Uint8Array | null;

type CrudOpResult = Request.PromiseResult<DynamoDB.QueryOutput, AWS.AWSError>;

type order = 'ascending' | 'descending';

interface Key {
	[key: string]: StoreableValue;
}

interface QueryOptions {
	index: string;
	filter: string;
	filterValues: Key;
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

	async read(TableName: string, options: Partial<QueryOptions>): Promise<CrudOpResult> {
		return this._client.query({
			TableName,
			IndexName: options.index || null,
			KeyConditionExpression: options.filter || null,
			ExpressionAttributeValues: options.filterValues || null,
			ExclusiveStartKey: options.startFrom || null,
			Limit: options.count || 20,
			ScanIndexForward: (options.order === 'descending')
		}).promise();
	}

	async put(TableName: string, Item: Key): Promise<CrudOpResult> {
		return this._client.put({
			TableName,
			Item
		}).promise();
	}

	async borrow(TableName: string, identifier: Key, index?: string): Promise<object> {
		const filters = [];
		const filterValues = {};
		Object.keys(identifier).forEach(key => {
			const id = nanoid();
			filters.push(`${key} = :${id}`);
			filterValues[`:${id}`] = identifier[key];
		});

		const filter = filters.join(' and ');

		const res = await this.read(TableName, {
			filter,
			filterValues,
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
								TableName,
								Item
							}).promise();
						};

					case 'drop':

						return async (): Promise<CrudOpResult> => {
							return this._client.delete({
								TableName,
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
