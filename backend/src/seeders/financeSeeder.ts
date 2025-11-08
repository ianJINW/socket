import mongoose from 'mongoose';
import '../modules/finance/models/Invoice';
import '../modules/finance/models/Payment';
import '../modules/students/models/Student';

const Invoice = mongoose.model('Invoice');
const Payment = mongoose.model('Payment');
const Student = mongoose.model('Student');

export async function seedFinance() {
  try {
    await Invoice.deleteMany({});
    await Payment.deleteMany({});

    // Get a student
    const student = await Student.findOne({ admissionNo: 'ST2025001' });
    if (!student) {
      throw new Error('No student found. Please seed students first.');
    }

    // Create invoice
    const total = 1200;
    const balance = 1200;
    const invoice = {
      studentId: student._id,
      invoiceNo: `INV-${Date.now()}`,
      dueDate: new Date('2025-12-31'),
      currency: 'USD',
      items: [
        {
          head: 'Tuition Fee',
          amount: 1000,
          description: 'First semester tuition fee'
        },
        {
          head: 'Laboratory Fee',
          amount: 200,
          description: 'Science lab usage fee'
        }
      ],
      total,
      balance,
      status: 'open'
    };

    const savedInvoice = await Invoice.create(invoice);

    // Create payment
    const payment = {
      invoiceId: savedInvoice._id,
      method: 'bank',
      amount: 600,
      currency: 'USD',
      txnRef: `TXN-${Date.now()}`,
      status: 'succeeded',
      receivedAt: new Date(),
      idempotencyKey: `PAY-${Date.now()}`
    };

    await Payment.create(payment);

    // Update invoice status
    savedInvoice.status = 'partial';
    await savedInvoice.save();

    console.log('✅ Finance data seeded');
  } catch (error) {
    console.error('❌ Error seeding finance data:', error);
    throw error;
  }
}