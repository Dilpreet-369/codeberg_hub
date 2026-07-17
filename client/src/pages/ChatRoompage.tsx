import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ChatMessage, Message } from "../components/chatroompage/ChatMessage";
import { ChatInputComposer } from "../components/chatroompage/ChatInputComposer";

interface ChatPartner {
  fullname: string;
  status: string;
  avatar: string;
}

const ChatRoomPage: React.FC = () => {
  const navigate = useNavigate();
  // Change this line:
  const { ChatId } = useParams<{ ChatId: string }>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatUser, setChatUser] = useState<ChatPartner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ─── FETCH EFFECT PIPELINE ───
  useEffect(() => {
    const loadConversationDetails = async () => {
      try {
        setLoading(true);
        // console.log("Fetching chat details for chatId:", ChatId);

        const res = await axios.get(`/chat/room/${ChatId}`, {
          withCredentials: true,
        });

        // console.log("Full API response:", res);
        // console.log("Response data:", res.data);

        if (res.data?.success) {
          // console.log("Messages received:", res.data.messages);
          // console.log("Partner info:", res.data.partner);
          setMessages(res.data.messages || []);
          setChatUser(res.data.partner);
        } else {
          console.error("API returned success: false", res.data);
          // Even if success is false, we should still show the empty state
          setMessages([]);
        }
      } catch (err: any) {
        // console.error("Failed to load chat logs:", err);
        // console.error("Error response:", err.response?.data);
        // console.error("Error status:", err.response?.status);
        // Set empty state on error so user can see something
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    if (ChatId) {
      loadConversationDetails();
    }
  }, [ChatId]);

  // Keep the viewport locked to the latest entry updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── HANDLER FOR SENDING MESSAGES ───
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    try {
      // POST the text message straight to the DB
      const res = await axios.post(
        "/chat/send",
        { chatId: ChatId, text },
        { withCredentials: true },
      );

      if (res.data?.success) {
        // Instantly append the clean, saved message returned from the backend
        // In ChatRoomPage.tsx
        setMessages(
          res.data.messages.map((msg) => ({
            ...msg,
            id: msg._id || msg.id,
            timestamp:
              msg.timestamp || new Date(msg.createdAt).toLocaleTimeString(),
          })),
        );
      }
    } catch (err) {
      console.error("Could not deliver message to DB:", err);
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

        <div className="flex flex-col">
          <h1 className="text-base font-semibold leading-none tracking-wide text-zinc-900 dark:text-zinc-100">
            {chatUser?.fullname || "Conversation"}
          </h1>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {chatUser?.status || "Active Now"}
          </span>
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
          messages.map((msg) => <ChatMessage key={msg.id} msg={msg} />)
        ) : (
          /* Empty State: Shows up beautifully if no messages have been sent yet */
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-zinc-400">
            <p className="text-sm font-medium">
              This is the start of your peer history.
            </p>
            <p className="text-xs text-zinc-500 mt-1">Say hello!</p>
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
