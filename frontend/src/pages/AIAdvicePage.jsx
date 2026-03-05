import { useState } from "react";
import InsightsPanel from "../components/InsightsPanel";
import SummaryCard from "../components/SummaryCard";
import { analyzeProfile } from "../lib/api";
import { useFinancialContext } from "../state/FinancialContext";

export default function AIAdvicePage() {
  const { profile, analysis, setAnalysis } = useFinancialContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshAdvice = async () => {
    if (!profile?.id) {
      setError("Create and save profile first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await analyzeProfile(profile.id);
      setAnalysis(result);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to generate AI advice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">AI Insights Panel</h2>
          <p className="text-slate-400">Gemini-powered insights for budget, investment, risk, and actionable planning.</p>
        </div>
        <button onClick={refreshAdvice} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium hover:bg-brand-500">
          {loading ? "Generating..." : "Generate Advice"}
        </button>
      </div>
      {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Financial Health Score" value={analysis ? `${analysis.financial_health_score}/100` : "--"} />
        <SummaryCard label="Risk Level" value={analysis?.risk_level?.toUpperCase() || "--"} />
        <SummaryCard label="Savings Rate" value={analysis ? `${analysis.ratios.savings_rate}%` : "--"} />
      </div>
      <InsightsPanel analysis={analysis} />
    </section>
  );
}
