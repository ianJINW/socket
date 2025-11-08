import mongoose from 'mongoose';
import '../modules/students/models/Student';
import '../modules/students/models/Guardian';
import '../modules/academics/models/Class';

const Student = mongoose.model('Student');
const Guardian = mongoose.model('Guardian');
const Class = mongoose.model('Class');

export async function seedStudents() {
  try {
    await Student.deleteMany({});
    await Guardian.deleteMany({});

    // Get available classes
    const classes = await Class.find({ status: 'ACTIVE' });
    if (classes.length === 0) {
      throw new Error('No active classes found. Please seed classes first.');
    }

    // Create students first
    const students = [
      {
        firstName: 'Alice',
        lastName: 'Doe',
        dob: new Date('2018-05-15'),
        gender: 'Female',
        admissionNo: 'ST2025001',
        classId: classes[0]._id,
        emails: ['alice.doe@student.school.com'],
        contacts: ['+1234567892'],
        address: '123 Parent Street', 
        status: 'active'
      },
      {
        firstName: 'Bob',
        lastName: 'Smith',
        dob: new Date('2018-08-22'),
        gender: 'Male',
        admissionNo: 'ST2025002',
        classId: classes[0]._id,
        emails: ['bob.smith@student.school.com'],
        contacts: ['+1234567893'],
        address: '456 Guardian Avenue',
        status: 'active'
      }
    ];

    const savedStudents = await Student.insertMany(students);

    // Create guardians for the students
    const guardians = [
      {
        name: 'John Doe',
        studentId: savedStudents[0]._id,
        relation: 'Father',
        phone: '+1234567890',
        email: 'john.doe@example.com',
        address: {
          street: '123 Parent Street',
          city: 'Example City',
          state: 'EX',
          zipCode: '12345'
        },
        isPrimary: true
      },
      {
        name: 'Jane Smith',
        studentId: savedStudents[1]._id,
        relation: 'Mother',
        phone: '+1234567891',
        email: 'jane.smith@example.com',
        address: {
          street: '456 Guardian Avenue',
          city: 'Example City',
          state: 'EX',
          zipCode: '12345'
        },
        isPrimary: true
      }
    ];

    await Guardian.insertMany(guardians);
    console.log('✅ Students and Guardians seeded');
  } catch (error) {
    console.error('❌ Error seeding students and guardians:', error);
    throw error;
  }
}