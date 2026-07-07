import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  HelpCircle,
  User,
  ShieldCheck,
  Eye,
  Mail,
  ShieldAlert,
  LogOut,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// ─── SETTINGS ITEM INTERFACE ───
interface SettingsOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Settingspage = () => {
  const navigate = useNavigate();

  // Local state to track the loading pipeline for the custom Logout action button
  const [status, setStatus] = useState<{ type: "idle" | "loading" }>({
    type: "idle",
  });

  // Options mapped explicitly to match the textual layout framework of  image_845982.png
  const settingsOptions: SettingsOption[] = [
    {
      id: "preferences",
      title: "Account preferences",
      description:
        "Options for managing your account and experience on CodebergHub",
      icon: (
        <User className="h-5 w-5 text-zinc-500 dark:text-zinc-400 stroke-[1.5]" />
      ),
    },
    {
      id: "security",
      title: "Sign in & security",
      description:
        "Options and controls for signing in and keeping your account safe",
      icon: (
        <ShieldCheck className="h-5 w-5 text-zinc-500 dark:text-zinc-400 stroke-[1.5]" />
      ),
    },
    {
      id: "visibility",
      title: "Visibility",
      description:
        "Control who sees your activity and information on CodebergHub",
      icon: (
        <Eye className="h-5 w-5 text-zinc-500 dark:text-zinc-400 stroke-[1.5]" />
      ),
    },
    {
      id: "communications",
      title: "Communications",
      description: "Controls for emails, invites, and notification triggers",
      icon: (
        <Mail className="h-5 w-5 text-zinc-500 dark:text-zinc-400 stroke-[1.5]" />
      ),
    },
    {
      id: "privacy",
      title: "Data privacy",
      description:
        "Control how CodebergHub uses your information for general site use",
      icon: (
        <ShieldAlert className="h-5 w-5 text-zinc-500 dark:text-zinc-400 stroke-[1.5]" />
      ),
    },
  ];

  // Simulated session deletion engine handler
  const handleLogout = async () => {
    setStatus({ type: "loading" });

    // Simulating clear-down latency (e.g., cookie clearance, state reset)
    setTimeout(() => {
      localStorage.removeItem("authToken"); // Clears current user authorization state
      setStatus({ type: "idle" });
      navigate("/login");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-8 transition-colors duration-200">
      {/* ─── STICKY HEADER BANNER ─── */}
      <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)} // Pops view controller back to caller profile layout
            className="p-1 -ml-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold text-zinc-800 dark:text-zinc-200 tracking-tight">
            Settings
          </h1>
        </div>
        <button className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition bg-transparent border-none cursor-pointer">
          <HelpCircle className="h-5 w-5" />
        </button>
      </header>

      {/* ─── SETTINGS UTILITY LIST BODY ─── */}
      <main className="w-full max-w-md mx-auto mt-1 flex flex-col bg-white dark:bg-zinc-900 border-y sm:border border-zinc-200 dark:border-zinc-800/80 divide-y divide-zinc-100 dark:divide-zinc-800/60">
        {settingsOptions.map((option) => (
          <div
            key={option.id}
            className="flex items-start gap-4 p-4 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition cursor-pointer group"
          >
            {/* Left Side: Layout Icon Cell */}
            <div className="mt-0.5 shrink-0">{option.icon}</div>

            {/* Right Side: Informational Context */}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                {option.title}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">
                {option.description}
              </p>
            </div>
          </div>
        ))}

        {/* ─── DESTRUCTIVE ACTION BLOCK (Bottom-anchored button placement) ─── */}
        <div className="p-4 bg-zinc-50/40 dark:bg-zinc-950/10">
          <Button
            type="button" // Use "button" instead of "submit" so it doesn't try to submit a form container
            variant="glossyRed" // ◄ Uses your new premium glossy red style
            size="default"
            className="w-full mt-2"
            disabled={status?.type === "loading"}
            onClick={handleLogout}
          >
            {status?.type === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Clearing Secure Session...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settingspage;
