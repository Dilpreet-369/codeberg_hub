import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile } from "lucide-react";

interface ChatInputComposerProps {
  onSendMessage: (text: string) => void;
  onTyping?: (isTyping: boolean) => void;
}

export const ChatInputComposer: React.FC<ChatInputComposerProps> = ({ 
  onSendMessage,
  onTyping 
}) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
      
      // Stop typing
      if (onTyping) {
        onTyping(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    
    // Handle typing indicator
    if (onTyping) {
      if (value.length > 0) {
        onTyping(true);
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // Set timeout to stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          onTyping(false);
        }, 2000);
      } else {
        onTyping(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2">
      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition p-1">
          <Paperclip className="h-5 w-5" />
        </button>
        
        {/* Emoji button */}
        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition p-1">
          <Smile className="h-5 w-5" />
        </button>

        {/* Message input */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full resize-none bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500/50 transition max-h-30 min-h-10"
            rows={1}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className={`p-2 rounded-full transition ${
            message.trim()
              ? 'bg-indigo-500 text-white hover:bg-indigo-600'
              : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed'
          }`}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};