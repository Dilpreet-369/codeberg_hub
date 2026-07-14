import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MoreVertical,
  Video,
  Plus,
  Mic,
  SendHorizontal,
  VideoIcon
} from "lucide-react";

// ─── CHAT ROOM DATA INTERFACES ───
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderBadge?: "open-to-work" | "hiring" | "none";
  timestamp: string;
  text?: string;
  type: "text" | "meeting_card" | "system";
  meetingTitle?: string;
}

const ChatRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [newMessage, setNewMessage] = useState("");
  
  // User identity definitions (Yuri Dud is current logged-in user, Timothy is target user)
  const loggedInUser = {
    id: "user_yuri",
    fullname: "Yuri Dud",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    badge: "open-to-work" as const
  };

  const [chatUser] = useState({
    fullname: "Timothy Hodges",
    status: "Mobile • 2m ago",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    badge: "hiring" as const
  });

  // ─── MOCK MESSAGE DB POPULATED EXACTLY FROM YOUR IMAGE ───
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg_1",
      senderId: "user_timothy",
      senderName: "Timothy Hodges",
      senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      senderBadge: "hiring",
      timestamp: "6:55 PM",
      text: "Your CV seemed interesting.",
      type: "text"
    },
    {
      id: "msg_2",
      senderId: "user_yuri",
      senderName: "Yuri Dud",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      senderBadge: "open-to-work",
      timestamp: "7:00 PM",
      text: "Okay, let's call and discuss this in more detail, I want to clarify whether I understood you correctly.",
      type: "text"
    },
    {
      id: "msg_3",
      senderId: "user_timothy",
      senderName: "Timothy Hodges",
      senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      senderBadge: "hiring",
      timestamp: "7:05 PM",
      text: "Ok, no problem.",
      type: "text"
    },
    {
      id: "msg_4",
      senderId: "user_yuri",
      senderName: "Yuri Dud",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      senderBadge: "open-to-work",
      timestamp: "7:08 PM",
      type: "meeting_card",
      meetingTitle: "Yuri meeting"
    },
    {
      id: "msg_system_1",
      senderId: "system",
      senderName: "System",
      senderAvatar: "",
      timestamp: "",
      text: "Timothy Hodges joined the video meeting.",
      type: "system"
    },
    {
      id: "msg_5",
      senderId: "user_timothy",
      senderName: "Timothy Hodges",
      senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      senderBadge: "hiring",
      timestamp: "7:23 PM",
      text: "Ok?",
      type: "text"
    },
    {
      id: "msg_6",
      senderId: "user_yuri",
      senderName: "Yuri Dud",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      senderBadge: "open-to-work",
      timestamp: "7:37 PM",
      text: "It will take me some time to make a decision.",
      type: "text"
    },
    {
      id: "msg_7",
      senderId: "user_timothy",
      senderName: "Timothy Hodges",
      senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      senderBadge: "hiring",
      timestamp: "7:37 PM",
      text: "Okay see you tomorrow.",
      type: "text"
    }
  ]);

  // Autoscroll logic on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsgObj: Message = {
      id: `msg_${Date.now()}`,
      senderId: loggedInUser.id,
      senderName: loggedInUser.fullname,
      senderAvatar: loggedInUser.avatar,
      senderBadge: loggedInUser.badge,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: newMessage,
      type: "text"
    };

    setMessages((prev) => [...prev, newMsgObj]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased max-w-md mx-auto border-x border-zinc-200 dark:border-zinc-800 flex flex-col h-screen overflow-hidden">
      
      {/* ─── HEADER AREA ─── */}
      <header className="flex items-center justify-between px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
          >
            <ArrowLeft className="h-6 w-6 stroke-[1.8]" />
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-base font-semibold leading-tight tracking-wide text-zinc-900 dark:text-zinc-100">
              {chatUser.fullname}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {chatUser.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
          <button className="p-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
            <MoreVertical className="h-5 w-5" />
          </button>
          <button className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:text-zinc-900 dark:hover:text-zinc-100 transition">
            <Video className="h-5 w-5 stroke-[1.8]" />
          </button>
        </div>
      </header>

      {/* ─── MESSAGES VIEWPORT STREAM ─── */}
      <main className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-white dark:bg-zinc-950">
        
        {messages.map((msg) => {
          // Render Logic: 1. System Notification Updates
          if (msg.type === "system") {
            return (
              <div key={msg.id} className="flex justify-start pl-14 text-xs text-zinc-500 dark:text-zinc-400 select-none">
                <span>
                  {msg.text}{" "}
                  <button className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline bg-transparent border-none cursor-pointer">
                    Join
                  </button>
                </span>
              </div>
            );
          }

          // Render Logic: 2. Core User Conversations
          return (
            <div key={msg.id} className="flex gap-3 items-start">
              
              {/* Profile image with custom border system */}
              <div className="relative shrink-0">
                <div className="h-10 w-10 rounded-full overflow-hidden border border-zinc-200/60 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800">
                  <img 
                    src={msg.senderAvatar} 
                    alt={msg.senderName} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                {msg.senderBadge === "open-to-work" && (
                  <div className="absolute inset-0 rounded-full border-[1.5px] border-emerald-500 pointer-events-none" />
                )}
                {msg.senderBadge === "hiring" && (
                  <div className="absolute inset-0 rounded-full border-[1.5px] border-purple-600 pointer-events-none" />
                )}
              </div>

              {/* Message Context */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                    • {msg.timestamp}
                  </span>
                </div>

                {/* Content switching based on block type */}
                {msg.type === "meeting_card" ? (
                  <div className="max-w-70 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-xl overflow-hidden shadow-sm flex mt-1">
                    <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/40 flex items-center justify-center border-r border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                      <VideoIcon className="h-5 w-5 stroke-[1.8]" />
                    </div>
                    <div className="p-3 flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {msg.meetingTitle}
                      </h4>
                      <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-1 bg-transparent border-none cursor-pointer self-start">
                        Join video meeting
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[14px] text-zinc-800 dark:text-zinc-200 leading-relaxed font-light mt-0.5 wrap-break-word">
                    {msg.text}
                  </p>
                )}
              </div>

            </div>
          );
        })}

        {/* Dummy div to target bottom focus shifts */}
        <div ref={messagesEndRef} />
      </main>

      {/* ─── CHAT FOOTER COMPOSER FIELD ─── */}
      <footer className="border-t border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/60 p-3 sticky bottom-0 z-50">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          
          {/* Action: Add attachment block */}
          <button 
            type="button" 
            className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition"
          >
            <Plus className="h-5 w-5 stroke-[1.8]" />
          </button>

          {/* Interactive core input layout */}
          <div className="flex-1 relative flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-1.5 border border-zinc-200/40 dark:border-transparent">
            <input
              type="text"
              placeholder="Write a message ..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none text-zinc-800 dark:text-zinc-150 placeholder-zinc-500 pr-1"
            />
          </div>

          {/* Dynamic Action Trigger: Send or Microphone Record */}
          {newMessage.trim() ? (
            <button 
              type="submit" 
              className="p-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-sm border-none cursor-pointer"
            >
              <SendHorizontal className="h-4.5 w-4.5" />
            </button>
          ) : (
            <button 
              type="button" 
              className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition"
            >
              <Mic className="h-5 w-5 stroke-[1.8]" />
            </button>
          )}

        </form>
      </footer>
    </div>
  );
};

export default ChatRoomPage;