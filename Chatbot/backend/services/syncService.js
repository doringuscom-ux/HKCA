const Knowledge = require('../models/Knowledge');
const mongoose = require('mongoose');

// We will pass the main connection to this service
const syncData = async (mainConn) => {
  try {
    console.log('Starting Auto-Sync from Main HKCA DB...');

    // 1. Sync Events
    // Accessing model from other connection
    const events = await mainConn.collection('events').find({ status: 'published' }).toArray();

    for (const event of events) {
      const intentName = `event_${event._id}`;
      const utterances = [
        event.title,
        `Tell me about ${event.title}`,
        `When is ${event.title}?`,
        `Where is ${event.title}?`,
        `Fees for ${event.title}`,
        `Price for ${event.title}`,
        `Registration for ${event.title}`,
        event.location,
        'Give details',
        'Events Details'
      ];
      const pricing = `Fees: Athlete ₹${event.pricing.athlete}, Coach ₹${event.pricing.coach}, Club ₹${event.pricing.club}.`;
      const requirements = `Registration Requirements: You need a Verified Profile with your Photograph and Date of Birth Proof.`;
      const answer = `${event.title} is scheduled for ${new Date(event.date).toLocaleDateString()} at ${event.location}. ${pricing} ${requirements} Description: ${event.description}`;

      await Knowledge.findOneAndUpdate(
        { intent: intentName },
        { 
          intent: intentName,
          utterances: utterances,
          answers: [answer],
          category: 'event',
          source: 'auto-sync',
          sourceId: event._id
        },
        { upsert: true, new: true }
      );
    }

    // 2. Sync Publications (News)
    const publications = await mainConn.collection('publications').find({ status: 'published' }).toArray();

    for (const pub of publications) {
      const intentName = `news_${pub._id}`;
      const utterances = [
        pub.title,
        `Latest news about ${pub.title}`,
        `Summary of ${pub.title}`
      ];
      const answer = `Latest News: ${pub.title}. Summary: ${pub.summary}. Category: ${pub.category}`;

      await Knowledge.findOneAndUpdate(
        { intent: intentName },
        { 
          intent: intentName,
          utterances: utterances,
          answers: [answer],
          category: 'news',
          source: 'auto-sync',
          sourceId: pub._id
        },
        { upsert: true, new: true }
      );
    }

    console.log('Auto-Sync Completed successfully.');
  } catch (error) {
    console.error('Sync Service Error:', error);
  }
};

module.exports = { syncData };
