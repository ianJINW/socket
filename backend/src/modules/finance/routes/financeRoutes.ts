import { Router } from 'express';
import { z } from 'zod';
import Invoice from '../models/Invoice';
import Payment from '../models/Payment';
import { authenticate, authorize } from '../../../middlewares/auth';
import { asyncHandler } from '../../../utils/errors';
import { AuthRequest, InvoiceStatus, PaymentStatus } from '../../../types';
import { AppError } from '../../../utils/errors';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const createInvoiceSchema = z.object({
  studentId: z.string(),
  items: z.array(z.object({
    head: z.string(),
    amount: z.number().min(0),
    description: z.string().optional(),
  })),
  dueDate: z.string().transform((str) => new Date(str)),
  currency: z.string().default('USD'),
});

const createPaymentSchema = z.object({
  invoiceId: z.string(),
  method: z.enum(['card', 'bank', 'cash']),
  amount: z.number().min(0),
  currency: z.string().default('USD'),
  idempotencyKey: z.string().optional(),
});

// Get invoices
router.get('/invoices', authenticate, asyncHandler(async (req: AuthRequest, res: any) => {
  const studentId = req.query.studentId as string;
  const status = req.query.status as string;

  const query: any = {};
  if (studentId) query.studentId = studentId;
  if (status) query.status = status;

  const invoices = await Invoice.find(query)
    .populate('studentId', 'firstName lastName admissionNo')
    .sort({ createdAt: -1 });

  res.json({ data: invoices });
}));

// Create invoice
router.post('/invoices', authenticate, authorize('admin', 'finance'), asyncHandler(async (req: AuthRequest, res: any) => {
  const data = createInvoiceSchema.parse(req.body);
  
  const total = data.items.reduce((sum, item) => sum + item.amount, 0);
  const invoiceNo = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const invoice = new Invoice({
    ...data,
    invoiceNo,
    total,
    balance: total,
    status: InvoiceStatus.OPEN,
  });

  await invoice.save();
  await invoice.populate('studentId');
  res.status(201).json({ data: invoice });
}));

// Create payment
router.post('/payments', authenticate, asyncHandler(async (req: AuthRequest, res: any) => {
  const data = createPaymentSchema.parse(req.body);
  const idempotencyKey = data.idempotencyKey || uuidv4();

  // Check for duplicate using idempotency key
  const existing = await Payment.findOne({ idempotencyKey });
  if (existing) {
    return res.json({ data: existing });
  }

  const invoice = await Invoice.findById(data.invoiceId);
  if (!invoice) {
    throw new AppError(404, 'NOT_FOUND', 'Invoice not found');
  }

  if (invoice.balance < data.amount) {
    throw new AppError(400, 'OVERPAYMENT', 'Payment amount exceeds invoice balance');
  }

  const txnRef = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const payment = new Payment({
    invoiceId: invoice._id,
    method: data.method,
    amount: data.amount,
    currency: data.currency,
    txnRef,
    status: PaymentStatus.PENDING,
    idempotencyKey,
  });

  await payment.save();

  // Update invoice balance and status
  invoice.balance -= data.amount;
  if (invoice.balance === 0) {
    invoice.status = InvoiceStatus.PAID;
  } else if (invoice.balance < invoice.total) {
    invoice.status = InvoiceStatus.PARTIAL;
  }

  await invoice.save();

  // Simulate payment success (in production, integrate with payment gateway)
  payment.status = PaymentStatus.SUCCEEDED;
  payment.receivedAt = new Date();
  await payment.save();

  res.status(201).json({ data: payment });
}));

// Get payments
router.get('/payments', authenticate, asyncHandler(async (req: AuthRequest, res: any) => {
  const invoiceId = req.query.invoiceId as string;

  const query: any = {};
  if (invoiceId) query.invoiceId = invoiceId;

  const payments = await Payment.find(query)
    .populate('invoiceId', 'invoiceNo total')
    .sort({ createdAt: -1 });

  res.json({ data: payments });
}));

export default router;

