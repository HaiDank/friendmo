import express, { NextFunction } from 'express';
import { authMiddleware } from '../middlewares';
import {
	getUserProfile,
	login,
	logout,
	sendFriendRequest,
	signup,
	updateProfile,
} from '../handlers/users';

const router = express.Router();

type CreateUserType = {
	name: string;
	password: string;
	email: string;
};

// GET get user's own profile
router.get('/me', authMiddleware, getUserProfile);

// POST log in to existing user
router.post('/login', login);

// POST log out user 
router.post('/logout', authMiddleware, logout);

// POST create new user
router.post('/signup', signup);

// PATCH update user
router.patch('/me', authMiddleware, updateProfile);

// POST send friend request
router.post('/friend/:id', authMiddleware, sendFriendRequest);

export default router;
