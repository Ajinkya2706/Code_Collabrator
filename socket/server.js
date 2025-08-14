const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const crypto = require("crypto");
const cors = require("cors");
const path = require("path");
const { generateToken04 } = require(path.join(__dirname, "server/zegoServerAssistant"));

// Load environment variables
dotenv.config();

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Set up Socket.IO with enhanced configuration
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling'],
  allowEIO3: true,
});

// Enhanced room and user tracking
const roomUsers = new Map();
const roomFiles = new Map(); // Track files per room for better sync
const userSessions = new Map(); // Track user sessions

// Socket.IO connection handling with enhanced features
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // Handle joining a room with enhanced tracking
  socket.on("join-room", ({ roomId, user }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.user = user;

    // Add user to room tracking
    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Map());
    }
    roomUsers.get(roomId).set(socket.id, user);

    // Track user session
    userSessions.set(socket.id, { roomId, user });

    // Broadcast updated users list to all clients in the room
    const usersInRoom = Array.from(roomUsers.get(roomId).values());
    io.to(roomId).emit("collaborators-update", usersInRoom);

    console.log(`👥 Socket ${socket.id} joined room: ${roomId} (${usersInRoom.length} users)`);
    
    // Send current room state to the new user
    if (roomFiles.has(roomId)) {
      socket.emit("room-state", { files: roomFiles.get(roomId) });
    }
  });

  // Enhanced code change handling with debouncing and validation
  socket.on("code-change", ({ roomId, fileId, code, sender }) => {
    try {
      // Validate input
      if (!roomId || !fileId || !sender) {
        console.warn("Invalid code-change data received:", { roomId, fileId, sender });
        return;
      }

      console.log(`📝 Code change in room ${roomId}, file ${fileId} by ${sender} (${code.length} chars)`);
      
      // Update room files state
      if (!roomFiles.has(roomId)) {
        roomFiles.set(roomId, new Map());
      }
      roomFiles.get(roomId).set(fileId, { content: code, lastModified: Date.now() });

    // Broadcast the code changes to other clients in the same room
      socket.to(roomId).emit("code-update", { fileId, code, sender, timestamp: Date.now() });
    } catch (error) {
      console.error("Error handling code-change:", error);
    }
  });

  // Enhanced cursor position handling
  socket.on("cursor-move", ({ roomId, fileId, position, sender }) => {
    try {
      if (!roomId || !fileId || !sender) {
        console.warn("Invalid cursor-move data received:", { roomId, fileId, sender });
        return;
      }

      console.log(`👆 Cursor move in room ${roomId}, file ${fileId} by ${sender}`);
      socket.to(roomId).emit("cursor-update", { fileId, position, sender, timestamp: Date.now() });
    } catch (error) {
      console.error("Error handling cursor-move:", error);
    }
  });

  // Enhanced file creation with validation
  socket.on("file-create", ({ roomId, file }) => {
    try {
      if (!roomId || !file || !file._id) {
        console.warn("Invalid file-create data received:", { roomId, file });
        return;
      }

      console.log(`📄 File created in room ${roomId}:`, file.name);
      
      // Update room files state
      if (!roomFiles.has(roomId)) {
        roomFiles.set(roomId, new Map());
      }
      roomFiles.get(roomId).set(file._id, { 
        name: file.name, 
        content: file.content || '', 
        language: file.language || 'javascript',
        lastModified: Date.now() 
      });

      // Broadcast file creation to other clients in the same room
      socket.to(roomId).emit("file-create", { file, timestamp: Date.now() });
    } catch (error) {
      console.error("Error handling file-create:", error);
    }
  });

  // Enhanced file deletion
  socket.on("file-delete", ({ roomId, fileId }) => {
    try {
      if (!roomId || !fileId) {
        console.warn("Invalid file-delete data received:", { roomId, fileId });
        return;
      }

      console.log(`🗑️ File deleted in room ${roomId}:`, fileId);
      
      // Remove from room files state
      if (roomFiles.has(roomId)) {
        roomFiles.get(roomId).delete(fileId);
      }

      // Broadcast file deletion to other clients in the same room
      socket.to(roomId).emit("file-delete", { fileId, timestamp: Date.now() });
    } catch (error) {
      console.error("Error handling file-delete:", error);
    }
  });

  // Enhanced file renaming
  socket.on("file-rename", ({ roomId, fileId, newName }) => {
    try {
      if (!roomId || !fileId || !newName) {
        console.warn("Invalid file-rename data received:", { roomId, fileId, newName });
        return;
      }

      console.log(`✏️ File renamed in room ${roomId}:`, fileId, "to", newName);
      
      // Update room files state
      if (roomFiles.has(roomId) && roomFiles.get(roomId).has(fileId)) {
        const fileData = roomFiles.get(roomId).get(fileId);
        fileData.name = newName;
        fileData.lastModified = Date.now();
      }

      // Broadcast file rename to other clients in the same room
      socket.to(roomId).emit("file-rename", { fileId, newName, timestamp: Date.now() });
    } catch (error) {
      console.error("Error handling file-rename:", error);
    }
  });

  // Enhanced message handling
  socket.on("message", ({ roomId, message }) => {
    try {
      if (!roomId || !message) {
        console.warn("Invalid message data received:", { roomId, message });
        return;
      }

      console.log(`💬 Message in room ${roomId}:`, message);
      socket.to(roomId).emit("new-message", { message, timestamp: Date.now() });
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  // Handle disconnection with cleanup
  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);

    // Remove user from room tracking
    const session = userSessions.get(socket.id);
    if (session && session.roomId && roomUsers.has(session.roomId)) {
      roomUsers.get(session.roomId).delete(socket.id);

      // If room is empty, clean it up
      if (roomUsers.get(session.roomId).size === 0) {
        roomUsers.delete(session.roomId);
        roomFiles.delete(session.roomId);
        console.log(`🗑️ Room ${session.roomId} removed (no users left)`);
      } else {
        // Broadcast updated user list
        const usersInRoom = Array.from(roomUsers.get(session.roomId).values());
        io.to(session.roomId).emit("collaborators-update", usersInRoom);
        console.log(`👥 Room ${session.roomId} now has ${usersInRoom.length} users`);
      }
    }

    // Clean up user session
    userSessions.delete(socket.id);
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// Simple health check route
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "Socket.IO server is running" });
});

app.use(cors({
  origin: [process.env.FRONTEND_URL || "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
}));

app.get("/api/get-zego-token", (req, res) => {
  try {
    const appId = parseInt(process.env.ZEGOCLOUD_APP_ID, 10);
    const serverSecret = process.env.ZEGOCLOUD_SERVER_SECRET;
    const { roomID, userID, userName } = req.query;
    
    console.log("Token request:", { appId, serverSecret: serverSecret ? "***" : "MISSING", roomID, userID, userName });
    
    if (!appId || !serverSecret || !roomID || !userID || !userName) {
      console.log("Missing parameters:", { appId: !!appId, serverSecret: !!serverSecret, roomID: !!roomID, userID: !!userID, userName: !!userName });
      return res.status(400).json({ error: "Missing required parameters" });
    }
    
    if (serverSecret.length !== 32) {
      console.log("Invalid server secret length:", serverSecret.length);
      return res.status(400).json({ error: "Server secret must be 32 characters" });
    }
    
    const effectiveTimeInSeconds = 3600; // 1 hour
    const payloadObject = {
      room_id: roomID,
      privilege: {
        1: 1, // loginRoom: 1 pass
        2: 1  // publishStream: 1 pass
      },
      stream_id_list: null
    };
    const payload = JSON.stringify(payloadObject);
    
    console.log("Generating token with payload:", payload);
    const token = generateToken04(appId, userID, serverSecret, effectiveTimeInSeconds, payload);
    console.log("Token generated successfully, length:", token.length);
    
    res.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Token generation failed", details: error.message || error });
  }
});

// Start the server
const PORT = process.env.SOCKET_PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Enhanced Socket.IO server running on port ${PORT}`);
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
  console.log(`👥 Active rooms: ${roomUsers.size}`);
  console.log(`📊 Total connected users: ${userSessions.size}`);
});

// Enhanced server stats logging
setInterval(() => {
  const totalUsers = Array.from(roomUsers.values()).reduce((acc, users) => acc + users.size, 0);
  const totalFiles = Array.from(roomFiles.values()).reduce((acc, files) => acc + files.size, 0);
  
  console.log(`📊 Enhanced Socket.IO Server Stats:`);
  console.log(`   - Active rooms: ${roomUsers.size}`);
  console.log(`   - Total users: ${totalUsers}`);
  console.log(`   - Total files tracked: ${totalFiles}`);
  console.log(`   - Connected sessions: ${userSessions.size}`);
}, 60000); // Every minute

// Graceful shutdown with cleanup
process.on('SIGINT', () => {
  console.log('🛑 Shutting down enhanced Socket.IO server...');
  
  // Clean up all rooms and sessions
  roomUsers.clear();
  roomFiles.clear();
  userSessions.clear();
  
  server.close(() => {
    console.log('✅ Enhanced Socket.IO server closed gracefully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down enhanced Socket.IO server...');
  
  // Clean up all rooms and sessions
  roomUsers.clear();
  roomFiles.clear();
  userSessions.clear();
  
  server.close(() => {
    console.log('✅ Enhanced Socket.IO server closed gracefully');
    process.exit(0);
  });
});
