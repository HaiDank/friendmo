import ErrorResponse from './interfaces/ErrorResponse';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from './models/users';
import { NextFunction, Request, Response } from 'express';

interface MyJwtPayload extends JwtPayload {
	_id: string;
}

export function notFound(req: Request, res: Response, next: NextFunction) {
	res.status(404);
	const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
	next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
	err: Error,
	req: Request,
	res: Response<ErrorResponse>,
	next: NextFunction
) {
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode);
	res.json({
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
	});
}

export async function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const head = req.header('Authorization');
		if (!head) {
			throw new Error('Unauthorized');
		}

		const token = head.replace('Bearer ', '');
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as MyJwtPayload;

		const user = await User.findOne({
			_id: decoded._id,
			'tokens.token': token,
		});

		if (!user) {
			throw new Error('User not found');
		}

		req.user = user;

		next();
	} catch (error) {
		res.status(401).send(error);
	}
}
