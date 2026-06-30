import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Landingpage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 1. Mobile Top Header Section */}
      <header className="w-full max-w-md mx-auto bg-white border-b border-gray-200/80 px-5 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        {/* Sleek App Icon Mark */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-md shadow-indigo-100">
            C
          </div>
          <span className="text-lg font-bold text-gray-800 tracking-tight">CodeHub</span>
        </div>

        {/* Quick Utility Sign In Link */}
        <Link 
          to="/login" 
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition px-3 py-1.5 rounded-md hover:bg-indigo-50"
        >
          Sign In
        </Link>
      </header>

      {/* 2. Main Center Hero Content Box */}
      <main className="flex-1 w-full max-w-md mx-auto px-6 flex flex-col justify-center items-center text-center gap-8 py-10">
        
        {/* Dynamic Minimalist Welcome Emblem */}
        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-indigo-100">
          🚀
        </div>

        {/* Value Proposition Typography */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Welcome to your <br />
            <span className="text-indigo-600">professional community</span>
          </h1>
          <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
            Connect with full-stack developers, share project milestones, and explore system security insights.
          </p>
        </div>

        {/* 3. Action Destination Hub (Vertically Stacked for Phones) */}
        <div className="w-full flex flex-col gap-3 mt-4">
          
          {/* Primary Action Call: Register Path */}
          <Link 
            to="/register"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-center font-semibold rounded-xl shadow-lg shadow-indigo-100 transition text-sm"
          >
            Agree & Join Now
          </Link>

          {/* Secondary Action Call: Alternative Google Authentication Placeholder */}
          <button 
            onClick={() => console.log("OAuth Redirect Triggered")}
            className="w-full py-3.5 bg-white border border-gray-300 hover:bg-gray-50 active:scale-[0.99] text-gray-700 font-medium rounded-xl transition text-sm flex items-center justify-center gap-2.5 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.68 14.91 1 12 1 7.35 1 3.4 3.65 1.48 7.5l3.78 2.93c.9-2.69 3.43-4.39 6.74-4.39z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.46c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.39-4.87 3.39-8.48z"/>
              <path fill="#FBBC05" d="M5.26 14.57a7.15 7.15 0 0 1 0-4.14L1.48 7.5a11.95 11.95 0 0 0 0 9l3.78-2.93z"/>
              <path fill="#34A353" d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.66-2.84c-1.01.68-2.31 1.09-4.3 1.09-3.31 0-5.84-1.7-6.74-4.39L1.48 16.88C3.4 20.35 7.35 23 12 23z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </main>

      {/* 4. Compliance Bottom Footer Area */}
      <footer className="w-full max-w-md mx-auto text-center px-6 py-4 text-[11px] text-gray-400 tracking-wide border-t border-gray-100 bg-white">
        By clicking continue, you agree to our User Agreement, Privacy Policy, and Cookie Policy.
      </footer>

    </div>
  );
};

export default Landingpage;