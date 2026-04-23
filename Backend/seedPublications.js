const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const Publication = require('./models/Publication');
const connectDB = require('./config/db');

const seedPublications = async () => {
  try {
    await connectDB();

    // Optionally clear existing publications
    // await Publication.deleteMany({});

    const data = [
      {
        title: "Haryana Aquatics Team for 37th National Games Announced",
        summary: "The selection committee has finalized the names of the elite athletes who will represent Haryana in the upcoming National Games.",
        category: "General",
        type: "Article",
        imageUrl: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=800&auto=format&fit=crop",
        status: "published",
        date: new Date('2024-10-24')
      },
      {
        title: "New High-Performance Training Center to Open in Rohtak",
        summary: "Expanding our horizons with a state-of-the-art facility dedicated to kayaking and canoeing excellence.",
        category: "General",
        type: "Article",
        imageUrl: "https://images.unsplash.com/photo-1544411047-c491e5469ca3?q=80&w=800&auto=format&fit=crop",
        status: "published",
        date: new Date('2024-10-20')
      },
      {
        title: "State Championship 2024: Official Winners List",
        summary: "Congratulations to all the podium finishers of the HKCA State Championship. Detailed results inside.",
        category: "Results",
        type: "PDF",
        imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Dummy PDF
        status: "published",
        date: new Date('2024-10-15')
      },
      {
        title: "National Trials: Haryana Athletes Dominate Results",
        summary: "Haryana's paddlers have secured top positions in the recent national trials held in Bhopal. Outstanding performance by all.",
        category: "Results",
        type: "PDF",
        imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Dummy PDF
        status: "published",
        date: new Date('2024-10-08')
      }
    ];

    console.log('Seeding publications (News & Results)...');

    for (const item of data) {
      const exists = await Publication.findOne({ title: item.title });
      if (!exists) {
        await Publication.create(item);
        console.log(`Created: ${item.title}`);
      } else {
        console.log(`Skipped (already exists): ${item.title}`);
      }
    }

    console.log('Seeding complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedPublications();
