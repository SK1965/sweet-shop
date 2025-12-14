import express from 'express';
import { createSweet, getSweets, updateSweet, deleteSweet } from '../controllers/SweetController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', verifyToken, createSweet);
router.get('/', getSweets);
router.put('/:id', verifyToken, isAdmin, updateSweet);
router.delete('/:id', verifyToken, isAdmin, deleteSweet);

export default router;
