import express from 'express';
import { authMiddleware } from '../middlewares';
import { acceptFriendRequest, getFriendRequests, rejectFriendRequest, sendFriendRequest } from '../handlers/friendRequests';

const router = express.Router();


// GET get pending friend requests
router.get('/', authMiddleware, getFriendRequests);

// POST send friend request
router.post('/:id', authMiddleware, sendFriendRequest);

// PATCH accept friend request
router.patch('/:id/accept', authMiddleware, acceptFriendRequest);

// PATCH reject friend request
router.patch('/:id/reject', authMiddleware, rejectFriendRequest);

export default router