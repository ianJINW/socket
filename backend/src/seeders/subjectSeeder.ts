import mongoose from 'mongoose';
import '../modules/academics/models/Subject';

const Subject = mongoose.model('Subject');

export async function seedSubjects() {
  try {
    await Subject.deleteMany({});

    const subjects = [
      {
        name: 'Mathematics',
        code: 'MATH101',
        description: 'Basic mathematics including algebra, geometry, and arithmetic',
        credits: 4,
        gradeLevel: 1,
        isActive: true,
      },
      {
        name: 'English',
        code: 'ENG101',
        description: 'English language and literature',
        credits: 3,
        gradeLevel: 1,
        isActive: true,
      },
      {
        name: 'Science',
        code: 'SCI101',
        description: 'Basic science including physics, chemistry, and biology',
        credits: 4,
        gradeLevel: 1,
        isActive: true,
      },
      {
        name: 'History',
        code: 'HIST101',
        description: 'World history and civilization',
        credits: 3,
        gradeLevel: 1,
        isActive: true,
      },
      {
        name: 'Computer Science',
        code: 'CS101',
        description: 'Introduction to computer science and programming',
        credits: 4,
        gradeLevel: 1,
        isActive: true,
      }
    ];

    await Subject.insertMany(subjects);
    console.log('✅ Subjects seeded');
  } catch (error) {
    console.error('❌ Error seeding subjects:', error);
    throw error;
  }
}