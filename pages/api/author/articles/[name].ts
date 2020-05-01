import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../../lib/database';
import {Contributor} from '../../../../lib/data-validator';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	let name = req.query.name as string;
	name = name.replace(/-/g, ' ');
	const count = Number(req.query.count as string);

	const db = new Database();
	let author;

	try {
		const res = await db.query('Contributors', {
			name
		}, {
			count: 1,
			index: 'name',
			attributes: [
				'id'
			]
		});
		const Items = res.Items as unknown;
		author = Items[0] as Contributor;
		if (typeof author === 'undefined') {
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

	let articles;

	try {
		const res = await db.query('Articles', {
			author: author.id
		}, {
			count: count || 10,
			index: 'author',
			attributes: [
				'date',
				'title',
				'image',
				'intro',
				'category'
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
			res.status(200);
			res.json({
				author: name,
				articles: []
			});
			return;
		}

		res.status(500);
		res.json(error);
		return;
	}

	res.status(200);
	res.setHeader('Cache-control', 'public, max-age=43200, must-revalidate');
	res.json({
		author: name,
		articles
	});
};
