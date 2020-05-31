import crypto from 'crypto';
import scrypt from 'scrypt-js';
import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../lib/database';
import Bucket from '../../../lib/s3-bucket';
import {getContributor} from './[id]';
import {UnhashedPassword, Contributor, Email, socialLinks} from '../../../lib/data-validator';
import {validateToken, AuthFailure} from '../auth';
import {makeSlug} from './[id]/drafts/new';

const acceptedImageFormats = [
	'jpg',
	'jpeg',
	'png',
	'svg',
	'gif'
];

async function hash(string) {
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

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const token = req.body.token as string;

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

	const requesteeId = token.split('||')[0];
	const requestee = await getContributor(requesteeId, true, true);

	if (requestee.moderator < 2) { // Only supermoderators can create contributors
		res.status(403);
		res.end();
		return;
	}

	const contributor = req.body.contributor as Contributor;

	const db = new Database();

	if (
		typeof contributor.bio !== 'string' ||
		contributor.bio.length === 0 ||
		typeof contributor.name !== 'string' ||
		contributor.name.length < 5 ||
		typeof contributor.sex !== 'string' ||
		contributor.sex.length !== 1 ||
		!UnhashedPassword.test(contributor.password) ||
		typeof contributor.email !== 'string' ||
		!Email.test(contributor.email) ||
		typeof contributor.social !== 'object'
	) {
		res.status(400);
		res.json({
			error: 'Missing or incorrect fields'
		});
		return;
	}

	contributor.id = makeSlug(contributor.name);
	contributor.password = await hash(contributor.password) as string;
	contributor.moderator = 0;
	contributor.drafts = [];
	contributor.articles = [];

	if (contributor.picture.includes('base64')) {
		const bucket = new Bucket();

		// Upload image
		const fileExtension = req.body.contributor.picture.slice(
			req.body.contributor.picture.indexOf('data:image/') as number + 11,
			req.body.contributor.picture.indexOf(';base64')
		);

		if (!acceptedImageFormats.includes(fileExtension)) {
			res.status(400);
			res.json({
				error: 'Bad image format'
			});
			return;
		}

		const base64 = req.body.contributor.picture.replace(/^.*,/, ''); // Strip metadata
		const key = await bucket.upload(base64, fileExtension);
		contributor.picture = `https://bucket.heticiens.news/${key as string}`;
	} else {
		contributor.picture = 'no-picture';
	}

	const filteredSocial = {};

	for (const [network, link] of Object.entries(contributor.social)) {
		const _link = link;
		if (_link.trim().length > 0) {
			filteredSocial[network] = _link;
		}
	}

	contributor.social = filteredSocial as socialLinks;

	try {
		await db.put('Contributors', {...contributor});
	} catch (error) {
		res.status(400);
		res.json({error});
	}

	res.status(201);
	res.setHeader('Cache-Control', 'no-store');
	res.json({
		id: contributor.id
	});
};

export const config = {
	api: {
		bodyParser: {
			sizeLimit: '5mb'
		}
	}
};
