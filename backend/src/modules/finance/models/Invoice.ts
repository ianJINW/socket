import mongoose, { Schema, Document } from 'mongoose';
import { BaseDocument, InvoiceStatus } from '../../../types';

export interface IInvoiceItem {
  head: string;
  amount: number;
  description?: string;
}

export interface IInvoice extends BaseDocument {
  studentId: mongoose.Types.ObjectId;
  invoiceNo: string;
  dueDate: Date;
  currency: string;
  items: IInvoiceItem[];
  total: number;
  balance: number;
  status: InvoiceStatus;
  lateFee?: number;
  meta?: Record<string, any>;
}

const invoiceItemSchema = new Schema<IInvoiceItem>({
  head: { type: String, required: true },
  amount: { type: Number, required: true },
  description: String,
});

const invoiceSchema = new Schema<IInvoice>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    items: [invoiceItemSchema],
    total: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(InvoiceStatus),
      default: InvoiceStatus.DRAFT,
      index: true,
    },
    lateFee: Number,
    meta: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

invoiceSchema.index({ studentId: 1, status: 1, dueDate: 1 });

const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
export default Invoice;


