import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../lib/database';
import {Article} from '../../../lib/data-validator';
import {getContributor} from '../contributor/[id]';

export async function getArticle(id: string, preview = true, auth = false): Promise<Article> {
	const attributes = [
		'id',
		'date',
		'category',
		'title',
		'image',
		'intro',
		'authors',
		'status'
	];
	if (auth) {
		attributes.push('approvals');
	}

	if (!preview) {
		attributes.push('content', 'readTime');
	}

	const db = new Database();

	const res = await db.query('Articles', {id}, {
		count: 1,
		attributes
	});
	const Items = res.Items as unknown[];

	if (Items.length !== 1) {
		throw new Error('not found');
	}

	return Items[0] as Article;
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const query = req.query.id as string;

	getArticle(query, false).then(async article => {
		let i = 0;
		for (const author of article.authors) {
			article.authors[i] = await getContributor(author as string).catch(e => {
				throw e;
			});
			i++;
		}

		res.status(200);
		res.setHeader('Cache-control', 'max-age=10, stale-while-revalidate=10800, must-revalidate');
		res.json(article);
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
