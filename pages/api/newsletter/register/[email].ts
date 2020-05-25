import {NextApiRequest, NextApiResponse} from 'next';
import {nanoid} from 'nanoid';
import SESV2 from 'aws-sdk/clients/sesv2';
import Database, {Key} from '../../../../lib/database';
import {Email, NewsletterRegistration} from '../../../../lib/data-validator';

const banlist = [
	'etudiants@hetic.net',
	'p2024@hetic.net',
	'p2023@hetic.net',
	'p2022@hetic.net',
	'p2021@hetic.net',
	'p2020@hetic.net',
	'3dp2020@hetic.net',
	'3dp2021@hetic.net',
	'3dp2022@hetic.net',
	'w3p2020@hetic.net',
	'webp2021@hetic.net',
	'webp2022@hetic.net',
	'wmp2020@hetic.net',
	'wmp2021@hetic.net',
	'mdp2021@hetic.net',
	'mmp2021@hetic.net',
	'mmp2020@hetic.net',
	'mdp2020@hetic.net'
];

export default async function (req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const email = (req.query.email as string).toLowerCase();

	if (!Email.test(email) || banlist.includes(email)) {
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
