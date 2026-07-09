import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, Check, ArrowRight, X } from "lucide-react";

interface StatusState {
  type: "success" | "error" | "loading";
  text: string;
}

// Pre-defined popular tags for swift mobile selection (Frictionless UX)
const POPULAR_INTERESTS = [
  "MERN", "React", "Node.js", "MongoDB", "TypeScript", 
  "Python", "C++", "Linux", "Docker", "Cybersecurity"
];

const Onboardingpage = () => {
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [workOrStudy, setWorkOrStudy] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<StatusState | null>(null);

  const updateStatus = (
    type: "success" | "error" | "loading",
    text: string,
  ) => {
    setStatus({ type, text });
  };

  // Toggles interest array allocations smoothly
  const handleTagToggle = (tag: string) => {
    if (interests.includes(tag)) {
      setInterests(interests.filter((i) => i !== tag));
    } else {
      setInterests([...interests, tag]);
    }
  };

  // Reusable pipeline to fire setup state variables to Express
  const submitOnboardingData = async (payload: {
    bio: string;
    workOrStudy: string;
    interests: string[];
  }, successMsg: string) => {
    updateStatus("loading", "Synchronizing developer profile map...");
    
    try {
      const token = localStorage.getItem("authToken");
      
      await axios.put(
        "https://codeberg-hub.onrender.com/api/auth/onboard", 
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}` // Passes through protectRoute
          }
        }
      );

      updateStatus("success", successMsg);
      
      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (err: any) {
      updateStatus(
        "error",
        `Onboarding Sync Blocked: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOnboardingData(
      { bio, workOrStudy, interests },
      "Profile configuration locked! Entering CodebergHub..."
    );
  };

  const handleSkipFlow = () => {
    submitOnboardingData(
      { bio: "", workOrStudy: "", interests: [] },
      "Skipping setup. Welcome to CodebergHub!"
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors duration-200">
      <div className="w-full max-w-md bg-transparent sm:bg-white sm:dark:bg-zinc-900/40 sm:border sm:border-zinc-200/80 sm:dark:border-zinc-900 rounded-lg p-4 sm:p-8 relative transition-all">
        
        {/* Soft-Gate Top Skip Button */}
        <button
          type="button"
          onClick={handleSkipFlow}
          disabled={status?.type === "loading"}
          className="absolute top-4 right-4 sm:top-6 sm:right-8 text-xs text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none disabled:opacity-50"
        >
          Skip <ArrowRight className="h-3 w-3" />
        </button>

        {/* Header */}
        <div className="mb-8 mt-4 sm:mt-2">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Setup Profile
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
            Customize your hub card before jumping in
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
          
          {/* Work or Study Input Row */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Where do you work / study?
            </label>
            <input
              type="text"
              placeholder="e.g. GNDEC Student"
              value={workOrStudy}
              onChange={(e) => setWorkOrStudy(e.target.value)}
              className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-zinc-900 dark:focus:border-zinc-100 outline-none transition-colors py-2 px-0"
            />
          </div>

          {/* Bio Input Row */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Bio / Developer Tagline
            </label>
            <textarea
              placeholder="Building full-stack apps and ricing window managers."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              rows={3}
              className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-zinc-900 dark:focus:border-zinc-100 outline-none transition-colors py-2 px-0 resize-none leading-relaxed"
            />
            <div className="text-right text-[10px] text-zinc-400 dark:text-zinc-600 mt-1">
              {bio.length} / 160
            </div>
          </div>

          {/* Core Tech Stack Selection Tag Grid Layout */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Select Core Interests
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-35 overflow-y-auto pr-1 py-0.5 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
              {POPULAR_INTERESTS.map((tag) => {
                const isSelected = interests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`text-xs px-2.5 py-1.5 rounded-md font-medium border transition-all cursor-pointer flex items-center gap-1.5 unselectable select-none ${
                      isSelected
                        ? "bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100"
                        : "bg-zinc-50 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <span>{tag}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Configuration Button Container */}
          <button
            type="submit"
            disabled={status?.type === "loading"}
            className="w-full mt-4 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status?.type === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-zinc-400 dark:text-zinc-600" />
                Saving profile setup...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Finish Setup
              </>
            )}
          </button>
        </form>

        {/* Structured Alert Banner Component Context */}
        {status && (
          <div
            className={`mt-6 p-3 rounded-md text-xs font-medium border break-all leading-relaxed flex items-start gap-2.5 ${
              status.type === "success"
                ? "bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800"
                : status.type === "loading"
                  ? "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                  : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30"
            }`}
          >
            {status.type === "loading" && <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />}
            {status.type === "success" && <Check className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100 mt-0.5 shrink-0" />}
            {status.type === "error" && <X className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />}
            <span>{status.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboardingpage;