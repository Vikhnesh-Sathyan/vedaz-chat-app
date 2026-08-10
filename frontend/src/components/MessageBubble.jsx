const MessageBubble = ({
  message,
  currentUsername,
  onDelete,
}) => {
  const isOwnMessage =
    message.username ===
    currentUsername;

  const formattedTime =
    new Date(
      message.createdAt
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // ============================
  // CHECK FILE TYPE
  // ============================

  const isImage =
    message.fileType?.startsWith(
      "image/"
    );

  const hasFile =
    Boolean(message.fileUrl);

  // ============================
  // FILE URL
  // ============================

  const fileUrl = hasFile
    ? `http://localhost:5000${message.fileUrl}`
    : null;

  return (
    <div
      className={`message-row ${
        isOwnMessage
          ? "message-own"
          : "message-other"
      }`}
    >

      {/* ============================
          USERNAME
      ============================ */}

      {!isOwnMessage && (
        <div className="message-username">
          {message.username}
        </div>
      )}

      <div className="message-content">

        {/* ============================
            TEXT MESSAGE
        ============================ */}

        {message.message && (
          <div className="message-text">
            {message.message}
          </div>
        )}

        {/* ============================
            IMAGE
        ============================ */}

        {isImage && fileUrl && (
          <div className="message-image-wrapper">
            <img
              src={fileUrl}
              alt={
                message.fileName ||
                "Shared image"
              }
              className="message-image"
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";
              }}
            />
          </div>
        )}

        {/* ============================
            OTHER FILE
        ============================ */}

        {!isImage && fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="message-file"
          >
            📎{" "}
            {message.fileName ||
              "Open file"}
          </a>
        )}

        {/* ============================
            MESSAGE FOOTER
        ============================ */}

        <div className="message-footer">

          <span className="message-time">
            {formattedTime}
          </span>

          {/* DELETE ONLY OWN MESSAGE */}

          {isOwnMessage && (
            <button
              type="button"
              className="delete-message-btn"
              onClick={() =>
                onDelete(
                  message._id
                )
              }
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