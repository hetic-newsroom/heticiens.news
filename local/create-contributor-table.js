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
	TableName: 'Contributors',
	KeySchema: [
		{AttributeName: 'id', KeyType: 'HASH'}
	],
	AttributeDefinitions: [
		{AttributeName: 'id', AttributeType: 'S'},
		{AttributeName: 'email', AttributeType: 'S'}
	],
	GlobalSecondaryIndexes: [
		{
			IndexName: 'email',
			KeySchema: [
				{AttributeName: 'email', KeyType: 'HASH'}
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

dynamodb.createTable(params, (error, data) => {
	if (error) {
		console.error('Unable to create table. Error:', JSON.stringify(error, null, 2));
	} else {
		console.log('Created table:', JSON.stringify(data, null, 2));

		const docClient = new AWS.DynamoDB.DocumentClient();

		docClient.put({
			TableName: 'Contributors',
			Item: {
				id: nanoid(),
				name: 'Tester',
				email: 'test@heticiens.news',
				password: 'rosebud',
				tokens: []
			}
		}).promise().then(() => {
			console.log('Table populated');
		}).catch(error_ => {
			console.log('Table population error:', JSON.stringify(error_, null, 2));
		});
	}
});
