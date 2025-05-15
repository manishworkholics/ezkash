const Ticket = require('../model/ticket.model');

exports.createTicket = async (req, res) => {
  try {
    const { subject, category, description, checkImg, vendorId } = req.body;

    const ticket = new Ticket({ subject, category, description, checkImg, vendorId });
    await ticket.save();

    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create ticket', error: error.message });
  }
};


exports.getTicketsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const tickets = await Ticket.find({ vendorId }).sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
};

