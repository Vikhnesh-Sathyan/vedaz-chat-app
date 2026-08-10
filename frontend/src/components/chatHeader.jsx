
const ChatHeader = ({
  username,
  onlineUsers,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="chat-header">

      {/* LEFT SIDE */}
      <div className="chat-title">
        <h1>Vedaz Chat</h1>

        <p>
          {onlineUsers.length}{" "}
          {onlineUsers.length === 1
            ? "user"
            : "users"}{" "}
          online
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="chat-header-actions">

        {/* DARK MODE BUTTON */}
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleDarkMode}
          title={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* CURRENT USER */}
        <div className="user-info">
          <span className="online-dot"></span>
          <span>{username}</span>
        </div>

      </div>

    </header>
  );
};

export default ChatHeader;

