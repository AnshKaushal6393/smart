import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import GoalPlanningPage from "./pages/GoalPlanningPage";
import AIAdvicePage from "./pages/AIAdvicePage";
import ProfilePage from "./pages/ProfilePage";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Financial Dashboard" },
  { to: "/goals", label: "Goal Planning" },
  { to: "/advice", label: "AI Advice" },
  { to: "/profile", label: "User Profile" }
];

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">
      <aside className="md:w-72 border-r border-slate-800 p-5">
        <h1 className="text-xl font-semibold">AI Financial Advisor</h1>
        <p className="text-sm text-slate-400 mt-1">Plan smarter with Gemini insights</p>
        <nav className="mt-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition ${
                  isActive ? "bg-brand-600 text-white" : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/goals" element={<GoalPlanningPage />} />
          <Route path="/advice" element={<AIAdvicePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}
