import express, { NextFunction } from 'express';
import { authMiddleware } from '../middlewares';
import { getUserProfile, login, signup } from '../handlers/users';

const router = express.Router();

type CreateUserType = {
	name: string;
	password: string;
	email: string;
};

// GET get user's own profile
router.get('/', authMiddleware, getUserProfile);

// POST log in to existing user
router.post('/login', login);

// POST create new user x
router.post('/signup', signup);

export default router;
