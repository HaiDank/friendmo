import { NextFunction, Request, Response } from 'express';
import { ITransaction, Transaction } from '../models/transactions';
import mongoose, { FilterQuery } from 'mongoose';
import { User } from '../models/users';

export const getTransactions = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// check logged in status
		if (!req.user) {
			throw new Error('Not logged in');
		}
		const user = req.user._id;
		const filters: FilterQuery<ITransaction> = {
			$or: [{ user }, { to: user }],
		};

		if (req.query.type) {
			filters.type = req.query.type;
		}

		if (req.query.dateFrom || req.query.dateTo) {
			filters.createdAt = {};
			if (req.query.dateFrom) {
				filters.createdAt.$gte = req.query.dateFrom;
			}
			if (req.query.dateTo) {
				filters.createdAt.$lte = req.query.dateTo;
			}
		}

		const friendRequests = await Transaction.find(filters);

		res.send(friendRequests);
	} catch (error) {
		next(error);
	}
};

export const deposit = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		if (!req.user) {
			throw new Error('Not logged in');
		}

		req.user.$session(session);

		let { amount } = req.body;

		amount = parseInt(amount);

		if (amount < 1000) {
			throw new Error('Minimum amount is 1000');
		}

		req.user.balance += amount;

		await Transaction.create(
			[
				{
					amount,
					user: req.user._id,
					type: 'deposit',
					description: 'Deposit into balance',
				},
			],
			{ session: session }
		);

		await req.user.save();

		await session.commitTransaction();

		res.send('Deposit successfully');
	} catch (error) {
		if (session) {
			await session.abortTransaction();
		}
		next(error);
	} finally {
		if (session) {
			session.endSession();
		}
	}
};

export const transfer = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		if (!req.user) {
			throw new Error('Not logged in');
		}

		req.user.$session(session);

		let { amount, to } = req.body;

		amount = parseInt(amount);

		if (amount < 1000) {
			throw new Error('Minimum amount is 1000');
		}

		const recipient = await User.findById(to).session(session);

		if (!recipient) {
			throw new Error('Unknown user');
		}

		if (amount > req.user.balance) {
			throw new Error('Not enough money');
		}

		req.user.balance -= amount;
		recipient.balance += amount;

		await Transaction.create(
			[
				{
					amount,
					to: to,
					user: req.user._id,
					type: 'transfer',
					description: `Transfer to ${recipient.name}`,
				},
			],
			{ session: session }
		);

		await req.user.save();
		await recipient.save();

		await session.commitTransaction();

		res.send('Transfer successfully');
	} catch (error) {
		if (session) {
			await session.abortTransaction();
		}
		next(error);
	} finally {
		if (session) {
			session.endSession();
		}
	}
};


export const withdraw = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		if (!req.user) {
			throw new Error('Not logged in');
		}

		req.user.$session(session);

		let { amount } = req.body;

		amount = parseInt(amount);

		if (amount < 1000) {
			throw new Error('Minimum amount is 1000');
		}

		if (amount > req.user.balance) {
			throw new Error('Not enough money');
		}

		req.user.balance -= amount;

		await Transaction.create(
			[
				{
					amount,
					user: req.user._id,
					type: 'withdrawal',
					description: 'Withdraw from balance',
				},
			],
			{ session: session }
		);

		await req.user.save();

		await session.commitTransaction();

		res.send('Withdraw successfully');
	} catch (error) {
		if (session) {
			await session.abortTransaction();
		}
		next(error);
	} finally {
		if (session) {
			session.endSession();
		}
	}
};