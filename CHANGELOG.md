# CHANGELOG

## [0.1.0] - Initial Setup
- Initialized core structural documentation: VISION.md, MEMORY.md, DEPLOY.md, IDEAS.md, CHANGELOG.md, ROADMAP.md, TODO.md.
- Scaffolded Next.js (TypeScript/Tailwind) frontend project layout.
- Scaffolded Node.js (TypeScript) backend project structure.

## [0.2.0] - Core Database & Ingestion Layer
- Established PostgreSQL connection pooling in `backend/src/db.ts` utilizing `pg` module.
- Set up high-speed Redis caching architecture in `backend/src/redis.ts`.
- Built the `UnifiedPropertyRecord` TypeScript interface representing the unified RESO API abstraction schema.
