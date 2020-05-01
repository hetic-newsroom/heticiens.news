import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../lib/database';
import {Contributor} from '../../../lib/data-validator';

export async function getContributor(id: string, preview = true): Promise<Contributor> {
	const attributes = [
		'id',
		'name'
	];

	if (!preview) {
		attributes.push('picture', 'sex', 'bio', 'social', 'articles');
	}

	const db = new Database();

	const res = await db.query('Contributors', {id}, {
		count: 1,
		attributes
	});
	const Items = res.Items as unknown[];

	if (Items.length !== 1) {
		throw new Error('not found');
	}

	return Items[0] as Contributor;
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const query = req.query.id as string;

	await getContributor(query, false).then(contributor => {
		res.status(200);
		res.setHeader('Cache-control', 'public, max-age=172800, must-revalidate');
		res.json(contributor);
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
