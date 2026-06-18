const mongoose = require('mongoose');

const documentVerificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentCategory: {
    type: String,
    required: true
  },
  documentUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  feePaid: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  transactionId: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('DocumentVerification', documentVerificationSchema);
