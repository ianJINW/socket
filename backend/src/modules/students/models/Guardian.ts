import mongoose, { Schema, Document } from 'mongoose';
import { BaseDocument } from '../../../types';

export interface IGuardian extends BaseDocument {
  studentId: mongoose.Types.ObjectId;
  name: string;
  relation: string;
  phone: string;
  email: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  isPrimary: boolean;
}

const guardianSchema = new Schema<IGuardian>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

guardianSchema.index({ studentId: 1, isPrimary: 1 });

const Guardian = mongoose.model<IGuardian>('Guardian', guardianSchema);
export default Guardian;


