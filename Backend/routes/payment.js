const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/auth');
const GlobalSettings = require('../models/GlobalSettings');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Get pricing for an event based on user role
// @route   GET /api/payment/get-price/:eventId
// @access  Private
router.get('/get-price/:eventId', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const role = req.user.role;
    // Map 'viewer' role to 'spectator' pricing
    const pricingKey = role === 'viewer' ? 'spectator' : role;
    const basePrice = event.pricing[pricingKey] || 0;

    res.json({ basePrice, role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Validate coupon code
// @route   GET /api/payment/validate-coupon/:code
// @access  Private
router.get('/validate-coupon/:code', protect, async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or inactive coupon code' });
    }

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (coupon.usedBy.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already used this coupon' });
    }

    if (coupon.restrictedEmail && coupon.restrictedEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ message: 'This coupon is not valid for your email address' });
    }

    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  const { eventId, couponCode, role: selectedRole } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check for existing confirmed registration
    const existingRegistration = await EventRegistration.findOne({
      event: eventId,
      user: req.user._id,
      status: 'confirmed'
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    console.log(`Creating Razorpay order for event: ${event.title}, User: ${req.user.email}`);

    const role = selectedRole || req.user.role;
    const pricingKey = role === 'viewer' ? 'spectator' : role;
    let amount = event.pricing[pricingKey] || 0;

    let couponId = null;
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && coupon.expiryDate > new Date() && !coupon.usedBy.includes(req.user._id)) {
        const baseAmount = amount;
        if (coupon.discountType === 'fixed') {
          amount = amount - coupon.discountValue;
        } else if (coupon.discountType === 'percentage') {
          amount = amount - (amount * (coupon.discountValue / 100));
        }
        
        // Ensure a minimum of ₹1 if it was a paid role
        if (baseAmount > 0) {
          amount = Math.max(1, amount);
        } else {
          amount = Math.max(0, amount);
        }

        discountAmount = baseAmount - amount;
        couponId = coupon._id;
      }
    }

    // Razorpay expects amount in paise
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Create a pending registration record
    const registration = await EventRegistration.create({
      event: eventId,
      user: req.user._id,
      role: role,
      status: 'pending',
      amountPaid: amount,
      discountAmount: discountAmount,
      razorpayOrderId: order.id,
      couponUsed: couponId
    });

    console.log(`Order created successfully: ${order.id}`);
    res.json({
      orderId: order.id,
      amount: order.amount,
      registrationId: registration._id,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify payment
// @route   POST /api/payment/verify
// @access  Private
router.post('/verify', protect, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    registrationId,
    status // 'success' or 'failed' (passed from frontend for easier testing as requested)
  } = req.body;

  try {
    const registration = await EventRegistration.findById(registrationId);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    // Verify signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      registration.status = 'failed';
      registration.paymentStatus = 'failed';
      await registration.save();
      return res.status(400).json({ message: 'Transaction not legitimate!' });
    }

    // Update registration based on status
    if (status === 'failed') {
      registration.status = 'failed';
      registration.paymentStatus = 'failed';
    } else {
      registration.status = 'confirmed';
      registration.paymentStatus = 'paid';
      registration.razorpayPaymentId = razorpay_payment_id;
      registration.razorpaySignature = razorpay_signature;

      // Mark coupon as used if applicable
      if (registration.couponUsed) {
        await Coupon.findByIdAndUpdate(registration.couponUsed, {
          $addToSet: { usedBy: req.user._id }
        });
      }
    }

    await registration.save();
    res.json({ success: true, status: registration.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const User = require('../models/User');

// @desc    Create Razorpay order for Registration Fee
// @route   POST /api/payment/create-registration-order
// @access  Public (User not created yet)
router.post('/create-registration-order', async (req, res) => {
  const { role, email, username } = req.body;

  try {
    // Preliminary Validation: Check if email or username already exists
    if (email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already registered. Please login or use a different email.' });
      }
    }

    if (username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ message: 'Username is already taken. Please choose another one.' });
      }
    }
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      settings = await GlobalSettings.create({
        registrationFees: { athlete: 0, coach: 0, club: 0 }
      });
    }
    const fee = settings.registrationFees[role] || 0;

    if (fee <= 0) {
      return res.status(400).json({ message: 'No fee required for this role or invalid role.' });
    }

    console.log(`Creating registration order for Role: ${role}, Email: ${email}, Amount: ${fee}`);

    const options = {
      amount: Math.round(fee * 100), // paise
      currency: 'INR',
      receipt: `reg_receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Registration Order Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create Razorpay order for Document Verification
// @route   POST /api/payment/create-doc-verify-order
// @access  Private
router.post('/create-doc-verify-order', protect, async (req, res) => {
  const { categoryName, couponCode } = req.body;

  try {
    let settings = await GlobalSettings.findOne();
    const category = settings?.documentCategories?.find(c => c.name === categoryName);
    
    if (!category || category.fee <= 0) {
      return res.status(400).json({ message: 'No fee required for this category or category not found.' });
    }

    let amount = category.fee;
    let discountAmount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && coupon.expiryDate > new Date() && !coupon.usedBy.includes(req.user._id)) {
        if (coupon.discountType === 'fixed') {
          amount = amount - coupon.discountValue;
        } else if (coupon.discountType === 'percentage') {
          amount = amount - (amount * (coupon.discountValue / 100));
        }
        
        amount = Math.max(0, amount);
        discountAmount = category.fee - amount;
      }
    }

    if (amount <= 0) {
      return res.json({
        orderId: null,
        amount: 0,
        message: 'No payment required'
      });
    }

    const options = {
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `doc_receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Doc Verify Order Error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
