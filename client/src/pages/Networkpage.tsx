import { useState } from "react";
import {
  UserPlus,
  Check,
  X,
  Users,
  Building,
  Hash,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile } from "console";
import { useNavigate } from "react-router-dom";

// ─── TYPES & INTERFACES ───
interface Invitation {
  id: string;
  name: string;
  role: string;
  avatar: string;
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
  // ─── LOCAL STATE FOR INTERACTIVE MOCK DATA ───
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: "inv-1",
      name: "Florjan Zyberaj",
      role: "Student at Niagra University",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "inv-2",
      name: "adigun ademola",
      role: "advanced diploma at newstart institute canada",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "inv-3",
      name: "Sarah Roberts",
      role: "Regional Human Resources Director / Deputy Total Force Management",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
  ]);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "sug-1",
      name: "Henry Chesky",
      role: "Recruiter | Helping healthcare professionals scale up",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      bannerBg: "bg-gradient-to-r from-purple-500 to-indigo-500",
      mutualCount: 34,
      mutualAvatars: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&auto=format&fit=crop&q=60",
      ],
    },
    {
      id: "sug-2",
      name: "Stephanie Heinert",
      role: "Recruiting at Stripe - we're Hiring!",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      bannerBg: "bg-gradient-to-r from-orange-400 to-amber-500",
      mutualCount: 9,
      mutualAvatars: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&auto=format&fit=crop&q=60",
      ],
    },
    {
      id: "sug-3",
      name: "William Fleming",
      role: "Scrum Servant Leader",
      avatar:
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
      bannerBg: "bg-gradient-to-r from-slate-400 to-slate-600",
      mutualCount: 2,
      mutualAvatars: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=50&auto=format&fit=crop&q=60",
      ],
    },
    {
      id: "sug-4",
      name: "Jason Lim",
      role: "Brand Strategist / Bicycling Evangelist",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
      bannerBg: "bg-gradient-to-r from-sky-400 to-blue-500",
      mutualCount: 2,
      mutualAvatars: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50&auto=format&fit=crop&q=60",
      ],
    },
    {
      id: "sug-5",
      name: "Andrada Amitiei",
      role: "#FlavoredWriting Freelance Emotion Strategist",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      bannerBg: "bg-gradient-to-r from-teal-400 to-emerald-500",
      mutualCount: 35,
      mutualAvatars: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=60",
      ],
    },
    {
      id: "sug-6",
      name: "Deanna Isaacs",
      role: "Syndicated Columnist and Freelance Writer",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
      bannerBg: "bg-gradient-to-r from-red-400 to-rose-500",
      mutualCount: 3,
      mutualAvatars: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&auto=format&fit=crop&q=60",
      ],
    },
  ]);

  const [activeTab, setActiveTab] = useState<TabType>("people");
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [showAllInvitations, setShowAllInvitations] = useState(false);

  // ─── ACTION HANDLERS ───
  const handleAcceptInvitation = (id: string) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== id));
  };

  const handleIgnoreInvitation = (id: string) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== id));
  };

  const toggleConnect = (id: string) => {
    setConnectedIds((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id],
    );
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 py-6 px-4 antialiased font-sans transition-colors duration-200">
      <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
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
        {/* ─── SECTION 1: INVITATIONS CARD ─── */}
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
            {invitations.length === 0 ? (
              <p className="text-xs text-zinc-500 p-6 text-center">
                No pending invitations
              </p>
            ) : (
              (showAllInvitations ? invitations : invitations.slice(0, 3)).map(
                (inv) => (
                  <div
                    key={inv.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/40 dark:hover:bg-zinc-800/10 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={inv.avatar}
                        alt={inv.name}
                        className="h-14 w-14 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-700 shadow-xs"
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate leading-snug">
                          {inv.name}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {inv.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleIgnoreInvitation(inv.id)}
                        className="px-3 py-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition bg-transparent border-none cursor-pointer"
                      >
                        Ignore
                      </button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950/30 rounded-full font-bold px-4 h-8"
                        onClick={() => handleAcceptInvitation(inv.id)}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                ),
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

          {/* Sub Navigation Segment Headers */}
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
                    {tab === "groups" && (
                      <Users className="h-3.5 w-3.5 text-zinc-400" />
                    )}
                    {tab === "companies" && (
                      <Building className="h-3.5 w-3.5" />
                    )}
                    {tab === "hashtags" && <Hash className="h-3.5 w-3.5" />}
                    {tab}
                  </div>
                </button>
              ),
            )}
          </div>

          {/* Responsive Suggestions Dynamic Render Core View Grid */}
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
                    {/* Cover Banner Accent Layer */}
                    <div
                      className={`h-16 w-full ${person.bannerBg} opacity-85`}
                    />

                    {/* Profile Header Details Layout block */}
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

                      {/* Mutual Connections Row Indicator Layer */}
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

                      {/* Explicit Connect Request Execution Button Node */}
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

                    {/* Single card item removal control button element */}
                    <button
                      onClick={() =>
                        setSuggestions((prev) =>
                          prev.filter((p) => p.id !== person.id),
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
