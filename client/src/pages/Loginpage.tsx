import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { LogIn, Loader2 } from "lucide-react";
import { useTheme } from "@/components/ThemeContext"; // Double check your context import path
// import { Sun, Moon } from "lucide-react"; // For theme toggle button

const Login = () => {
  const { theme, toggleTheme } = useTheme(); // Ensure you are using the ThemeProvider correctly
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleAuthSuccess = (token: string, message: string) => {
    localStorage.setItem("authToken", token);
    setStatus(message);
    setEmail("");
    setPassword("");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading"); // ◄ Key change: Set to literal "loading" so button spinner activates

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      const token = res.data.data?.accessToken;
      if (token) {
        handleAuthSuccess(token, "Credentials verified! Welcome back.");
      } else {
        setStatus("Authentication succeeded, but no session token was issued.");
      }
    } catch (err: any) {
      setStatus(`Access Denied: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setStatus("loading"); // ◄ Key change: Set to literal "loading" for consistency
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        credential: credentialResponse.credential,
      });
      const token = res.data.data?.accessToken;
      if (token) {
        handleAuthSuccess(token, "Google Sign-In verified! Welcome back.");
      } else {
        setStatus("Google validation succeeded, but no app token was issued.");
      }
    } catch (err: any) {
      setStatus(
        `Google Auth Failed: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  // Check if status contains actual error messages vs positive alerts
  const isErrorStatus =
    status.includes("Denied") ||
    status.includes("Failed") ||
    status.includes("succeeded");

  return (
    /* Changed: Root bg-transparent works great because index.css body takes over */
    <div className="flex justify-center items-center min-h-screen bg-transparent p-4 font-sans transition-colors duration-200">
      {/* Changed: Fixed typo. Switched from :dark:bg-gray-800 to dark:bg-slate-900 and dark:border-slate-800 */}
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-lg border border-transparent dark:border-slate-800/60 transition-colors duration-200">
        {/* Header (Changed: added dark:text-white and dark:text-slate-400) */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Sign in to access your secure profile
          </p>
        </div>
        {/* <Button
          onClick={toggleTheme}
          variant="outline"
          size="icon"
          className="rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4 text-slate-700" />
          ) : (
            <Sun className="h-4 w-4 text-amber-400" />
          )}
        </Button> */}
        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          {/* Email Row (Changed: input text, background, focus rings, and borders) */}
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

          {/* Password Row (Changed: inputs customized for dark states) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-700 text-base bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-600 focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Reusable Core Submission Button Layout */}
          <Button
            type="submit"
            variant="glossyBlue"
            size="default"
            className="w-full mt-2"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
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

        {/* Visual Divider (Changed: added dark:border-slate-800 and dark:text-slate-500) */}
        <div className="relative flex py-4 items-center">
          <div className="grow border-t border-gray-200 dark:border-slate-800"></div>
          <span className="shrink mx-4 text-gray-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">
            or
          </span>
          <div className="grow border-t border-gray-200 dark:border-slate-800"></div>
        </div>

        {/* Google Login Component (Inherits automatic system theme rendering) */}
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() =>
              setStatus("Google Authentication Failed client-side")
            }
            shape="circle"
            theme={theme === "dark" ? "filled_blue" : "outline"} // ◄ Pro Tip: Toggles Google theme wrapper layout!
            width={360}
          />
        </div>

        {/* Dynamic Alert Banner (Changed: Fixed string matching so error vs green alerts swap perfectly) */}
        {status && status !== "loading" && (
          <div
            className={`mt-5 p-3 rounded-lg text-sm font-medium border break-all leading-relaxed ${
              isErrorStatus
                ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50"
                : "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50"
            }`}
          >
            {status}
          </div>
        )}

        {/* Visual Anchor (Changed: added dark:text-indigo-400) */}
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
