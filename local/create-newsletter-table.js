const crypto = require('crypto');
const AWS = require('aws-sdk');
const scrypt = require('scrypt-js');

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
	TableName: 'Newsletter',
	KeySchema: [
		{AttributeName: 'id', KeyType: 'HASH'}
	],
	AttributeDefinitions: [
		{AttributeName: 'id', AttributeType: 'S'},
		{AttributeName: 'status', AttributeType: 'S'},
		{AttributeName: 'validationToken', AttributeType: 'S'}
	],
	GlobalSecondaryIndexes: [
		{
			IndexName: 'status',
			KeySchema: [
				{AttributeName: 'status', KeyType: 'HASH'}
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
			IndexName: 'validationToken',
			KeySchema: [
				{AttributeName: 'validationToken', KeyType: 'HASH'}
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

		docClient.batchWrite({
			RequestItems: {
				'Newsletter': [
					{
						PutRequest: {
							Item: {
								id: 'subscriber1',
								email: 'subscribing@example.com',
								status: 'unconfirmed',
								validationToken: 'confirm999'
							}
						}
					},
					{
						PutRequest: {
							Item: {
								id: 'subscriber2',
								email: 'hello@heticiens.news',
								status: 'confirmed',
								validationToken: 'verylongstring'
							}
						}
					}
				]
			}
		}).promise().then(() => {
			console.log('Table populated');
		}).catch(error_ => {
			console.log('Table population error:', JSON.stringify(error_, null, 2));
		});
	}
});
