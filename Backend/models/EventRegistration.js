const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['athlete', 'coach', 'club', 'spectator'],
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'failed'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  amountPaid: {
    type: Number,
    default: 0
  },
  couponUsed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    default: null
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  cancellationReason: {
    type: String,
    default: '',
  },
  allowReapply: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

// Note: Unique index removed to allow historical cancelled records and new ticket IDs for re-booking.
// Application logic now ensures only one active (confirmed/pending) registration exists per user/event/role.

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
