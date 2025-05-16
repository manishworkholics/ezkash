const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String },
    image: { type: String},
  }, { timestamps: true });
  
  module.exports = mongoose.model('Chat', chatSchema);
  