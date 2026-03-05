import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-indigo-600 to-sky-500 p-8">
        <h2 className="text-3xl font-bold">AI Financial Advisor</h2>
        <p className="mt-2 max-w-2xl text-slate-100/90">
          Build your personal financial roadmap with AI-powered budgeting, debt strategy, investment guidance, and goal tracking.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/profile" className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white">
            Create Profile
          </Link>
          <Link to="/dashboard" className="rounded-lg border border-white/40 px-4 py-2 text-sm font-medium text-white">
            View Dashboard
          </Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="font-semibold">AI Financial Analysis</h3>
          <p className="mt-2 text-sm text-slate-400">Gemini-based structured advice for budgeting, savings, debt and investments.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="font-semibold">Goal-Based Planning</h3>
          <p className="mt-2 text-sm text-slate-400">Track targets like retirement, home purchase, and emergency fund milestones.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="font-semibold">Smart Visual Dashboard</h3>
          <p className="mt-2 text-sm text-slate-400">Use interactive charts for income, expenses, savings growth and debt reduction.</p>
        </div>
      </div>
    </section>
  );
}
