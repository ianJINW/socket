import { Request } from 'express';
import { Document } from 'mongoose';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions?: string[];
  };
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<{ path: string; message: string }>;
    correlationId?: string;
  };
}

// Base document interface
export interface BaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// User roles
export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
  FINANCE = 'finance',
  ACADEMIC_ADMIN = 'academic_admin',
}

// Student status
export enum StudentStatus {
  ACTIVE = 'active',
  TRANSFERRED = 'transferred',
  GRADUATED = 'graduated',
  ARCHIVED = 'archived',
}

// Attendance status
export enum AttendanceStatus {
  PRESENT = 'P',
  ABSENT = 'A',
  LATE = 'L',
}

// Invoice status
export enum InvoiceStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  PARTIAL = 'partial',
  PAID = 'paid',
  VOID = 'void',
}

// Payment status
export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// Exam status
export enum ExamStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
}


