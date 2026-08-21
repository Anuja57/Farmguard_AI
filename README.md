FarmGuard AI
FarmGuard AI is a production-ready starter for a sustainable farming platform with a React frontend, FastAPI backend, LangGraph-style multi-agent workflow, Supabase-ready persistence, n8n automation samples, and Relay webhook integration.

What is included
React + Vite + Tailwind CSS + reusable ShadCN-style UI primitives
FastAPI backend with JWT auth, Swagger docs, logging, and modular services
Multi-agent routing flow for disease, weather, irrigation, market, advisory, and notifications
Supabase SQL schema
n8n workflow JSON examples
Relay webhook payload example
Dockerfiles and docker-compose.yml
Project structure
farmguard-ai/
├── frontend/
├── backend/
├── ai-workflows/
├── database/
├── automation/
└── docs/
Quick start
1. Frontend
cd frontend
npm install
npm run dev
2. Backend
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
3. Docker
docker compose up --build
API endpoints
POST /register
POST /login
POST /ask-ai
POST /detect-disease
GET /weather/{location}
GET /market-prices/{crop}
GET /notifications
GET /analytics
Swagger docs are available at http://localhost:8000/docs.

Environment setup
Copy .env.example to .env and fill in:

OpenAI or Groq keys for live LLM responses
OpenWeatherMap API key for live weather
Supabase credentials for database persistence
Relay webhook URL for outbound automation payloads
Supabase setup
Run [database/schema.sql](C:\Users\Lenovo\Documents\New project\farmguard-ai\database\schema.sql) in the Supabase SQL editor.

n8n automation
Import the JSON files in [automation/n8n](C:\Users\Lenovo\Documents\New project\farmguard-ai\automation\n8n) into your n8n instance, then connect your preferred WhatsApp or SMS provider.

Deployment
Railway / Render
Deploy backend as a Python web service
Deploy frontend as a static site
Set environment variables from .env.example
AWS EC2
Install Docker and Docker Compose
Clone the repo
Run docker compose up -d --build
Place Nginx or an AWS Application Load Balancer in front for HTTPS
Notes
Disease detection uses mock inference with realistic output so you can demo immediately.
Weather and market modules gracefully fall back to demo data when keys are not configured.
LangGraph orchestration is implemented in a way that can be upgraded to live tools without changing API contracts.
