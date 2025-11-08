import mongoose, { Schema, Document } from 'mongoose';
import { BaseDocument, AttendanceStatus } from '../../../types';

export interface IAttendance extends BaseDocument {
  studentId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  date: Date;
  status: AttendanceStatus;
  method: 'manual' | 'qr' | 'biometric';
  recordedBy: mongoose.Types.ObjectId;
  note?: string;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
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
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      required: true,
    },
    method: {
      type: String,
      enum: ['manual', 'qr', 'biometric'],
      default: 'manual',
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    note: String,
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attendance records
attendanceSchema.index({ studentId: 1, classId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ classId: 1, date: 1 });

const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);
export default Attendance;


