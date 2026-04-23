const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the event'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description for the event'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date for the event'],
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Please provide a registration deadline'],
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL or upload an image'],
  },
  cloudinaryId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
  },
  pricing: {
    athlete: { type: Number, default: 200 },
    coach: { type: Number, default: 500 },
    club: { type: Number, default: 5000 },
    spectator: { type: Number, default: 100 },
  },
  duration: {
    type: String,
  },
  mapUrl: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
