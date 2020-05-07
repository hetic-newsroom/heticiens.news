import {NextApiRequest, NextApiResponse} from 'next';
import Bucket from '../../lib/s3-bucket';
import {validateToken, AuthFailure} from './auth';
import multipart from 'parse-multipart';

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

	const boundary = multipart.getBoundary(req.headers['content-type']);
	// eslint-disable-next-line new-cap
	const image = multipart.Parse(Buffer.from(req.body, 'utf-8'), boundary)[0];

	const bucket = new Bucket();

	// Upload image
	const fileExtension = image.type.slice(
		image.type.indexOf('image/') as number + 6,
		image.type.length
	);

	if (!acceptedImageFormats.includes(fileExtension)) {
		res.status(400);
		res.json({
			error: {
				message: 'Bad image format'
			}
		});
		return;
	}

	const key = await bucket.upload(null, fileExtension, image.data);
	const url = `https://bucket.heticiens.news/${key as string}`;

	res.status(201);
	res.setHeader('Cache-Control', 'no-store');
	res.json({
		url
	});
};
