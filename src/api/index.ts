import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import users from './users';
import friendRequests from './friendRequests';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
	res.json({
		message: 'API - 👋🌎🌍🌏',
	});
});

router.use('/users', users);
router.use('/friend', friendRequests);

export default router;
