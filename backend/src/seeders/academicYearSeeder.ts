import mongoose from 'mongoose';
import '../modules/admin/models/AcademicYear';

const AcademicYear = mongoose.model('AcademicYear');

export async function seedAcademicYear() {
  try {
    await AcademicYear.deleteMany({}); // Clear existing academic years

    const currentYear = new Date().getFullYear();
    
    const academicYears = [
      {
        name: `${currentYear}-${currentYear + 1}`,
        startDate: new Date(currentYear, 8, 1), // September 1st
        endDate: new Date(currentYear + 1, 7, 31), // August 31st
        isActive: true,
      },
      {
        name: `${currentYear + 1}-${currentYear + 2}`,
        startDate: new Date(currentYear + 1, 8, 1),
        endDate: new Date(currentYear + 2, 7, 31),
        isActive: false,
      }
    ];

    await AcademicYear.insertMany(academicYears);
    console.log('✅ Academic Years seeded');
  } catch (error) {
    console.error('❌ Error seeding academic years:', error);
    throw error;
  }
}