import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../lib/database';
import {Article} from '../../../lib/data-validator';
import {getArticle} from '../article/[id]';
import {getContributor} from '../contributor/[id]';

export async function getArticleListByCategory(category: string, count = 10): Promise<[{id: string}]> {
	const db = new Database();

	const res = await db.query('Articles', {category}, {
		count,
		index: 'category',
		attributes: ['id', 'status']
	});
	const Items = res.Items as unknown[];

	Items.forEach((article: Article, index) => {
		if (article.status !== 'published') {
			Items.splice(index, 1);
		}
	});

	if (Items.length === 0) {
		throw new Error('not found');
	}

	return Items as [{id: string}];
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const category = req.query.category as string;
	const count = Number(req.query.count as string);

	getArticleListByCategory(category, count).then(async articles => {
		let i = 0;
		for (const article of articles) {
			const populatedArticle: Article = await getArticle(article.id).catch(e => {
				throw e;
			});

			let i2 = 0;
			for (const author of populatedArticle.authors) {
				populatedArticle.authors[i2] = await getContributor(author as string);
				i2++;
			}

			articles[i] = populatedArticle;
			i++;
		}

		res.status(200);
		res.setHeader('Cache-control', 'public, max-age=43200, must-revalidate');
		res.json({
			category,
			articles
		});
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
