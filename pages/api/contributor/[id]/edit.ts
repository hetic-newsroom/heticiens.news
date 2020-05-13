import crypto from 'crypto';
import scrypt from 'scrypt-js';
import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../../lib/database';
import Bucket from '../../../../lib/s3-bucket';
import {getContributor} from '../[id]';
import {UnhashedPassword} from '../../../../lib/data-validator';
import {validateToken, AuthFailure} from '../../auth';

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
	const contributorId = req.query.id as string;
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

	if (requestee.moderator <= 1 && requesteeId !== contributorId) {
		res.status(403);
		res.end();
		return;
	}

	try {
		const db = new Database();
		const dbContributor = await db.borrow('Contributors', {id: contributorId}) as any;

		if (dbContributor.email !== req.body.new.email) {
			dbContributor.email = req.body.new.email;
		}

		if (dbContributor.picture !== req.body.new.picture && req.body.new.picture.includes('base64')) {
			const bucket = new Bucket();

			// Upload image
			const fileExtension = req.body.new.picture.slice(
				req.body.new.picture.indexOf('data:image/') as number + 11,
				req.body.new.picture.indexOf(';base64')
			);

			if (!acceptedImageFormats.includes(fileExtension)) {
				res.status(400);
				res.json({
					error: 'Bad image format'
				});
				return;
			}

			const base64 = req.body.new.picture.replace(/^.*,/, ''); // Strip metadata
			const key = await bucket.upload(base64, fileExtension);
			dbContributor.picture = `https://bucket.heticiens.news/${key as string}`;
		}

		if (dbContributor.bio !== req.body.new.bio) {
			dbContributor.bio = req.body.new.bio;
		}

		if (req.body.new.password.length > 0) {
			if (!UnhashedPassword.test(req.body.new.password)) {
				res.status(400);
				res.json({
					error: 'Bad password format'
				});
				return;
			}

			dbContributor.password = await hash(req.body.new.password);
		}

		const filteredSocial = {};

		for (const [network, link] of Object.entries(req.body.new.social)) {
			const _link = link as string;
			if (_link.trim().length > 0) {
				filteredSocial[network] = _link;
			}
		}

		if (JSON.stringify(dbContributor.social) !== JSON.stringify(filteredSocial)) {
			dbContributor.social = filteredSocial;
		}

		try {
			await dbContributor.save();
		} catch (error) {
			console.log(error);
			res.status(500);
			res.end();
		}

		res.status(200);
		res.setHeader('Cache-Control', 'no-store');
		res.end();
	} catch (error) {
		if (error.message === 'not found') {
			res.status(404);
			res.end();
			return;
		}

		res.status(500);
		res.json(error);
	}
};

export const config = {
	api: {
		bodyParser: {
			sizeLimit: '5mb'
		}
	}
};
