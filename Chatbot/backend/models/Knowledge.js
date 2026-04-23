const mongoose = require('mongoose');

const knowledgeSchema = new mongoose.Schema({
  intent: {
    type: String,
    required: true,
    unique: true,
  },
  utterances: [{
    type: String,
    required: true,
  }],
  answers: [{
    type: String,
    required: true,
  }],
  category: {
    type: String,
    enum: ['core', 'event', 'news', 'faq'],
    default: 'faq',
  },
  source: {
    type: String, // 'manual' or 'auto-sync'
    default: 'manual',
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId, // ID of the event or publication if synced
  }
}, { timestamps: true });

module.exports = mongoose.model('Knowledge', knowledgeSchema);
