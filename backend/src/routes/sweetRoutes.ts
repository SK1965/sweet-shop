import express from 'express';
import { createSweet, getSweets, updateSweet, deleteSweet, searchSweets } from '../controllers/SweetController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/search', searchSweets);
router.post('/', verifyToken, createSweet);
router.get('/', getSweets);
router.put('/:id', verifyToken, isAdmin, updateSweet);
router.delete('/:id', verifyToken, isAdmin, deleteSweet);

export default router;
