import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar
} from "recharts";

const currency = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

export default function FinanceCharts({ profile, analysis, goalPlan }) {
  if (!profile || !analysis) {
    return <p className="text-slate-400">Save profile and run AI analysis to view charts.</p>;
  }

  const monthlySurplus = Math.max(profile.monthly_income - profile.monthly_expenses, 0);
  const projectionData = Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    savings: profile.current_savings + monthlySurplus * (i + 1)
  }));

  const debtProjection = Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    debt: Math.max(profile.existing_debt - (analysis.ratios.required_monthly_savings * 0.3 * (i + 1)), 0)
  }));

  const incomeExpense = [
    { label: "Income", value: profile.monthly_income },
    { label: "Expense", value: profile.monthly_expenses },
    { label: "Savings Target", value: analysis.ratios.required_monthly_savings }
  ];

  const goalPercent = goalPlan?.plan?.current_progress_pct || Math.min((profile.current_savings / profile.goal_amount) * 100, 100);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-base font-semibold mb-3">Income vs Expense</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeExpense}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={currency} />
              <Tooltip formatter={(value) => currency(value)} />
              <Bar dataKey="value" fill="#6366f1" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-base font-semibold mb-3">Savings Growth Projection</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={currency} />
              <Tooltip formatter={(value) => currency(value)} />
              <Area type="monotone" dataKey="savings" stroke="#818cf8" fill="url(#savingsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-base font-semibold mb-3">Debt Reduction Progress</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={debtProjection}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={currency} />
              <Tooltip formatter={(value) => currency(value)} />
              <Legend />
              <Line type="monotone" dataKey="debt" stroke="#f43f5e" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-base font-semibold mb-3">Goal Completion</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="w-full">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Goal progress</span>
              <span>{goalPercent.toFixed(1)}%</span>
            </div>
            <div className="h-4 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${goalPercent}%` }} />
            </div>
            <p className="text-sm text-slate-400 mt-3">Target: {currency(profile.goal_amount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
