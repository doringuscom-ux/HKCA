const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect, adminGuard } = require('../middleware/auth');
const Gallery = require('../models/Gallery');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const Publication = require('../models/Publication');
const Asset = require('../models/Asset');
const ContactInquiry = require('../models/ContactInquiry');
const GlobalSettings = require('../models/GlobalSettings');
const RegistrationCode = require('../models/RegistrationCode');
const DocumentVerification = require('../models/DocumentVerification');

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

// Helper function to handle Cloudinary upload
const uploadToCloudinary = (fileBuffer, folder = 'hkca', resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        access_mode: 'public',
        type: 'upload' // Ensures public delivery
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// --- Gallery Routes ---

// @desc    Get all gallery items
// @route   GET /api/admin/gallery
// @access  Public
router.get('/gallery', async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a gallery item
// @route   POST /api/admin/gallery
// @access  Private
router.post('/gallery', protect, adminGuard, upload.single('image'), async (req, res) => {
  const { title, imageUrl, category, isUpload, type, coverImage } = req.body;

  try {
    let finalImageUrl = imageUrl;
    let cloudinaryId = '';

    if (isUpload === 'true' && req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      finalImageUrl = result.secure_url;
      cloudinaryId = result.public_id;
    }

    const newItem = await Gallery.create({
      title,
      imageUrl: finalImageUrl,
      cloudinaryId,
      category,
      type: type || 'image',
      coverImage: coverImage || '',
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a gallery item
// @route   DELETE /api/admin/gallery/:id
// @access  Private
router.delete('/gallery/:id', protect, adminGuard, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.cloudinaryId) {
      await cloudinary.uploader.destroy(item.cloudinaryId);
    }

    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a gallery item
// @route   PUT /api/admin/gallery/:id
// @access  Private
router.put('/gallery/:id', protect, adminGuard, upload.single('image'), async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const { title, category, isUpload, imageUrl, type, coverImage } = req.body;

    let finalImageUrl = item.imageUrl;
    let cloudinaryId = item.cloudinaryId;

    // Handle Image Update
    if (isUpload === 'true' && req.file) {
      if (item.cloudinaryId) {
        await cloudinary.uploader.destroy(item.cloudinaryId);
      }
      const result = await uploadToCloudinary(req.file.buffer);
      finalImageUrl = result.secure_url;
      cloudinaryId = result.public_id;
    } else if (imageUrl && imageUrl !== item.imageUrl) {
      if (item.cloudinaryId) {
        await cloudinary.uploader.destroy(item.cloudinaryId);
        cloudinaryId = '';
      }
      finalImageUrl = imageUrl;
    }

    item.title = title || item.title;
    item.category = category || item.category;
    item.type = type || item.type;
    item.imageUrl = finalImageUrl;
    item.cloudinaryId = cloudinaryId;
    if (coverImage !== undefined) item.coverImage = coverImage;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Asset (Media Library) Routes ---

// @desc    Get all assets
// @route   GET /api/admin/assets
// @access  Private
router.get('/assets', protect, adminGuard, async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create an asset
// @route   POST /api/admin/assets
// @access  Private
router.post('/assets', protect, adminGuard, upload.single('image'), async (req, res) => {
  const { title } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'hkca/assets');

    const newAsset = await Asset.create({
      title: title || req.file.originalname,
      url: result.secure_url,
      cloudinaryId: result.public_id,
      fileType: req.file.mimetype.startsWith('image') ? 'image' : 'other'
    });

    res.status(201).json(newAsset);
  } catch (error) {
    console.error('Asset upload error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create multiple assets (Bulk Upload)
// @route   POST /api/admin/assets/bulk
// @access  Private
router.post('/assets/bulk', protect, adminGuard, upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(async (file) => {
      const result = await uploadToCloudinary(file.buffer, 'hkca/assets');
      return await Asset.create({
        title: file.originalname,
        url: result.secure_url,
        cloudinaryId: result.public_id,
        fileType: file.mimetype.startsWith('image') ? 'image' : 'other'
      });
    });

    const newAssets = await Promise.all(uploadPromises);
    res.status(201).json(newAssets);
  } catch (error) {
    console.error('Bulk asset upload error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete an asset
// @route   DELETE /api/admin/assets/:id
// @access  Private
router.delete('/assets/:id', protect, adminGuard, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    if (asset.cloudinaryId) {
      await cloudinary.uploader.destroy(asset.cloudinaryId);
    }

    await asset.deleteOne();
    res.json({ message: 'Asset removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Event Routes ---

// @desc    Get all published events
// @route   GET /api/admin/events
// @access  Public
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find({ status: 'published' }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all events (Admin Dashboard)
// @route   GET /api/admin/events/all
// @access  Private
router.get('/events/all', protect, adminGuard, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single event by ID
// @route   GET /api/admin/events/:id
// @access  Public
router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create an event
// @route   POST /api/admin/events
// @access  Private
router.post('/events', protect, adminGuard, upload.single('image'), async (req, res) => {
  const { title, description, date, registrationDeadline, location, imageUrl, isUpload, status, duration, mapUrl } = req.body;

  try {
    let finalImageUrl = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
    let cloudinaryId = '';

    if (isUpload === 'true' && req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      finalImageUrl = result.secure_url;
      cloudinaryId = result.public_id;
    }

    let pricing = {
      athlete: 200,
      coach: 500,
      club: 5000
    };

    if (req.body.pricing) {
      try {
        pricing = typeof req.body.pricing === 'string' ? JSON.parse(req.body.pricing) : req.body.pricing;
      } catch (err) {
        console.error('Error parsing pricing JSON', err);
      }
    }

    let registrationOpen = true;
    if (req.body.registrationOpen !== undefined) {
      registrationOpen = req.body.registrationOpen === 'true' || req.body.registrationOpen === true;
    }

    const newEvent = await Event.create({
      title,
      description,
      date,
      registrationDeadline,
      location,
      imageUrl: finalImageUrl,
      cloudinaryId,
      status: status || 'published',
      registrationOpen,
      pricing,
      duration,
      mapUrl,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update an event
// @route   PUT /api/admin/events/:id
// @access  Private
router.put('/events/:id', protect, adminGuard, upload.single('image'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { title, description, date, registrationDeadline, location, imageUrl, isUpload, status, duration, mapUrl } = req.body;

    const cleanImageUrl = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
    let finalImageUrl = event.imageUrl;
    let cloudinaryId = event.cloudinaryId;

    // Handle Image Change
    if (isUpload === 'true' && req.file) {
      // Delete old image from Cloudinary if it exists
      if (event.cloudinaryId) {
        await cloudinary.uploader.destroy(event.cloudinaryId);
      }
      const result = await uploadToCloudinary(req.file.buffer);
      finalImageUrl = result.secure_url;
      cloudinaryId = result.public_id;
    } else if (imageUrl && imageUrl !== event.imageUrl) {
      // New URL provided, cleanup old Cloudinary image if it was an upload
      if (event.cloudinaryId) {
        await cloudinary.uploader.destroy(event.cloudinaryId);
        cloudinaryId = '';
      }
      finalImageUrl = cleanImageUrl;
    }

    if (req.body.pricing) {
      try {
        event.pricing = typeof req.body.pricing === 'string' ? JSON.parse(req.body.pricing) : req.body.pricing;
      } catch (err) {
        console.error('Error parsing pricing JSON', err);
      }
    }

    if (req.body.registrationOpen !== undefined) {
      event.registrationOpen = req.body.registrationOpen === 'true' || req.body.registrationOpen === true;
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.registrationDeadline = registrationDeadline || event.registrationDeadline;
    event.location = location || event.location;
    event.imageUrl = finalImageUrl;
    event.cloudinaryId = cloudinaryId;
    event.status = status || event.status;
    event.duration = duration || event.duration;
    event.mapUrl = mapUrl || event.mapUrl;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle event registration status
// @route   PUT /api/admin/events/:id/toggle-registration
// @access  Private (Admin only)
router.put('/events/:id/toggle-registration', protect, adminGuard, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.registrationOpen = event.registrationOpen === false ? true : false;
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete an event
// @route   DELETE /api/admin/events/:id
// @access  Private
router.delete('/events/:id', protect, adminGuard, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.cloudinaryId) {
      await cloudinary.uploader.destroy(event.cloudinaryId);
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Publication Routes (News & Results) ---

// @desc    Get all published publications
// @route   GET /api/admin/publications
// @access  Public
router.get('/publications', async (req, res) => {
  try {
    const publications = await Publication.find({ status: 'published' }).sort({ date: -1 });
    res.json(publications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all publications (Admin)
// @route   GET /api/admin/publications/all
// @access  Private
router.get('/publications/all', protect, adminGuard, async (req, res) => {
  try {
    const publications = await Publication.find().sort({ date: -1 });
    res.json(publications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a publication
// @route   POST /api/admin/publications
// @access  Private
router.post('/publications', protect, adminGuard, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), async (req, res) => {
  const { title, summary, content, category, type, status, date } = req.body;

  try {
    let imageUrl = req.body.imageUrl || '';
    let cloudinaryImageId = '';
    let fileUrl = req.body.fileUrl || '';
    let cloudinaryFileId = '';

    // Handle Image Upload
    if (req.files && req.files.image) {
      const result = await uploadToCloudinary(req.files.image[0].buffer, 'hkca/images', 'auto');
      imageUrl = result.secure_url;
      cloudinaryImageId = result.public_id;
    }

    // Handle PDF File Upload
    if (req.files && req.files.file) {
      // Use resource_type: 'auto' instead of 'image' to avoid strict transformation issues on some accounts
      const result = await uploadToCloudinary(req.files.file[0].buffer, 'hkca/documents', 'auto');
      fileUrl = result.secure_url;
      cloudinaryFileId = result.public_id;
    }

    const newPublication = await Publication.create({
      title,
      summary,
      content,
      category,
      type: type || 'PDF',
      imageUrl,
      fileUrl,
      cloudinaryImageId,
      cloudinaryFileId,
      date: date || Date.now(),
      status: status || 'published',
    });

    res.status(201).json(newPublication);
  } catch (error) {
    console.error('Error creating publication:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a publication
// @route   PUT /api/admin/publications/:id
// @access  Private
router.put('/publications/:id', protect, adminGuard, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) return res.status(404).json({ message: 'Publication not found' });

    const { title, summary, content, category, type, status, date } = req.body;

    // Handle Image Update
    if (req.files && req.files.image) {
      if (publication.cloudinaryImageId) {
        await cloudinary.uploader.destroy(publication.cloudinaryImageId);
      }
      const result = await uploadToCloudinary(req.files.image[0].buffer, 'hkca/images', 'image');
      publication.imageUrl = result.secure_url;
      publication.cloudinaryImageId = result.public_id;
    } else if (req.body.imageUrl) {
      publication.imageUrl = req.body.imageUrl;
    }

    // Handle File Update
    if (req.files && req.files.file) {
      if (publication.cloudinaryFileId) {
        // Must use the same resource_type that was used for upload
        await cloudinary.uploader.destroy(publication.cloudinaryFileId, { resource_type: 'image' });
      }
      const result = await uploadToCloudinary(req.files.file[0].buffer, 'hkca/documents', 'auto');
      publication.fileUrl = result.secure_url;
      publication.cloudinaryFileId = result.public_id;
    } else if (req.body.fileUrl) {
      publication.fileUrl = req.body.fileUrl;
    }

    publication.title = title || publication.title;
    publication.summary = summary || publication.summary;
    publication.content = content || publication.content;
    publication.category = category || publication.category;
    publication.type = type || publication.type;
    publication.status = status || publication.status;
    publication.date = date || publication.date;

    const updated = await publication.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a publication
// @route   DELETE /api/admin/publications/:id
// @access  Private
router.delete('/publications/:id', protect, adminGuard, async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) return res.status(404).json({ message: 'Publication not found' });

    if (publication.cloudinaryImageId) {
      await cloudinary.uploader.destroy(publication.cloudinaryImageId);
    }
    if (publication.cloudinaryFileId) {
      await cloudinary.uploader.destroy(publication.cloudinaryFileId, { resource_type: 'image' });
    }

    await publication.deleteOne();
    res.json({ message: 'Publication removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Participant Management Routes ---

// @desc    Get all registrations for a specific event
// @route   GET /api/admin/events/:id/registrations
// @access  Private
router.get('/events/:id/registrations', protect, adminGuard, async (req, res) => {
  try {
    console.log(`Fetching registrations for event: ${req.params.id}`);
    const registrations = await EventRegistration.find({ event: req.params.id })
      .populate('user', '-password') // Populate full user profile but exclude password
      .sort({ registrationDate: -1 });

    console.log(`Found ${registrations.length} registrations`);
    res.json(registrations);
  } catch (error) {
    console.error('Error in GET registrations:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update registration status (Confirm/Cancel)
// @route   PUT /api/admin/registrations/:id/status
// @access  Private
router.put('/registrations/:id/status', protect, adminGuard, async (req, res) => {
  const { status, cancellationReason, allowReapply } = req.body;
  try {
    const registration = await EventRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.status = status;

    // Update cancellation details if status is cancelled
    if (status === 'cancelled') {
      if (cancellationReason !== undefined) registration.cancellationReason = cancellationReason;
      if (allowReapply !== undefined) registration.allowReapply = allowReapply;
    } else {
      // Reset cancellation reason and reapply status if status changed back to something else
      registration.cancellationReason = '';
      registration.allowReapply = false;
    }

    const updatedRegistration = await registration.save();

    res.json(updatedRegistration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- User Management Routes ---

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get('/users', protect, adminGuard, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
router.put('/users/:id/role', protect, adminGuard, async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    const updatedUser = await user.save();

    const userObj = updatedUser.toObject();
    delete userObj.password;

    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/users/:id/verify', protect, adminGuard, async (req, res) => {
  const { status, message } = req.body; // 'verified' or 'rejected'
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.verificationStatus = status;
    user.isVerified = (status === 'verified');
    if (message) user.adminMessage = message;

    await user.save();
    res.json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Send message and optionally unlock user profile for editing
// @route   PUT /api/admin/users/:id/message
// @access  Private (Admin only)
router.put('/users/:id/message', protect, adminGuard, async (req, res) => {
  const { message, unlock } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (message !== undefined) user.adminMessage = message;
    if (unlock) {
      user.isVerified = false;
      user.verificationStatus = 'pending';
    }

    await user.save();
    res.json({ message: 'Message sent to user', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Admin update user password
// @route   PUT /api/admin/users/:id/password
// @access  Private (Admin only)
router.put('/users/:id/password', protect, adminGuard, async (req, res) => {
  const { newPassword } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'User password updated successfully by admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Admin Edit User Profile (Any field)
// @route   PUT /api/admin/users/:id/profile
// @access  Private (Admin only)
router.put('/users/:id/profile', protect, adminGuard, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Admins can update everything and choose if they want to verify it immediately
    if (req.body.clubInfo) user.clubInfo = req.body.clubInfo;
    if (req.body.personalInfo) user.personalInfo = req.body.personalInfo;
    if (req.body.guardianInfo) user.guardianInfo = req.body.guardianInfo;
    if (req.body.contactInfo) user.contactInfo = req.body.contactInfo;
    if (req.body.documents) user.documents = req.body.documents;
    if (req.body.role) user.role = req.body.role;
    if (req.body.achievements) user.achievements = req.body.achievements;

    // If admin edits, we keep user verified unless explicitly changed
    if (req.body.isVerified !== undefined) user.isVerified = req.body.isVerified;
    if (req.body.verificationStatus) user.verificationStatus = req.body.verificationStatus;

    await user.save();
    res.json({ message: 'Profile updated by admin', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
router.delete('/users/:id', protect, adminGuard, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Also delete their registrations to cleanup
    await EventRegistration.deleteMany({ user: req.params.id });

    await user.deleteOne();
    res.json({ message: 'User and their registrations deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update if registration fee received manually
// @route   PUT /api/admin/users/:id/fee-received
// @access  Private (Admin only)
router.put('/users/:id/fee-received', protect, adminGuard, async (req, res) => {
  const { isFeeReceived } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isFeeReceived = isFeeReceived;
    if (isFeeReceived) {
      user.paymentStatus = 'paid';
    }
    await user.save();
    res.json({ message: 'User fee status updated', isFeeReceived: user.isFeeReceived });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Global Settings & Registration Fee Routes ---

// @desc    Get registration fees
// @route   GET /api/admin/settings/registration-fees
// @access  Public
router.get('/settings/registration-fees', async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      // Create default settings if not found
      settings = await GlobalSettings.create({
        registrationFees: { athlete: 0, coach: 0, club: 0 }
      });
    }
    res.json(settings.registrationFees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update registration fees
// @route   PUT /api/admin/settings/registration-fees
// @access  Private (Admin only)
router.put('/settings/registration-fees', protect, adminGuard, async (req, res) => {
  const { athlete, coach, club } = req.body;
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      settings = new GlobalSettings();
    }
    settings.registrationFees = { athlete, coach, club };
    await settings.save();
    res.json(settings.registrationFees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get document categories
// @route   GET /api/admin/settings/document-categories
// @access  Public
router.get('/settings/document-categories', async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      settings = await GlobalSettings.create({});
    }
    res.json(settings.documentCategories || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update document categories
// @route   PUT /api/admin/settings/document-categories
// @access  Private (Admin only)
router.put('/settings/document-categories', protect, adminGuard, async (req, res) => {
  const { documentCategories } = req.body;
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      settings = new GlobalSettings();
    }
    settings.documentCategories = documentCategories;
    await settings.save();
    res.json(settings.documentCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Registration Code Management ---

// @desc    Generate a registration code
// @route   POST /api/admin/registration-codes
// @access  Private (Admin only)
router.post('/registration-codes', protect, adminGuard, async (req, res) => {
  const { email, role } = req.body;
  try {
    // Generate a simple unique code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();

    const newCode = await RegistrationCode.create({
      code,
      email,
      role,
      generatedBy: req.user._id
    });

    res.status(201).json(newCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all registration codes
// @route   GET /api/admin/registration-codes
// @access  Private (Admin only)
router.get('/registration-codes', protect, adminGuard, async (req, res) => {
  try {
    const codes = await RegistrationCode.find().sort({ createdAt: -1 });
    res.json(codes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a registration code
// @route   DELETE /api/admin/registration-codes/:id
// @access  Private (Admin only)
router.delete('/registration-codes/:id', protect, adminGuard, async (req, res) => {
  try {
    await RegistrationCode.findByIdAndDelete(req.params.id);
    res.json({ message: 'Code deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Coupon Management Routes ---

// @desc    Get all coupons
// @route   GET /api/admin/coupons
// @access  Private (Admin only)
router.get('/coupons', protect, adminGuard, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a coupon
// @route   POST /api/admin/coupons
// @access  Private (Admin only)
router.post('/coupons', protect, adminGuard, async (req, res) => {
  const { code, discountType, discountValue, minPurchase, expiryDate, usageLimit } = req.body;
  try {
    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      minPurchase,
      expiryDate,
      usageLimit,
      restrictedEmail: req.body.restrictedEmail
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a coupon
// @route   PUT /api/admin/coupons/:id
// @access  Private (Admin only)
router.put('/coupons/:id', protect, adminGuard, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    coupon.isActive = req.body.isActive !== undefined ? req.body.isActive : coupon.isActive;
    coupon.discountValue = req.body.discountValue || coupon.discountValue;
    coupon.expiryDate = req.body.expiryDate || coupon.expiryDate;
    coupon.restrictedEmail = req.body.restrictedEmail !== undefined ? req.body.restrictedEmail : coupon.restrictedEmail;

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private (Admin only)
router.delete('/coupons/:id', protect, adminGuard, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    await coupon.deleteOne();
    res.json({ message: 'Coupon removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get Daily Report
// @route   GET /api/admin/reports/daily
// @access  Private (Admin only)
router.get('/reports/daily', protect, adminGuard, async (req, res) => {
  try {
    // Calculate start and end of "Today" in IST (UTC+5:30)
    // For standard aggregation, we'll use the server's local day range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Get Aggregated Stats
    const stats = await EventRegistration.aggregate([
      {
        $match: {
          registrationDate: { $gte: startOfDay, $lte: endOfDay },
          status: 'confirmed' // Only count successful (confirmed) registrations
        }
      },
      {
        $group: {
          _id: null,
          totalRegistrations: { $sum: 1 },
          totalRevenue: { $sum: "$amountPaid" },
          totalDiscounts: { $sum: "$discountAmount" }
        }
      }
    ]);

    // 2. Get Today's Registrations with User Details
    const todayRegistrations = await EventRegistration.find({
      registrationDate: { $gte: startOfDay, $lte: endOfDay }
    })
      .populate('user', 'username email personalInfo')
      .populate('event', 'title pricing') // Added pricing
      .populate('couponUsed', 'code')
      .sort({ registrationDate: -1 });

    const result = {
      summary: stats[0] || { totalRegistrations: 0, totalRevenue: 0, totalDiscounts: 0 },
      registrations: todayRegistrations
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Inquiry Routes ---

// @desc    Submit a contact inquiry
// @route   POST /api/admin/inquiries
// @access  Public
router.post('/inquiries', async (req, res) => {
  try {
    const { name, email, subject, message, documentUrl } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newInquiry = new ContactInquiry({
      name,
      email,
      subject,
      message,
      documentUrl
    });

    await newInquiry.save();
    res.status(201).json({ message: 'Inquiry submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all inquiries
// @route   GET /api/admin/inquiries/list
// @access  Private/Admin
router.get('/inquiries/list', protect, async (req, res) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete an inquiry
// @route   DELETE /api/admin/inquiries/:id
// @access  Private/Admin
router.delete('/inquiries/:id', protect, async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update inquiry status
// @route   PATCH /api/admin/inquiries/:id/status
// @access  Private/Admin
router.patch('/inquiries/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'read', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Document Verification Routes ---

// @desc    Get all document verifications
// @route   GET /api/admin/document-verifications
// @access  Private (Admin only)
router.get('/document-verifications', protect, adminGuard, async (req, res) => {
  try {
    const verifications = await DocumentVerification.find()
      .populate('user', 'username email personalInfo')
      .sort({ createdAt: -1 });
    res.json(verifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update document verification status
// @route   PUT /api/admin/document-verifications/:id/status
// @access  Private (Admin only)
router.put('/document-verifications/:id/status', protect, adminGuard, async (req, res) => {
  try {
    const { status } = req.body;
    const verification = await DocumentVerification.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'username email personalInfo');
    
    if (!verification) {
      return res.status(404).json({ message: 'Verification not found' });
    }
    res.json(verification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
