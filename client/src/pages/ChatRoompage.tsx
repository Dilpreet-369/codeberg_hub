// ChatRoomPage.tsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MoreVertical, Video, Loader2 } from "lucide-react";
import { ChatMessage, Message } from "../components/chatroompage/ChatMessage";
import { ChatInputComposer } from "../components/chatroompage/ChatInputComposer";

interface ChatPartner {
  fullname: string;
  status: string;
  avatar: string;
  badge?: "open-to-work" | "hiring" | "none";
}

const ChatRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ─── STATE MANAGEMENT ───
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatUser, setChatUser] = useState<ChatPartner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ─── FETCH EFFECT PIPELINE ───
  useEffect(() => {
    const loadConversationDetails = async () => {
      try {
        setLoading(true);
        // TODO: Load conversation partner detail and dynamic logs from DB
        // const res = await axios.get(`/api/messages/room/${chatId}`, { withCredentials: true });
        // if (res.data?.success) {
        //   setMessages(res.data.messages);
        //   setChatUser(res.data.partner);
        // }
      } catch (err) {
        console.error("Failed to load chat parameters:", err);
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      loadConversationDetails();
    }
  }, [chatId]);

  // Keep the viewport locked to the latest entry updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handler for sending messages
  const handleSendMessage = (text: string) => {
    const tempMsgObj: Message = {
      id: `msg_${Date.now()}`,
      senderId: "me", // Corresponds to logged-in profile ID
      senderName: "Me",
      senderAvatar: "",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text,
      type: "text"
    };

    // Emit socket.io package or send POST request here
    setMessages((prev) => [...prev, tempMsgObj]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased max-w-md mx-auto border-x border-zinc-200 dark:border-zinc-800 flex flex-col h-screen overflow-hidden">
      
      {/* ─── HEADER AREA ─── */}
      <header className="flex items-center justify-between px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition cursor-pointer"
          >
            <ArrowLeft className="h-6 w-6 stroke-[1.8]" />
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-base font-semibold leading-tight tracking-wide text-zinc-900 dark:text-zinc-100">
              {chatUser?.fullname || "Conversation"}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {chatUser?.status || "Active Now"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
          <button className="p-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition cursor-pointer">
            <MoreVertical className="h-5 w-5" />
          </button>
          <button className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:text-zinc-900 dark:hover:text-zinc-100 transition cursor-pointer">
            <Video className="h-5 w-5 stroke-[1.8]" />
          </button>
        </div>
      </header>

      {/* ─── MESSAGES VIEWPORT STREAM ─── */}
      <main className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-white dark:bg-zinc-950 flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            <p className="text-xs">Streaming logs...</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <ChatMessage key={msg.id} msg={msg} />
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-zinc-400">
            <p className="text-sm font-medium">This is the start of your peer history.</p>
            <p className="text-xs text-zinc-500 mt-1">Send an invitation or say hello!</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* ─── CHAT FOOTER COMPOSER FIELD ─── */}
      <ChatInputComposer onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatRoomPage;