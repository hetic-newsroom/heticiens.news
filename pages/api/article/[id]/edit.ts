import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../../lib/database';
import Bucket from '../../../../lib/s3-bucket';
import {getArticle} from '../[id]';
import {getContributor} from '../../contributor/[id]';
import {Article, Email, Contributor} from '../../../../lib/data-validator';
import {validateToken, AuthFailure} from '../../auth';

const acceptedImageFormats = [
	'jpg',
	'jpeg',
	'png',
	'svg',
	'gif'
];

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const articleId = req.query.id as string;
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

	const userId = token.split('||')[0];
	const user = await getContributor(userId, true, true);

	if (user.moderator !== 1) {
		res.status(403);
		res.end();
		return;
	}

	getArticle(articleId).then(async _ => {
		const edition = req.body.article as Article;

		const db = new Database();

		const dbArticle = await db.borrow('Articles', {id: articleId}) as any;

		if (JSON.stringify(dbArticle.authors) !== JSON.stringify(edition.authors)) {
			console.log('not same authors');
			// Check & fill authors
			let i = 0;
			for (const author of edition.authors) {
				let Items;
				if (Email.test(author as string)) {
					const dbRes = await db.query('Contributors', {
						email: author
					}, {
						count: 1,
						index: 'email',
						attributes: ['id']
					});
					Items = dbRes.Items as unknown[];
				} else {
					const dbRes = await db.query('Contributors', {
						id: author
					}, {
						count: 1,
						attributes: ['id']
					});
					Items = dbRes.Items as unknown[];
				}

				if (Items.length === 0) {
					res.status(400);
					res.json({
						error: `Could not find contributor ${author as string}`
					});
					return;
				}

				const contributor = Items[0] as Contributor;
				edition.authors[i] = contributor.id;
				i++;
			}

			dbArticle.authors = edition.authors;
		}

		if (dbArticle.title !== edition.title) {
			console.log('not same title');
			dbArticle.title = edition.title;
		}

		if (dbArticle.category !== edition.category) {
			console.log('not same category');
			dbArticle.category = edition.category;
		}

		if (dbArticle.intro !== edition.intro) {
			console.log('not same intro');
			dbArticle.intro = edition.intro;
		}

		if (dbArticle.content !== edition.content) {
			console.log('not same content');
			dbArticle.content = edition.content;
		}

		if (edition.content.includes('base64')) {
			console.log('not same image');
			const bucket = new Bucket();

			// Upload image
			const fileExtension = edition.image.slice(
				edition.image.indexOf('data:image/') + 11,
				edition.image.indexOf(';base64')
			);

			if (!acceptedImageFormats.includes(fileExtension)) {
				res.status(400);
				res.json({
					error: 'Bad image format'
				});
				return;
			}

			const base64 = edition.image.replace(/^.*,/, ''); // Strip metadata
			const key = await bucket.upload(base64, fileExtension);
			dbArticle.image = `https://bucket.heticiens.news/${key as string}`;
		}

		try {
			await dbArticle.save();
		} catch (error) {
			console.log(error);
			res.status(500);
			res.end();
		}

		res.status(200);
		res.setHeader('Cache-Control', 'no-store');
		res.end();
	}).catch(error => {
		if (error.message === 'not found') {
			res.status(404);
			res.end();
			return;
		}

		res.status(500);
		res.json(error);
	});
};
