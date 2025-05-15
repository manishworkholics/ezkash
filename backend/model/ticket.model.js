const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  checkImg: { type: String }, // URL or file path
  isActive: { type: Boolean, default: true },
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true }); // adds createdAt & updatedAt

module.exports = mongoose.model('Ticket', ticketSchema);
