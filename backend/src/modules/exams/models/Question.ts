import mongoose, { Schema, Document } from 'mongoose';
import { BaseDocument } from '../../../types';

export interface IQuestion extends BaseDocument {
  type: 'mcq' | 'short' | 'essay';
  prompt: string;
  choices?: string[];
  correctAnswers?: string[];
  points: number;
  subjectId: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
}

const questionSchema = new Schema<IQuestion>(
  {
    type: {
      type: String,
      enum: ['mcq', 'short', 'essay'],
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    choices: [String],
    correctAnswers: [String],
    points: {
      type: Number,
      required: true,
      default: 1,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    metadata: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ subjectId: 1, type: 1 });

const Question = mongoose.model<IQuestion>('Question', questionSchema);
export default Question;


