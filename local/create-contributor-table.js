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

function hash(string) {
	return new Promise(resolve => {
		string = Buffer.from(string.normalize('NFKC'), 'utf8');
		crypto.randomBytes(32, async (error, salt) => {
			if (error) {
				throw error;
			}

			const N = 1024;
			const r = 8;
			const p = 1;
			const dkLen = 32;

			const hash = await scrypt.scrypt(string, salt, N, r, p, dkLen);

			resolve(`${salt.toString('hex')}::${Buffer.from(hash).toString('hex')}`);
		});
	});
}

const dynamodb = new AWS.DynamoDB();

const params = {
	TableName: 'Contributors',
	KeySchema: [
		{AttributeName: 'id', KeyType: 'HASH'}
	],
	AttributeDefinitions: [
		{AttributeName: 'id', AttributeType: 'S'},
		{AttributeName: 'email', AttributeType: 'S'},
		{AttributeName: 'name', AttributeType: 'S'},
		{AttributeName: 'moderator', AttributeType: 'N'}
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
		},
		{
			IndexName: 'name',
			KeySchema: [
				{AttributeName: 'name', KeyType: 'HASH'}
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
			IndexName: 'moderator',
			KeySchema: [
				{AttributeName: 'moderator', KeyType: 'HASH'}
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

		const password = await hash('rosebud');

		docClient.batchWrite({
			RequestItems: {
				'Contributors': [
					{
						PutRequest: {
							Item: {
								id: 'tester1',
								name: 'Tester',
								email: 'test@heticiens.news',
								password,
								tokens: [],
								moderator: 1,
								sex: 'F',
								bio: `I'm a test account, hello there!`,
								picture: 'no-picture',
								social: {
									twitter: 'https://twitter.com/jack'
								},
								articles: [
									'test-article',
									'sean-connery-et-la-vodka'
								]
							}
						}
					},
					{
						PutRequest: {
							Item: {
								id: 'tester2',
								name: 'Jean Michel Tester',
								email: 'testi@heticiens.news',
								password,
								tokens: [],
								moderator: 0,
								sex: 'H',
								bio: `Je suis un compte de test, salut!`,
								picture: 'no-picture',
								social: {
									twitter: 'https://twitter.com/jack',
									linkedin: 'https://linkedin.com'
								},
								articles: [
									'sean-connery-et-la-vodka'
								]
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
