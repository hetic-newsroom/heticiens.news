const crypto = require('crypto');
const AWS = require('aws-sdk');
const {nanoid} = require('nanoid');

AWS.config.update({
	region: 'eu-west-3',
	endpoint: 'http://localhost:8000',
	credentials: {
		accessKeyId: 'blob',
		secretAccessKey: 'random'
	}
});

const dynamodb = new AWS.DynamoDB();

const params = {
	TableName: 'Articles',
	KeySchema: [
		{AttributeName: 'id', KeyType: 'HASH'},
		{AttributeName: 'date', KeyType: 'RANGE'}
	],
	AttributeDefinitions: [
		{AttributeName: 'id', AttributeType: 'S'},
		{AttributeName: 'date', AttributeType: 'N'},
		{AttributeName: 'title', AttributeType: 'S'},
		{AttributeName: 'category', AttributeType: 'S'}
	],
	GlobalSecondaryIndexes: [
		{
			IndexName: 'title',
			KeySchema: [
				{AttributeName: 'title', KeyType: 'HASH'}
			],
			Projection: {
				ProjectionType: 'ALL'
			},
			ProvisionedThroughput: {
				ReadCapacityUnits: 5,
				WriteCapacityUnits: 5
			}
		},
		{
			IndexName: 'category',
			KeySchema: [
				{AttributeName: 'category', KeyType: 'HASH'}
			],
			Projection: {
				ProjectionType: 'ALL'
			},
			ProvisionedThroughput: {
				ReadCapacityUnits: 5,
				WriteCapacityUnits: 5
			}
		}
	],
	ProvisionedThroughput: {
		ReadCapacityUnits: 5,
		WriteCapacityUnits: 5
	}
};

dynamodb.createTable(params, async (error, data) => {
	if (error) {
		console.error('Unable to create table. Error:', JSON.stringify(error, null, 2));
	} else {
		console.log('Created table:', JSON.stringify(data, null, 2));

		const docClient = new AWS.DynamoDB.DocumentClient();

		docClient.put({
			TableName: 'Articles',
			Item: {
				id: nanoid(),
				title: 'This is a test article',
				date: Date.now(),
				category: 'interviews',
				author: 'contributor_id',
				visits: 0,
				readTime: 20000,
				content: '<p>Lorem ipsum dolor sit amet.</p>'
			}
		}).promise().then(() => {
			console.log('Table populated');
		}).catch(error_ => {
			console.log('Table population error:', JSON.stringify(error_, null, 2));
		});
	}
});
