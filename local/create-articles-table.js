const crypto = require('crypto');
const AWS = require('aws-sdk');

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
		{AttributeName: 'id', KeyType: 'HASH'}
	],
	AttributeDefinitions: [
		{AttributeName: 'id', AttributeType: 'S'},
		{AttributeName: 'status', AttributeType: 'S'},
		{AttributeName: 'date', AttributeType: 'N'},
		{AttributeName: 'title', AttributeType: 'S'},
		{AttributeName: 'category', AttributeType: 'S'},
		{AttributeName: 'author', AttributeType: 'S'}
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
			IndexName: 'status',
			KeySchema: [
				{AttributeName: 'status', KeyType: 'HASH'},
				{AttributeName: 'date', KeyType: 'RANGE'}
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
				{AttributeName: 'category', KeyType: 'HASH'},
				{AttributeName: 'date', KeyType: 'RANGE'}
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
			IndexName: 'author',
			KeySchema: [
				{AttributeName: 'author', KeyType: 'HASH'},
				{AttributeName: 'date', KeyType: 'RANGE'}
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
				'Articles': [
					{
						PutRequest: {
							Item: {
								id: 'test_article1',
								title: 'Test article',
								date: Math.floor(Date.now() / 1000),
								category: 'interviews',
								author: 'tester1',
								visits: 0,
								readTime: 20000,
								image: 'https://images.unsplash.com/photo-1586462175816-c0e709898f01?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920',
								intro: 'Lorem ipsum dolor sit amet. Nectet us mergitur, nectet es. Obitur.',
								content: '<p>Lorem ipsum dolor sit amet.</p>',
								status: 'published'
							}
						}
					},
					{
						PutRequest: {
							Item: {
								id: 'test_article2',
								title: 'Sean Connery et la vodka',
								date: Math.floor(Date.now() / 1000) + 5,
								category: 'portraits',
								author: 'tester2',
								visits: 8,
								readTime: 120000,
								image: 'https://images.unsplash.com/photo-1586462175816-c0e709898f01?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920',
								intro: 'Depuis plusieurs années, l\'acteur esquive les attaques de Raspoutine, à qui il a volé un litre de Poliakof. Portrait d\'un homme retranché.',
								content: '<p>Lorem ipsum dolor sit amet.</p><img src="https://images.unsplash.com/photo-1586462175816-c0e709898f01?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920"/><i>Description de cette magnifique image.</i><p>Et oui, cet article continue!</p><h2>Deuxième section</h2><p>Incroyable, non? Lorem ipsum dolor est.</p>',
								status: 'published'
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
