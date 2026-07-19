import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import connectionRoutes from './routes/connection.routes.js';
import errorHandler from './utils/errorHandler.js';
import chatRoutes from './routes/chat.routes.js';

const app = express();

app.use(
  cors({
    origin: [process.env.VITE_API_URL, 'http://localhost:5173', 'http://localhost:5000'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users/connections', connectionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use(errorHandler);

// ─── CREATE HTTP SERVER ───
const httpServer = createServer(app);

// ─── SOCKET.IO SETUP WITH CORS ───
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.VITE_API_URL, 'http://localhost:5173', 'http://localhost:5000'],
    credentials: true,
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'],
});

// ─── SOCKET.IO CONNECTION HANDLERS ───
io.on('connection', (socket) => {
  console.log('🟢 New client connected!');
  console.log('🟢 Socket ID:', socket.id);

  // Send a test message to the client
  socket.emit('test', { message: 'Connection successful!' });

  // Join a chat room
  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
    console.log(`📩 User ${socket.id} joined room: ${chatId}`);
    console.log(`📩 Rooms:`, socket.rooms);
  });

  // Leave a chat room
  socket.on('leave-chat', (chatId) => {
    socket.leave(chatId);
    console.log(`📤 User ${socket.id} left room: ${chatId}`);
  });

  // Handle sending messages
  socket.on('send-message', (data) => {
    const { chatId, message } = data;
    console.log(`📨 Message received for chat ${chatId}:`, message);
    
    // Add server timestamp
    const messageWithTimestamp = {
      ...message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    // Broadcast to everyone in the room (including sender)
    io.to(chatId).emit('new-message', messageWithTimestamp);
    console.log(`📨 Broadcasted message to room ${chatId}`);
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { chatId, isTyping, userId } = data;
    socket.to(chatId).emit('user-typing', { userId, isTyping });
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`🔴 User ${socket.id} disconnected:`, reason);
  });
});

export { app, httpServer };