import { NextFunction, Request, Response } from 'express';
import { User } from '../models/users';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/User';
import { FilterQuery } from 'mongoose';

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

export const getUserFriends = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user;
		if (!user) {
			res.status(401);
			return;
		}

		await user.populate({
			path: 'friends',
			select: '_id name',
		});

		res.send(user.friends);
	} catch (error) {
		next(error);
	}
};

export const findUsers = async (
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

		const { name, email } = req.query;

		const filter: FilterQuery<IUser> = {};


		if(name){
			filter.name = { $regex: '.*' + name + '.*' , $options: "i" }
		}
		if(email){
			filter.email = { $regex: '.*' + email + '.*' , $options: "i" }
		}

		const usersList = await User.find(filter);

		res.send(usersList)
	} catch (error) {
		next(error);
	}
};

export const logout = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.user) {
			throw new Error('Not logged in');
		}

		const isMultiple = req.query.all;

		if (isMultiple === 'true') {
			req.user.tokens = [];
		} else {
			req.user!.tokens = req.user!.tokens.filter(
				(token) => token.token !== req.token
			);
		}
		await req.user.save();
		res.send('Logout successfully');
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

		const user = await User.findUserByCredential(email, password);

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

type AllowedFields = 'email' | 'name' | 'password';

const isAllowedField = (fields: string[]): fields is AllowedFields[] => {
	const allowedFields: AllowedFields[] = ['email', 'name', 'password'];

	return fields.every((element) =>
		allowedFields.includes(element as AllowedFields)
	);
};

export const updateProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const fields = Object.keys(req.body);

		if (!isAllowedField(fields)) {
			throw new Error('Invalid fields');
		}

		const user = req.user!;

		fields.forEach((field) => {
			user[field] = req.body[field];
		});
		await user.save();

		res.status(200).send(user);
	} catch (e) {
		next(e);
	}
};
