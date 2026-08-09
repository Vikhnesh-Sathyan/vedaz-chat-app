import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";

import { getMessages } from "./services/chatService";

import "./App.css";

const SOCKET_URL = "http://localhost:5000";

function App() {
  const [username, setUsername] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const [loading, setLoading] = useState(false);

  // Online users
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!username) {
      return;
    }

    const newSocket = io(SOCKET_URL);

    setSocket(newSocket);

    // Tell backend that this user is online
    newSocket.emit("user_online", username);

    // Load previous messages
    const loadMessages = async () => {
      try {
        setLoading(true);

        const data = await getMessages();

        if (data.success) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Socket connected
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    // Receive online users
    newSocket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    // Receive new messages instantly
    newSocket.on("new_message", (newMessage) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        newMessage,
      ]);
    });

    // Handle socket errors
    newSocket.on("message_error", (error) => {
      console.error("Message error:", error.message);
    });

    // Handle disconnect
    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [username]);

  const handleUsernameSubmit = (event) => {
    event.preventDefault();

    const trimmedUsername = usernameInput.trim();

    if (!trimmedUsername) {
      return;
    }

    setUsername(trimmedUsername);
  };

  const handleSendMessage = (message) => {
    if (!socket) {
      console.error("Socket is not connected");
      return;
    }

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    socket.emit("send_message", {
      username,
      message: trimmedMessage,
    });
  };

  // Username screen
  if (!username) {
    return (
      <div className="login-container">
        <div className="username-card">
          <div className="logo">V</div>

          <h1>Vedaz Chat</h1>

          <p>
            Enter your username to join the conversation.
          </p>

          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              value={usernameInput}
              onChange={(event) =>
                setUsernameInput(event.target.value)
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

  // Chat screen
  return (
    <div className="app-container">
      <div className="chat-container">

        <ChatHeader
          username={username}
          onlineUsers={onlineUsers}
        />

        {loading ? (
          <div className="loading">
            Loading messages...
          </div>
        ) : (
          <MessageList
            messages={messages}
            currentUsername={username}
          />
        )}

        <MessageInput
          onSend={handleSendMessage}
        />

      </div>
    </div>
  );
}

export default App;