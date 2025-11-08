import mongoose, { Schema, Document } from 'mongoose';
import { BaseDocument, PaymentStatus } from '../../../types';

export interface IPayment extends BaseDocument {
  invoiceId: mongoose.Types.ObjectId;
  method: 'card' | 'bank' | 'cash';
  amount: number;
  currency: string;
  txnRef: string;
  status: PaymentStatus;
  receivedAt?: Date;
  idempotencyKey?: string;
  meta?: Record<string, any>;
}

const paymentSchema = new Schema<IPayment>(
  {
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true,
      index: true,
    },
    method: {
      type: String,
      enum: ['card', 'bank', 'cash'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    txnRef: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    receivedAt: Date,
    idempotencyKey: {
      type: String,
      index: true,
      sparse: true,
    },
    meta: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ invoiceId: 1, status: 1 });
paymentSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;


