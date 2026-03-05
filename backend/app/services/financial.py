from __future__ import annotations

from dataclasses import dataclass

from ..models import UserProfile


@dataclass
class RatioMetrics:
    budget_ratio: float
    savings_rate: float
    debt_to_income: float
    required_monthly_savings: float


def round2(value: float) -> float:
    return round(value, 2)


def calculate_ratios(profile: UserProfile) -> RatioMetrics:
    budget_ratio = (profile.monthly_expenses / profile.monthly_income) * 100 if profile.monthly_income else 0
    monthly_surplus = max(profile.monthly_income - profile.monthly_expenses, 0)
    savings_rate = (monthly_surplus / profile.monthly_income) * 100 if profile.monthly_income else 0
    debt_to_income = (profile.existing_debt / profile.monthly_income) * 100 if profile.monthly_income else 0
    remaining_goal = max(profile.goal_amount - profile.current_savings, 0)
    required_monthly_savings = remaining_goal / profile.timeline_months if profile.timeline_months else remaining_goal
    return RatioMetrics(
        budget_ratio=round2(budget_ratio),
        savings_rate=round2(savings_rate),
        debt_to_income=round2(debt_to_income),
        required_monthly_savings=round2(required_monthly_savings),
    )


def compute_risk_level(profile: UserProfile, ratios: RatioMetrics) -> str:
    risk_score = 0
    if ratios.debt_to_income > 50:
        risk_score += 2
    elif ratios.debt_to_income > 30:
        risk_score += 1

    if ratios.savings_rate < 10:
        risk_score += 2
    elif ratios.savings_rate < 20:
        risk_score += 1

    if ratios.budget_ratio > 85:
        risk_score += 2
    elif ratios.budget_ratio > 70:
        risk_score += 1

    if profile.risk_preference == "high":
        risk_score -= 1
    elif profile.risk_preference == "low":
        risk_score += 1

    if risk_score >= 5:
        return "high"
    if risk_score >= 3:
        return "moderate"
    return "low"


def financial_health_score(ratios: RatioMetrics) -> int:
    score = 100
    if ratios.budget_ratio > 80:
        score -= 20
    elif ratios.budget_ratio > 65:
        score -= 10

    if ratios.savings_rate < 10:
        score -= 25
    elif ratios.savings_rate < 20:
        score -= 10

    if ratios.debt_to_income > 50:
        score -= 25
    elif ratios.debt_to_income > 35:
        score -= 15

    return max(0, min(100, score))


def default_action_plan(profile: UserProfile, ratios: RatioMetrics) -> list[str]:
    plan = []
    if ratios.budget_ratio > 70:
        plan.append("Reduce non-essential spending by 10-15% over the next 90 days.")
    plan.append(f"Automate at least ₹{ratios.required_monthly_savings:,.0f} monthly for your goal.")
    if ratios.debt_to_income > 35:
        plan.append("Use avalanche debt repayment: prioritize highest-interest debt first.")
    else:
        plan.append("Allocate surplus to diversified SIPs aligned with your risk preference.")
    plan.append("Maintain an emergency fund of 6 months of expenses before higher-risk investing.")
    return plan


def recommend_investment_mix(risk_level: str) -> str:
    if risk_level == "high":
        return "80% equity index funds, 15% debt funds, 5% liquid cash"
    if risk_level == "moderate":
        return "60% equity index funds, 30% debt funds, 10% liquid cash"
    return "35% equity index funds, 45% debt funds, 20% liquid cash"
