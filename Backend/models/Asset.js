const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a name for the asset'],
  },
  url: {
    type: String,
    required: [true, 'Please provide the asset URL'],
  },
  cloudinaryId: {
    type: String,
  },
  fileType: {
    type: String,
    default: 'image',
  },
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
