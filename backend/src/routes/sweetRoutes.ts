import express from 'express';
import { createSweet, getSweets, updateSweet, deleteSweet, searchSweets, purchaseSweet, restockSweet } from '../controllers/SweetController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/search', searchSweets);
router.post('/', verifyToken, createSweet);
router.get('/', getSweets);
router.put('/:id', verifyToken, isAdmin, updateSweet);
router.delete('/:id', verifyToken, isAdmin, deleteSweet);
router.post('/:id/purchase', verifyToken, purchaseSweet);
router.post('/:id/restock', verifyToken, isAdmin, restockSweet);

export default router;
