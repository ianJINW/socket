import { Router } from 'express';
import { z } from 'zod';
import Exam from '../models/Exam';
import Question from '../models/Question';
import Submission from '../models/Submission';
import Grade from '../models/Grade';
import { authenticate, authorize } from '../../../middlewares/auth';
import { asyncHandler } from '../../../utils/errors';
import { AuthRequest, ExamStatus } from '../../../types';
import { AppError } from '../../../utils/errors';

const router = Router();

const createExamSchema = z.object({
  name: z.string().min(1),
  subjectId: z.string(),
  classId: z.string(),
  date: z.string().transform((str) => new Date(str)),
  durationMin: z.number().int().min(1),
  sections: z.array(z.object({
    name: z.string(),
    questionIds: z.array(z.string()),
  })),
  settings: z.object({
    negativeMarking: z.boolean().optional(),
    proctoring: z.boolean().optional(),
    allowReview: z.boolean().optional(),
  }).optional(),
});

const createQuestionSchema = z.object({
  type: z.enum(['mcq', 'short', 'essay']),
  prompt: z.string().min(1),
  choices: z.array(z.string()).optional(),
  correctAnswers: z.array(z.string()).optional(),
  points: z.number().default(1),
  subjectId: z.string(),
});

const submitExamSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.union([z.string(), z.array(z.string())]),
  })),
});

// Get all exams
router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: any) => {
  const classId = req.query.classId as string;
  const subjectId = req.query.subjectId as string;
  const status = req.query.status as string;

  const query: any = {};
  if (classId) query.classId = classId;
  if (subjectId) query.subjectId = subjectId;
  if (status) query.status = status;

  const exams = await Exam.find(query)
    .populate('subjectId', 'name code')
    .populate('classId', 'name')
    .populate('createdBy', 'firstName lastName')
    .sort({ date: -1 });

  res.json({ data: exams });
}));

// Create exam
router.post('/', authenticate, authorize('teacher', 'admin', 'academic_admin'), asyncHandler(async (req: AuthRequest, res: any) => {
  const data = createExamSchema.parse(req.body);
  const exam = new Exam({
    ...data,
    createdBy: req.user!.id,
    status: ExamStatus.DRAFT,
  });
  await exam.save();
  await exam.populate('subjectId classId createdBy');
  res.status(201).json({ data: exam });
}));

// Publish exam
router.post('/:id/publish', authenticate, authorize('teacher', 'admin', 'academic_admin'), asyncHandler(async (req: AuthRequest, res: any) => {
  const exam = await Exam.findByIdAndUpdate(
    req.params.id,
    { $set: { status: ExamStatus.PUBLISHED } },
    { new: true }
  );

  if (!exam) {
    throw new AppError(404, 'NOT_FOUND', 'Exam not found');
  }

  res.json({ data: exam });
}));

// Submit exam
router.post('/:id/submit', authenticate, authorize('student'), asyncHandler(async (req: AuthRequest, res: any) => {
  const data = submitExamSchema.parse(req.body);
  const exam = await Exam.findById(req.params.id);
  
  if (!exam) {
    throw new AppError(404, 'NOT_FOUND', 'Exam not found');
  }

  if (exam.status !== ExamStatus.PUBLISHED) {
    throw new AppError(400, 'EXAM_NOT_PUBLISHED', 'Exam is not published');
  }

  // Check if already submitted
  const existing = await Submission.findOne({
    examId: exam._id,
    studentId: req.user!.id,
  });

  if (existing) {
    throw new AppError(409, 'ALREADY_SUBMITTED', 'Exam already submitted');
  }

  // Auto-grade MCQ questions
  let scoreAuto = 0;
  const questions = await Question.find({ _id: { $in: exam.sections.flatMap(s => s.questionIds) } });
  const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

  for (const answer of data.answers) {
    const question = questionMap.get(answer.questionId);
    if (question && question.type === 'mcq' && question.correctAnswers) {
      const userAnswer = Array.isArray(answer.answer) ? answer.answer : [answer.answer];
      const correct = userAnswer.every(a => question.correctAnswers!.includes(a)) &&
                      userAnswer.length === question.correctAnswers.length;
      if (correct) {
        scoreAuto += question.points;
      }
    }
  }

  const submission = new Submission({
    examId: exam._id,
    studentId: req.user!.id,
    answers: data.answers,
    startedAt: new Date(),
    submittedAt: new Date(),
    scoreAuto,
    totalScore: scoreAuto,
  });

  await submission.save();
  res.status(201).json({ data: submission });
}));

// Get questions
router.get('/questions', authenticate, asyncHandler(async (req: AuthRequest, res: any) => {
  const subjectId = req.query.subjectId as string;
  const type = req.query.type as string;

  const query: any = {};
  if (subjectId) query.subjectId = subjectId;
  if (type) query.type = type;

  const questions = await Question.find(query).sort({ createdAt: -1 });
  res.json({ data: questions });
}));

// Create question
router.post('/questions', authenticate, authorize('teacher', 'admin', 'academic_admin'), asyncHandler(async (req: AuthRequest, res: any) => {
  const data = createQuestionSchema.parse(req.body);
  const question = new Question(data);
  await question.save();
  res.status(201).json({ data: question });
}));

// Get grades
router.get('/grades', authenticate, asyncHandler(async (req: AuthRequest, res: any) => {
  const studentId = req.query.studentId as string;
  const classId = req.query.classId as string;
  const termId = req.query.termId as string;

  const query: any = {};
  if (studentId) query.studentId = studentId;
  if (termId) query.termId = termId;

  const grades = await Grade.find(query)
    .populate('studentId', 'firstName lastName admissionNo')
    .populate('subjectId', 'name code')
    .populate('examId', 'name')
    .sort({ createdAt: -1 });

  res.json({ data: grades });
}));

export default router;

