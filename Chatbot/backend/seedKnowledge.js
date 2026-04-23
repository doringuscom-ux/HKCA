const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Knowledge = require('./models/Knowledge');

dotenv.config();

const coreKnowledge = [
  {
    intent: 'hkca.about',
    utterances: [
      'What is HKCA?',
      'Tell me about HKCA',
      'What does HKCA stand for?',
      'Who are you?',
      'What is this website?',
      'HKCA kya hai?',
      'Is website ka kaam kya hai?'
    ],
    answers: [
      'HKCA stands for Haryana Kayaking and Canoeing Association. We are the official state body dedicated to promoting and developing the sports of Kayaking and Canoeing in Haryana. We are affiliated with the Indian Kayaking and Canoeing Association and the Haryana Olympic Association.'
    ],
    category: 'core'
  },
  {
    intent: 'hkca.work',
    utterances: [
      'What do you do?',
      'What is the purpose of HKCA?',
      'HKCA kya kaam karta hai?',
      'Services provided by HKCA',
      'Kaam kya hai aapka?'
    ],
    answers: [
      'HKCA organizes state-level tournaments, training camps, and selection trials for athletes. We identify talent, provide professional coaching, and prepare athletes for national and international competitions like the Olympics and Asian Games.'
    ],
    category: 'core'
  },
  {
    intent: 'hkca.join',
    utterances: [
      'How can I join HKCA?',
      'Registration process',
      'I want to be a member',
      'Join kaise karein?',
      'Membership kaise milti hai?'
    ],
    answers: [
      'You can join HKCA by registering as an athlete, coach, or club on our website. Go to the "Register" section, fill in your details, and upload the required documents. Once verified by the admin, you will become an official member.'
    ],
    category: 'core'
  },
  {
    intent: 'hkca.contact',
    utterances: [
      'How to contact HKCA?',
      'Contact number',
      'Office address',
      'Email id',
      'Help desk'
    ],
    answers: [
      'You can contact us via the Contact page on our website or visit our head office in Haryana. You can also send an inquiry through the contact form, and our team will get back to you.'
    ],
    category: 'core'
  },
  {
    intent: 'hkca.president',
    utterances: [
      'Who is the President of HKCA?',
      'Who is the face of HKCA?',
      'Message from the President',
      'Jaswinder Meenu Beniwal',
      'Leadership of HKCA',
      'President kaun hai?',
      'President ka message kya hai?'
    ],
    answers: [
      'Capt. Jaswinder Meenu Beniwal is the President of HKCA. His message to the athletes: "I extend my heartfelt greetings to all athletes of Haryana. Our mission is to promote kayaking and canoeing across the state and reach every aspiring sportsperson at the grassroots level. I encourage all young athletes to take up water sports with dedication and confidence. We are committed to providing the necessary opportunities, training, and support."'
    ],
    category: 'core'
  },
  {
    intent: 'hkca.affiliation',
    utterances: [
      'Is HKCA affiliated with Haryana Olympic Association?',
      'Who is HKCA connected to?',
      'Recognition of HKCA',
      'Affiliation info'
    ],
    answers: [
      'Yes, HKCA is proudly affiliated with the Indian Kayaking and Canoeing Association (IKCA) and the Haryana Olympic Association (HOA). We work closely with these bodies to promote the sport as an Olympic discipline.'
    ],
    category: 'core'
  },
  {
    intent: 'hkca.events.list',
    utterances: [
      'Show me all events',
      'Give me event details',
      'What are the upcoming events?',
      'Upcoming championships',
      'Event details',
      'List events',
      'Tell me about matches',
      'Bataiye kaunse events hone wale hai?',
      'Event details de do'
    ],
    answers: [
      'Here are the latest ongoing and upcoming events directly from our official portal. Choose an event below to see its details, dates, and registration info!'
    ],
    category: 'core'
  },
  {
    intent: 'hkca.awards',
    utterances: [
      'What are the awards?',
      'Medals and prizes',
      'Do we get a certificate?',
      'Award system',
      'Is there any cash prize?',
      'Jeetne par kya milega?'
    ],
    answers: [
      'Winners in official state championships receive Gold, Silver, and Bronze medals along with Merit Certificates authorized by HKCA. All participating athletes also receive a Digital Participation Certificate directly available in their dashboard.'
    ],
    category: 'core'
  },
  {
    intent: 'hkca.how_to_register',
    utterances: [
      'How to register?',
      'How to create an account?',
      'Registration process steps',
      'Naya account kaise banaye?',
      'Register kaise karein?'
    ],
    answers: [
      'Registering on HKCA is simple: 1. Click "Join the Association" or go to the Register page. 2. Step 1: Create your Account with username, email, and choose your role (Athlete, Coach, or Club). 3. Step 2: Fill in your basic personal details. 4. Step 3: Review and click "Complete Registration". After this, you will be redirected to your Profile to add documents.'
    ],
    category: 'core'
  },
  {
    intent: 'hkca.how_to_edit_profile',
    utterances: [
      'How to change my details?',
      'How to edit profile?',
      'Profile update kaise karein?',
      'Change my name or phone',
      'Update my documents'
    ],
    answers: [
      'To update your details: 1. Login to your account. 2. Go to the "Profile" page from the menu. 3. Click the "Edit Profile" button. 4. Change your contact info or upload new documents. 5. Click "Save Changes". Note: Some personal details are locked once the Admin verifies your profile.'
    ],
    category: 'core'
  },
  {
    intent: 'hkca.verification',
    utterances: [
      'How long does verification take?',
      'Why is my profile not verified?',
      'Verification process',
      'Profile verify kaise hoga?'
    ],
    answers: [
      'After you complete your profile and upload documents (Aadhaar, Photo, etc.), the HKCA Admin will review your application. This usually takes 2-3 working days. Once verified, a green badge will appear on your profile, and you can register for championships.'
    ],
    category: 'core'
  },
  {
    intent: 'greetings.hello',
    utterances: [
      'Hello',
      'Hi',
      'Hey',
      'Hlo',
      'Hlo yaar',
      'Namaste',
      'Greetings',
      'Hiiii',
      'Hey there'
    ],
    answers: [
      'Hello! How can I help you today with HKCA related queries?',
      'Hi there! I am your HKCA Assistant. What would you like to know?',
      'Namaste! How can I assist you with HKCA information?'
    ],
    category: 'core'
  },
  {
    intent: 'hkca.developer',
    utterances: [
      'Who made this website?',
      'Who developed this?',
      'Website kisne banayi hai?',
      'Developer details',
      'Who created you?',
      'Aapko kisne banaya?'
    ],
    answers: [
      'This platform and I (the HKCA Smart Assistant) were built by an expert development team to make the entire HKCA ecosystem digital, transparent, and user-friendly for all athletes of Haryana!'
    ],
    category: 'core'
  },
  {
    intent: 'hkca.sports_info',
    utterances: [
      'What is kayaking?',
      'What is canoeing?',
      'Dragon boat kya hota hai?',
      'Water sports in haryana',
      'Tell me about the sports'
    ],
    answers: [
      'Kayaking, Canoeing, and Dragon Boat are competitive water sports. Kayaking involves a double-bladed paddle, while Canoeing uses a single-bladed paddle. Dragon Boat is an exciting team paddling sport. We train athletes in all these disciplines for national events.'
    ],
    category: 'core'
  },
  {
    intent: 'hkca.certificates',
    utterances: [
      'How to get my certificate?',
      'Where is the participation certificate?',
      'Certificate download kaise karein?',
      'I want my tournament certificate'
    ],
    answers: [
      'If you have participated in a completed event, your certificate will automatically appear in your Profile dashboard. Go to Profile -> Achievements & Documents to download your official digital certificate.'
    ],
    category: 'how-to'
  },
  {
    intent: 'hkca.registration_refund',
    utterances: [
      'Event register karne ke liye kya chahiye?',
      'Registration requirements',
      'What documents are needed for event?',
      'Refund policy for events',
      'If I cancel, will I get refund?',
      'Kitni fees refund milegi?',
      'Event fees refund',
      'Cancellation rules'
    ],
    answers: [
      'To register for any event, you must have a Verified Profile with your Photograph and Date of Birth Proof uploaded. \n\nRegarding Refunds: Under normal circumstances, event fees are strictly non-refundable. However, if HKCA cancels the event, a 75% refund will be provided to the original payment source within 7-10 working days.'
    ],
    category: 'core'
  },
  {
    intent: 'greetings.bye',
    utterances: [
      'Bye',
      'Goodbye',
      'See you later',
      'Thanks bye',
      'Chalta hu'
    ],
    answers: [
      'Goodbye! Have a great day. Feel free to come back if you have more questions about HKCA.',
      'Bye! Check out our latest events on the homepage. See you soon!'
    ],
    category: 'general'
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_CHATBOT);
    console.log('Connected to Chatbot DB for seeding...');

    for (const k of coreKnowledge) {
      await Knowledge.findOneAndUpdate(
        { intent: k.intent },
        k,
        { upsert: true, new: true }
      );
    }

    console.log('Core Knowledge Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seed();
