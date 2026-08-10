require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const messageRoutes = require("./routes/messageRoutes");
const initializeSocket = require("./sockets/chatSocket");

const app = express();

const server = http.createServer(app);

// ============================
// SOCKET.IO
// ============================

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// ============================
// DATABASE
// ============================

connectDB();

// ============================
// MIDDLEWARE
// ============================

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());

// ============================
// UPLOADED FILES
// ============================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ============================
// API STATUS
// ============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Vedaz Chat API is running",
  });
});

// ============================
// MESSAGE ROUTES
// ============================

app.use(
  "/api/messages",
  messageRoutes
);

// ============================
// SOCKET.IO EVENTS
// ============================

initializeSocket(io);

// ============================
// SERVER
// ============================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});