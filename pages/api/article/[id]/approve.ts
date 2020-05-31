import {NextApiRequest, NextApiResponse} from 'next';
import SESV2 from 'aws-sdk/clients/sesv2';
import Database from '../../../../lib/database';
import {NewsletterRegistration} from '../../../../lib/data-validator';
import {getArticle} from '../[id]';
import {getContributor} from '../../contributor/[id]';
import {validateToken, AuthFailure} from '../../auth';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const articleId = req.query.id as string;
	const token = req.query.token as string;

	const authResponse = await validateToken(token);

	if (authResponse.statusCode !== 200) {
		const {statusCode, error} = authResponse as AuthFailure;

		res.status(statusCode);
		res.json({error});
		return;
	}

	getArticle(articleId).then(async article => {
		if (article.status !== 'draft') {
			res.status(400);
			res.json({
				error: 'Not a draft'
			});
			return;
		}

		const userId = token.split('||')[0];
		const user = await getContributor(userId, true, true);

		if (user.moderator < 1) {
			res.status(403);
			res.end();
			return;
		}

		const db = new Database();

		const dbArticle = await db.borrow('Articles', {id: articleId}) as any;

		if (typeof dbArticle.approvals === 'object') {
			if (dbArticle.approvals.includes(userId)) {
				res.status(400);
				res.json({
					error: 'Already approved by user'
				});
				res.end();
				return;
			}

			dbArticle.approvals.push(userId);
		} else {
			dbArticle.approvals = [userId];
		}

		await dbArticle.save().catch(e => console.log(e));

		if (dbArticle.approvals.length < 3) {
			res.status(200);
			res.setHeader('Cache-Control', 'no-store');
			res.end();
			return;
		}

		// Enough approvals, publish!
		delete dbArticle.approvals;
		dbArticle.status = 'published';
		dbArticle.date = Math.round(Date.now() / 1000);

		await dbArticle.save();

		for (const author of dbArticle.authors) {
			const contributor = await db.borrow('Contributors', {id: author}) as any;

			contributor.drafts.splice(contributor.drafts.indexOf(dbArticle.id), 1);
			contributor.articles.push(dbArticle.id);
			await contributor.save();
		}

		// Send email to newsletter
		const newsletter = await db.query('Newsletter', {
			status: 'confirmed'
		}, {
			index: 'status',
			count: 1000 * 1000 // We'll never reach that, right?
		});
		const Items = newsletter.Items as unknown;
		const subscribers = Items as NewsletterRegistration[];

		const emails = [];
		for (const subscriber of subscribers) {
			emails.push(subscriber.email);
		}

		const link = `https://heticiens.news/article/${dbArticle.id as string}`;

		const emailSubject = 'Nouvel article sur HETIC Newsroom';
		const emailTextContent = `Bonjour,

		Un nouvel article a été publié sur HETIC Newsroom:
		${dbArticle.title as string}
		(${link})

		Bonne lecture!

		- Un robot.

		P.S: Ce mail vous a été envoyé car vous êtes inscrit à notre newsletter.`;
		const emailHtmlContent = `<p>Bonjour,</p><br/>
		<p>Un nouvel article a été publié sur HETIC Newsroom:<br/>
		<a href="${link}">${dbArticle.title as string}</a></p>
		<br/>
		<p>Bonne lecture!<br/><br/>- Un robot.</p>
		<br/>
		<h5>P.S: Ce mail vous a été envoyé car vous êtes inscrit à notre newsletter.`;

		const sesv2 = new SESV2({
			apiVersion: '2019-09-27',
			region: 'eu-west-1'
		});

		const emailParams = {
			Destination: {
				BccAddresses: emails
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

		await sesv2.sendEmail(emailParams).promise();

		res.status(201);
		res.setHeader('Cache-Control', 'no-store');
		res.end();
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
