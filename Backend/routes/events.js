const express = require('express');
const router = express.Router();
const EventRegistration = require('../models/EventRegistration');
const User = require('../models/User');
const Event = require('../models/Event');

// Middleware to protect routes
const protect = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized, please login' });
  }
};

// @desc    Get user's event registrations
// @route   GET /api/user-events/my-registrations
// @access  Private
router.get('/my-registrations', protect, async (req, res, next) => {
  try {
    const registrations = await EventRegistration.find({ user: req.session.userId })
      .populate('event')
      .sort('-createdAt');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Register logged-in user for an event (One-Click)
// @route   POST /api/user-events/register/:id
// @access  Private
router.post('/register/:id', protect, async (req, res, next) => {
  const { role } = req.body;
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Enforce Registration Toggle
    if (event.registrationOpen === false) {
      return res.status(400).json({ message: 'Registration for this event has been closed by the administrator' });
    }

    // Enforce Registration Deadline
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({ message: 'Registration for this event has closed' });
    }

    // Check for existing active registration (confirmed or pending) for THIS EVENT
    const activeReg = await EventRegistration.findOne({ 
      event: eventId, 
      user: req.session.userId,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (activeReg) {
      return res.status(400).json({ message: 'You already have an active registration for this event' });
    }

    // Check for cancelled registration to decide between New Ticket vs Re-apply
    const cancelledReg = await EventRegistration.findOne({
      event: eventId,
      user: req.session.userId,
      role,
      status: 'cancelled'
    });

    if (cancelledReg && cancelledReg.allowReapply) {
      // Re-apply logic: Reuse existing record (Admin Permission Flow)
      cancelledReg.status = 'confirmed';
      cancelledReg.cancellationReason = '';
      cancelledReg.allowReapply = false;
      const updated = await cancelledReg.save();
      return res.json({ message: 'Re-application successful (Profile updated)', registration: updated });
    }

    // Check for pricing. If price > 0, direct registration is not allowed.
    const pricingKey = role === 'viewer' ? 'spectator' : role;
    const price = event.pricing[pricingKey] || 0;
    
    if (price > 0) {
      return res.status(400).json({ 
        message: 'This is a paid event. Please use the payment registration flow.',
        isPaid: true 
      });
    }

    // New Ticket Logic: Create a brand new record
    const registration = await EventRegistration.create({
      event: eventId,
      user: req.session.userId,
      role,
      status: 'confirmed' // Only directly confirm if it's FREE
    });

    res.status(201).json({ message: 'Successfully registered for event (New Ticket)', registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Quick Register for new users (Chota Form: Join Portal + Register Event)
// @route   POST /api/user-events/quick-register/:id
// @access  Public
router.post('/quick-register/:id', async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Enforce Registration Toggle
    if (event.registrationOpen === false) {
      return res.status(400).json({ message: 'Registration for this event has been closed by the administrator' });
    }

    // Enforce Registration Deadline
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({ message: 'Registration for this event has closed' });
    }

    // 2. Create User account first
    let user = await User.findOne({ $or: [{ email }, { username: email.split('@')[0] }] });
    if (user) return res.status(400).json({ message: 'Account already exists. Please login.' });

    const username = email.split('@')[0] + Math.floor(1000 + Math.random() * 9000);
    
    user = await User.create({
      username,
      email,
      password,
      role: 'athlete',
      personalInfo: { 
        firstName: name.split(' ')[0] || 'Member', 
        lastName: name.split(' ').slice(1).join(' ') || '' 
      },
      contactInfo: { email, phone },
      isRegistered: true
    });

    // 3. Set Session
    req.session.userId = user._id;

    // Check for pricing. If price > 0, direct registration is not allowed.
    // Map viewer role to spectator for price check
    const pricingKey = role === 'viewer' ? 'spectator' : role;
    const price = event.pricing[pricingKey] || 0;
    
    if (price > 0) {
      return res.status(400).json({ 
        message: 'This is a paid event. Please use the normal guest checkout flow.',
        isPaid: true 
      });
    }

    // 4. Create Event Registration
    const registration = await EventRegistration.create({
      event: eventId,
      user: user._id,
      role,
      status: 'confirmed'
    });

    req.session.save((err) => {
      if (err) return res.status(500).json({ message: 'Session initialization failed' });
      
      const userObj = user.toObject();
      delete userObj.password;
      
      res.status(201).json({ 
        message: 'Account created and registered successfully',
        user: userObj, 
        registration 
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Cancel a registration (User initiated)
// @route   POST /api/user-events/cancel/:id
// @access  Private
router.post('/cancel/:id', protect, async (req, res) => {
  const { reason } = req.body;
  try {
    const registration = await EventRegistration.findOne({
      _id: req.params.id,
      user: req.session.userId
    }).populate('event');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({ message: 'Already cancelled' });
    }

    if (new Date() > new Date(registration.event.registrationDeadline)) {
      return res.status(400).json({ message: 'Registration deadline has passed.' });
    }

    registration.status = 'cancelled';
    registration.cancellationReason = reason || 'Cancelled by user';
    registration.allowReapply = false;

    await registration.save();
    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
