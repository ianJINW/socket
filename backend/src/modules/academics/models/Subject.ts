import mongoose, { Schema, Document } from 'mongoose';
import { BaseDocument } from '../../../types';

export interface ISubject extends BaseDocument {
  name: string;
  code: string;
  departmentId?: mongoose.Types.ObjectId;
  gradeLevel: number;
  credits: number;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    gradeLevel: {
      type: Number,
      required: true,
      index: true,
    },
    credits: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

subjectSchema.index({ gradeLevel: 1, departmentId: 1 });

const Subject = mongoose.model<ISubject>('Subject', subjectSchema);
export default Subject;


