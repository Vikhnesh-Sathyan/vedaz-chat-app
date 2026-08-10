const Message = require("../models/Message");

const onlineUsers = new Map();

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // ============================
    // USER ONLINE
    // ============================

    socket.on("user_online", (username) => {
      onlineUsers.set(socket.id, username);

      io.emit(
        "online_users",
        Array.from(onlineUsers.values())
      );

      console.log(`${username} is online`);
    });

    // ============================
    // USER TYPING
    // ============================

    socket.on("typing", (username) => {
      socket.broadcast.emit("user_typing", username);
    });

    // ============================
    // USER STOPPED TYPING
    // ============================

    socket.on("stop_typing", (username) => {
      socket.broadcast.emit("user_stop_typing", username);
    });

    // ============================
    // SEND MESSAGE
    // ============================

    socket.on("send_message", async (data) => {
      try {
        const { username, message } = data;

        if (!username || !message?.trim()) {
          return;
        }

        const newMessage = await Message.create({
          username,
          message: message.trim(),
        });

        io.emit("new_message", newMessage);
      } catch (error) {
        console.error("Socket message error:", error);

        socket.emit("message_error", {
          message: "Failed to send message",
        });
      }
    });

    
// ============================
// DELETE MESSAGE
// ============================

socket.on("delete_message", async (data) => {
  try {
    const { messageId, username } = data;

    if (!messageId || !username) {
      return;
    }

    const message = await Message.findById(messageId);

    if (!message) {
      socket.emit("message_error", {
        message: "Message not found",
      });

      return;
    }

    // Only the original sender can delete
    if (message.username !== username) {
      socket.emit("message_error", {
        message: "You can only delete your own messages",
      });

      return;
    }

    await Message.findByIdAndDelete(messageId);

    // Notify every connected client
    io.emit("message_deleted", messageId);

  } catch (error) {
    console.error("Delete message error:", error);

    socket.emit("message_error", {
      message: "Failed to delete message",
    });
  }
});


    // ============================
    // DISCONNECT
    // ============================

    socket.on("disconnect", () => {
      const username = onlineUsers.get(socket.id);

      onlineUsers.delete(socket.id);

      io.emit(
        "online_users",
        Array.from(onlineUsers.values())
      );

      console.log(
        username
          ? `${username} disconnected`
          : `User disconnected: ${socket.id}`
      );
    });
  });
};

module.exports = initializeSocket;