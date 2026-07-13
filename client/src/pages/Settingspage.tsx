import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

  // States for account deletion pipeline
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [deleteError, setDeleteError] = useState("");

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
      setStatus({ type: "idle" });
      navigate("/login");
    }, 1200);
  };

  const closeDeleteModal = () => {
    if (deleteStatus === "loading" || deleteStatus === "success") return;
    setIsDeleteModalOpen(false);
    setDeleteStatus("idle");
    setDeleteError("");
  };

  const handleDeleteAccount = async () => {
    setDeleteStatus("loading");
    setDeleteError("");
    try {
      const response = await axios.delete("/auth/delete-account", {
        withCredentials: true,
      });

      if (response.data?.success || response.status === 200) {
        setDeleteStatus("success");

        setTimeout(() => {
          setIsDeleteModalOpen(false);
          setDeleteStatus("idle");
          // Redirect to login page
          navigate("/login");
        }, 2000);
      } else {
        setDeleteStatus("error");
        setDeleteError(
          "Failed to delete account. Server returned an invalid response.",
        );
      }
    } catch (err: any) {
      console.error("Delete account error:", err);
      setDeleteStatus("error");
      setDeleteError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while deleting your account.",
      );
    }
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
        <div className="p-4 bg-zinc-50/40 dark:bg-zinc-950/10 flex flex-col gap-2">
          <Button
            type="button" // Use "button" instead of "submit" so it doesn't try to submit a form container
            variant="outline"
            size="default"
            className="w-full mt-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
            disabled={
              status?.type === "loading" ||
              deleteStatus === "loading" ||
              deleteStatus === "success"
            }
            onClick={handleLogout}
          >
            {status?.type === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-zinc-500" />
                Clearing Secure Session...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="glossyRed"
            size="default"
            className="w-full"
            disabled={
              status?.type === "loading" ||
              deleteStatus === "loading" ||
              deleteStatus === "success"
            }
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <ShieldAlert className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </div>
      </main>

      {/* ─── CONFIRMATION MODAL (Glassmorphic backdrop) ─── */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Warning indicator / Icon header */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="p-2.5 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400">
                <ShieldAlert className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                  Delete Account permanently?
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Modal Body / Information */}
            <div className="space-y-2 mb-6">
              <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Deleting your account will permanently remove all your profile
                information, settings, and all published posts including their
                uploaded media files.
              </p>

              {deleteStatus === "error" && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 leading-normal">
                  {deleteError || "Failed to delete account. Please try again."}
                </div>
              )}

              {deleteStatus === "success" && (
                <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/40 rounded-lg text-xs font-semibold text-green-600 dark:text-green-400 leading-normal flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400 animate-ping" />
                  Account deleted successfully. Redirecting in 2 seconds...
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
              <Button
                type="button"
                variant="outline"
                className="border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                onClick={closeDeleteModal}
                disabled={
                  deleteStatus === "loading" || deleteStatus === "success"
                }
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="glossyRed"
                onClick={handleDeleteAccount}
                disabled={
                  deleteStatus === "loading" || deleteStatus === "success"
                }
              >
                {deleteStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete Account"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settingspage;
