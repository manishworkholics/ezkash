const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    mobile: String,
    bussiness: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['superadmin', 'admin', 'vendor'], default: 'admin' },
    otp: String,
    otpVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Admin', adminSchema);
