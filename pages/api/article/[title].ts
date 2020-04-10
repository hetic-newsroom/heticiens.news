import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../lib/database';
import {Article, Contributor} from '../../../lib/data-validator';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const query = req.query.title as string;
	const title = query.replace(/-/g, ' ');

	const db = new Database();
	let article;

	try {
		const res = await db.read('Articles', {
			title
		}, {
			count: 1,
			index: 'title',
			attributes: [
				'date',
				'title',
				'intro',
				'category',
				'author',
				'readTime',
				'content'
			]
		});
		const Items = res.Items as unknown;
		article = Items[0] as Article;
		if (typeof article === 'undefined') {
			throw new TypeError('not found');
		}
	} catch (error) {
		if (error.message === 'not found') {
			res.status(404);
			res.end();
			return;
		}

		res.status(500);
		res.json(error);
		return;
	}

	let author;
	try {
		const res = await db.read('Contributors', {
			id: article.author
		}, {
			count: 1,
			attributes: [
				'name',
				'picture'
			]
		});
		const Items = res.Items as unknown;
		author = Items[0] as Contributor;
	} catch (_) {
		res.status(500);
		res.end('Author not found');
		return;
	}

	article.author = author;

	res.status(200);
	res.setHeader('Cache-control', 'public, max-age=172800, must-revalidate');
	res.json(article);
};
