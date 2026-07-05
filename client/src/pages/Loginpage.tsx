import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { LogIn, Loader2, Eye, EyeOff } from "lucide-react";

interface StatusState {
  type: "success" | "error" | "loading";
  text: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ◄ State for eye toggle
  const [status, setStatus] = useState<StatusState | null>(null);

  const updateStatus = (
    type: "success" | "error" | "loading",
    text: string,
  ) => {
    setStatus({ type, text });
  };

  const handleAuthSuccess = (token: string, successMessage: string) => {
    localStorage.setItem("authToken", token);
    updateStatus("success", successMessage);

    setEmail("");
    setPassword("");

    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateStatus("loading", "Verifying your credentials...");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const token = res.data.data?.accessToken;

      if (token) {
        handleAuthSuccess(token, "Credentials verified! Welcome back.");
      } else {
        updateStatus(
          "error",
          "Authentication succeeded, but the server failed to issue a session token.",
        );
      }
    } catch (err: any) {
      updateStatus(
        "error",
        `Access Denied: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent p-4 font-sans transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-lg border border-transparent dark:border-slate-800/60 transition-colors duration-200">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Sign in to access your secure profile
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          
          {/* Email Row */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-700 text-base bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-600 focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Password Row */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
              Password
            </label>
            {/* Added relative positioning context for the button anchor */}
            <div className="relative w-full flex items-center">
              <input
                type={showPassword ? "text" : "password"} // ◄ Dynamically changes field behavior
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-4 pr-11 py-2.5 rounded-lg border border-gray-300 dark:border-slate-700 text-base bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-600 focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
              {/* Eye Button Toggle Anchor */}
              <button
                type="button" // ◄ Crucial: Prevents hitting Enter or clicking this from triggering form submit
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none transition p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submission Button */}
          <Button
            type="submit"
            variant="glossyBlue"
            size="default"
            className="w-full mt-2"
            disabled={status?.type === "loading"}
          >
            {status?.type === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying Account...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </form>

        {/* Structured Alert Banner */}
        {status && (
          <div
            className={`mt-5 p-3 rounded-lg text-sm font-medium border break-all leading-relaxed flex items-start gap-2.5 ${
              status.type === "success"
                ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200/80 dark:border-green-900/40"
                : status.type === "loading"
                  ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200/80 dark:border-blue-900/40"
                  : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200/80 dark:border-red-900/40"
            }`}
          >
            <span>{status.text}</span>
          </div>
        )}

        {/* Navigation Link Anchor */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-slate-400">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;