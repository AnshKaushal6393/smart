import { useState } from "react";
import FinanceCharts from "../components/FinanceCharts";
import SummaryCard from "../components/SummaryCard";
import { analyzeProfile } from "../lib/api";
import { useFinancialContext } from "../state/FinancialContext";

const currency = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

export default function DashboardPage() {
  const { profile, analysis, setAnalysis, goalPlan } = useFinancialContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    if (!profile?.id) {
      setError("Create your profile first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await analyzeProfile(profile.id);
      setAnalysis(result);
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to generate analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Financial Dashboard</h2>
          <p className="text-slate-400">Interactive overview of your current financial health.</p>
        </div>
        <button onClick={runAnalysis} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium hover:bg-brand-500">
          {loading ? "Analyzing..." : "Run AI Analysis"}
        </button>
      </div>

      {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Income" value={currency(profile?.monthly_income)} hint="Monthly" />
        <SummaryCard label="Expenses" value={currency(profile?.monthly_expenses)} hint="Monthly" />
        <SummaryCard label="Savings" value={currency(profile?.current_savings)} hint="Current" />
        <SummaryCard label="Health Score" value={analysis ? `${analysis.financial_health_score}/100` : "--"} hint="AI + rules based" />
      </div>

      <FinanceCharts profile={profile} analysis={analysis} goalPlan={goalPlan} />
    </section>
  );
}
