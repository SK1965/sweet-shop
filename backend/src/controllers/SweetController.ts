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
