
const MessageBubble = ({
  message,
  currentUsername,
  onDelete,
}) => {
  const isOwnMessage = message.username === currentUsername;

  const formattedTime = new Date(
    message.createdAt
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    onDelete(message._id);
  };

  return (
    <div
      className={`message-row ${
        isOwnMessage
          ? "message-own"
          : "message-other"
      }`}
    >

      {!isOwnMessage && (
        <div className="message-username">
          {message.username}
        </div>
      )}

      <div className="message-content">

        <div className="message-text">
          {message.message}
        </div>

        <div className="message-footer">

          <div className="message-time">
            {formattedTime}
          </div>

          {isOwnMessage && (
            <button
              className="delete-message-btn"
              onClick={handleDelete}
              title="Delete message"
            >
              🗑️
            </button>
          )}

        </div>

      </div>

    </div>
  );
};

export default MessageBubble;

