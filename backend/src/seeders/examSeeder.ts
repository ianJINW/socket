import mongoose from 'mongoose';
import '../modules/exams/models/Exam';
import '../modules/exams/models/Question';
import '../modules/academics/models/Subject';
import '../modules/academics/models/Class';

const Exam = mongoose.model('Exam');
const Question = mongoose.model('Question');
const Subject = mongoose.model('Subject');
const Class = mongoose.model('Class');

export async function seedExams() {
  try {
    await Exam.deleteMany({});
    await Question.deleteMany({});

    // Get a subject and class
    const subject = await Subject.findOne({ code: 'MATH101' });
    const class1 = await Class.findOne({ name: 'Grade 1A' });

    if (!subject || !class1) {
      throw new Error('Required subject or class not found. Please seed subjects and classes first.');
    }

    // Create questions
    const questions = [
      {
        type: 'mcq',
        prompt: 'What is 2 + 2?',
        choices: ['3', '4', '5', '6'],
        correctAnswers: ['4'],
        points: 1,
        subjectId: subject._id
      },
      {
        type: 'mcq', 
        prompt: 'What is 5 x 5?',
        choices: ['15', '20', '25', '30'],
        correctAnswers: ['25'],
        points: 1,
        subjectId: subject._id
      }
    ];

    const savedQuestions = await Question.insertMany(questions);

    // Find a teacher user
    const teacher = await mongoose.model('User').findOne({ role: 'teacher' });
    if (!teacher) {
      throw new Error('Teacher user not found. Please seed users first.');
    }

    // Create exam 
    const exam = {
      createdBy: teacher._id,
      name: 'Mathematics Mid-Term',
      subjectId: subject._id,
      classId: class1._id,
      date: new Date('2025-12-15'),
      durationMin: 60,
      sections: [{
        name: 'Multiple Choice',
        questionIds: savedQuestions.map(q => q._id)
      }],
      settings: {
        negativeMarking: false,
        proctoring: false,
        allowReview: true
      },
      status: 'draft'
    };

    await Exam.create(exam);
    console.log('✅ Exams and Questions seeded');
  } catch (error) {
    console.error('❌ Error seeding exams and questions:', error);
    throw error;
  }
}