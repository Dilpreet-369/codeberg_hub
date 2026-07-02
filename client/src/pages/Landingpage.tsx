// src/pages/Landingpage.tsx
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; 
import { UserPlus, ArrowRight, ShieldCheck, Sun, Moon } from "lucide-react"; 
import { useTheme } from "@/components/ThemeContext"; // Double check your context import path

const Landingpage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // Ensure you are using the ThemeProvider correctly

  return (
    /* Added dark:bg-slate-950 to the screen container */
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between font-sans selection:bg-blue-500 selection:text-white antialiased transition-colors duration-200">
      
      {/* 1. Mobile Top Header Section (Added dark:bg-slate-900 and dark:border-slate-800) */}
      <header className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-5 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-xs transition-colors duration-200">
        
        {/* Sleek App Icon Mark */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 bg-linear-to-b from-[#6D7BFF] to-[#4F59E9] rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-md shadow-blue-100 dark:shadow-none">
            C
          </div>
          {/* Added dark:text-slate-100 */}
          <span className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            CodebergHub
          </span>
        </div>

        {/* Theme Toggle Button */}
        <Button
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
        </Button>

        {/* Quick Utility Sign In Link (Added dark:text-blue-400) */}
        <Link
          to="/login"
          className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition px-3 py-1.5 rounded-lg hover:bg-blue-50/60 dark:hover:bg-blue-950/30"
        >
          Sign In
        </Link>
      </header>

      {/* 2. Main Center Hero Content Box */}
      <main className="flex-1 w-full max-w-md mx-auto px-6 flex flex-col justify-center items-center text-center gap-8 py-10">
        
        {/* Dynamic Minimalist Welcome Emblem (Added dark styles) */}
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 border border-blue-100/70 dark:border-blue-900/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
          <ShieldCheck className="w-8 h-8 stroke-[1.75]" />
        </div>

        {/* Value Proposition Typography */}
        <div className="space-y-3">
          {/* Added dark:text-white */}
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Welcome to your <br />
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              professional community
            </span>
          </h1>
          {/* Added dark:text-slate-400 */}
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            Connect with full-stack developers, share production milestones, and
            explore open-source tech.
          </p>
        </div>

        {/* 3. Action Destination Hub */}
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
            <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </main>

      {/* 4. Compliance Bottom Footer Area (Added dark:bg-slate-900 dark:border-slate-800 dark:text-slate-500) */}
      <footer className="w-full max-w-md mx-auto text-center px-6 py-4 text-[11px] font-medium text-slate-400 dark:text-slate-500 tracking-normal border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-200">
        By clicking continue, you agree to our User Agreement, Privacy Policy,
        and Cookie Policy.
      </footer>
    </div>
  );
};

export default Landingpage;