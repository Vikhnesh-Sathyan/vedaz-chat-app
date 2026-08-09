import { useRef, useState } from "react";

const MessageInput = ({ onSend, socket, username }) => {
  const [message, setMessage] = useState("");

  const typingTimeout = useRef(null);

  // ============================
  // WHEN USER TYPES
  // ============================

  const handleChange = (event) => {
    const value = event.target.value;

    setMessage(value);

    if (!socket) {
      return;
    }

    // User is typing
    if (value.trim()) {
      socket.emit("user_typing", username);

      // Reset previous timer
      clearTimeout(typingTimeout.current);

      // Stop typing after 1 second
      typingTimeout.current = setTimeout(() => {
        socket.emit("user_stop_typing", username);
      }, 1000);
    } else {
      // Input is empty
      socket.emit("user_stop_typing", username);

      clearTimeout(typingTimeout.current);
    }
  };

  // ============================
  // SEND MESSAGE
  // ============================

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    // Send message
    onSend(trimmedMessage);

    // Clear input
    setMessage("");

    // Tell others we stopped typing
    if (socket) {
      socket.emit("user_stop_typing", username);
    }

    clearTimeout(typingTimeout.current);
  };

  return (
    <form
      className="message-input-container"
      onSubmit={handleSubmit}
    >

      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="Type a message..."
        autoComplete="off"
      />

      <button type="submit">
        Send
      </button>

    </form>
  );
};

export default MessageInput;