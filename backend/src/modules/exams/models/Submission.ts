import mongoose, { Schema, Document } from 'mongoose';
import { BaseDocument } from '../../../types';

export interface IAnswer {
  questionId: mongoose.Types.ObjectId;
  answer: string | string[];
}

export interface ISubmission extends BaseDocument {
  examId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  answers: IAnswer[];
  startedAt: Date;
  submittedAt?: Date;
  scoreAuto?: number;
  scoreManual?: number;
  totalScore?: number;
  gradedBy?: mongoose.Types.ObjectId;
  gradedAt?: Date;
}

const answerSchema = new Schema<IAnswer>({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  answer: Schema.Types.Mixed,
});

const submissionSchema = new Schema<ISubmission>(
  {
    examId: {
      type: Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    answers: [answerSchema],
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    submittedAt: Date,
    scoreAuto: Number,
    scoreManual: Number,
    totalScore: Number,
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    gradedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate submissions
submissionSchema.index({ examId: 1, studentId: 1 }, { unique: true });

const Submission = mongoose.model<ISubmission>('Submission', submissionSchema);
export default Submission;


