import express from 'express';
import { createSweet, getSweets } from '../controllers/SweetController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', verifyToken, createSweet);
router.get('/', getSweets);

export default router;
