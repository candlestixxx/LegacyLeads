# OmniLead Nexus — Deployment Guide

## Environment Prerequisites

### Local Development
| Component | Version | Notes |
|-----------|---------|-------|
| Node.js | >= 18.x LTS | Required for frontend (Next.js) |
| Python | >= 3.11 | Optional backend (FastAPI alternative) |
| PostgreSQL | >= 15.x | With PostGIS extension |
| Redis | >= 7.x | For queue management |
| Docker | >= 24.x | Recommended for environment parity |
| Docker Compose | >= 2.x | For multi-service orchestration |

### Environment Variables
Create `.env.local` for frontend and `.env` for backend:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/omnileadnexus
POSTGIS_ENABLED=true

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=<generate-random-secret>
JWT_EXPIRY=24h

# External APIs
MAPBOX_ACCESS_TOKEN=<your-mapbox-token>
GOOGLE_MAPS_API_KEY=<your-google-maps-key>

# MLS Credential Gateway
MLS_API_BASE_URL=<mls-reso-api-endpoint>

# Payment Gateway
STRIPE_SECRET_KEY=<stripe-secret>
STRIPE_PUBLISHABLE_KEY=<stripe-publishable>

# AI Provider Keys (optional per integration)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
```

## Local Setup

### Using Docker (Recommended)
```bash
docker compose up -d
```

### Manual Setup
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Production Build
```bash
# Frontend build
cd frontend
npm run build

# Docker production build
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

## Deployment Targets
- **Vercel** (recommended for Next.js frontend)
- **Railway / Render** (backend API)
- **AWS EC2 / ECS** (enterprise self-hosted)
- **Google Cloud Run** (containerized deployment)

## Database Migrations
```bash
# Generate migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Monitoring
- **Health Check:** `GET /api/health`
- **Metrics:** Prometheus endpoint at `/api/metrics`
- **Logging:** Structured JSON logging to stdout (Docker)
