const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userMessage: {
    type: String,
    required: true,
  },
  botResponse: {
    type: String,
    required: true,
  },
  intent: {
    type: String,
  },
  score: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
