import {NextApiRequest, NextApiResponse} from 'next';
import Bucket from '../../lib/s3-bucket';
import {validateToken, AuthFailure} from './auth';

const acceptedImageFormats = [
	'jpg',
	'jpeg',
	'png',
	'svg',
	'gif'
];

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const token = req.query.token as string;

	if (req.method !== 'POST') {
		res.status(400);
		res.end();
		return;
	}

	const authResponse = await validateToken(token);

	if (authResponse.statusCode !== 200) {
		const {statusCode, error} = authResponse as AuthFailure;

		res.status(statusCode);
		res.json({error});
		return;
	}

	const bucket = new Bucket();

	// Upload image
	const fileExtension = req.body.slice(
		req.body.indexOf('data:image/') as number + 11,
		req.body.indexOf(';base64')
	);

	if (!acceptedImageFormats.includes(fileExtension)) {
		res.status(400);
		res.json({
			error: 'Bad image format'
		});
		return;
	}

	const base64 = req.body.replace(/^.*,/, ''); // Strip metadata
	const key = await bucket.upload(base64, fileExtension);
	const url = `https://bucket.heticiens.news/${key as string}`;

	res.status(201);
	res.setHeader('Cache-Control', 'no-store');
	res.json({
		url
	});
};

export const config = {
	api: {
		bodyParser: {
			sizeLimit: '5mb'
		}
	}
};
