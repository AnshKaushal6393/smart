import { useState } from "react";
import { createProfile } from "../lib/api";
import { useFinancialContext } from "../state/FinancialContext";

const fieldClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none";

export default function ProfileForm() {
  const { profileInput, setProfileInput, setProfile, setAnalysis, setGoalPlan } = useFinancialContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (key, value) => {
    setProfileInput((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const payload = {
        ...profileInput,
        monthly_income: Number(profileInput.monthly_income),
        monthly_expenses: Number(profileInput.monthly_expenses),
        current_savings: Number(profileInput.current_savings),
        existing_debt: Number(profileInput.existing_debt),
        goal_amount: Number(profileInput.goal_amount),
        timeline_months: Number(profileInput.timeline_months)
      };
      const savedProfile = await createProfile(payload);
      setProfile(savedProfile);
      setAnalysis(null);
      setGoalPlan(null);
      setMessage(`Profile saved (ID: ${savedProfile.id}).`);
    } catch (error) {
      setMessage(error?.response?.data?.detail || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
      <h3 className="text-lg font-semibold">Financial Profile Input</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <input className={fieldClass} placeholder="Name" value={profileInput.name} onChange={(e) => handleChange("name", e.target.value)} />
        <input
          className={fieldClass}
          placeholder="Monthly Income"
          type="number"
          value={profileInput.monthly_income}
          onChange={(e) => handleChange("monthly_income", e.target.value)}
        />
        <input
          className={fieldClass}
          placeholder="Monthly Expenses"
          type="number"
          value={profileInput.monthly_expenses}
          onChange={(e) => handleChange("monthly_expenses", e.target.value)}
        />
        <input
          className={fieldClass}
          placeholder="Current Savings"
          type="number"
          value={profileInput.current_savings}
          onChange={(e) => handleChange("current_savings", e.target.value)}
        />
        <input
          className={fieldClass}
          placeholder="Existing Debt"
          type="number"
          value={profileInput.existing_debt}
          onChange={(e) => handleChange("existing_debt", e.target.value)}
        />
        <input
          className={fieldClass}
          placeholder="Financial Goal"
          value={profileInput.financial_goal}
          onChange={(e) => handleChange("financial_goal", e.target.value)}
        />
        <input
          className={fieldClass}
          placeholder="Target Goal Amount"
          type="number"
          value={profileInput.goal_amount}
          onChange={(e) => handleChange("goal_amount", e.target.value)}
        />
        <input
          className={fieldClass}
          placeholder="Timeline (months)"
          type="number"
          value={profileInput.timeline_months}
          onChange={(e) => handleChange("timeline_months", e.target.value)}
        />
        <select className={fieldClass} value={profileInput.risk_preference} onChange={(e) => handleChange("risk_preference", e.target.value)}>
          <option value="low">Low Risk</option>
          <option value="moderate">Moderate Risk</option>
          <option value="high">High Risk</option>
        </select>
      </div>
      <button className="rounded-lg bg-brand-600 px-4 py-2 font-medium hover:bg-brand-500" type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </button>
      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
    </form>
  );
}
