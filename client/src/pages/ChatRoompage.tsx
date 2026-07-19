import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ChatMessage, Message } from "../components/chatroompage/ChatMessage";
import { ChatInputComposer } from "../components/chatroompage/ChatInputComposer";
import { useSocket } from "@/context/SocketContext";

interface ChatPartner {
  fullname: string;
  status: string;
  avatar: string;
}

const ChatRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { ChatId } = useParams<{ ChatId: string }>();
  const { socket, isConnected, joinChat, sendMessage, sendTyping } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // ─── ADD THIS: Ref to prevent duplicate join calls ───
  const hasJoinedRef = useRef(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatUser, setChatUser] = useState<ChatPartner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ─── GET CURRENT USER ───
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await axios.get('/auth/me', { withCredentials: true });
        if (res.data?.success) {
          setCurrentUserId(res.data.user._id);
        }
      } catch (err) {
        console.error('Failed to get current user:', err);
      }
    };
    getCurrentUser();
  }, []);

  // ─── JOIN CHAT ROOM ON MOUNT (WITH hasJoinedRef) ───
  useEffect(() => {
    if (socket && isConnected && ChatId && !hasJoinedRef.current) {
      joinChat(ChatId);
      hasJoinedRef.current = true;
      console.log(`📩 Joined chat room: ${ChatId}`);
    }

    return () => {
      // Cleanup if needed
    };
  }, [socket, isConnected, ChatId, joinChat]);

  // ─── LISTEN FOR NEW MESSAGES ───
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      console.log('📨 New message received:', message);
      // ─── FIX: Check if message already exists to prevent duplicates ───
      setMessages((prev) => {
        // Check if message with this ID already exists
        const exists = prev.some((m) => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
    };

    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== currentUserId) {
        setOtherUserTyping(data.isTyping);
      }
    };

    socket.on('new-message', handleNewMessage);
    socket.on('user-typing', handleUserTyping);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('user-typing', handleUserTyping);
    };
  }, [socket, currentUserId]);

  // ─── FETCH EXISTING MESSAGES ───
  useEffect(() => {
    const loadConversationDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/chat/room/${ChatId}`, {
          withCredentials: true,
        });

        if (res.data?.success) {
          // ─── FIX: Ensure all messages have proper IDs ───
          const formattedMessages = res.data.messages.map((msg: any) => ({
            ...msg,
            id: msg._id || msg.id || `msg-${Date.now()}-${Math.random()}`,
            timestamp: msg.timestamp || new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
          }));
          setMessages(formattedMessages || []);
          setChatUser(res.data.partner);
        } else {
          console.error("API returned success: false", res.data);
          setMessages([]);
        }
      } catch (err: any) {
        console.error("Failed to load chat logs:", err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    if (ChatId) {
      loadConversationDetails();
    }
  }, [ChatId]);

  // ─── AUTO-SCROLL ───
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── HANDLE TYPING ───
  const handleTyping = (isTyping: boolean) => {
    if (isTyping && !isTyping) {
      setIsTyping(true);
      sendTyping({ chatId: ChatId!, isTyping: true, userId: currentUserId });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        sendTyping({ chatId: ChatId!, isTyping: false, userId: currentUserId });
      }, 2000);
    } else {
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      sendTyping({ chatId: ChatId!, isTyping: false, userId: currentUserId });
    }
  };

  // ─── HANDLER FOR SENDING MESSAGES ───
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !ChatId || !currentUserId) return;

    // ─── Generate unique temp ID ───
    const uniqueId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const tempMessage: Message = {
      id: uniqueId,
      senderId: currentUserId,
      senderName: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text,
      type: 'text',
    };

    // Add to UI optimistically
    setMessages((prev) => [...prev, tempMessage]);

    // Send via socket for real-time
    sendMessage({
      chatId: ChatId,
      message: tempMessage,
    });

    handleTyping(false);

    // Save to DB
    try {
      const res = await axios.post(
        "/chat/send",
        { chatId: ChatId, text },
        { withCredentials: true },
      );

      if (res.data?.success && res.data.data) {
        // ─── FIX: Replace temp message with real one from DB ───
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === uniqueId) {
              return {
                ...res.data.data,
                id: res.data.data._id || res.data.data.id || `msg-${Date.now()}`,
                timestamp: res.data.data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
            }
            return msg;
          })
        );
      }
    } catch (err: any) {
      console.error("Could not deliver message to DB:", err);
      // ─── FIX: Remove temp message on failure ───
      setMessages((prev) => prev.filter((msg) => msg.id !== uniqueId));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased max-w-md mx-auto border-x border-zinc-200 dark:border-zinc-800 flex flex-col h-screen overflow-hidden">
      {/* ─── HEADER AREA ─── */}
      <header className="flex items-center gap-3 px-3 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition cursor-pointer"
        >
          <ArrowLeft className="h-6 w-6 stroke-[1.8]" />
        </button>

        <div className="flex flex-col flex-1">
          <h1 className="text-base font-semibold leading-none tracking-wide text-zinc-900 dark:text-zinc-100">
            {chatUser?.fullname || "Conversation"}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {isConnected ? '🟢 Online' : chatUser?.status || "Active Now"}
            </span>
            {otherUserTyping && (
              <span className="text-xs text-indigo-500 animate-pulse">
                • typing...
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ─── MESSAGES VIEWPORT ─── */}
      <main className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-white dark:bg-zinc-950 flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            <p className="text-xs">Loading messages...</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              msg={msg} 
              isCurrentUser={msg.senderId === currentUserId} 
            />
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-zinc-400">
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs text-zinc-500 mt-1">Say hello! 👋</p>
          </div>
        )}
        
        {otherUserTyping && (
          <div className="flex items-start gap-2 text-zinc-500">
            <span className="text-sm">{chatUser?.fullname || 'User'}</span>
            <span className="text-xs">is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* ─── CHAT INPUT ─── */}
      <ChatInputComposer 
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
      />
    </div>
  );
};

export default ChatRoomPage;