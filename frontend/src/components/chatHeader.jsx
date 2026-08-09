const ChatHeader = ({ username }) => {
  return (
    <header className="chat-header">
      <div>
        <h1>Vedaz Chat</h1>
        <p>Real-time conversation</p>
      </div>

      <div className="user-info">
        <span className="online-dot"></span>
        <span>{username}</span>
      </div>
    </header>
  );
};

export default ChatHeader;