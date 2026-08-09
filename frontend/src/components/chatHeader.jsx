const ChatHeader = ({ username, onlineUsers }) => {
  return (
    <header className="chat-header">
      <div>
        <h1>Vedaz Chat</h1>

        <p>
          {onlineUsers.length}{" "}
          {onlineUsers.length === 1 ? "user" : "users"} online
        </p>
      </div>

      <div className="user-info">
        <span className="online-dot"></span>
        <span>{username}</span>
      </div>
    </header>
  );
};

export default ChatHeader;