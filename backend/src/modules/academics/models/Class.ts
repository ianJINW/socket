import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '../../../types';

export interface IClass extends BaseDocument {
  name: string;
  gradeLevel: number;
  capacity: number;
  teacherId?: mongoose.Types.ObjectId;
  status: 'ACTIVE' | 'INACTIVE';
}

const classSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    gradeLevel: {
      type: Number,
      required: true,
      index: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 30,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

classSchema.index({ gradeLevel: 1, name: 1 });

const Class = mongoose.model<IClass>('Class', classSchema);
export default Class;


