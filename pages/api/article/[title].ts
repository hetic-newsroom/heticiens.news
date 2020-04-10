import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../lib/database';
import {Article, Contributor} from '../../../lib/data-validator';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const query = req.query.title as string;
	const title = query.replace(/-/g, ' ');

	const db = new Database();
	let article;

	// TODO: implement specific attributes on db.read, do not fetch author password and article visit count...

	try {
		article = await db.borrow('Articles', {
			title
		}, 'title') as Article;
	} catch (_) {
		res.status(404);
		res.end();
		return;
	}

	let author;
	try {
		author = await db.borrow('Contributors', {
			id: article.author
		}) as Contributor;
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
