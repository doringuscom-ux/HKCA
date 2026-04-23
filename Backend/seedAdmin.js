const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';

    const userExists = await User.findOne({ username });

    if (userExists) {
      console.log('Admin user already exists');
      process.exit();
    }

    const admin = new User({
      username,
      email: 'admin@hkca.com',
      password,
      role: 'admin',
    });

    await admin.save();

    console.log(`Admin user created: ${username} / ${password}`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
