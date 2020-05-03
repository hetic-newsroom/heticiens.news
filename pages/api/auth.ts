import {NextApiRequest, NextApiResponse} from 'next';
import {nanoid} from 'nanoid';
import scrypt from 'scrypt-js';
import Database from '../../lib/database';
import {Token, TokenRegex, Contributor, Email, UnhashedPassword} from '../../lib/data-validator';

const TOKEN_TIMEOUT = 5 * 60 * 60 * 1000; // 5 hours
const TOKEN_RENEW = 3 * 60 * 60 * 1000; // Renew if <= 3 hours left

interface AuthCredentials {
	email: string;
	password: string;
}

export interface AuthSuccess {
	statusCode: number;
	token: string;
}

export interface AuthFailure {
	statusCode: number;
	error: string;
}

type AuthResponse = AuthSuccess | AuthFailure;

async function authentify(creds: AuthCredentials): Promise<AuthResponse> {
	if (!creds.email || !Email.test(creds.email)) {
		return {
			statusCode: 400,
			error: 'Bad email format'
		};
	}

	if (!creds.password || !UnhashedPassword.test(creds.password)) {
		return {
			statusCode: 400,
			error: 'Bad password format'
		};
	}

	const db = new Database();
	let user;

	try {
		user = await db.borrow('Contributors', {
			email: creds.email
		}, 'email') as Contributor;
	} catch (error) {
		return {
			statusCode: 404,
			error: error.message as string
		};
	}

	const salt = Buffer.from(
		user.password.slice(0, user.password.indexOf('::')),
		'hex'
	);
	const password = Buffer.from(
		user.password.slice(user.password.indexOf('::') as number + 2),
		'hex'
	);

	const suppliedPassword = Buffer.from(creds.password.normalize('NFKC'), 'utf8');

	const N = 1024;
	const r = 8;
	const p = 1;
	const dkLen = 32;

	const suppliedPasswordHash = Buffer.from(await scrypt.scrypt(suppliedPassword, salt, N, r, p, dkLen));

	if (suppliedPasswordHash.toString('hex') !== password.toString('hex')) {
		return {
			statusCode: 403,
			error: 'Wrong password'
		};
	}

	// Delete old tokens
	user.tokens = user.tokens.filter(token => {
		return ((Date.now() - token.created) < TOKEN_TIMEOUT);
	});

	const token: Token = {
		token: nanoid(20),
		created: Date.now()
	};
	user.tokens.push(token);

	await user.save();

	return {
		statusCode: 201,
		token: `${user.id as string}||${token.token}`
	};
}

// Export token validation function to be used in other API endpoints
export async function validateToken(token: string, autorenew = false): Promise<AuthResponse> {
	if (!token) {
		return {
			statusCode: 400,
			error: 'No token specified'
		};
	}

	if (!TokenRegex.test(token)) {
		return {
			statusCode: 400,
			error: 'Bad token format'
		};
	}

	const [userId, tokenId] = token.split('||');

	const db = new Database();
	let user;

	try {
		user = await db.borrow('Contributors', {
			id: userId
		}) as Contributor;
	} catch (error) {
		return {
			statusCode: 404,
			error: error.message as string
		};
	}

	const inDb = user.tokens.find(token => {
		return (token.token === tokenId);
	});

	if (!inDb) {
		return {
			statusCode: 404,
			error: 'Token not found'
		};
	}

	const time = (Date.now() - inDb.created);

	if (time > TOKEN_TIMEOUT) {
		return {
			statusCode: 410,
			error: 'Token expired'
		};
	}

	let newTokenId: string | null;
	if ((TOKEN_TIMEOUT - time) <= TOKEN_RENEW && autorenew) {
		newTokenId = nanoid();
		user.tokens[user.tokens.indexOf(inDb)] = {
			token: newTokenId,
			created: Date.now()
		};
		await user.save();
	}

	return {
		statusCode: 200,
		token: `${userId}||${newTokenId || tokenId}`
	};
}

interface AuthRequest extends NextApiRequest {
	body: AuthCredentials;
}

// Handle direct authentication API requests from client forms
export default async (req: AuthRequest, res: NextApiResponse): Promise<void> => {
	let response;

	switch (req.method) {
		case 'GET':
			response = validateToken(req.query.token as string, true);
			break;
		case 'POST':
			response = authentify(req.body);
			break;
		default:
			res.status(400);
			res.end();
			return;
	}

	res.setHeader('Cache-Control', 'no-store');

	response.then(response => {
		res.status(response.statusCode);
		delete response.statusCode;
		res.json(response);
	}).catch(error => {
		res.status(500);
		res.json({
			error: error.message
		});
	});
};
