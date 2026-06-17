const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const DocumentVerification = require('../models/DocumentVerification');
const GlobalSettings = require('../models/GlobalSettings');
const Coupon = require('../models/Coupon');

// @desc    Get document categories
// @route   GET /api/document-verification/categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const settings = await GlobalSettings.findOne();
    if (!settings) {
      return res.json([]);
    }
    res.json(settings.documentCategories || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Submit a document verification request
// @route   POST /api/document-verification/submit
// @access  Private
router.post('/submit', protect, async (req, res) => {
  const { documentCategory, documentUrl, feePaid, transactionId, paymentStatus, couponCode } = req.body;

  if (!documentCategory || !documentUrl) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // Optionally verify the fee from GlobalSettings
    const settings = await GlobalSettings.findOne();
    const category = settings?.documentCategories?.find(c => c.name === documentCategory);

    const newRequest = await DocumentVerification.create({
      user: req.user._id,
      documentCategory,
      documentUrl,
      feePaid: feePaid || 0,
      status: 'Pending',
      paymentStatus: paymentStatus || (feePaid > 0 ? 'Pending' : 'Completed'),
      transactionId: transactionId || null
    });

    if (couponCode && paymentStatus === 'Completed') {
       const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
       if (coupon) {
         coupon.usedBy.push(req.user._id);
         await coupon.save();
       }
    }

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
