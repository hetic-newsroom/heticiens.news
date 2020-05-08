import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../lib/database';
import {Contributor} from '../../../lib/data-validator';
import {validateToken} from '../auth';

export async function getContributor(id: string, preview = true, authenticated = false): Promise<Contributor> {
	const attributes = [
		'id',
		'name',
		'picture'
	];

	if (!preview || authenticated) {
		attributes.push('sex', 'bio', 'social', 'articles');
	}

	if (authenticated) {
		attributes.push('email', 'moderator', 'drafts');
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
	const token = req.query.token as string;

	let authenticated = false;

	if (token) {
		const {statusCode: authStatus} = await validateToken(token);

		if (authStatus === 200) {
			authenticated = true;
		}
	}

	await getContributor(query, false, authenticated).then(contributor => {
		res.status(200);
		res.setHeader('Cache-control', 'max-age=10, stale-while-revalidate=10800, must-revalidate');
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
