import mongoose, { Schema, Document } from 'mongoose';
import { BaseDocument, StudentStatus } from '../../../types';

export interface IStudent extends BaseDocument {
  firstName: string;
  lastName: string;
  dob: Date;
  gender: string;
  admissionNo: string;
  emails: string[];
  contacts: string[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  classId?: mongoose.Types.ObjectId;
  status: StudentStatus;
  medical?: {
    notes?: string;
    allergies?: string[];
  };
}

const studentSchema = new Schema<IStudent>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    admissionNo: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    emails: [String],
    contacts: [String],
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(StudentStatus),
      default: StudentStatus.ACTIVE,
      index: true,
    },
    medical: {
      notes: String,
      allergies: [String],
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

studentSchema.index({ classId: 1, status: 1 });
studentSchema.index({ deletedAt: 1 });

const Student = mongoose.model<IStudent>('Student', studentSchema);
export default Student;


