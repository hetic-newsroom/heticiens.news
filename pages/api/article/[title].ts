import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../lib/database';
import {Article} from '../../../lib/data-validator';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const query = req.query.title as string;
	const title = query.replace(/-/g, ' ');

	const db = new Database();
	let article;

	try {
		article = await db.borrow('Articles', {
			title
		}, 'title') as Article;
	} catch (error) {
		res.status(404);
		res.json(error);
		return;
	}

	res.status(200);
	res.setHeader('Cache-control', 'public, max-age=172800, must-revalidate');
	res.json(article);
};
