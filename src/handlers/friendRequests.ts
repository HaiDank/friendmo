import { NextFunction, Request, Response } from 'express';
import { FriendRequest } from '../models/friendRequests';
import { User } from '../models/users';
import mongoose from 'mongoose';

export const getIncomingFriendRequests = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// check logged in status
		if (!req.user) {
			throw new Error('Not logged in');
		}

		const userId = req.user!._id;

		const friendRequests = await FriendRequest.find({
			to: userId,
			status: 'pending',
		});

		res.send(friendRequests);
	} catch (error) {
		next(error);
	}
};

export const sendFriendRequest = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// check logged in status
		if (!req.user) {
			throw new Error('Not logged in');
		}
		const userId = req.user!._id;
		const { id: friendId } = req.params;

		// check params
		if (!friendId) {
			throw new Error('Please select a user to befriend');
		}

		const sender = await User.findById(friendId);

		// check if user exist

		if (!sender) {
			throw new Error('Invalid user');
		}

		// check if user is befriending itself
		if (userId.equals(sender._id)) {
			throw new Error('You cannot befriend yourself');
		}
		const request = await FriendRequest.findOne({
			from: userId,
			to: sender._id,
		});

		// check request
		if (request && request.status === 'pending') {
			throw new Error('You already sent a request');
		}

		const isAlreadyFriend = req.user.friends.includes(sender._id);

		// check sender status
		if (isAlreadyFriend) {
			throw new Error('You are already sender with this user');
		}

		const friendRequest = new FriendRequest({
			from: userId,
			to: sender._id,
		});

		await friendRequest.save();

		res.send('Friend request sent ♥♥');
	} catch (error) {
		next(error);
	}
};

export const acceptFriendRequest = async (
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

		const { id } = req.params;

		const friendRequest = await FriendRequest.findById(id).session(session);

		req.user.$session(session);
		if (!friendRequest) {
			throw new Error('Request does not exist');
		}

		if (!friendRequest.to.equals(req.user._id)) {
			throw new Error('Invalid request');
		}

		if (friendRequest.status !== 'pending') {
			throw new Error('You cannot do further action to this request');
		}

		const sender = await User.findById(friendRequest.from).session(session);

		if (!sender) {
			throw new Error(
				'The user that want to befriend you does not exist anymore'
			);
		}

		friendRequest.status = 'accepted';
		req.user.friends.push(sender._id);
		sender.friends.push(req.user._id);

		await friendRequest.save();
		await sender.save();
		await req.user.save();

		await session.commitTransaction();

		res.send('Friend request accepted');
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

export const rejectFriendRequest = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const friendRequest = await FriendRequest.findById(id);

		if (!friendRequest) {
			throw new Error('Request does not exist');
		}

		if (friendRequest.status !== 'pending') {
			throw new Error('You cannot do further action to this request');
		}

		friendRequest.status = 'rejected';

		await friendRequest.save();

		res.send('Friend request rejected');
	} catch (error) {
		next(error);
	}
};
