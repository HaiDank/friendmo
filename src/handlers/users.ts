import { NextFunction, Request, Response } from 'express';
import { User } from '../models/users';
import bcrypt from 'bcrypt';

export const getUserProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user;
		if (!user) {
			res.status(404);
			return;
		}

		res.send(user);
	} catch (error) {
		next(error);
	}
};

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = req.body;

		if (!email) {
			throw new Error('Email is required');
		}

		if (!password) {
			throw new Error('Password is required');
		}

		const user = await User.findUserByCredential(email, password)

		const token = await user.generateToken();

		res.status(200).send({ user, token });
	} catch (error) {
		next(error);
	}
};

export const signup = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, email, password } = req.body;

		if (!name) {
			throw new Error('Name is required');
		}
		if (!email) {
			throw new Error('Email is required');
		}

		if (!password) {
			throw new Error('Password is required');
		}
		const user = new User({ name, email, password });
		await user.save();
		const token = await user.generateToken();
		res.status(201).send({ user: user.toJSON(), token });
	} catch (error) {
		next(error);
	}
};
