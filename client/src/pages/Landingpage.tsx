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