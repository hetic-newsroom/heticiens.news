import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../lib/database';
import {Contributor} from '../../../lib/data-validator';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const query = req.query.name as string;
	const name = query.replace(/-/g, ' ');

	const db = new Database();
	let contributor;

	try {
		const res = await db.query('Contributors', {
			name
		}, {
			count: 1,
			index: 'name',
			attributes: [
				'name',
				'picture',
				'sex',
				'bio',
				'social'
			]
		});
		const Items = res.Items as unknown;
		contributor = Items[0] as Contributor;
		if (typeof contributor === 'undefined') {
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
	res.setHeader('Cache-control', 'public, max-age=172800, must-revalidate');
	res.json(contributor);
};
