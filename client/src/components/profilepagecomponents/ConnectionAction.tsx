// components/ConnectionActions.tsx
import { Loader2, UserPlus, Clock, Check, X, MessageSquare } from "lucide-react";

interface ActionProps {
  status: "none" | "pending" | "accepted" | "rejected";
  isSender: boolean;
  loading: boolean;
  onConnect: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onMessage: () => void;
}

export const ConnectionActions = ({ status, isSender, loading, onConnect, onAccept, onDecline, onMessage }: ActionProps) => {
  if (status === "none") return (
    <button onClick={onConnect} disabled={loading} className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 flex items-center justify-center gap-1.5">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Connect
    </button>
  );
  
  if (status === "pending" && isSender) return (
    <button disabled className="flex-1 py-2 px-4 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center gap-1.5">
      <Clock className="h-4 w-4" /> Request Pending
    </button>
  );

  if (status === "pending" && !isSender) return (
    <div className="flex gap-2 w-full">
      <button onClick={onAccept} disabled={loading} className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-full hover:bg-emerald-700 flex items-center justify-center gap-1.5">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Accept
      </button>
      <button onClick={onDecline} disabled={loading} className="flex-1 bg-red-600/10 text-red-600 py-2 px-4 rounded-full hover:bg-red-600/20 flex items-center justify-center gap-1.5">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />} Decline
      </button>
    </div>
  );

  if (status === "accepted") return (
    <button onClick={onMessage} className="flex-1 bg-zinc-900 text-white py-2 px-4 rounded-full hover:bg-zinc-800 flex items-center justify-center gap-1.5">
      <MessageSquare className="h-4 w-4" /> Send Message
    </button>
  );

  return null;
};