import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '../../../types';

export interface ITerm {
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface IAcademicYear extends BaseDocument {
  name: string;
  startDate: Date;
  endDate: Date;
  terms: ITerm[];
  isActive: boolean;
}

const termSchema = new Schema<ITerm>({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const academicYearSchema = new Schema<IAcademicYear>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    terms: [termSchema],
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

academicYearSchema.index({ isActive: 1 });
academicYearSchema.index({ startDate: 1, endDate: 1 });

const AcademicYear = mongoose.model<IAcademicYear>('AcademicYear', academicYearSchema);
export default AcademicYear;


