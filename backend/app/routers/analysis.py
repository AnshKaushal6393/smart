from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..services.financial import calculate_ratios, compute_risk_level, default_action_plan, financial_health_score
from ..services.gemini import build_financial_prompt, generate_ai_analysis

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


@router.get("/prompt-preview/{profile_id}")
def get_prompt_preview(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).filter(models.UserProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")
    ratios = calculate_ratios(profile)
    risk_level = compute_risk_level(profile, ratios)
    return {"prompt": build_financial_prompt(profile, ratios, risk_level)}


@router.post("", response_model=schemas.AnalysisResponse)
def analyze_finances(payload: schemas.AnalysisRequest, db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).filter(models.UserProfile.id == payload.profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")

    ratios = calculate_ratios(profile)
    risk_level = compute_risk_level(profile, ratios)
    baseline_score = financial_health_score(ratios)
    prompt = build_financial_prompt(profile, ratios, risk_level)

    ai_json, ai_raw = generate_ai_analysis(prompt)
    budget_insights = ai_json.get("budget_insights", []) if ai_json else []
    investment_suggestions = ai_json.get("investment_suggestions", []) if ai_json else []
    risk_warnings = ai_json.get("risk_warnings", []) if ai_json else []
    action_plan = ai_json.get("action_plan", []) if ai_json else default_action_plan(profile, ratios)
    spending_insights = ai_json.get("spending_insights", []) if ai_json else []
    health_score = ai_json.get("financial_health_score", baseline_score) if ai_json else baseline_score

    record = models.AnalysisRecord(
        profile_id=profile.id,
        health_score=int(health_score),
        budget_ratio=ratios.budget_ratio,
        savings_rate=ratios.savings_rate,
        debt_to_income=ratios.debt_to_income,
        risk_level=risk_level,
        ai_summary=(ai_json.get("summary", ai_raw) if ai_json else ai_raw)[:2000],
        action_plan="\n".join(action_plan)[:2000],
    )
    db.add(record)
    db.commit()

    return schemas.AnalysisResponse(
        profile_id=profile.id,
        financial_health_score=int(health_score),
        ratios=schemas.Ratios(
            budget_ratio=ratios.budget_ratio,
            savings_rate=ratios.savings_rate,
            debt_to_income=ratios.debt_to_income,
            required_monthly_savings=ratios.required_monthly_savings,
        ),
        risk_level=risk_level,
        budget_insights=budget_insights,
        investment_suggestions=investment_suggestions,
        risk_warnings=risk_warnings,
        action_plan=action_plan,
        spending_insights=spending_insights,
        ai_raw_response=ai_raw,
    )
