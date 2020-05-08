import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../lib/database';
import {Article} from '../../../lib/data-validator';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const query = req.query.title as string;
	const title = query.replace(/-/g, ' ');

	const db = new Database();
	let article;

	try {
		const res = await db.query('Articles', {
			title
		}, {
			count: 1,
			index: 'title',
			attributes: [
				'id'
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

	res.status(200);
	res.setHeader('Cache-control', 'max-age=10, stale-while-revalidate=10800, must-revalidate');
	res.json(article);
};
