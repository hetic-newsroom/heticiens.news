import {NextApiRequest, NextApiResponse} from 'next';
import readingTime from 'reading-time';
import createDOMPurify from 'dompurify';
import {JSDOM} from 'jsdom';
import Database from '../../../../../lib/database';
import Bucket from '../../../../../lib/s3-bucket';
import {Article, Email, Contributor} from '../../../../../lib/data-validator';
import {validateToken, AuthFailure} from '../../../auth';

const acceptedImageFormats = [
	'jpg',
	'jpeg',
	'png',
	'svg',
	'gif'
];

function makeSlug(title: string): string {
	const accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
	const accentsNormalized = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
	const titleNormalized = [];

	for (const char of title) {
		if (accents.includes(char)) {
			const i = accents.indexOf(char);
			titleNormalized.push(accentsNormalized.slice(i, i + 1));
		} else {
			titleNormalized.push(char);
		}
	}

	return titleNormalized
		.join('')
		.normalize('NFKC')
		.toLocaleLowerCase('fr-FR')
		.replace(/[^a-z\d- ]/g, '')
		.trim()
		.replace(/\s/g, '-');
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const id = req.query.id as string;

	if (req.method !== 'POST') {
		res.status(400);
		res.end();
		return;
	}

	const token = req.body.token as string;

	const authResponse = await validateToken(token);

	if (authResponse.statusCode !== 200) {
		const {statusCode, error} = authResponse as AuthFailure;

		res.status(statusCode);
		res.json({error});
		return;
	}

	if (token.split('||')[0] !== id) {
		res.status(403);
		res.json({
			error: 'Cannot publish as another user'
		});
		return;
	}

	const draft = req.body.draft as Article;

	if (
		typeof draft.authors !== 'object' ||
		draft.authors.length === 0 ||
		typeof draft.title !== 'string' ||
		draft.title.length < 5 ||
		typeof draft.category !== 'string' ||
		typeof draft.intro !== 'string' ||
		typeof draft.content !== 'string' ||
		typeof draft.image !== 'string'
	) {
		res.status(400);
		res.json({
			error: 'Missing or incorrect fields'
		});
		return;
	}

	const db = new Database();
	const bucket = new Bucket();

	// Check & fill authors
	let i = 0;
	for (const author of draft.authors) {
		let Items;
		if (Email.test(author as string)) {
			const dbRes = await db.query('Contributors', {
				email: author
			}, {
				count: 1,
				index: 'email',
				attributes: ['id']
			});
			Items = dbRes.Items as unknown[];
		} else {
			const dbRes = await db.query('Contributors', {
				id: author
			}, {
				count: 1,
				attributes: ['id']
			});
			Items = dbRes.Items as unknown[];
		}

		if (Items.length === 0) {
			res.status(400);
			res.json({
				error: `Could not find contributor ${author as string}`
			});
			return;
		}

		const contributor = Items[0] as Contributor;
		draft.authors[i] = contributor.id;
		i++;
	}

	// Upload image
	const fileExtension = draft.image.slice(
		draft.image.indexOf('data:image/') + 11,
		draft.image.indexOf(';base64')
	);

	if (!acceptedImageFormats.includes(fileExtension)) {
		res.status(400);
		res.json({
			error: 'Bad image format'
		});
		return;
	}

	const base64 = draft.image.replace(/^.*,/, ''); // Strip metadata
	const key = await bucket.upload(base64, fileExtension);
	draft.image = `https://bucket.heticiens.news/${key as string}`;

	// Purify HTML
	const window = new JSDOM('').window;
	const DOMPurify = createDOMPurify(window);
	draft.content = DOMPurify.sanitize(draft.content);

	// Fill in metadata
	draft.readTime = Math.round(
		readingTime(`${draft.intro}${draft.content}`)
			.time
	);
	draft.date = Math.round(Date.now() / 1000);
	draft.status = 'draft';

	// Make slug
	draft.id = makeSlug(draft.title);

	// Save to database!
	await db.put('Articles', {...draft});

	for (const author of draft.authors) {
		const contributor = await db.borrow('Contributors', {id: author}) as any;
		contributor.drafts.push(draft.id);
		await contributor.save();
	}

	res.status(201);
	res.setHeader('Cache-Control', 'no-store');
	res.json({
		draft: draft.id
	});
};

export const config = {
	api: {
		bodyParser: {
			sizeLimit: '5mb'
		}
	}
};
