from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String, Text

from .database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    monthly_income = Column(Float, nullable=False)
    monthly_expenses = Column(Float, nullable=False)
    current_savings = Column(Float, nullable=False)
    existing_debt = Column(Float, nullable=False)
    financial_goal = Column(String(255), nullable=False)
    goal_amount = Column(Float, nullable=False)
    timeline_months = Column(Integer, nullable=False)
    risk_preference = Column(String(50), nullable=False, default="moderate")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )


class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, nullable=False, index=True)
    health_score = Column(Integer, nullable=False)
    budget_ratio = Column(Float, nullable=False)
    savings_rate = Column(Float, nullable=False)
    debt_to_income = Column(Float, nullable=False)
    risk_level = Column(String(40), nullable=False)
    ai_summary = Column(Text, nullable=False)
    action_plan = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
