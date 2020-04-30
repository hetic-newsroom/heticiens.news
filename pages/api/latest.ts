import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../lib/database';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const count = Number(req.query.count as string);

	const db = new Database();
	let articles;

	try {
		const res = await db.query('Articles', {
			status: 'published'
		}, {
			count: count || 10,
			index: 'status',
			attributes: [
				'id',
				'date',
				'title',
				'image',
				'intro',
				'category',
				'authors'
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
			const authors = [];

			for (const author of article.authors) {
				/* eslint-disable-next-line no-await-in-loop */
				const res = await db.query('Contributors', {
					id: author
				}, {
					count: 1,
					attributes: [
						'name'
					]
				});
				const Items = res.Items as unknown;
				authors.push(Items[0]);
			}

			article.authors = authors;
		}
	} catch (_) {
		res.status(500);
		res.end('Author not found');
		return;
	}

	res.status(200);
	res.setHeader('Cache-control', 'public, max-age=43200, must-revalidate');
	res.json({articles});
};
