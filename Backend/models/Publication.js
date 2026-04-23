const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  summary: {
    type: String,
    required: [true, 'Please add a summary'],
  },
  content: {
    type: String, // Full text if it's an article
  },
  category: {
    type: String,
    enum: ['General', 'Results', 'Result', 'News'],
    required: true,
  },
  type: {
    type: String,
    enum: ['Article', 'PDF'],
    default: 'PDF',
  },
  imageUrl: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String, // PDF URL
  },
  cloudinaryImageId: {
    type: String,
  },
  cloudinaryFileId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
  },
}, { timestamps: true });

module.exports = mongoose.model('Publication', publicationSchema);
