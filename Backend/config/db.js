const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 10000, // 10 seconds timeout for initial connection
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout for all operations
      autoIndex: true, // Help Mongoose sync indexes properly
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
