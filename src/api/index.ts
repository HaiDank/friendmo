import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import users from './users';
import friendRequests from './friendRequests';
import transactions from './transactions';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
	res.json({
		message: 'API - 👋🌎🌍🌏',
	});
});

router.use('/users', users);
router.use('/friends', friendRequests);
router.use('/transactions', transactions);

export default router;
