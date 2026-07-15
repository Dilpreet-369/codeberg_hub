// components/chatroom/ChatMessage.tsx
import React from "react";
import { VideoIcon } from "lucide-react";

export interface Message {
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

interface ChatMessageProps {
  msg: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ msg }) => {
  // System Notification Block Type
  if (msg.type === "system") {
    return (
      <div className="flex justify-start pl-14 text-xs text-zinc-500 dark:text-zinc-400 select-none">
        <span>
          {msg.text}{" "}
          <button className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline bg-transparent border-none cursor-pointer">
            Join
          </button>
        </span>
      </div>
    );
  }

  // Active Peer Conversation Bubble
  return (
    <div className="flex gap-3 items-start">
      {/* Profile image with custom status rings */}
      <div className="relative shrink-0">
        <div className="h-10 w-10 rounded-full overflow-hidden border border-zinc-200/60 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800">
          <img 
            src={msg.senderAvatar} 
            alt={msg.senderName} 
            className="h-full w-full object-cover" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${msg.senderName}`;
            }}
          />
        </div>
        {msg.senderBadge === "open-to-work" && (
          <div className="absolute inset-0 rounded-full border-[1.5px] border-emerald-500 pointer-events-none" />
        )}
        {msg.senderBadge === "hiring" && (
          <div className="absolute inset-0 rounded-full border-[1.5px] border-purple-600 pointer-events-none" />
        )}
      </div>

      {/* Message Metadata & Payload */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {msg.senderName}
          </span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
            • {msg.timestamp}
          </span>
        </div>

        {msg.type === "meeting_card" ? (
          <div className="max-w-70 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex mt-1">
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
};