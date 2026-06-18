const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'fixed'
  },
  discountValue: {
    type: Number,
    required: true
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: 1 // Default to one-time use if global, but we use usedBy for per-user
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  restrictedEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  applicableFor: {
    type: String,
    enum: ['All', 'Events', 'Documents'],
    default: 'All'
  }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
