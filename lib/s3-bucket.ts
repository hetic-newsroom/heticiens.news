import AWS from 'aws-sdk';
import {customAlphabet} from 'nanoid';
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 20);

const bucket = 'heticiensnews-assets';
const baseFolder = 'images';

export default class Bucket {
	_client: AWS.S3;

	constructor() {
		AWS.config.apiVersions = {
			s3: '2006-03-01'
		};

		this._client = new AWS.S3();
	}

	async upload(base64: string, format: string): Promise<string | Error> {
		const data = Buffer.from(base64, 'base64');
		const id = nanoid();
		const key = `${baseFolder}/${id}.${format}`;

		await new AWS.S3.ManagedUpload({
			service: this._client,
			params: {
				Bucket: bucket,
				Key: key,
				Body: data,
				StorageClass: 'INTELLIGENT_TIERING'
			}
		}).promise().catch(error => {
			throw error;
		});

		return key;
	}
}
