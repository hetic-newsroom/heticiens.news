import {NextApiRequest, NextApiResponse} from 'next';
import {nanoid} from 'nanoid';
import SESV2 from 'aws-sdk/clients/sesv2';
import Database, {Key} from '../../../../lib/database';
import {Email, NewsletterRegistration} from '../../../../lib/data-validator';

export default async function (req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const email = req.query.email as string;

	if (!Email.test(email)) {
		res.status(400);
		res.json({
			error: 'Bad email'
		});
		return;
	}

	const validationToken = nanoid(75);
	const registration: NewsletterRegistration = {
		id: nanoid(),
		email,
		status: 'unconfirmed',
		validationToken
	};

	const emailSubject = 'Confirmez votre inscription à la newsletter HETIC Newsroom';
	const emailTextContent = `Bonjour!
	Pour confirmer votre inscription à la newsletter HETIC Newsroom, nous vous demandons de vérifier votre addresse e-mail en cliquant sur ce lien:

	https://heticiens.news/api/newsletter/verify/${validationToken}`;
	const emailHtmlContent = `<p>Bonjour!<br/><br>
	Pour confirmer votre inscription à la newsletter HETIC Newsroom, nous vous demandons de vérifier votre addresse e-mail en cliquant sur ce lien:</p>
	<br>
	<p><a href="https://heticiens.news/api/newsletter/verify/${validationToken}">https://heticiens.news/api/newsletter/verify/${validationToken}</a></p>`;

	// Send email
	const sesv2 = new SESV2({
		apiVersion: '2019-09-27',
		region: 'eu-west-1'
	});

	const emailParams = {
		Destination: {
			ToAddresses: [
				email
			]
		},
		Content: {
			Simple: {
				Body: {
					Html: {
						Charset: 'UTF-8',
						Data: emailHtmlContent
					},
					Text: {
						Charset: 'UTF-8',
						Data: emailTextContent
					}
				},
				Subject: {
					Charset: 'UTF-8',
					Data: emailSubject
				}
			}
		},
		FromEmailAddress: 'noreply@heticiens.news'
	};

	await sesv2.sendEmail(emailParams).promise().catch(error => {
		res.status(500);
		res.json(error);
		throw error;
	});

	const db = new Database();
	const registrationObject: unknown = registration;
	await db.put('Newsletter', registrationObject as Key).catch(error => {
		res.status(500);
		res.json(error);
		throw error;
	});

	res.status(200);
	res.end('OK');
}
