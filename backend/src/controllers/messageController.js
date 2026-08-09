const Message = require("../models/Message");

// Send message
const sendMessage = async (req, res) => {
  try {
    const { username, message } = req.body;

    if (!username || !message) {
      return res.status(400).json({
        success: false,
        message: "Username and message are required",
      });
    }

    const newMessage = await Message.create({
      username,
      message,
    });

    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

// Get chat history
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: 1 })
      .limit(100);

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};