import {NextApiRequest, NextApiResponse} from 'next';
import Database from '../../../../lib/database';
import {NewsletterRegistration} from '../../../../lib/data-validator';

export default async function (req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const token = req.query.token as string;

	const db = new Database();
	let registration;
	try {
		registration = await db.borrow('Newsletter', {
			validationToken: token
		}, 'validationToken') as NewsletterRegistration;
	} catch (_) {
		res.status(404);
		res.json({
			error: 'Token not found'
		});
		return;
	}

	if (registration.status === 'confirmed') {
		// We return a 404 here to not leak our registered emails...
		res.status(404);
		res.json({
			error: 'Token not found'
		});
		return;
	}

	registration.status = 'confirmed';
	await registration.save();

	res.status(200);
	res.setHeader('Content-type', 'text/html; charset=UTF-8');
	res.end('Votre inscription a été confirmée!');
}
