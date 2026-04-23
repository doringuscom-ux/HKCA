const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const connectDB = require('./config/db');
const cloudinary = require('./config/cloudinary');
const path = require('path');

const seedEvents = async () => {
  try {
    await connectDB();

    // Clear existing events? The user didn't ask, but maybe better for fresh start
    // await Event.deleteMany({});

    const images = [
      {
        path: 'C:\\Users\\dell8\\.gemini\\antigravity\\brain\\f3bddc32-fdfb-4100-9256-8a42a970b1c0\\cricket_tournament_1775299643960.png',
        title: 'State Cricket Championship 2026',
        description: 'A grand cricket tournament focusing on identifying talent across all districts of Haryana.',
        location: 'Tau Devi Lal Stadium, Gurugram',
        date: new Date('2026-05-15'),
      },
      {
        path: 'C:\\Users\\dell8\\.gemini\\antigravity\\brain\\f3bddc32-fdfb-4100-9256-8a42a970b1c0\\marathon_event_1775299662821.png',
        title: 'HKCA Annual Marathon',
        description: 'Run for health and fitness! Join the annual HKCA marathon through the heart of Panchkula.',
        location: 'Sector 5, Panchkula',
        date: new Date('2026-06-20'),
      },
      {
        path: 'C:\\Users\\dell8\\.gemini\\antigravity\\brain\\f3bddc32-fdfb-4100-9256-8a42a970b1c0\\athletics_meet_1775299681316.png',
        title: 'Junior Athletics Meet',
        description: 'A platform for young athletes to showcase their speed and agility in various track and field events.',
        location: 'Rajiv Gandhi Sports Complex, Rohtak',
        date: new Date('2026-07-10'),
      }
    ];

    console.log('Uploading images to Cloudinary and seeding events...');

    for (const item of images) {
      const uploadResult = await cloudinary.uploader.upload(item.path, {
        folder: 'hkca_events',
      });

      const newEvent = new Event({
        title: item.title,
        description: item.description,
        location: item.location,
        date: item.date,
        imageUrl: uploadResult.secure_url,
        cloudinaryId: uploadResult.public_id,
        status: 'published'
      });

      await newEvent.save();
      console.log(`Event created: ${item.title}`);
    }

    console.log('Seeding complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedEvents();
