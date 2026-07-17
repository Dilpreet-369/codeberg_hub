// ChatInboxPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  MoreVertical,
  SquarePen,
  Search,
  SlidersHorizontal,
  Loader2,
  MessageSquareOff,
} from "lucide-react";
import {
  InboxChatItem,
  ChatThread,
} from "../components/chatinboxpage/ChatInboxItem";

const ChatInboxPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // ─── STATE MANAGEMENT ───
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ─── FETCH REAL CHAT CONVERSATIONS ───
  // Inside ChatInboxPage.tsx (Update the useEffect block)
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Axios requests your new controller endpoint
        const res = await axios.get("/users/connections/list", {
          withCredentials: true,
        });
        if (res.data?.success) {
          setThreads(res.data.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch chat inbox threads:", err);
        setError(err.response?.data?.message || "Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleUserClick = async (targetUserId: string) => {
    try {
      // Hits the new Find-or-Create backend controller endpoint
      const res = await axios.post(
        "/chat/room",
        { targetUserId },
        { withCredentials: true },
      );

      if (res.data?.success) {
        // Safely redirects to the permanent chatroom ID returned by the database
        navigate(`/messages/${res.data.chatId}`);
      }
    } catch (err) {
      console.error("Could not open chat room:", err);
    }
  };

  // Filter messages dynamically based on user search inputs
  const filteredThreads = threads.filter(
    (thread) =>
      thread.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased max-w-md mx-auto border-x border-zinc-200 dark:border-zinc-800 flex flex-col">
      {/* ─── APP TOP NAV BAR ─── */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
          >
            <ArrowLeft className="h-6 w-6 stroke-[1.8]" />
          </button>
          <h1 className="text-xl font-medium tracking-wide">Messaging</h1>
        </div>
        <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400">
          <button className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">
            <MoreVertical className="h-5 w-5" />
          </button>
          <button className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">
            <SquarePen className="h-5 w-5 stroke-[1.8]" />
          </button>
        </div>
      </header>

      {/* ─── SEARCH & FILTER UTILITY LAYER ─── */}
      <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-800 border border-transparent rounded focus:outline-none focus:bg-white focus:border-indigo-500 dark:focus:bg-zinc-800 transition text-zinc-800 dark:text-zinc-200 placeholder-zinc-500"
          />
        </div>
        <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
          <SlidersHorizontal className="h-5 w-5 stroke-[1.8]" />
        </button>
      </div>

      {/* ─── CHAT CONVERSATION STREAM LIST ─── */}
      <main className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60 flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-zinc-400 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            <p className="text-xs font-medium tracking-wide">
              Syncing inbox feed...
            </p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-red-500 gap-2">
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : filteredThreads.length > 0 ? (
          filteredThreads.map((chat) => (
            <InboxChatItem
              key={chat.id}
              chat={chat}
              onClick={() => handleUserClick(chat.id)}
            />
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-zinc-400 dark:text-zinc-500 gap-3">
            <MessageSquareOff className="h-10 w-10 text-zinc-300 dark:text-zinc-700 stroke-[1.5]" />
            <div>
              <p className="text-sm font-medium">No conversations found</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                {searchQuery
                  ? "Try searching for another name"
                  : "Your inbox is currently clear!"}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatInboxPage;
