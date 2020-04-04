import {NextApiRequest, NextApiResponse} from 'next';
import {nanoid} from 'nanoid';
import {Email, UnhashedPassword} from '../../lib/data-validator';

interface AuthCredentials {
	email: string;
	password: string;
}

interface AuthSuccess {
	statusCode: number;
	token: string;
}

interface AuthFailure {
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

	// TODO: validate against database, store new token & time of creation

	return {
		statusCode: 201,
		token: nanoid()
	};
}

// Export token validation function to be used in other API endpoints
export async function validateToken(token: string): Promise<AuthResponse> {
	if (!token) {
		return {
			statusCode: 400,
			error: 'No token specified'
		};
	}
	// TODO: validate token against database, renew if approaching expiration
	// Perhaps also cleanup dead tokens here?

	if (token.length > 5) {
		return {
			statusCode: 200,
			token
		};
		// Other possible responses:
		// 404 - token not found
		// 410 - no longer valid (keep this one? possible info leak)
	}

	return {
		statusCode: 400,
		error: 'Bad token format'
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
			response = validateToken(req.query.token as string);
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
