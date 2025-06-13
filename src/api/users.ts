import express from 'express';
import { authMiddleware } from '../middlewares';
import {
	getUserFriends,
	getUserProfile,
	login,
	logout,
	signup,
	updateProfile,
} from '../handlers/users';

const router = express.Router();

// GET get user's own profile
router.get('/me', authMiddleware, getUserProfile);

// GET get user's friends list
router.get('/me/friends', authMiddleware, getUserFriends);

// POST log in to existing user
router.post('/login', login);

// POST log out user 
router.post('/logout', authMiddleware, logout);

// POST create new user
router.post('/signup', signup);

// PATCH update user
router.patch('/me', authMiddleware, updateProfile);

export default router;
