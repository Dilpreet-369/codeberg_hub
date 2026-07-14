import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserPlus,
  Check,
  X,
  Users,
  Building,
  Hash,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── DEFINED TYPES (Sourced Dynamically from the populated database) ───
interface DBUser {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  workOrStudy?: string;
  bio?: string;
}

interface ConnectionInvitation {
  _id: string; // The connection document's ID
  sender: DBUser; // Hydrated sender data
  status: "pending";
  createdAt: string;
}

interface Suggestion {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bannerBg: string;
  mutualCount: number;
  mutualAvatars: string[];
}

type TabType = "people" | "groups" | "companies" | "hashtags";

const NetworkPage = () => {
  const navigate = useNavigate();

  // ─── API CONTEXT STATES ───
  const [invitations, setInvitations] = useState<ConnectionInvitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState<boolean>(true);
  const [actionIdLoading, setActionIdLoading] = useState<string | null>(null); // Tracks which invitation row is processing

  // Keeping hardcoded suggestions for standard layout feed
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "sug-1",
      name: "Henry Chesky",
      role: "Recruiter | Helping healthcare professionals scale up",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      bannerBg: "bg-gradient-to-r from-purple-500 to-indigo-500",
      mutualCount: 34,
      mutualAvatars: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&auto=format&fit=crop&q=60",
      ],
    },
    {
      id: "sug-2",
      name: "Stephanie Heinert",
      role: "Recruiting at Stripe - we're Hiring!",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      bannerBg: "bg-gradient-to-r from-orange-400 to-amber-500",
      mutualCount: 9,
      mutualAvatars: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=60",
      ],
    },
  ]);

  const [activeTab, setActiveTab] = useState<TabType>("people");
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [showAllInvitations, setShowAllInvitations] = useState(false);

  // ─── 1. FETCH REAL PENDING INVITATIONS ON MOUNT ───
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setLoadingInvitations(true);
        const res = await axios.get("/users/connections/pending", {
          withCredentials: true,
        });
        if (res.data?.success) {
          setInvitations(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch incoming connection invitations:", err);
      } finally {
        setLoadingInvitations(false);
      }
    };

    fetchInvitations();
  }, []);

  // ─── 2. ACTION: ACCEPT REAL CONNECTION REQUEST ───
  const handleAcceptInvitation = async (connectionId: string) => {
    try {
      setActionIdLoading(connectionId);
      const res = await axios.put(
        `/users/connections/accept/${connectionId}`,
        {},
        { withCredentials: true }
      );
      if (res.data?.success) {
        // Remove item instantly from local array upon success
        setInvitations((prev) => prev.filter((inv) => inv._id !== connectionId));
      }
    } catch (err) {
      console.error("Failed to accept invitation:", err);
    } finally {
      setActionIdLoading(null);
    }
  };

  // ─── 3. ACTION: DECLINE/IGNORE REAL CONNECTION REQUEST ───
  const handleIgnoreInvitation = async (connectionId: string) => {
    try {
      setActionIdLoading(connectionId);
      const res = await axios.put(
        `/users/connections/reject/${connectionId}`,
        {},
        { withCredentials: true }
      );
      if (res.data?.success) {
        // Remove item instantly from local array upon success
        setInvitations((prev) => prev.filter((inv) => inv._id !== connectionId));
      }
    } catch (err) {
      console.error("Failed to reject invitation:", err);
    } finally {
      setActionIdLoading(null);
    }
  };

  const toggleConnect = (id: string) => {
    setConnectedIds((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 py-6 px-4 antialiased font-sans transition-colors duration-200">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
            Network
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* ─── SECTION 1: DYNAMIC INVITATIONS CARD ─── */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60">
            <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              Invitations ({invitations.length})
            </h2>
            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline bg-transparent border-none cursor-pointer">
              Manage all
            </button>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {loadingInvitations ? (
              <div className="p-8 flex justify-center items-center">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
              </div>
            ) : invitations.length === 0 ? (
              <p className="text-xs text-zinc-500 p-6 text-center">
                No pending invitations
              </p>
            ) : (
              (showAllInvitations ? invitations : invitations.slice(0, 3)).map(
                (inv) => (
                  <div
                    key={inv._id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/40 dark:hover:bg-zinc-800/10 transition"
                  >
                    {/* User Identity Details Card Block */}
                    <div 
                      onClick={() => navigate(`/profile/${inv.sender.username}`)}
                      className="flex items-center gap-3.5 cursor-pointer group"
                    >
                      {/* Avatar container */}
                      <div className="h-14 w-14 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 shadow-xs shrink-0">
                        <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                          {inv.sender.fullname.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate leading-snug transition">
                          {inv.sender.fullname}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                          @{inv.sender.username}
                        </p>
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {inv.sender.workOrStudy || inv.sender.bio || "Member of Developer Ecosystem"}
                        </p>
                      </div>
                    </div>

                    {/* ─── DYNAMIC ACCEPT & REJECT BUTTONS ─── */}
                    <div className="flex items-center justify-end gap-3 shrink-0 self-end sm:self-center">
                      <button
                        disabled={actionIdLoading !== null}
                        onClick={() => handleIgnoreInvitation(inv._id)}
                        className="px-3 py-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 disabled:opacity-50 transition bg-transparent border-none cursor-pointer"
                      >
                        Ignore
                      </button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={actionIdLoading !== null}
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-950/30 rounded-full font-bold px-4 h-8 flex items-center gap-1.5"
                        onClick={() => handleAcceptInvitation(inv._id)}
                      >
                        {actionIdLoading === inv._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        Accept
                      </Button>
                    </div>
                  </div>
                )
              )
            )}
          </div>

          {invitations.length > 3 && (
            <button
              onClick={() => setShowAllInvitations(!showAllInvitations)}
              className="w-full text-center py-3 border-t border-zinc-100 dark:border-zinc-800/60 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20 transition bg-transparent cursor-pointer"
            >
              {showAllInvitations ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* ─── SECTION 2: MORE SUGGESTIONS CARD ─── */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-xs">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
            More suggestions for you
          </h2>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-6 border-b border-zinc-100 dark:border-zinc-800/60 mb-4 overflow-x-auto scrollbar-none">
            {(["people", "groups", "companies", "hashtags"] as TabType[]).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2.5 text-xs font-bold capitalize transition border-b-2 bg-transparent cursor-pointer whitespace-nowrap -mb-0.5 ${
                    activeTab === tab
                      ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                      : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {tab === "people" && <Users className="h-3.5 w-3.5" />}
                    {tab === "groups" && <Users className="h-3.5 w-3.5 text-zinc-400" />}
                    {tab === "companies" && <Building className="h-3.5 w-3.5" />}
                    {tab === "hashtags" && <Hash className="h-3.5 w-3.5" />}
                    {tab}
                  </div>
                </button>
              )
            )}
          </div>

          {activeTab !== "people" ? (
            <div className="p-8 text-center text-xs text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
              Suggestions for {activeTab} will appear here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {suggestions.map((person) => {
                const isConnected = connectedIds.includes(person.id);
                return (
                  <div
                    key={person.id}
                    className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-xl overflow-hidden relative group hover:shadow-md transition duration-200"
                  >
                    <div className={`h-16 w-full ${person.bannerBg} opacity-85`} />

                    <div className="px-3 pb-4 flex flex-col items-center flex-1 text-center -mt-9">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="h-18 w-18 rounded-full object-cover border-4 border-white dark:border-zinc-900 shadow-sm mb-2 relative z-10"
                      />
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 leading-tight mb-0.5">
                        {person.name}
                      </h3>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-normal px-2 min-h-8">
                        {person.role}
                      </p>

                      <div className="flex items-center justify-center gap-1.5 mt-4 mb-4 w-full">
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {person.mutualAvatars.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt="mutual context"
                              className="inline-block h-4 w-4 rounded-full ring-2 ring-white dark:ring-zinc-900 object-cover"
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium truncate">
                          {person.mutualCount} mutual connection
                          {person.mutualCount > 1 ? "s" : ""}
                        </span>
                      </div>

                      <Button
                        variant={isConnected ? "secondary" : "outline"}
                        size="sm"
                        className={`w-full max-w-40 rounded-full text-xs font-bold h-7 shadow-2xs mt-auto transition ${
                          isConnected
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40"
                            : "border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950/20"
                        }`}
                        onClick={() => toggleConnect(person.id)}
                      >
                        {isConnected ? (
                          <>
                            <Check className="mr-1 h-3.5 w-3.5 stroke-[2.5]" />
                            Pending
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-1 h-3.5 w-3.5" />
                            Connect
                          </>
                        )}
                      </Button>
                    </div>

                    <button
                      onClick={() =>
                        setSuggestions((prev) =>
                          prev.filter((p) => p.id !== person.id)
                        )
                      }
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/20 hover:bg-black/40 text-white border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkPage;