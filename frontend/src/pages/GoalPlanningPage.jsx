import { useState } from "react";
import SummaryCard from "../components/SummaryCard";
import { generateGoalPlan } from "../lib/api";
import { useFinancialContext } from "../state/FinancialContext";

const currency = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

export default function GoalPlanningPage() {
  const { profile, goalPlan, setGoalPlan } = useFinancialContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buildPlan = async () => {
    if (!profile?.id) {
      setError("Please create a profile first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await generateGoalPlan(profile.id);
      setGoalPlan(response);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to generate goal plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Goal-Based Planning</h2>
          <p className="text-slate-400">Estimate monthly savings and timeline to achieve your target goals.</p>
        </div>
        <button onClick={buildPlan} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium hover:bg-brand-500">
          {loading ? "Calculating..." : "Generate Goal Plan"}
        </button>
      </div>
      {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Goal Amount" value={currency(profile?.goal_amount)} />
        <SummaryCard label="Current Savings" value={currency(profile?.current_savings)} />
        <SummaryCard label="Timeline" value={`${profile?.timeline_months || "--"} months`} />
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        {goalPlan?.plan ? (
          <div className="grid gap-4 md:grid-cols-2">
            <SummaryCard label="Required Monthly Savings" value={currency(goalPlan.plan.required_monthly_savings)} />
            <SummaryCard label="Projected Completion" value={`${goalPlan.plan.projected_completion_months} months`} />
            <SummaryCard label="Risk Level" value={goalPlan.plan.risk_level.toUpperCase()} />
            <SummaryCard label="Progress" value={`${goalPlan.plan.current_progress_pct}%`} />
            <div className="md:col-span-2 rounded-lg bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Recommended Strategy</p>
              <p className="mt-1">{goalPlan.plan.recommended_strategy}</p>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">Generate a goal plan to view recommendations.</p>
        )}
      </div>
    </section>
  );
}
