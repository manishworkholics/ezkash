const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: String,
  middlename: String,
  lastname: String,
  mobile: String,
  bussiness: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['superadmin', 'admin', 'vendor'], default: 'vendor' },
  otp: String,
  otpVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('User', userSchema);
