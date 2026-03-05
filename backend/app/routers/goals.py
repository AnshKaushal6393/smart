from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..services.financial import calculate_ratios, compute_risk_level, recommend_investment_mix

router = APIRouter(prefix="/api/goals", tags=["goals"])


@router.post("/plan", response_model=schemas.GoalPlanResponse)
def create_goal_plan(payload: schemas.GoalPlanRequest, db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).filter(models.UserProfile.id == payload.profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")

    ratios = calculate_ratios(profile)
    risk_level = compute_risk_level(profile, ratios)
    remaining_goal = max(profile.goal_amount - profile.current_savings, 0)
    monthly_surplus = max(profile.monthly_income - profile.monthly_expenses, 0.1)
    projected_completion_months = remaining_goal / monthly_surplus
    current_progress_pct = min((profile.current_savings / profile.goal_amount) * 100, 100)

    return schemas.GoalPlanResponse(
        profile_id=profile.id,
        plan=schemas.GoalPlan(
            current_progress_pct=round(current_progress_pct, 2),
            required_monthly_savings=ratios.required_monthly_savings,
            projected_completion_months=round(projected_completion_months, 2),
            recommended_strategy=recommend_investment_mix(risk_level),
            risk_level=risk_level,
        ),
    )
