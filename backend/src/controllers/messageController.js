const Message = require("../models/Message");

// ============================
// SEND MESSAGE
// ============================

const sendMessage = async (req, res) => {
  try {
    const { username, message } = req.body;

    if (!username || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Username and message are required",
      });
    }

    const newMessage = await Message.create({
      username,
      message: message.trim(),
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

// ============================
// GET CHAT HISTORY
// ============================

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

// ============================
// DELETE MESSAGE
// ============================

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!id || !username) {
      return res.status(400).json({
        success: false,
        message: "Message ID and username are required",
      });
    }

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Only the original sender can delete
    
    if (message.username !== username) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own messages",
      });
    }

    await Message.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
      deletedMessageId: id,
    });
  } catch (error) {
    console.error("Delete message error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  deleteMessage,
};


