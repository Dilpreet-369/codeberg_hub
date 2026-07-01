// src/pages/Landingpage.tsx
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Import the reusable Button component
import { UserPlus, ArrowRight, ShieldCheck } from "lucide-react"; // Import vector icons instead of emojis
import { useTheme } from "@/components/ThemeContext";
import { Sun, Moon } from "lucide-react";
const Landingpage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-blue-500 selection:text-white antialiased">
      {/* 1. Mobile Top Header Section */}
      <header className="w-full max-w-md mx-auto bg-white border-b border-slate-200/80 px-5 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        {/* Sleek App Icon Mark */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 bg-linear-to-b from-[#6D7BFF] to-[#4F59E9] rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-md shadow-blue-100">
            C
          </div>
          <span className="text-lg font-bold text-slate-800 tracking-tight">
            CodebergHub
          </span>
        </div>

        {/* Quick Utility Sign In Link */}
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="icon"
          className="rounded-xl border-slate-200"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4 text-slate-700" />
          ) : (
            <Sun className="h-4 w-4 text-amber-400" />
          )}
        </Button>
        <Link
          to="/login"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition px-3 py-1.5 rounded-lg hover:bg-blue-50/60"
        >
          Sign In
        </Link>
      </header>

      {/* 2. Main Center Hero Content Box */}
      <main className="flex-1 w-full max-w-md mx-auto px-6 flex flex-col justify-center items-center text-center gap-8 py-10">
        {/* Dynamic Minimalist Welcome Emblem */}
        <div className="w-16 h-16 bg-blue-50 border border-blue-100/70 rounded-2xl flex items-center justify-center text-blue-600 shadow-xs">
          <ShieldCheck className="w-8 h-8 stroke-[1.75]" />
        </div>

        {/* Value Proposition Typography */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Welcome to your <br />
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              professional community
            </span>
          </h1>
          <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto leading-relaxed">
            Connect with full-stack developers, share production milestones, and
            explore open-source tech.
          </p>
        </div>

        {/* 3. Action Destination Hub (Using Reusable Glossy Buttons) */}
        <div className="w-full flex flex-col gap-3 mt-2">
          {/* Primary Join Action */}
          <Button
            onClick={() => navigate("/register")}
            variant="glossyBlue"
            className="w-48 justify-center mx-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Agree & Join Now</span>
          </Button>

          {/* Secondary Forwarding Action */}
          <Button
            onClick={() => navigate("/login")}
            variant="glossyWhite"
            className="w-56 justify-center mx-auto"
          >
            <span>Explore Account</span>
            <ArrowRight className="w-4 h-4 text-slate-500 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </main>

      {/* 4. Compliance Bottom Footer Area */}
      <footer className="w-full max-w-md mx-auto text-center px-6 py-4 text-[11px] font-medium text-slate-400 tracking-normal border-t border-slate-100 bg-white">
        By clicking continue, you agree to our User Agreement, Privacy Policy,
        and Cookie Policy.
      </footer>
    </div>
  );
};

export default Landingpage;
