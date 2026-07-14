import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  MoreVertical, 
  SquarePen, 
  Search, 
  SlidersHorizontal 
} from "lucide-react";

// ─── CHAT CONVERSATION THREAD INTERFACE ───
interface ChatThread {
  id: string;
  fullname: string;
  avatar: string;
  badge?: "open-to-work" | "hiring" | "none";
  isOnline: boolean;
  lastMessage: string;
  isSenderMe: boolean;
  isInMail?: boolean;
  timestamp: string;
  unreadCount?: number;
}

const ChatInboxPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // ─── MOCK DATA INSPIRED EXACTLY BY THE LAYOUT IMAGE ───
  const [threads] = useState<ChatThread[]>([
    {
      id: "chat_1",
      fullname: "Stuart Arnold",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      badge: "open-to-work",
      isOnline: false,
      lastMessage: "Of course send your mail",
      isSenderMe: false,
      timestamp: "10:07 AM",
      unreadCount: 1,
    },
    {
      id: "chat_2",
      fullname: "Thomas Simmons",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      badge: "hiring",
      isOnline: false,
      lastMessage: "OK",
      isSenderMe: true,
      timestamp: "Sat",
    },
    {
      id: "chat_3",
      fullname: "Sandra Hernandez",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      badge: "none",
      isOnline: true,
      lastMessage: "I plunged headlong into QA",
      isSenderMe: true,
      timestamp: "Fri",
    },
    {
      id: "chat_4",
      fullname: "Ray Willis",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      badge: "none",
      isOnline: true,
      lastMessage: "I'll be able to read it later",
      isSenderMe: true,
      timestamp: "Wed",
    },
    {
      id: "chat_5",
      fullname: "Mary Newman",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      badge: "open-to-work",
      isOnline: false,
      lastMessage: "Hi, there is a suggestion",
      isSenderMe: false,
      isInMail: true,
      timestamp: "Tue",
    },
    {
      id: "chat_6",
      fullname: "Sidney Snyder",
      avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80",
      badge: "none",
      isOnline: false,
      lastMessage: "That's how linkedin works))",
      isSenderMe: false,
      timestamp: "Sun",
    },
    {
      id: "chat_7",
      fullname: "Michael Dixon",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
      badge: "hiring",
      isOnline: true,
      lastMessage: "OK",
      isSenderMe: true,
      timestamp: "Sun",
    },
    {
      id: "chat_8",
      fullname: "Joe Howard",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
      badge: "none",
      isOnline: false,
      lastMessage: "👍",
      isSenderMe: false,
      timestamp: "Oct 9",
    },
    {
      id: "chat_9",
      fullname: "Frederick White",
      avatar: "https://images.unsplash.com/photo-15Charity?auto=format&fit=crop&w=150&q=80",
      badge: "none",
      isOnline: true,
      lastMessage: "Thank you for confirming my...",
      isSenderMe: true,
      timestamp: "Oct 6",
    }
  ]);

  // Filter messages dynamically on user search inputs
  const filteredThreads = threads.filter(thread => 
    thread.fullname.toLowerCase().includes(searchQuery.toLowerCase()) || 
    thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased max-w-md mx-auto border-x border-zinc-200 dark:border-zinc-800 flex flex-col">
      
      {/* ─── APP TOP NAV BAR BAR ─── */}
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

      {/* ─── CHAT CONVERSATION STREAM SCROLL WINDOW ─── */}
      <main className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
        {filteredThreads.length > 0 ? (
          filteredThreads.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/messages/${chat.id}`)}
              className="flex items-start gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition select-none"
            >
              
              {/* AVATAR WRAPPER CARD CONTAINING DYNAMIC STYLED BADGES */}
              <div className="relative shrink-0">
                <div className="relative h-14 w-14 rounded-full overflow-hidden border border-zinc-200/60 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800">
                  <img 
                    src={chat.avatar} 
                    alt={chat.fullname}
                    className="h-full w-full object-cover" 
                    onError={(e) => {
                      // Fallback profile avatar fallback render
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${chat.fullname}`;
                    }}
                  />
                </div>
                
                {/* Dynamic Overlap Frames for Open-To-Work / Hiring rings */}
                {chat.badge === "open-to-work" && (
                  <div className="absolute inset-0 rounded-full border-[2.5px] border-emerald-500 pointer-events-none mix-blend-normal" />
                )}
                {chat.badge === "hiring" && (
                  <div className="absolute inset-0 rounded-full border-[2.5px] border-purple-600 pointer-events-none mix-blend-normal" />
                )}

                {/* Online Indicator Dot Badge */}
                {chat.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-600 border-2 border-white dark:border-zinc-950" />
                )}
              </div>

              {/* MESSAGE CONTENT CLOUD DESCRIPTIONS */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100 truncate pr-2">
                    {chat.fullname}
                  </h3>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0 whitespace-nowrap">
                    {chat.timestamp}
                  </span>
                </div>

                <p className={`text-sm truncate ${chat.unreadCount ? "font-semibold text-zinc-950 dark:text-white" : "text-zinc-600 dark:text-zinc-400"}`}>
                  {chat.isInMail && (
                    <span className="font-bold text-zinc-900 dark:text-zinc-200 mr-1">InMail •</span>
                  )}
                  {chat.isSenderMe && <span className="text-zinc-400 dark:text-zinc-500 mr-1">You:</span>}
                  {chat.lastMessage}
                </p>
              </div>

              {/* UNREAD UNREAD MESSAGES NOTIFICATION DOT BADGES */}
              {chat.unreadCount && chat.unreadCount > 0 && (
                <div className="shrink-0 self-center pl-1">
                  <span className="flex items-center justify-center h-4 w-4 rounded-full bg-sky-600 text-[10px] font-bold text-white shadow-sm">
                    {chat.unreadCount}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-400 dark:text-zinc-500">
            <p className="text-sm font-medium">No messages found matching search keys.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatInboxPage;