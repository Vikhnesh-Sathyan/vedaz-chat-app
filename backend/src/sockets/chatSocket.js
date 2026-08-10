const Message = require("../models/Message");

const onlineUsers = new Map();

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // ============================
    // USER ONLINE
    // ============================

    socket.on("user_online", (username) => {
      if (!username) {
        return;
      }

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
      if (!username) {
        return;
      }

      socket.broadcast.emit(
        "user_typing",
        username
      );
    });

    // ============================
    // USER STOPPED TYPING
    // ============================

    socket.on("stop_typing", (username) => {
      if (!username) {
        return;
      }

      socket.broadcast.emit(
        "user_stop_typing",
        username
      );
    });

    // ============================
    // SEND MESSAGE
    // ============================

    socket.on(
      "send_message",
      async (data) => {
        try {
          const {
            username,
            message,
            fileUrl,
            fileName,
            fileType,
            fileSize,
          } = data || {};

          // ============================
          // VALIDATE USERNAME
          // ============================

          if (!username?.trim()) {
            socket.emit("message_error", {
              message:
                "Username is required",
            });

            return;
          }

          const cleanUsername =
            username.trim();

          const cleanMessage =
            message?.trim() || "";

          // ============================
          // CHECK MESSAGE CONTENT
          // ============================

          const hasText =
            cleanMessage.length > 0;

          const hasFile =
            typeof fileUrl === "string" &&
            fileUrl.trim().length > 0;

          if (!hasText && !hasFile) {
            socket.emit("message_error", {
              message:
                "Message or file is required",
            });

            return;
          }

          // ============================
          // CREATE MESSAGE
          // ============================

          const newMessage =
            await Message.create({
              username: cleanUsername,

              message: cleanMessage,

              fileUrl: hasFile
                ? fileUrl
                : null,

              fileName:
                fileName || null,

              fileType:
                fileType || null,

              fileSize:
                typeof fileSize === "number"
                  ? fileSize
                  : null,
            });

          // ============================
          // BROADCAST MESSAGE
          // ============================

          io.emit(
            "new_message",
            newMessage
          );

          console.log(
            `Message sent by ${cleanUsername}`
          );

        } catch (error) {
          console.error(
            "Socket message error:",
            error
          );

          socket.emit(
            "message_error",
            {
              message:
                "Failed to send message",
            }
          );
        }
      }
    );

    // ============================
    // DELETE MESSAGE
    // ============================

    socket.on(
      "delete_message",
      async (data) => {
        try {
          const {
            messageId,
            username,
          } = data || {};

          if (
            !messageId ||
            !username
          ) {
            return;
          }

          // ============================
          // FIND MESSAGE
          // ============================

          const message =
            await Message.findById(
              messageId
            );

          if (!message) {
            socket.emit(
              "message_error",
              {
                message:
                  "Message not found",
              }
            );

            return;
          }

          // ============================
          // CHECK OWNER
          // ============================

          if (
            message.username !==
            username
          ) {
            socket.emit(
              "message_error",
              {
                message:
                  "You can only delete your own messages",
              }
            );

            return;
          }

          // ============================
          // DELETE
          // ============================

          await Message.findByIdAndDelete(
            messageId
          );

          // ============================
          // NOTIFY CLIENTS
          // ============================

          io.emit(
            "message_deleted",
            messageId
          );

          console.log(
            `Message deleted: ${messageId}`
          );

        } catch (error) {
          console.error(
            "Delete message error:",
            error
          );

          socket.emit(
            "message_error",
            {
              message:
                "Failed to delete message",
            }
          );
        }
      }
    );

    // ============================
    // DISCONNECT
    // ============================

    socket.on(
      "disconnect",
      () => {
        const username =
          onlineUsers.get(
            socket.id
          );

        onlineUsers.delete(
          socket.id
        );

        io.emit(
          "online_users",
          Array.from(
            onlineUsers.values()
          )
        );

        console.log(
          username
            ? `${username} disconnected`
            : `User disconnected: ${socket.id}`
        );
      }
    );
  });
};

module.exports = initializeSocket;