import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google"; // 1. Import official Google login component
import axios from "axios";
import { Button } from "@/components/ui/button"; // 2. Import the reusable Button component
import { LogIn, Loader2 } from "lucide-react" // ◄ Import Loader2 for the spinner animation
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  // A reusable helper function to set token, cleanup, and redirect
  const handleAuthSuccess = (token: string, message: string) => {
    localStorage.setItem("authToken", token);
    setStatus(message);

    setEmail("");
    setPassword("");

    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  // ─── TRADITIONAL EMAIL/PASSWORD LOGIN ───
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Verifying credentials...");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const token = res.data.data?.accessToken;
      if (token) {
        handleAuthSuccess(token, "Credentials verified! Welcome back.");
      } else {
        setStatus(
          "Authentication succeeded, but no session token was issued.",
        );
      }
    } catch (err: any) {
      setStatus(
        `Access Denied: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  // ─── NEW: GOOGLE OAUTH CALLBACK HANDLER ───
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setStatus("Verifying Google profile with server...");
    try {
      // Forward the raw Google string token to your updated backend controller
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        credential: credentialResponse.credential,
      });

      const token = res.data.data?.accessToken;
      if (token) {
        handleAuthSuccess(token, "Google Sign-In verified! Welcome back.");
      } else {
        setStatus(
          "Google validation succeeded, but no app token was issued.",
        );
      }
    } catch (err: any) {
      setStatus(
        `Google Auth Failed: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to access your secure profile
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-base bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-base bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* <Button
            type="submit"
            icon={LogIn}
            isLoading={status?.type === "loading"} // Handles the spinning state automatically
            className="w-full mt-2" // Appends your width and margin to the button layout
          >
            Sign In
          </Button> */}
          <Button
            type="submit"
            variant="glossyBlue"
            size="default"
            className="w-full mt-2"
            disabled={status === "loading"} // ◄ Prevents double submission while waiting for redirect
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

        {/* ─── VISUAL DIVIDER ─── */}
        <div className="relative flex py-4 items-center">
          <div className="grow border-t border-gray-200"></div>
          <span className="shrink mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">
            or
          </span>
          <div className="grow border-t border-gray-200"></div>
        </div>

        {/* ─── GOOGLE INTEGRATION HUB ─── */}
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() =>
              setStatus("Google Authentication Failed client-side")
            }
            // useOneTap
            shape="circle"
            theme="outline"
            width={360} // Matches width constraints gracefully
          />
        </div>

        {/* Status Notification */}
        {status && (
          <div
            className={`mt-5 p-3 rounded-lg text-sm font-medium border break-all leading-relaxed ${
              status.includes("")
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {status}
          </div>
        )}

        {/* Visual Anchor to toggle between views */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
