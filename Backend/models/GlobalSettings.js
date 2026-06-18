const mongoose = require('mongoose');

const globalSettingsSchema = new mongoose.Schema({
  registrationFees: {
    athlete: { type: Number, default: 0 },
    coach: { type: Number, default: 0 },
    club: { type: Number, default: 0 },
  },
  documentCategories: [{
    name: { type: String, required: true },
    fee: { type: Number, default: 0 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('GlobalSettings', globalSettingsSchema);
