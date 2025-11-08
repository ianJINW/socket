import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import '../modules/admin/models/User';

const User = mongoose.model('User');

export async function seedUsers() {
  try {
    await User.deleteMany({}); // Clear existing users

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        email: 'admin@school.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
      },
      {
        email: 'teacher@school.com',
        password: hashedPassword,
        firstName: 'Teacher',
        lastName: 'User',
        role: 'teacher',
        isActive: true,
      },
    ];

    await User.insertMany(users);
    console.log('✅ Users seeded');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}