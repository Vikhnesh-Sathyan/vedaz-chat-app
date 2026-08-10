
import MessageBubble from "./MessageBubble";

const MessageList = ({
  messages,
  currentUsername,
  onDelete,
}) => {
  return (
    <div className="message-list">

      {messages.length === 0 ? (
        <div className="empty-chat">
          <h3>No messages yet</h3>
          <p>Start the conversation 👋</p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            currentUsername={currentUsername}
            onDelete={onDelete}
          />
        ))
      )}

    </div>
  );
};

export default MessageList;

