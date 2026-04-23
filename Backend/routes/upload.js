const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

// Multer storage in memory
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @desc    Upload file to Cloudinary via Backend Proxy
// @route   POST /api/upload
// @access  Public (Used for registration) / Private (Used for profile)
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Use upload_stream for better reliability and performance
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'hkca_uploads',
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Stream Upload Error:', error);
          return res.status(500).json({ 
            message: 'Cloudinary upload failed', 
            error: error.message 
          });
        }
        res.status(200).json({ 
          secure_url: result.secure_url,
          public_id: result.public_id
        });
      }
    );

    // Write buffer to the stream
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('Backend Proxy Upload Error:', error);
    res.status(500).json({ 
      message: 'Server error during upload', 
      error: error.message 
    });
  }
});

module.exports = router;
