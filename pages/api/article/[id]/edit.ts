import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../../lib/database';
import Bucket from '../../../../lib/s3-bucket';
import readingTime from 'reading-time';
import {getArticle} from '../[id]';
import {getContributor} from '../../contributor/[id]';
import {makeSlug} from '../../contributor/[id]/drafts/new';
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

	if (user.moderator < 1) {
		res.status(403);
		res.end();
		return;
	}

	getArticle(articleId).then(async _ => {
		const edition = req.body.article as Article;

		const db = new Database();
		const dbArticle = await db.borrow('Articles', {id: articleId}) as any;

		if (dbArticle.status === 'published' && user.moderator < 2) {
			// Published article can only be edited by supermoderators
			res.status(403);
			res.end();
			return;
		}

		if (dbArticle.title !== edition.title) {
			dbArticle.title = edition.title;

			if (dbArticle.status === 'draft') {
				const newSlug = makeSlug(edition.title);
				// Update attribution of authors
				for (const author of dbArticle.authors) {
					const contributor = await db.borrow('Contributors', {id: author}) as any;
					contributor.drafts.splice(contributor.drafts.indexOf(dbArticle.id), 1);
					contributor.drafts.push(newSlug);
					await contributor.save();
				}

				// If name changed and it's still a draft, we can change slug (useful for DO NOT PUBLISH in title)
				dbArticle.id = newSlug;
			}
		}

		if (dbArticle.authors.join(', ') !== edition.authors.join(', ')) {
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

				// If authors not in db, we add it to its own drafts
				if (!dbArticle.authors.includes(author)) {
					const contributor = await db.borrow('Contributors', {id: edition.authors[i - 1]}) as any;
					contributor.drafts.push(edition.id);
					await contributor.save();
				}
			}

			for (const author of dbArticle.authors) {
				// If authors not in edition, we remove it from its own drafts
				if (!edition.authors.includes(author)) {
					const contributor = await db.borrow('Contributors', {id: author}) as any;
					contributor.drafts.splice(contributor.drafts.indexOf(dbArticle.id), 1);
					await contributor.save();
				}
			}

			dbArticle.authors = edition.authors;
		}

		if (dbArticle.category !== edition.category) {
			dbArticle.category = edition.category;
		}

		if (dbArticle.intro !== edition.intro) {
			dbArticle.intro = edition.intro;
		}

		if (dbArticle.content !== edition.content) {
			dbArticle.content = edition.content;

			dbArticle.readTime = Math.round(
				readingTime(`${edition.intro}${edition.content}`)
					.time
			);
		}

		if (edition.image.includes('base64')) {
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
			res.status(400);
			res.json({
				error: error.message
			});
			return;
		}

		res.status(200);
		res.setHeader('Cache-Control', 'no-store');
		res.json({
			slug: dbArticle.id
		});
	}).catch(error => {
		if (error.message === 'not found') {
			res.status(404);
			res.end();
			return;
		}

		res.status(400);
		res.json(error);
	});
};

export const config = {
	api: {
		bodyParser: {
			sizeLimit: '5mb'
		}
	}
};
