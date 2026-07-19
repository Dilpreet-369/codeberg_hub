import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendMessage: (data: { chatId: string; message: any }) => void;
  sendTyping: (data: { chatId: string; isTyping: boolean; userId: string }) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinChat: () => {},
  leaveChat: () => {},
  sendMessage: () => {},
  sendTyping: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // ─── REMOVE /api FROM THE URL ───
    const SOCKET_URL = 'http://localhost:5000'; // Hardcode for now
    
    console.log('🔌 Connecting to Socket.io at:', SOCKET_URL);

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected successfully!');
      console.log('Socket ID:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      console.error('Error details:', error.message);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
    });

    setSocket(newSocket);

    return () => {
      console.log('🧹 Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, []);

  const joinChat = (chatId: string) => {
    if (socket && isConnected) {
      console.log(`📩 Joining chat room: ${chatId}`);
      socket.emit('join-chat', chatId);
    } else {
      console.warn('⚠️ Cannot join chat - socket not connected');
    }
  };

  const leaveChat = (chatId: string) => {
    if (socket && isConnected) {
      console.log(`📤 Leaving chat room: ${chatId}`);
      socket.emit('leave-chat', chatId);
    }
  };

  const sendMessage = (data: { chatId: string; message: any }) => {
    if (socket && isConnected) {
      console.log(`📨 Sending message to chat:`, data.chatId);
      socket.emit('send-message', data);
    } else {
      console.warn('⚠️ Cannot send message - socket not connected');
    }
  };

  const sendTyping = (data: { chatId: string; isTyping: boolean; userId: string }) => {
    if (socket && isConnected) {
      socket.emit('typing', data);
    }
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      isConnected, 
      joinChat, 
      leaveChat, 
      sendMessage,
      sendTyping
    }}>
      {children}
    </SocketContext.Provider>
  );
};