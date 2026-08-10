# 💬 Vedaz Chat

A real-time chat application built with **React, Node.js, Express, MongoDB, and Socket.io**. Vedaz Chat provides instant messaging with persistent message history, online/offline status, timestamps, and a responsive chat interface.

## 🚀 Features

* ✅ **React Frontend** — Modern and responsive user interface
* ✅ **Node.js + Express Backend** — REST API and server-side logic
* ✅ **MongoDB Persistence** — Messages are stored permanently
* ✅ **REST API for Messages** — Send and retrieve chat messages
* ✅ **Socket.io Real-Time Messaging** — Instant communication between users
* ✅ **Instant Message Delivery** — Messages appear without refreshing the page
* ✅ **Message Timestamps** — Displays when each message was sent
* ✅ **Persistent Chat History** — Messages remain available after refreshing
* ✅ **Connection Handling** — Handles Socket.io connection and disconnection events
* ✅ **Username-Based Login** — Simple dummy login using a username
* ✅ **Online/Offline Status** — Shows the current connection status of users
* ✅ **Clean Component Structure** — Organized and maintainable React components
* ✅ **Responsive UI** — Works across desktop and mobile screen sizes

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Socket.io Client

### Backend

* Node.js
* Express.js
* Socket.io
* REST API

### Database

* MongoDB
* Mongoose

## 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │     React Client    │
                    │                     │
                    │  Chat UI Components │
                    │  Socket.io Client   │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
          REST API Requests          Socket.io Events
                 │                           │
                 ▼                           ▼
        ┌─────────────────────────────────────────┐
        │          Node.js + Express              │
        │                                         │
        │        REST API + Socket.io             │
        └──────────────────┬──────────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │     MongoDB     │
                  │                 │
                  │ Message History │
                  └─────────────────┘
```

## 📂 Project Structure

```text
vedaz-chat/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   ├── Message/
│   │   │   └── User/
│   │   │
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

> The exact folder names may vary depending on your implementation.

## ⚙️ How It Works

### 1. User Login

Users enter a username through the dummy login interface.

```text
Username → Login → Chat Interface
```

No complex authentication system is required for the current implementation.

### 2. Sending a Message

When a user sends a message:

```text
User
  │
  ▼
React Chat UI
  │
  ├── REST API
  │       │
  │       ▼
  │    MongoDB
  │
  └── Socket.io
          │
          ▼
    Other Connected User
```

The message is persisted in MongoDB while Socket.io provides real-time delivery.

### 3. Real-Time Communication

Socket.io maintains a real-time connection between the frontend and backend.

When a new message is sent:

```text
User A
  │
  │  Send Message
  ▼
Socket.io Server
  │
  │  Real-time event
  ▼
User B
```

The receiving user sees the message immediately without refreshing the browser.

### 4. Message Persistence

Messages are stored in MongoDB.

This means:

```text
Send Message
     ↓
Save to MongoDB
     ↓
Refresh Browser
     ↓
Fetch Chat History
     ↓
Previous Messages Still Available
```

## 🔌 API Endpoints

### Send Message

```http
POST /api/messages
```

Example request:

```json
{
  "username": "Vikhnesh",
  "message": "Hello!"
}
```

### Fetch Message History

```http
GET /api/messages
```

Returns previously stored messages from MongoDB.

> Update the endpoint paths above if your actual backend routes use different names.

## 🔄 Socket.io Events

The application uses Socket.io for real-time communication.

Typical flow:

```text
Client connects
      ↓
Socket connection established
      ↓
User becomes online
      ↓
Message event emitted
      ↓
Server receives event
      ↓
Message broadcast
      ↓
Connected clients receive message
```

The application also handles connection and disconnection events to maintain online/offline status.

## 🖥️ User Interface

The chat interface includes:

* Username/login screen
* Chat window
* Message input
* Send button
* Message timestamps
* Online/offline status
* Chat history
* Responsive layout

## 📱 Responsive Design

Vedaz Chat is designed to work across different screen sizes:

```text
Desktop 💻
     ↓
Tablet 📱
     ↓
Mobile 📱
```

The layout adapts to smaller screens while maintaining the core messaging experience.

## 🔧 Installation

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB

### Clone the Repository

```bash
git clone https://github.com/your-username/vedaz-chat.git
cd vedaz-chat
```

### Install Backend Dependencies

```bash
cd server
npm install
```

### Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

## 🔐 Environment Variables

Create a `.env` file inside the backend/server directory.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/vedaz-chat
```

Add any additional environment variables required by your implementation.

> Never commit your `.env` file to GitHub.

## ▶️ Running the Application

### Start the Backend

```bash
cd server
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start the Frontend

In another terminal:

```bash
cd client
npm run dev
```

The React application will normally be available at:

```text
http://localhost:5173
```

## 🧪 Testing Real-Time Messaging

To test Socket.io functionality:

1. Start the backend.
2. Start the React frontend.
3. Open the application in two browser windows/tabs.
4. Login with different usernames.
5. Send a message from one user.
6. Verify that the second user receives it instantly.
7. Refresh the page.
8. Verify that previous messages are still available.
9. Disconnect one client and verify its connection/offline handling.

## 🎯 Project Objectives

Vedaz Chat was developed to demonstrate practical implementation of:

* Real-time web communication
* REST API development
* WebSocket-based messaging
* MongoDB data persistence
* React component architecture
* Client-server communication
* Connection state management
* Responsive frontend development

## 🔮 Future Improvements

Possible future enhancements include:

* 👥 Multiple chat rooms
* 👤 User profiles
* 🟢 More detailed presence indicators
* ✍️ Typing indicators
* ✓ Message delivery/read status
* 🗑️ Message deletion
<!-- * 📎 File and image sharing
* 🔔 Notifications
* 🔍 Message search
* 🌙 Dark mode
* 👥 Group conversations -->

## 📸 Screenshots

Add screenshots of your application here:

```text
screenshots/
├── login.png
├── chat.png
├── online-status.png
└── mobile-chat.png
```

Example:

```markdown
![Vedaz Chat Login](screenshots/login.png)

![Vedaz Chat](screenshots/chat.png)
```

## 👨‍💻 Author

**Vikhnesh Sathyan**

MCA Graduate | MERN Stack Developer

---

