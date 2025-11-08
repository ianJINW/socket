import mongoose, { Schema, Document } from 'mongoose';
import { BaseDocument } from '../../../types';

export interface ITimetableSlot {
  day: string; // Mon, Tue, Wed, etc.
  period: number;
  subjectId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  room?: string;
}

export interface ITimetable extends BaseDocument {
  classId: mongoose.Types.ObjectId;
  academicYearId: mongoose.Types.ObjectId;
  slots: ITimetableSlot[];
  version: number;
}

const slotSchema = new Schema<ITimetableSlot>({
  day: { type: String, required: true },
  period: { type: Number, required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  room: String,
});

const timetableSchema = new Schema<ITimetable>(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,
    },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    slots: [slotSchema],
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

timetableSchema.index({ classId: 1, academicYearId: 1 }, { unique: true });

const Timetable = mongoose.model<ITimetable>('Timetable', timetableSchema);
export default Timetable;


