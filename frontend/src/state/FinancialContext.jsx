import { createContext, useContext, useMemo, useState } from "react";

const FinancialContext = createContext(null);

const defaultProfileInput = {
  name: "Aarav Sharma",
  monthly_income: 120000,
  monthly_expenses: 65000,
  current_savings: 250000,
  existing_debt: 180000,
  financial_goal: "Emergency fund + House down payment",
  goal_amount: 500000,
  timeline_months: 36,
  risk_preference: "moderate"
};

export function FinancialProvider({ children }) {
  const [profileInput, setProfileInput] = useState(defaultProfileInput);
  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [goalPlan, setGoalPlan] = useState(null);

  const value = useMemo(
    () => ({
      profileInput,
      setProfileInput,
      profile,
      setProfile,
      analysis,
      setAnalysis,
      goalPlan,
      setGoalPlan
    }),
    [profileInput, profile, analysis, goalPlan]
  );

  return <FinancialContext.Provider value={value}>{children}</FinancialContext.Provider>;
}

export function useFinancialContext() {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error("useFinancialContext must be used within FinancialProvider");
  }
  return context;
}
