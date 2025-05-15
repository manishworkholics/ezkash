const Chat = require('../model/chat.model');

exports.addChatMessage = async (req, res) => {
  try {
    const { ticketId, senderId, message,image } = req.body;

    const chat = new Chat({ ticketId, senderId, message,image });
    await chat.save();

    res.status(201).json({ message: 'Message sent', chat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};


exports.getChatByTicket = async (req, res) => {
    try {
      const { ticketId } = req.params;
      const chats = await Chat.find({ ticketId }).sort({ createdAt: 1 }).populate('senderId', 'name role');
      res.status(200).json(chats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get chat messages', error: error.message });
    }
  };
  