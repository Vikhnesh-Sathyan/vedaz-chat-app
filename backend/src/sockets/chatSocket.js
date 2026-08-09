const Message = require("../models/Message");

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("send_message", async (data) => {
      try {
        const { username, message } = data;

        if (!username || !message) {
          return;
        }

        const newMessage = await Message.create({
          username,
          message,
        });

        io.emit("new_message", newMessage);
      } catch (error) {
        console.error("Socket message error:", error);

        socket.emit("message_error", {
          message: "Failed to send message",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = initializeSocket;