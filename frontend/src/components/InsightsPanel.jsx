function InsightSection({ title, items }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="font-semibold">{title}</h3>
      {items?.length ? (
        <ul className="mt-2 space-y-2 text-sm text-slate-300">
          {items.map((item, idx) => (
            <li key={`${title}-${idx}`} className="rounded-lg bg-slate-950 p-2">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-400">No insights available yet.</p>
      )}
    </div>
  );
}

export default function InsightsPanel({ analysis }) {
  if (!analysis) {
    return <p className="text-slate-400">Generate AI analysis to view insights.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <InsightSection title="Budget Insights" items={analysis.budget_insights} />
      <InsightSection title="Investment Suggestions" items={analysis.investment_suggestions} />
      <InsightSection title="Risk Warnings" items={analysis.risk_warnings} />
      <InsightSection title="Action Plan" items={analysis.action_plan} />
      <InsightSection title="Spending Insights" items={analysis.spending_insights} />
    </div>
  );
}
