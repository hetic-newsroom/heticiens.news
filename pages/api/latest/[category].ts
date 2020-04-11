import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../lib/database';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const category = req.query.category as string;
	const count = Number(req.query.count as string);

	const db = new Database();
	let articles;

	try {
		const res = await db.query('Articles', {
			category
		}, {
			count: count || 10,
			index: 'category',
			attributes: [
				'date',
				'title',
				'image',
				'intro',
				'category',
				'author'
			],
			order: 'ascending'
		});
		const Items = res.Items as unknown;
		articles = Items;

		if (articles.length === 0) {
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

	try {
		for (const article of articles) {
			/* eslint-disable-next-line no-await-in-loop */
			const res = await db.query('Contributors', {
				id: article.author
			}, {
				count: 1,
				attributes: [
					'name'
				]
			});
			const Items = res.Items as unknown;
			article.author = Items[0];
		}
	} catch (_) {
		res.status(500);
		res.end('Author not found');
		return;
	}

	res.status(200);
	res.setHeader('Cache-control', 'public, max-age=43200, must-revalidate');
	res.json({
		category,
		articles
	});
};
