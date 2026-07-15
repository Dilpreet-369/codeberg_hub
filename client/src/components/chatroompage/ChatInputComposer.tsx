// components/chatroom/ChatInputComposer.tsx
import React, { useState } from "react";
import { Plus, Mic, SendHorizontal } from "lucide-react";

interface ChatInputComposerProps {
  onSendMessage: (text: string) => void;
}

export const ChatInputComposer: React.FC<ChatInputComposerProps> = ({ onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage.trim());
    setNewMessage("");
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/60 p-3 sticky bottom-0 z-50">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Attachment Options */}
        <button 
          type="button" 
          className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition cursor-pointer"
        >
          <Plus className="h-5 w-5 stroke-[1.8]" />
        </button>

        {/* Input Text Container */}
        <div className="flex-1 relative flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-1.5 border border-zinc-200/40 dark:border-transparent">
          <input
            type="text"
            placeholder="Write a message ..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-500 pr-1"
          />
        </div>

        {/* Dynamic Action Trigger: Send or Microphones */}
        {newMessage.trim() ? (
          <button 
            type="submit" 
            className="p-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-sm border-none cursor-pointer"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        ) : (
          <button 
            type="button" 
            className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition cursor-pointer"
          >
            <Mic className="h-5 w-5 stroke-[1.8]" />
          </button>
        )}
      </form>
    </footer>
  );
};