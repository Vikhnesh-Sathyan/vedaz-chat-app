const MessageBubble = ({ message, currentUsername }) => {
  const isOwnMessage = message.username === currentUsername;

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`message-row ${
        isOwnMessage ? "message-own" : "message-other"
      }`}
    >
      <div className="message-bubble">
        {!isOwnMessage && (
          <div className="message-username">{message.username}</div>
        )}

        <div className="message-text">{message.message}</div>

        <div className="message-time">{formattedTime}</div>
      </div>
    </div>
  );
};

export default MessageBubble;