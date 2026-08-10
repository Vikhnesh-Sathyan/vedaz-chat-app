
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";

import { getMessages } from "./services/chatService";

import "./App.css";

const SOCKET_URL = "http://localhost:5000";

function App() {
  // ============================
  // USER
  // ============================

  const [username, setUsername] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  // ============================
  // MESSAGES
  // ============================

  const [messages, setMessages] = useState([]);

  // ============================
  // SOCKET
  // ============================

  const [socket, setSocket] = useState(null);

  // ============================
  // LOADING
  // ============================

  const [loading, setLoading] = useState(false);

  // ============================
  // ONLINE USERS
  // ============================

  const [onlineUsers, setOnlineUsers] = useState([]);

  // ============================
  // TYPING INDICATOR
  // ============================

  const [typingUser, setTypingUser] = useState("");

  // ============================
  // SEARCH
  // ============================

  const [searchTerm, setSearchTerm] = useState("");

  // ============================
  // DARK MODE
  // ============================

  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("vedaz-dark-mode") ===
      "true"
    );
  });

  // ============================
  // SAVE DARK MODE
  // ============================

  useEffect(() => {
    localStorage.setItem(
      "vedaz-dark-mode",
      darkMode
    );
  }, [darkMode]);

  // ============================
  // TOGGLE DARK MODE
  // ============================

  const toggleDarkMode = () => {
    setDarkMode(
      (previousMode) => !previousMode
    );
  };

  // ============================
  // SOCKET CONNECTION
  // ============================

  useEffect(() => {
    if (!username) {
      return;
    }

    const newSocket = io(SOCKET_URL);

    setSocket(newSocket);

    // ============================
    // USER ONLINE
    // ============================

    newSocket.emit(
      "user_online",
      username
    );

    // ============================
    // LOAD OLD MESSAGES
    // ============================

    const loadMessages = async () => {
      try {
        setLoading(true);

        const data = await getMessages();

        if (data.success) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error(
          "Failed to load messages:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // ============================
    // SOCKET CONNECTED
    // ============================

    newSocket.on("connect", () => {
      console.log(
        "Socket connected:",
        newSocket.id
      );
    });

    // ============================
    // ONLINE USERS
    // ============================

    newSocket.on(
      "online_users",
      (users) => {
        setOnlineUsers(users);
      }
    );

    // ============================
    // NEW MESSAGE
    // ============================

    newSocket.on(
      "new_message",
      (newMessage) => {
        setMessages(
          (previousMessages) => [
            ...previousMessages,
            newMessage,
          ]
        );
      }
    );

    // ============================
    // MESSAGE DELETED
    // ============================

    newSocket.on(
      "message_deleted",
      (messageId) => {
        setMessages(
          (previousMessages) =>
            previousMessages.filter(
              (message) =>
                message._id !== messageId
            )
        );
      }
    );

    // ============================
    // USER TYPING
    // ============================

    newSocket.on(
      "user_typing",
      (user) => {
        if (user !== username) {
          setTypingUser(user);
        }
      }
    );

    // ============================
    // USER STOPPED TYPING
    // ============================

    newSocket.on(
      "user_stop_typing",
      (user) => {
        if (user !== username) {
          setTypingUser("");
        }
      }
    );

    // ============================
    // MESSAGE ERROR
    // ============================

    newSocket.on(
      "message_error",
      (error) => {
        console.error(
          "Message error:",
          error.message
        );
      }
    );

    // ============================
    // DISCONNECT
    // ============================

    newSocket.on("disconnect", () => {
      console.log(
        "Socket disconnected"
      );
    });

    // ============================
    // CLEANUP
    // ============================

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [username]);

  // ============================
  // USERNAME SUBMIT
  // ============================

  const handleUsernameSubmit = (
    event
  ) => {
    event.preventDefault();

    const trimmedUsername =
      usernameInput.trim();

    if (!trimmedUsername) {
      return;
    }

    setUsername(trimmedUsername);
  };

  // ============================
  // SEND MESSAGE
  // ============================

  const handleSendMessage = (
    message
  ) => {
    if (!socket) {
      console.error(
        "Socket is not connected"
      );
      return;
    }

    const trimmedMessage =
      message.trim();

    if (!trimmedMessage) {
      return;
    }

    socket.emit("send_message", {
      username,
      message: trimmedMessage,
    });
  };

  // ============================
  // DELETE MESSAGE
  // ============================

  const handleDeleteMessage = (
    messageId
  ) => {
    if (!socket) {
      console.error(
        "Socket is not connected"
      );
      return;
    }

    socket.emit(
      "delete_message",
      {
        messageId,
        username,
      }
    );
  };

  // ============================
  // SEARCH MESSAGES
  // ============================

  const filteredMessages =
    messages.filter((message) => {
      const search =
        searchTerm
          .toLowerCase()
          .trim();

      if (!search) {
        return true;
      }

      return (
        message.message
          .toLowerCase()
          .includes(search) ||
        message.username
          .toLowerCase()
          .includes(search)
      );
    });

  // ============================
  // LOGIN SCREEN
  // ============================

  if (!username) {
    return (
      <div
        className={`login-container ${
          darkMode
            ? "dark-mode"
            : ""
        }`}
      >
        <div className="username-card">

          <div className="logo">
            V
          </div>

          <h1>Vedaz Chat</h1>

          <p>
            Enter your username to join
            the conversation.
          </p>

          <form
            onSubmit={
              handleUsernameSubmit
            }
          >
            <input
              type="text"
              value={usernameInput}
              onChange={(event) =>
                setUsernameInput(
                  event.target.value
                )
              }
              placeholder="Enter username"
              maxLength={30}
              autoFocus
            />

            <button type="submit">
              Join Chat
            </button>
          </form>

        </div>
      </div>
    );
  }

  // ============================
  // CHAT SCREEN
  // ============================

  return (
    <div
      className={`app-container ${
        darkMode
          ? "dark-mode"
          : ""
      }`}
    >
      <div className="chat-container">

        {/* HEADER */}

        <ChatHeader
          username={username}
          onlineUsers={
            onlineUsers
          }
          darkMode={darkMode}
          onToggleDarkMode={
            toggleDarkMode
          }
        />

        {/* SEARCH */}

        <div className="search-container">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search messages..."
          />

          {searchTerm && (
            <button
              className="clear-search"
              onClick={() =>
                setSearchTerm("")
              }
              title="Clear search"
            >
              ✕
            </button>
          )}

        </div>

        {/* MESSAGES */}

        {loading ? (
          <div className="loading">
            Loading messages...
          </div>
        ) : (
          <MessageList
            messages={
              filteredMessages
            }
            currentUsername={
              username
            }
            onDelete={
              handleDeleteMessage
            }
          />
        )}

        {/* TYPING INDICATOR */}

        {typingUser && (
          <div className="typing-indicator">
            <span>
              {typingUser} is typing
            </span>
          </div>
        )}

        {/* MESSAGE INPUT */}

        <MessageInput
          onSend={
            handleSendMessage
          }
          socket={socket}
          username={username}
        />

      </div>
    </div>
  );
}

export default App;

