import mongoose, { Schema, Document } from 'mongoose';
import { BaseDocument } from '../../../types';

export interface IGradingScaleItem {
  grade: string;
  minScore: number;
  maxScore: number;
  points: number;
}

export interface IAttendancePolicy {
  minAttendancePercent: number;
  lateThresholdMinutes: number;
}

export interface ILateFeeRules {
  enabled: boolean;
  type: 'percent' | 'flat';
  value: number;
  graceDays: number;
}

export interface ISettings extends BaseDocument {
  schoolName: string;
  gradingScale: IGradingScaleItem[];
  attendancePolicy: IAttendancePolicy;
  lateFeeRules: ILateFeeRules;
}

const gradingScaleItemSchema = new Schema<IGradingScaleItem>({
  grade: { type: String, required: true },
  minScore: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  points: { type: Number, required: true },
});

const settingsSchema = new Schema<ISettings>(
  {
    schoolName: {
      type: String,
      required: true,
      default: 'School Management System',
    },
    gradingScale: [gradingScaleItemSchema],
    attendancePolicy: {
      minAttendancePercent: { type: Number, default: 75 },
      lateThresholdMinutes: { type: Number, default: 15 },
    },
    lateFeeRules: {
      enabled: { type: Boolean, default: false },
      type: { type: String, enum: ['percent', 'flat'], default: 'percent' },
      value: { type: Number, default: 0 },
      graceDays: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document
settingsSchema.index({ _id: 1 }, { unique: true });

const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
export default Settings;


