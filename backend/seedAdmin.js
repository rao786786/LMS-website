import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({
      email: 'admin@lms.com',
    });

    if (existingAdmin) {
      console.log('Admin already exists');
      return; // ❗ STOP ONLY FUNCTION, NOT SERVER
    }

    const hashedPassword = await bcrypt.hash('Admin@12345', 10);

    const admin = new User({
      name: 'Admin',
      email: 'admin@lms.com',
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();

    console.log('Admin account created successfully');
    console.log('Email: admin@lms.com');
    console.log('Password: Admin@12345');

  } catch (error) {
    console.log(error);
  }
};

seedAdmin();
