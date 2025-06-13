import { NextFunction, Request, Response } from 'express';
import { FriendRequest } from '../models/friendRequests';
import { User } from '../models/users';

export const getFriendRequests = async (
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
			from: userId,
            status: 'pending'
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

		const friend = await User.findById(friendId);

		// check if user exist

		if (!friend) {
			throw new Error('Invalid user');
		}

		// check if user is befriending itself
		if (userId.equals(friend._id)) {
			throw new Error('You cannot befriend yourself');
		}
		const request = await FriendRequest.findOne({
			from: userId,
			to: friend._id,
		});

		// check request
		if (request && request.status === 'pending') {
			throw new Error('You already sent a request');
		}

		const isAlreadyFriend = req.user.friends.includes(friend._id);

		// check friend status
		if (isAlreadyFriend) {
			throw new Error('You are already friend with this user');
		}

		const friendRequest = new FriendRequest({
			from: userId,
			to: friend._id,
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
	try {
		if (!req.user) {
			return;
		}

		const { id } = req.params;
		const friendRequest = await FriendRequest.findById(id);

		if (!friendRequest) {
			throw new Error('Request does not exist');
		}

        if (!friendRequest.to.equals(req.user._id)) {
			throw new Error('Invalid request');
		}

		if (friendRequest.status !== 'pending') {
			throw new Error('You cannot do further action to this request');
		}

		friendRequest.status = 'accepted';

		const friend = await User.findById(friendRequest.to);

		if (!friend) {
			throw new Error(
				'The user you want to befriend does not exist anymore'
			);
		}

		req.user.friends.push(friend._id);
		friend.friends.push(req.user._id);
		await friendRequest.save();
		await friend.save();
		await req.user.save();

		res.send('Friend request accepted');
	} catch (error) {
		next(error);
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
