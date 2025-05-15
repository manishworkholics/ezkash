const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const chatController = require('../controllers/chat.controller');

// Ticket routes
router.post('/tickets', ticketController.createTicket);
router.get('/tickets/vendor/:vendorId', ticketController.getTicketsByVendor);


// Chat routes
router.post('/tickets/chat', chatController.addChatMessage);
router.get('/tickets/chat/:ticketId', chatController.getChatByTicket);

module.exports = router;
