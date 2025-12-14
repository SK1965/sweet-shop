import { Request, Response } from 'express';
import Sweet from '../models/Sweet';

export const createSweet = async (req: Request, res: Response) => {
  try {
    const { name, category, price, stock } = req.body;
    const sweet = new Sweet({ name, category, price, stock });
    await sweet.save();
    res.status(201).json(sweet);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSweets = async (req: Request, res: Response) => {
  try {
    const sweets = await Sweet.find();
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const sweet = await Sweet.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!sweet) {
            return res.status(404).json({ message: 'Sweet not found' });
        }
        res.status(200).json(sweet);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const sweet = await Sweet.findByIdAndDelete(id);
        if (!sweet) {
            return res.status(404).json({ message: 'Sweet not found' });
        }
        res.status(200).json({ message: 'Sweet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const searchSweets = async (req: Request, res: Response) => {
    try {
        const { name, category, minPrice, maxPrice } = req.query;
        let query: any = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const sweets = await Sweet.find(query);
        res.status(200).json(sweets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const purchaseSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        const sweet = await Sweet.findById(id);
        if (!sweet) {
            return res.status(404).json({ message: 'Sweet not found' });
        }

        if (sweet.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        sweet.stock -= quantity;
        await sweet.save();

        res.status(200).json(sweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const restockSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        const sweet = await Sweet.findById(id);
        if (!sweet) {
            return res.status(404).json({ message: 'Sweet not found' });
        }

        sweet.stock += quantity;
        await sweet.save();

        res.status(200).json(sweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
