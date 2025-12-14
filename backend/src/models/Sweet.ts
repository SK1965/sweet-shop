import mongoose, { Schema, Document } from 'mongoose';

export interface ISweet extends Document {
  name: string;
  category: string;
  price: number;
  stock: number;
}

const SweetSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'] 
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'], 
    validate: {
      validator: (v: number) => v > 0,
      message: 'Price must be greater than zero'
    }
  },
  stock: { 
    type: Number, 
    required: [true, 'Stock is required'], 
    min: [0, 'Stock cannot be negative'],
    default: 0 
  }
});

export default mongoose.model<ISweet>('Sweet', SweetSchema);
