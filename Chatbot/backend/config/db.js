const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connection for Chatbot's own data
    const chatbotConn = await mongoose.createConnection(process.env.MONGO_URI_CHATBOT).asPromise();
    console.log(`Chatbot DB Connected: ${chatbotConn.host}`);

    // Connection for Main HKCA data (Read-only access usually sufficient)
    const mainConn = await mongoose.createConnection(process.env.MONGO_URI_MAIN).asPromise();
    console.log(`Main HKCA DB Connected: ${mainConn.host}`);

    return { chatbotConn, mainConn };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
