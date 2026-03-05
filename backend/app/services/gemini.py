import json
import os
from typing import Any

import google.generativeai as genai

from ..models import UserProfile
from .financial import RatioMetrics, recommend_investment_mix


def build_financial_prompt(profile: UserProfile, ratios: RatioMetrics, risk_level: str) -> str:
    return f"""
Analyze the following financial profile:
Income: {profile.monthly_income}
Expenses: {profile.monthly_expenses}
Savings: {profile.current_savings}
Debt: {profile.existing_debt}
Financial Goal: {profile.financial_goal}
Goal Amount: {profile.goal_amount}
Timeline (months): {profile.timeline_months}
Risk Preference: {profile.risk_preference}

Computed Metrics:
- Budget ratio: {ratios.budget_ratio}%
- Savings rate: {ratios.savings_rate}%
- Debt-to-income ratio: {ratios.debt_to_income}%
- Required monthly savings: {ratios.required_monthly_savings}
- Base risk level: {risk_level}
- Suggested base investment allocation: {recommend_investment_mix(risk_level)}

Respond in strict JSON with keys:
financial_health_score (0-100 integer),
budget_insights (array of strings),
investment_suggestions (array of strings),
risk_warnings (array of strings),
action_plan (array of strings),
spending_insights (array of strings),
summary (string).

Prioritize realistic, India-friendly advice in INR and avoid guarantees.
""".strip()


def _extract_json(text: str) -> dict[str, Any]:
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`")
        text = text.replace("json", "", 1).strip()
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON object found in model response.")
    return json.loads(text[start : end + 1])


def generate_ai_analysis(prompt: str) -> tuple[dict[str, Any] | None, str]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None, "GEMINI_API_KEY not configured."

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")
    try:
        response = model.generate_content(prompt)
    except Exception as error:
        return None, f"Gemini request failed: {error}"

    raw_text = (response.text or "").strip()
    if not raw_text:
        return None, "Gemini returned an empty response."

    try:
        return _extract_json(raw_text), raw_text
    except Exception:
        return None, raw_text
