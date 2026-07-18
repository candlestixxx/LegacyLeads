# CHANGELOG

## [0.1.0] - Initial Setup
- Initialized core structural documentation: VISION.md, MEMORY.md, DEPLOY.md, IDEAS.md, CHANGELOG.md, ROADMAP.md, TODO.md.
- Scaffolded Next.js (TypeScript/Tailwind) frontend project layout.
- Scaffolded Node.js (TypeScript) backend project structure.

## [0.2.0] - Core Database & Ingestion Layer
- Established PostgreSQL connection pooling in `backend/src/db.ts` utilizing `pg` module.
- Set up high-speed Redis caching architecture in `backend/src/redis.ts`.
- Built the `UnifiedPropertyRecord` TypeScript interface representing the unified RESO API abstraction schema.
- Added `backend/migrations/01_initial_schema.sql` mapping PostgreSQL structure with PostGIS and atomic `credit_ledgers`.
- Implemented robust transactional `deductCredits` function in `backend/src/credits.ts`.
- Configured foundational Express API with `GET /listings` and `POST /augmentpropertyrecord` routes.
- Wrote and verified integration tests via Jest + Supertest (`app.test.ts`).

## [0.3.0] - AI Agentic Event Queues
- Implemented BullMQ queue architecture (`backend/src/queue.ts`) designed to handle background processing for heavy geospatial queries and skip-tracing.
- Exceeded AI dialer integration requirements by creating an async `POST /webhooks/ai-sync` route which responds instantly with 202 Accepted.
- Covered the new async architecture with full Jest integration tests.

## [0.4.0] - Frontend Maps & Dashboard Skeleton
- Drafted main frontend dashboard UI featuring `Sidebar` and `OmniSearch`.
- Drafted `InteractiveMap` core component leveraging `react-map-gl` and Mapbox GL.
- Configured frontend Next.js routing and UI integration for the Live Market Feed.
