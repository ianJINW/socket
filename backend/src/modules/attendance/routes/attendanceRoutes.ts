import { Router } from 'express';
import { z } from 'zod';
import Attendance from '../models/Attendance';
import { authenticate, authorize } from '../../../middlewares/auth';
import { asyncHandler } from '../../../utils/errors';
import { AuthRequest, AttendanceStatus } from '../../../types';
import { AppError } from '../../../utils/errors';

const router = Router();

const markAttendanceSchema = z.object({
  classId: z.string(),
  date: z.string().transform((str) => new Date(str)),
  entries: z.array(z.object({
    studentId: z.string(),
    status: z.nativeEnum(AttendanceStatus),
    note: z.string().optional(),
  })),
  method: z.enum(['manual', 'qr', 'biometric']).default('manual'),
});

// Mark attendance
router.post('/mark', authenticate, authorize('teacher', 'admin', 'academic_admin'), asyncHandler(async (req: AuthRequest, res: any) => {
  const data = markAttendanceSchema.parse(req.body);
  const recordedBy = req.user!.id;

  const attendanceRecords = [];
  for (const entry of data.entries) {
    const attendance = await Attendance.findOneAndUpdate(
      {
        studentId: entry.studentId,
        classId: data.classId,
        date: data.date,
      },
      {
        $set: {
          studentId: entry.studentId,
          classId: data.classId,
          date: data.date,
          status: entry.status,
          method: data.method,
          recordedBy,
          note: entry.note,
        },
      },
      { upsert: true, new: true }
    );
    attendanceRecords.push(attendance);
  }

  res.status(201).json({ data: attendanceRecords });
}));

// Get attendance
router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: any) => {
  const classId = req.query.classId as string;
  const from = req.query.from as string;
  const to = req.query.to as string;
  const studentId = req.query.studentId as string;

  const query: any = {};
  if (classId) query.classId = classId;
  if (studentId) query.studentId = studentId;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  const attendance = await Attendance.find(query)
    .populate('studentId', 'firstName lastName admissionNo')
    .populate('classId', 'name')
    .populate('recordedBy', 'firstName lastName')
    .sort({ date: -1, createdAt: -1 });

  res.json({ data: attendance });
}));

export default router;

