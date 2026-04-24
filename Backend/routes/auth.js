const express = require('express');
const router = express.Router();
const User = require('../models/User');
const GlobalSettings = require('../models/GlobalSettings');
const RegistrationCode = require('../models/RegistrationCode');
const crypto = require('crypto');

// @desc    Register a new user (Athlete/Coach/Club)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res, next) => {
  const { username, email, password, role, clubInfo, personalInfo, guardianInfo, contactInfo, documents } = req.body;

  const allowedRoles = ['athlete', 'coach', 'club'];
  if (!role || !allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role selected. Please select Athlete, Coach, or Club.' });
  }

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already registered. Please use a different one or login.' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username is already taken. Please choose another one.' });
    }

    // Check personalInfo.phone or contactInfo.phone
    const phone = personalInfo?.phone || contactInfo?.phone;
    if (phone) {
      const phoneExists = await User.findOne({
        $or: [
          { 'personalInfo.phone': phone },
          { 'contactInfo.phone': phone }
        ]
      });
      if (phoneExists) {
        return res.status(400).json({ message: 'Phone number already registered. Please login or use a different number.' });
      }
    }

    const { paymentDetails, registrationCode } = req.body;
    let finalPaymentData = {
      paymentStatus: 'unpaid',
      paymentMethod: 'online'
    };

    // Check if fee is required
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      // Initialize default settings if not exists
      settings = await GlobalSettings.create({
        registrationFees: { athlete: 0, coach: 0, club: 0 }
      });
    }
    const requiredFee = settings.registrationFees[role] || 0;

    if (requiredFee > 0) {
      if (registrationCode) {
        // Handle Offline Code
        const codeDoc = await RegistrationCode.findOne({ 
          code: registrationCode.toUpperCase(), 
          email: email.toLowerCase(),
          role,
          isUsed: false 
        });

        if (!codeDoc) {
          return res.status(400).json({ message: 'Invalid or already used registration code for this email/role.' });
        }

        finalPaymentData = {
          paymentStatus: 'paid',
          paymentMethod: 'offline',
          isFeeReceived: true,
          registrationPayment: {
            registrationCode: registrationCode.toUpperCase(),
            amount: requiredFee,
            paidAt: new Date()
          }
        };
        
        // Mark code as used
        codeDoc.isUsed = true;
        await codeDoc.save();
      } else if (paymentDetails) {
        // Handle Online Payment
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;
        
        // Verify signature
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        if (digest !== razorpay_signature) {
          return res.status(400).json({ message: 'Payment verification failed. Transaction not legitimate.' });
        }

        finalPaymentData = {
          paymentStatus: 'paid',
          paymentMethod: 'online',
          isFeeReceived: true,
          registrationPayment: {
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            amount: requiredFee,
            paidAt: new Date()
          }
        };
      } else {
        return res.status(400).json({ message: `Registration fee of ₹${requiredFee} is required to join as ${role}.` });
      }
    } else {
      // Fee is 0
      finalPaymentData = {
        paymentStatus: 'paid',
        paymentMethod: 'manual',
        isFeeReceived: true
      };
    }

    const user = await User.create({
      username,
      email,
      password,
      role,
      clubInfo,
      personalInfo,
      guardianInfo,
      contactInfo,
      documents,
      isRegistered: true,
      ...finalPaymentData
    });

    if (user && registrationCode) {
      // Update code with user ID
      await RegistrationCode.findOneAndUpdate({ code: registrationCode.toUpperCase() }, { usedBy: user._id });
    }

    if (user) {
      req.session.userId = user._id;
      req.session.save((err) => {
        if (err) return res.status(500).json({ message: 'Session save error' });

        // Return full user object for immediate profile access
        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json(userObj);
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check phone uniqueness if phone is being updated
    const newPhone = req.body.personalInfo?.phone || req.body.contactInfo?.phone;
    if (newPhone) {
      const phoneExists = await User.findOne({
        $or: [
          { 'personalInfo.phone': newPhone },
          { 'contactInfo.phone': newPhone }
        ],
        _id: { $ne: req.session.userId }
      });
      if (phoneExists) {
        return res.status(400).json({ message: 'This phone number is already being used by another member.' });
      }
    }

    // Update fields if provided — verification status is NOT touched here
    // Only admin can change verificationStatus / isVerified
    if (req.body.clubInfo) user.clubInfo = req.body.clubInfo;
    if (req.body.personalInfo) user.personalInfo = req.body.personalInfo;
    if (req.body.guardianInfo) user.guardianInfo = req.body.guardianInfo;
    if (req.body.contactInfo) user.contactInfo = req.body.contactInfo;
    if (req.body.documents) user.documents = req.body.documents;
    if (req.body.achievements) user.achievements = req.body.achievements;

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user & get session
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body; // Can be email or username

  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    }).select('+password');

    if (user && (await user.matchPassword(password))) {
      req.session.userId = user._id;
      req.session.save((err) => {
        if (err) return res.status(500).json({ message: 'Session save error' });

        // Return full user object for immediate profile access
        const userObj = user.toObject();
        delete userObj.password;
        res.json(userObj);
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Logout user & clear session
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

// @desc    Get current user status
// @route   GET /api/auth/me
// @access  Private
router.get('/me', async (req, res, next) => {
  try {
    if (req.session.userId) {
      const user = await User.findById(req.session.userId);
      if (user) {
        res.json(user); // Return full user object for profile access
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Request Password Change OTP
// @route   POST /api/auth/request-password-otp
// @access  Private
router.post('/request-password-otp', async (req, res, next) => {
  try {
    if (!req.session.userId) return res.status(401).json({ message: 'Not authenticated' });
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    // Log to console as requested
    console.log(`-----------------------------------------`);
    console.log(`PASSWORD CHANGE OTP FOR ${user.username}: ${otp}`);
    console.log(`-----------------------------------------`);

    res.json({ success: true, message: 'OTP logged to server console' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Change Password with OTP
// @route   POST /api/auth/change-password
// @access  Private
router.post('/change-password', async (req, res, next) => {
  try {
    if (!req.session.userId) return res.status(401).json({ message: 'Not authenticated' });

    const { oldPassword, newPassword, otp } = req.body;
    const user = await User.findById(req.session.userId).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let verified = false;

    // 1. Verify with Old Password first
    if (oldPassword) {
      const isMatch = await user.matchPassword(oldPassword);
      if (isMatch) verified = true;
    }

    // 2. If not verified by password, verify with OTP
    if (!verified && otp) {
      const isOtpValid = user.resetPasswordOTP && user.resetPasswordOTP === otp && user.resetPasswordExpires > Date.now();
      if (isOtpValid) verified = true;
    }

    if (!verified) {
      return res.status(400).json({ message: 'Invalid current password or OTP' });
    }

    // 3. Update Password
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Request Forgot Password OTP
// @route   POST /api/auth/forgot-password-request
// @access  Public
router.post('/forgot-password-request', async (req, res, next) => {
  const { identity } = req.body; // username or email

  try {
    const user = await User.findOne({
      $or: [{ username: identity }, { email: identity }]
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    // Log to console for testing
    console.log(`-----------------------------------------`);
    console.log(`FORGOT PASSWORD OTP FOR ${user.username}: ${otp}`);
    console.log(`-----------------------------------------`);

    res.json({ success: true, message: 'OTP logged to server console' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Reset Password with OTP
// @route   POST /api/auth/forgot-password-reset
// @access  Public
router.post('/forgot-password-reset', async (req, res, next) => {
  const { identity, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username: identity }, { email: identity }]
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify OTP
    if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update Password
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
