import express, { NextFunction } from 'express';
import { authMiddleware } from '../middlewares';
import { getUserProfile, login, signup, updateProfile } from '../handlers/users';

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

// POST create new user 
router.post('/signup', signup);

// PATCH update user 
router.patch('/me', authMiddleware, updateProfile);


export default router;
