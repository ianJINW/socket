import mongoose, { Schema, Document } from 'mongoose';
import { BaseDocument, ExamStatus } from '../../../types';

export interface IExamSection {
  name: string;
  questionIds: mongoose.Types.ObjectId[];
}

export interface IExamSettings {
  negativeMarking?: boolean;
  proctoring?: boolean;
  allowReview?: boolean;
}

export interface IExam extends BaseDocument {
  name: string;
  subjectId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  date: Date;
  durationMin: number;
  sections: IExamSection[];
  settings: IExamSettings;
  status: ExamStatus;
  createdBy: mongoose.Types.ObjectId;
}

const sectionSchema = new Schema<IExamSection>({
  name: { type: String, required: true },
  questionIds: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
});

const examSchema = new Schema<IExam>(
  {
    name: {
      type: String,
      required: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    durationMin: {
      type: Number,
      required: true,
    },
    sections: [sectionSchema],
    settings: {
      negativeMarking: { type: Boolean, default: false },
      proctoring: { type: Boolean, default: false },
      allowReview: { type: Boolean, default: true },
    },
    status: {
      type: String,
      enum: Object.values(ExamStatus),
      default: ExamStatus.DRAFT,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

examSchema.index({ classId: 1, subjectId: 1, date: 1 });

const Exam = mongoose.model<IExam>('Exam', examSchema);
export default Exam;


