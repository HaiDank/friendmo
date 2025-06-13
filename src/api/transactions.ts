import express from "express";
import { authMiddleware } from "../middlewares";
import { deposit, getTransactions, transfer, withdraw } from "../handlers/transactions";

const router = express.Router()


// GET user's transaction history
router.get('/', authMiddleware, getTransactions)

// POST deposit into user balance
router.post('/deposit', authMiddleware, deposit)

// POST transfer to other's balance
router.post('/transfer', authMiddleware, transfer)

// POST withdraw from user balance
router.post('/withdraw', authMiddleware, withdraw)

export default router