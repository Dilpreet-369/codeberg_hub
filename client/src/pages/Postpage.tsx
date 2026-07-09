import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  X,
  Globe,
  Image,
  Video,
  Calendar,
  MoreHorizontal,
  MessageSquare,
  Keyboard,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchUserProfile } from "@/utils/Fetchprofile";

interface UserContextState {
  fullname: string;
  username: string;
}

const PostPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null); // ◄ Link reference directly targeting file type input element
  
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ─── EXTRA FILE TRACKING STATES ───
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile(setUser, setLoading, setError);
  }, []);

  // Handle local system picker file selections
  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosenFile = e.target.files?.[0];
    if (chosenFile) {
      setMediaFile(chosenFile);
      setPreviewUrl(URL.createObjectURL(chosenFile)); // Generates synchronous visual sandbox client URL link
    }
  };

  // Resets attachment hook scopes completely back to normal parameters
  const clearSelectedMedia = () => {
    setMediaFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <p className="text-sm font-semibold text-red-500 mb-4">
          {error || "User data empty."}
        </p>
        <button
          onClick={() => navigate("/login")}
          className="text-xs font-bold text-indigo-500 hover:underline bg-transparent border-none cursor-pointer"
        >
          Return to Login
        </button>
      </div>
    );
  }

  const handlePostSubmit = async () => {
    if (!content.trim() && !mediaFile) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      
      // ─── UPGRADED PACKAGING PAYLOAD: FORMDATA ───
      const submissionForm = new FormData();
      submissionForm.append("content", content);
      
      if (mediaFile) {
        // Key match must align key-name identical to upload.single('image') inside backend router layer strings
        submissionForm.append("image", mediaFile);
      }

      await axios.post(
        "http://localhost:5000/api/users/posts",
        submissionForm,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" // Crucial header key identifier tells engine how to chunk payload binary boundaries
          } 
        },
      );

      navigate(-1);
    } catch (error) {
      console.error("Post creation execution failure", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans flex flex-col justify-between selection:bg-indigo-500/20">
      {/* ─── MODAL CONTROLLER ACTION ROW ─── */}
      <header className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between sticky top-0 bg-white dark:bg-zinc-950 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition cursor-pointer bg-transparent border-none"
            aria-label="Close editor"
          >
            <X className="h-6 w-6 stroke-[1.75]" />
          </button>
          <span className="text-base font-bold tracking-tight">Start post</span>
        </div>

        <Button
          type="button"
          variant="glossyBlue"
          size="default"
          className="px-5 py-1.5 rounded-full text-xs font-semibold"
          disabled={(!content.trim() && !mediaFile) || isSubmitting}
          onClick={handlePostSubmit}
        >
          {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Post"}
        </Button>
      </header>

      {/* ─── CENTRAL EDITOR WINDOW CANVAS ─── */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-4 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-linear-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-xs select-none">
            <User className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-sm font-bold leading-none tracking-tight">
              {user?.fullname || "Developer"}
            </span>

            <button className="flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-zinc-300 dark:border-zinc-700 text-[11px] font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition cursor-pointer">
              <Globe className="h-3 w-3 text-zinc-400" />
              <span>Anyone</span>
            </button>
          </div>
        </div>

        {/* Seamless Interactive Input Area */}
        <div className="flex-1 flex flex-col gap-3 min-h-62.5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full min-h-25 resize-none border-none outline-hidden bg-transparent text-base text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 leading-relaxed font-normal focus:ring-0"
            autoFocus
          />

          {/* ─── INTERACTIVE SELECTION PREVIEW LAYER ─── */}
          {previewUrl && mediaFile && (
            <div className="relative rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-900 max-h-64 border border-zinc-200 dark:border-zinc-800 shadow-xs group">
              {mediaFile.type.startsWith("video/") ? (
                <video src={previewUrl} className="w-full max-h-64 object-contain" controls />
              ) : (
                <img src={previewUrl} alt="Upload workspace snapshot preview" className="w-full max-h-64 object-contain mx-auto" />
              )}
              <button
                type="button"
                onClick={clearSelectedMedia}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white shadow-md transition-all cursor-pointer"
                aria-label="Remove asset"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ─── LOWER TOOLBAR ATTACHMENT DOCK ─── */}
      <footer className="w-full max-w-md mx-auto sticky bottom-0 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 px-4 py-2 flex flex-col gap-2">
        <div className="flex items-center gap-2 px-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Add connection requirements or content rules</span>
        </div>

        <div className="flex items-center justify-between mt-1 pt-1">
          <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
            {/* Hidden Input Bridge Hook */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleMediaFileChange}
              accept="image/*,video/*"
              className="hidden"
            />
            
            {/* Image Upload Trigger Anchor Button */}
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1 hover:text-indigo-500 dark:hover:text-indigo-400 transition bg-transparent border-none cursor-pointer"
            >
              <Image className="h-5 w-5 stroke-[1.75]" />
            </button>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1 hover:text-indigo-500 dark:hover:text-indigo-400 transition bg-transparent border-none cursor-pointer"
            >
              <Video className="h-5 w-5 stroke-[1.75]" />
            </button>
            <button type="button" className="p-1 hover:text-indigo-500 dark:hover:text-indigo-400 transition bg-transparent border-none cursor-pointer">
              <Calendar className="h-5 w-5 stroke-[1.75]" />
            </button>
            <button type="button" className="p-1 hover:text-indigo-500 dark:hover:text-indigo-400 transition bg-transparent border-none cursor-pointer">
              <MoreHorizontal className="h-5 w-5 stroke-[1.75]" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-zinc-400">
            <button type="button" className="p-1 hover:text-zinc-600 dark:hover:text-zinc-300 transition bg-transparent border-none cursor-pointer">
              <Keyboard className="h-5 w-5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PostPage;