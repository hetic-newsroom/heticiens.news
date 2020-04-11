import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../lib/database';
import {Article} from '../../lib/data-validator';

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
				'date',
				'title',
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
		articles.forEach(async (article: Article) => {
			const res = await db.query('Contributors', {
				id: article.author
			}, {
				count: 1,
				attributes: [
					'name'
				]
			}).catch(error => {
				throw error;
			});
			const Items = res.Items as unknown;
			article.author = Items[0];
		});
	} catch (_) {
		res.status(500);
		res.end('Author not found');
		return;
	}

	res.status(200);
	res.setHeader('Cache-control', 'public, max-age=43200, must-revalidate');
	res.json({articles});
};
