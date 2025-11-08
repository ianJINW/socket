import { Router } from 'express';
import { z } from 'zod';
import Student from '../models/Student';
import Guardian from '../models/Guardian';
import { authenticate, authorize } from '../../../middlewares/auth';
import { asyncHandler } from '../../../utils/errors';
import { AuthRequest, StudentStatus, PaginatedResponse } from '../../../types';
import { AppError } from '../../../utils/errors';

const router = Router();

const createStudentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dob: z.string().transform((str) => new Date(str)),
  gender: z.string(),
  admissionNo: z.string(),
  emails: z.array(z.string().email()).optional(),
  contacts: z.array(z.string()).optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  classId: z.string().optional(),
  medical: z.object({
    notes: z.string().optional(),
    allergies: z.array(z.string()).optional(),
  }).optional(),
});

const updateStudentSchema = createStudentSchema.partial();

const createGuardianSchema = z.object({
  name: z.string().min(1),
  relation: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
  isPrimary: z.boolean().default(false),
});

// Get all students with pagination
router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const q = req.query.q as string;
  const classId = req.query.classId as string;
  const status = req.query.status as string;

  const query: any = { deletedAt: null };
  if (q) {
    query.$or = [
      { firstName: { $regex: q, $options: 'i' } },
      { lastName: { $regex: q, $options: 'i' } },
      { admissionNo: { $regex: q, $options: 'i' } },
    ];
  }
  if (classId) query.classId = classId;
  if (status) query.status = status;

  const total = await Student.countDocuments(query);
  const students = await Student.find(query)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate('classId', 'name gradeLevel')
    .sort({ createdAt: -1 });

  const response: PaginatedResponse<any> = {
    data: students,
    meta: {
      page,
      pageSize,
      total,
      pageCount: Math.ceil(total / pageSize),
    },
  };

  res.json(response);
}));

// Get single student
router.get('/:id', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const student = await Student.findOne({ _id: req.params.id, deletedAt: null })
    .populate('classId', 'name gradeLevel');
  
  if (!student) {
    throw new AppError(404, 'NOT_FOUND', 'Student not found');
  }

  res.json({ data: student });
}));

// Create student
router.post('/', authenticate, authorize('admin', 'academic_admin'), asyncHandler(async (req, res) => {
  const data = createStudentSchema.parse(req.body);
  
  const existing = await Student.findOne({ admissionNo: data.admissionNo });
  if (existing) {
    throw new AppError(409, 'DUPLICATE_ADMISSION_NO', 'Student with this admission number already exists');
  }

  const student = new Student({ ...data, status: StudentStatus.ACTIVE });
  await student.save();
  
  res.status(201).json({ data: student });
}));

// Update student
router.patch('/:id', authenticate, authorize('admin', 'academic_admin'), asyncHandler(async (req: AuthRequest, res: any) => {
  const data = updateStudentSchema.parse(req.body);
  const student = await Student.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { $set: data },
    { new: true }
  );

  if (!student) {
    throw new AppError(404, 'NOT_FOUND', 'Student not found');
  }

  res.json({ data: student });
}));

// Delete student (soft delete)
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(async (req: AuthRequest, res: any) => {
  const student = await Student.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { $set: { deletedAt: new Date(), status: StudentStatus.ARCHIVED } },
    { new: true }
  );

  if (!student) {
    throw new AppError(404, 'NOT_FOUND', 'Student not found');
  }

  res.json({ data: { success: true } });
}));

// Get guardians for a student
router.get('/:id/guardians', authenticate, asyncHandler(async (req: AuthRequest, res: any) => {
  const guardians = await Guardian.find({ studentId: req.params.id });
  res.json({ data: guardians });
}));

// Add guardian
router.post('/:id/guardians', authenticate, authorize('admin', 'academic_admin'), asyncHandler(async (req: AuthRequest, res: any) => {
  const data = createGuardianSchema.parse(req.body);
  
  // If setting as primary, unset other primary guardians
  if (data.isPrimary) {
    await Guardian.updateMany(
      { studentId: req.params.id, isPrimary: true },
      { $set: { isPrimary: false } }
    );
  }

  const guardian = new Guardian({ ...data, studentId: req.params.id });
  await guardian.save();
  
  res.status(201).json({ data: guardian });
}));

// Update guardian
router.patch('/:id/guardians/:guardianId', authenticate, authorize('admin', 'academic_admin'), asyncHandler(async (req: AuthRequest, res: any) => {
  const data = createGuardianSchema.partial().parse(req.body);
  
  if (data.isPrimary) {
    await Guardian.updateMany(
      { studentId: req.params.id, isPrimary: true, _id: { $ne: req.params.guardianId } },
      { $set: { isPrimary: false } }
    );
  }

  const guardian = await Guardian.findOneAndUpdate(
    { _id: req.params.guardianId, studentId: req.params.id },
    { $set: data },
    { new: true }
  );

  if (!guardian) {
    throw new AppError(404, 'NOT_FOUND', 'Guardian not found');
  }

  res.json({ data: guardian });
}));

export default router;

