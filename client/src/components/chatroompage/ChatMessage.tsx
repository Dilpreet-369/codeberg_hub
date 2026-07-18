// components/chatroom/ChatMessage.tsx
import React from "react";
import { VideoIcon } from "lucide-react";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  text?: string;
  type: "text" | "meeting_card" | "system";
  meetingTitle?: string;
}

interface ChatMessageProps {
  msg: Message;
  isCurrentUser: boolean; // ← Add this prop
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ msg, isCurrentUser }) => {
  // System Notification Block Type
  if (msg.type === "system") {
    return (
      <div className="flex justify-center text-xs text-zinc-500 dark:text-zinc-400 select-none">
        <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
          {msg.text}{" "}
          <button className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline bg-transparent border-none cursor-pointer">
            Join
          </button>
        </span>
      </div>
    );
  }

  // ─── Determine alignment based on sender ───
  const alignment = isCurrentUser ? "items-end" : "items-start";
  const bubbleColor = isCurrentUser 
    ? "bg-indigo-500 dark:bg-indigo-600 text-white rounded-2xl rounded-tr-none" 
    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-2xl rounded-tl-none";
  const nameColor = isCurrentUser 
    ? "text-indigo-400 dark:text-indigo-300" 
    : "text-zinc-600 dark:text-zinc-400";

  // Active Peer Conversation Bubble
  return (
    <div className={`flex flex-col gap-0.5 max-w-[85%] ${alignment}`}>
      {/* Sender name */}
      <span className={`text-xs font-semibold ${nameColor} ${isCurrentUser ? 'mr-1' : 'ml-1'}`}>
        {isCurrentUser ? "You" : msg.senderName}
      </span>
      
      {/* Message bubble with timestamp */}
      <div className="relative group">
        {/* Main message bubble */}
        <div className={`${bubbleColor} px-4 py-2.5 shadow-sm`}>
          {msg.type === "meeting_card" ? (
            <div className="flex items-center gap-3">
              <div className={`${isCurrentUser ? 'bg-white/20' : 'bg-black/5 dark:bg-white/10'} p-2 rounded-lg`}>
                <VideoIcon className="h-5 w-5 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-sm font-bold">{msg.meetingTitle}</h4>
                <button className={`text-xs font-semibold ${isCurrentUser ? 'text-white/90 hover:text-white' : 'text-indigo-600 dark:text-indigo-400 hover:underline'} bg-transparent border-none cursor-pointer`}>
                  Join meeting →
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[15px] leading-relaxed font-normal">
              {msg.text}
            </p>
          )}
        </div>
        
        {/* Timestamp - positioned below */}
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mt-0.5`}>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 px-1">
            {msg.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
};