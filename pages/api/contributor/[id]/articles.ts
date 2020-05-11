import {NextApiRequest, NextApiResponse} from 'next';
import {getArticle} from '../../article/[id]';
import {getContributor} from '../[id]';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const id = req.query.id as string;
	const count = Number(req.query.count as string);

	getContributor(id, false).then(async contributor => {
		contributor.articles = contributor.articles.slice(0, count);

		const articles = [];
		for (const article of contributor.articles) {
			const populatedArticle = await getArticle(article).catch(e => {
				throw e;
			});

			let i = 0;
			for (const author of populatedArticle.authors) {
				populatedArticle.authors[i] = await getContributor(author as string).catch(e => {
					throw e;
				});
				i++;
			}

			articles.push(populatedArticle);
		}

		articles.forEach((article, i) => {
			if (article.status !== 'published') {
				articles.splice(i, 1);
			}
		});

		res.status(200);
		res.setHeader('Cache-control', 'max-age=10, stale-while-revalidate=10800, must-revalidate');
		res.json({
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
