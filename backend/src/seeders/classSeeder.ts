import mongoose from 'mongoose';
import '../modules/academics/models/Class';
import '../modules/admin/models/AcademicYear';

const Class = mongoose.model('Class');
const AcademicYear = mongoose.model('AcademicYear');

export async function seedClasses() {
  try {
    await Class.deleteMany({});

    // Get the current academic year
    const currentYear = await AcademicYear.findOne({ isActive: true });
    if (!currentYear) {
      throw new Error('No active academic year found. Please seed academic years first.');
    }

    const classes = [
      {
        name: 'Grade 1A',
        section: 'A',
        gradeLevel: 1,
        academicYear: currentYear._id,
        capacity: 30,
        status: 'ACTIVE',
      },
      {
        name: 'Grade 1B',
        section: 'B',
        gradeLevel: 1,
        academicYear: currentYear._id,
        capacity: 30,
        status: 'ACTIVE',
      },
      {
        name: 'Grade 2A',
        section: 'A',
        gradeLevel: 2,
        academicYear: currentYear._id,
        capacity: 30,
        status: 'ACTIVE',
      },
      {
        name: 'Grade 2B',
        section: 'B',
        gradeLevel: 2,
        academicYear: currentYear._id,
        capacity: 30,
        status: 'ACTIVE',
      }
    ];

    await Class.insertMany(classes);
    console.log('✅ Classes seeded');
  } catch (error) {
    console.error('❌ Error seeding classes:', error);
    throw error;
  }
}