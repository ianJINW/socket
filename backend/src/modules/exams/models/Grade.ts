import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '../../../types';

export interface IGrade extends BaseDocument {
  studentId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  termId?: mongoose.Types.ObjectId;
  examId?: mongoose.Types.ObjectId;
  score: number;
  maxScore: number;
  grade: string;
  remarks?: string;
  recordedBy: mongoose.Types.ObjectId;
}

const gradeSchema = new Schema<IGrade>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    termId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear.terms',
      index: true,
    },
    examId: {
      type: Schema.Types.ObjectId,
      ref: 'Exam',
      // index is declared below as a schema index to allow flexibility (avoid duplicate index warnings)
    },
    score: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    remarks: String,
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

gradeSchema.index({ studentId: 1, subjectId: 1, termId: 1 });
gradeSchema.index({ examId: 1 });

const Grade = mongoose.model<IGrade>('Grade', gradeSchema);
export default Grade;


