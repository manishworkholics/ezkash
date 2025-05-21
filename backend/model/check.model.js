// models/Check.js
const mongoose = require('mongoose');

const checkSchema = new mongoose.Schema({
  imageUrl: String,
  imageUrl2: String,
  imageUrl3: String,
  imageUrl4: String,
  customerFirstName: String,
  customerMiddleName: String,
  customerLastName: String,
  licenseNo: String,
  date: String,
  company: String,
  checkType: String,
  amount: String,
  extractedText: String,
  comment: String,
  venderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  customerStatus: { type: String, enum: ['verified customer', 'new customer'], default: 'new customer' },
  isActive: { type: Boolean, default: true },
  status: { type: String, enum: ['bad', 'good'], default: 'good' },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Check', checkSchema);
