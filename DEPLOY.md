# DEPLOY

## Environment Setup & Deployment Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 15+ (with PostGIS extension enabled)
- Redis 6+

### Environment Variables (.env)
Required across Frontend and Backend services:

```env
# Database
DATABASE_URL=postgres://user:pass@localhost:5432/omnilead
REDIS_URL=redis://localhost:6379

# Map & API Keys
MAPBOX_ACCESS_TOKEN=your_mapbox_token
# Add LLM Keys
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
GEMINI_API_KEY=your_key

# Third-Party Integrations
STRIPE_SECRET_KEY=your_stripe_key
```

### Local Development Startup

**1. Database Setup**
```bash
# Ensure Postgres is running and the 'omnilead' db exists with PostGIS.
# Create PostGIS extension inside your DB:
# CREATE EXTENSION postgis;
```

**2. Backend Service**
```bash
cd backend
npm install
npm run start:dev # or npx ts-node src/index.ts
```

**3. Frontend Service**
```bash
cd frontend
npm install
npm run start:dev
```

### Production Deployment Notes
- **Scaling:** Backend services parsing MLS webhooks must be deployed behind a load balancer to handle ingestion spikes. Redis/BullMQ instances require dedicated memory scaling.
- **Geospatial Processing:** Ensure PostGIS spatial indices are built during production migration steps to keep bounding-box queries optimal.
- **Edge Caching:** Map tile components should rely heavily on edge CDN caching.
