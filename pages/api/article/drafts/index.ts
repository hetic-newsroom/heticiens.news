import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../../lib/database';
import {Article} from '../../../../lib/data-validator';
import {getArticle} from '../[id]';
import {getContributor} from '../../contributor/[id]';
import {validateToken, AuthFailure} from '../../auth';

export async function getDraftsList(count = 10): Promise<[{id: string}]> {
	const db = new Database();

	const res = await db.query('Articles', {
		status: 'draft'
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
	const token = req.query.token as string;
	const count = Number(req.query.count as string);

	const authResponse = await validateToken(token);

	if (authResponse.statusCode !== 200) {
		const {statusCode, error} = authResponse as AuthFailure;

		res.status(statusCode);
		res.json({error});
		return;
	}

	getDraftsList(count).then(async drafts => {
		let i = 0;
		for (const draft of drafts) {
			const populatedArticle: Article = await getArticle(draft.id, true, true).catch(e => {
				throw e;
			});

			let i2 = 0;
			for (const author of populatedArticle.authors) {
				populatedArticle.authors[i2] = await getContributor(author as string).catch(e => {
					throw e;
				});
				i2++;
			}

			drafts[i] = populatedArticle;
			i++;
		}

		res.status(200);
		res.setHeader('Cache-control', 'max-age=10, stale-while-revalidate=10800, must-revalidate');
		res.json({drafts});
	}).catch(error => {
		if (error.message === 'not found') {
			res.status(200);
			res.json({drafts: []});
			return;
		}

		res.status(500);
		res.json(error);
	});
};
