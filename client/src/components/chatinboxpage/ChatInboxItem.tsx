// components/InboxChatItem.tsx
import React from "react";
import { User } from "lucide-react"; // Imported standard profile placeholder

export interface ChatThread {
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

interface InboxChatItemProps {
  chat: ChatThread;
  onClick: () => void;
}

export const InboxChatItem: React.FC<InboxChatItemProps> = ({ chat, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-start gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition select-none"
    >
      {/* AVATAR WRAPPER CARD CONTAINING DYNAMIC STYLED BADGES */}
      <div className="relative shrink-0">
        <div className="relative h-14 w-14 rounded-full overflow-hidden border border-zinc-200/60 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <User className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
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

      {/* UNREAD MESSAGES NOTIFICATION DOT BADGES */}
      {chat.unreadCount && chat.unreadCount > 0 ? (
        <div className="shrink-0 self-center pl-1">
          <span className="flex items-center justify-center h-4 w-4 rounded-full bg-sky-600 text-[10px] font-bold text-white shadow-sm">
            {chat.unreadCount}
          </span>
        </div>
      ) : null}
    </div>
  );
};