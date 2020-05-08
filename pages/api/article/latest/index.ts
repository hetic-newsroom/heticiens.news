import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../../lib/database';
import {Article} from '../../../../lib/data-validator';
import {getArticle} from '../[id]';
import {getContributor} from '../../contributor/[id]';

export async function getArticleList(count = 10): Promise<[{id: string}]> {
	const db = new Database();

	const res = await db.query('Articles', {
		status: 'published'
	}, {
		count,
		index: 'status',
		attributes: ['id']
	});
	const Items = res.Items as unknown[];

	if (Items.length === 0) {
		throw new Error('not found');
	}

	return Items as [{id: string}];
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const count = Number(req.query.count as string);

	getArticleList(count).then(async articles => {
		let i = 0;
		for (const article of articles) {
			const populatedArticle: Article = await getArticle(article.id).catch(e => {
				throw e;
			});

			let i2 = 0;
			for (const author of populatedArticle.authors) {
				populatedArticle.authors[i2] = await getContributor(author as string).catch(e => {
					throw e;
				});
				i2++;
			}

			articles[i] = populatedArticle;
			i++;
		}

		res.status(200);
		res.setHeader('Cache-control', 'max-age=10, stale-while-revalidate=10800, must-revalidate');
		res.json({articles});
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
