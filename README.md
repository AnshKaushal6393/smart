# AI Financial Advisor

A modern AI-powered financial planning web app with a React + Tailwind frontend and FastAPI backend.  
It generates personalized financial advice using **Google Gemini 2.0 Flash**, stores profiles in SQLite, and visualizes key metrics with Recharts.

## Tech Stack

- Frontend: React, Tailwind CSS, Recharts
- Backend: FastAPI, SQLAlchemy
- AI: Google Gemini (`gemini-2.0-flash`)
- Database: SQLite
- Deployment: Dockerfiles + `docker-compose.yml`

## Folder Structure

```txt
smart/
├─ backend/
│  ├─ app/
│  │  ├─ main.py
│  │  ├─ database.py
│  │  ├─ models.py
│  │  ├─ schemas.py
│  │  ├─ routers/
│  │  │  ├─ profile.py
│  │  │  ├─ analysis.py
│  │  │  └─ goals.py
│  │  └─ services/
│  │     ├─ financial.py
│  │     └─ gemini.py
│  ├─ requirements.txt
│  ├─ Dockerfile
│  └─ .env.example
├─ frontend/
│  ├─ src/
│  │  ├─ pages/
│  │  ├─ components/
│  │  ├─ state/
│  │  └─ lib/
│  ├─ package.json
│  ├─ Dockerfile
│  └─ .env.example
├─ docker-compose.yml
└─ README.md
```

## Core Features Implemented

1. User financial profile input (income, expenses, savings, debt, goals, timeline, risk)
2. AI analysis engine using Gemini with structured prompt + JSON output parsing
3. Smart advice sections:
   - Financial Health Score
   - Budget Insights
   - Investment Suggestions
   - Risk Warnings
   - Action Plan
4. Goal planning:
   - Required monthly savings
   - Progress tracking
   - Recommended strategy and risk level
5. Interactive dashboard charts:
   - Income vs Expense
   - Savings projection
   - Debt reduction
   - Goal completion
6. Responsive UI with sidebar navigation and dedicated pages:
   - Home
   - Financial Dashboard
   - Goal Planning
   - AI Advice
   - User Profile

## Gemini Prompt Engineering (Example)

The backend generates a prompt in this format:

```txt
Analyze the following financial profile:
Income: X
Expenses: Y
Savings: Z
Debt: D
Financial Goal: G
Goal Amount: A
Timeline (months): T
Risk Preference: R

Provide structured financial advice including budgeting, saving strategy, debt management, and investment suggestions.
```

You can inspect the exact generated prompt via:

- `GET /api/analysis/prompt-preview/{profile_id}`

## API Endpoints

- `POST /api/profile` - create user profile
- `GET /api/profile/{profile_id}` - fetch profile
- `POST /api/analysis` - generate AI analysis from Gemini
- `GET /api/analysis/prompt-preview/{profile_id}` - inspect generated Gemini prompt
- `POST /api/goals/plan` - goal-based financial planning
- `GET /health` - service health check

## Run Locally

### 1) Backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
```

Set `GEMINI_API_KEY` in `backend/.env`, then run:

```bash
uvicorn app.main:app --reload --port 8000
```

### 2) Frontend

```bash
cd frontend
npm install
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
npm run dev
```

Open `http://localhost:5173`.

### 3) Docker (optional)

```bash
copy backend\.env.example backend\.env   # Windows
docker compose up --build
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:8000`

## Scalability-Ready Design

- Clear module boundaries (`routers`, `services`, `models`) for easy feature expansion
- AI prompt logic isolated in a service for future model/provider swaps
- Schema-based API contracts for predictable multi-client integration
- Extensible data model for future:
  - Predictive analytics
  - Risk simulations
  - Multi-user dashboards
  - Portfolio tracking
