import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  company: string;
  status: 'Active' | 'Inactive';
  spend: number;
  orders: number;
  lastPurchase: Date;
  createdAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  company: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  spend: { type: Number, default: 0 },
  orders: { type: Number, default: 0 },
  lastPurchase: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema); 