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

  useEffect(() => {
    if (!username) {
      return;
    }

    const newSocket = io(SOCKET_URL);

    setSocket(newSocket);

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

    newSocket.on("connect", () => {
      console.log("Connected to Socket.io:", newSocket.id);
    });

    newSocket.on("new_message", (newMessage) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        newMessage,
      ]);
    });

    newSocket.on("message_error", (error) => {
      console.error("Socket message error:", error.message);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from Socket.io");
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

  if (!username) {
    return (
      <div className="username-page">
        <form onSubmit={handleUsernameSubmit}>
          <h1>Vedaz Chat</h1>

          <p>Enter your username to join the conversation.</p>

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
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-container">

        <ChatHeader username={username} />

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

        <MessageInput onSend={handleSendMessage} />

      </div>
    </div>
  );
}

export default App;