const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the gallery item'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL or upload an image'],
  },
  cloudinaryId: {
    type: String,
  },
  category: {
    type: String,
    default: 'General',
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },
  coverImage: {
    type: String,
    default: '',
  },
  source: {
    type: String,
    enum: ['admin', 'youtube'],
    default: 'admin',
  },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);

