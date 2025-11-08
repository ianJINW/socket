import { Router } from 'express';
import { z } from 'zod';
import Class from '../models/Class';
import Subject from '../models/Subject';
import Timetable from '../models/Timetable';
import { authenticate, authorize } from '../../../middlewares/auth';
import { asyncHandler } from '../../../utils/errors';
import { AuthRequest } from '../../../types';
import { AppError } from '../../../utils/errors';

const router = Router();

// Classes
const createClassSchema = z.object({
  name: z.string().min(1),
  gradeLevel: z.number().int().min(1),
  capacity: z.number().int().min(1).default(30),
  teacherId: z.string().optional(),
});

// Subjects
const createSubjectSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  departmentId: z.string().optional(),
  gradeLevel: z.number().int().min(1),
  credits: z.number().default(1),
});

// Timetables
const createTimetableSchema = z.object({
  classId: z.string(),
  academicYearId: z.string(),
  slots: z.array(z.object({
    day: z.string(),
    period: z.number().int(),
    subjectId: z.string(),
    teacherId: z.string(),
    room: z.string().optional(),
  })),
});

// Get all classes
router.get('/classes', authenticate, asyncHandler(async (req: AuthRequest, res: any) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const gradeLevel = req.query.gradeLevel as string;

  const query: any = {};
  if (gradeLevel) query.gradeLevel = parseInt(gradeLevel);

  const total = await Class.countDocuments(query);
  const classes = await Class.find(query)
    .populate('teacherId', 'firstName lastName email')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .sort({ gradeLevel: 1, name: 1 });

  res.json({
    data: classes,
    meta: {
      page,
      pageSize,
      total,
      pageCount: Math.ceil(total / pageSize),
    },
  });
}));

// Create class
router.post('/classes', authenticate, authorize('admin', 'academic_admin'), asyncHandler(async (req: AuthRequest, res: any) => {
  const data = createClassSchema.parse(req.body);
  const classDoc = new Class(data);
  await classDoc.save();
  await classDoc.populate('teacherId', 'firstName lastName email');
  res.status(201).json({ data: classDoc });
}));

// Get all subjects
router.get('/subjects', authenticate, asyncHandler(async (req: AuthRequest, res: any) => {
  const subjects = await Subject.find().sort({ name: 1 });
  res.json({ data: subjects });
}));

// Create subject
router.post('/subjects', authenticate, authorize('admin', 'academic_admin'), asyncHandler(async (req: AuthRequest, res: any) => {
  const data = createSubjectSchema.parse(req.body);
  const subject = new Subject(data);
  await subject.save();
  res.status(201).json({ data: subject });
}));

// Get timetables
router.get('/timetables', authenticate, asyncHandler(async (req: AuthRequest, res: any) => {
  const classId = req.query.classId as string;
  const academicYearId = req.query.academicYearId as string;

  const query: any = {};
  if (classId) query.classId = classId;
  if (academicYearId) query.academicYearId = academicYearId;

  const timetables = await Timetable.find(query)
    .populate('classId', 'name gradeLevel')
    .populate('academicYearId', 'name')
    .populate('slots.subjectId', 'name code')
    .populate('slots.teacherId', 'firstName lastName')
    .sort({ createdAt: -1 });

  res.json({ data: timetables });
}));

// Create timetable
router.post('/timetables', authenticate, authorize('admin', 'academic_admin'), asyncHandler(async (req: AuthRequest, res: any) => {
  const data = createTimetableSchema.parse(req.body);
  
  // Check for conflicts (same teacher, same period, same day)
  const existing = await Timetable.findOne({
    academicYearId: data.academicYearId,
    'slots.day': { $in: data.slots.map(s => s.day) },
    'slots.period': { $in: data.slots.map(s => s.period) },
    'slots.teacherId': { $in: data.slots.map(s => s.teacherId) },
  });

  if (existing) {
    throw new AppError(409, 'TIMETABLE_CONFLICT', 'Teacher has a conflict in the timetable');
  }

  const timetable = new Timetable(data);
  await timetable.save();
  await timetable.populate('classId academicYearId slots.subjectId slots.teacherId');
  
  res.status(201).json({ data: timetable });
}));

export default router;

