import {NextApiRequest, NextApiResponse} from 'next';
import {getArticle} from '../../article/[id]';
import {getContributor} from '../[id]';
import {validateToken, AuthFailure} from '../../auth';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const id = req.query.id as string;
	const token = req.query.token as string;
	const count = Number(req.query.count as string);

	const authResponse = await validateToken(token);

	if (authResponse.statusCode !== 200) {
		const {statusCode, error} = authResponse as AuthFailure;

		res.status(statusCode);
		res.json({error});
		return;
	}

	getContributor(id, false, true).then(async contributor => {
		contributor.drafts.slice(0, count);

		const drafts = [];
		for (const draft of contributor.drafts) {
			const populatedArticle = await getArticle(draft).catch(e => {
				throw e;
			});

			let i = 0;
			for (const author of populatedArticle.authors) {
				populatedArticle.authors[i] = await getContributor(author as string).catch(e => {
					throw e;
				});
				i++;
			}

			drafts.push(populatedArticle);
		}

		res.status(200);
		res.setHeader('Cache-control', 'public, max-age=172800, must-revalidate');
		res.json({
			drafts
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
