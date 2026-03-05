from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ProfileBase(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    monthly_income: float = Field(gt=0)
    monthly_expenses: float = Field(ge=0)
    current_savings: float = Field(ge=0)
    existing_debt: float = Field(ge=0)
    financial_goal: str = Field(min_length=2, max_length=255)
    goal_amount: float = Field(gt=0)
    timeline_months: int = Field(gt=0, le=600)
    risk_preference: Literal["low", "moderate", "high"] = "moderate"


class ProfileCreate(ProfileBase):
    pass


class ProfileResponse(ProfileBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Ratios(BaseModel):
    budget_ratio: float
    savings_rate: float
    debt_to_income: float
    required_monthly_savings: float


class GoalPlan(BaseModel):
    current_progress_pct: float
    required_monthly_savings: float
    projected_completion_months: float
    recommended_strategy: str
    risk_level: str


class AnalysisRequest(BaseModel):
    profile_id: int


class AnalysisResponse(BaseModel):
    profile_id: int
    financial_health_score: int
    ratios: Ratios
    risk_level: str
    budget_insights: list[str]
    investment_suggestions: list[str]
    risk_warnings: list[str]
    action_plan: list[str]
    spending_insights: list[str]
    ai_raw_response: str


class GoalPlanRequest(BaseModel):
    profile_id: int


class GoalPlanResponse(BaseModel):
    profile_id: int
    plan: GoalPlan
