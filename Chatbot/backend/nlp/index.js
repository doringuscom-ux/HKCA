const { NlpManager } = require('node-nlp');
const Knowledge = require('../models/Knowledge');

const manager = new NlpManager({ languages: ['en'], forceNER: true });

const trainModel = async () => {
  try {
    const records = await Knowledge.find();
    
    // Clear previous training if necessary (manager usually handles updates)
    records.forEach(record => {
      record.utterances.forEach(utterance => {
        manager.addDocument('en', utterance, record.intent);
      });
      record.answers.forEach(answer => {
        manager.addAnswer('en', record.intent, answer);
      });
    });

    console.log('NLP Training started...');
    await manager.train();
    console.log('NLP Training finished.');
    manager.save();
  } catch (error) {
    console.error('NLP Training Error:', error);
  }
};

const getResponse = async (text) => {
  const response = await manager.process('en', text);
  
  // Custom Fallback Logic for low confidence
  if (!response.intent || response.score < 0.6 || response.intent === 'None') {
    return {
      answer: "I'm sorry, I don't have enough information about that yet. Please visit our Contact Page (https://hkca.org.in/contact) to raise a formal query with our support team.",
      intent: 'fallback',
      score: response.score,
    };
  }

  return {
    answer: response.answer,
    intent: response.intent,
    score: response.score,
  };
};

module.exports = { trainModel, getResponse };
