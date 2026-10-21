# LegacyLeads — OmniLead Nexus

**Lead generation, delivery, and data enrichment system** for realtors, attorneys, and B2B sales teams. Operates as a standalone SaaS, a CRM add-on, and an AI-agent-driven data server.

> This project was specified in `VISION.md` (OmniLead Nexus). Current state: **early MVP** — see "Status vs Vision" below for exactly what is implemented and what remains.

## What It Does

- **FSBO / Expired prospecting** — dead-listing queue ranked by estimated owner equity
- **Neighborhood market analytics** — city-level market slices for micro-trend spotting
- **Contact enrichment** — skip-trace cascade with phone/email discovery
- **TCPA compliance** — quiet-hours enforcement by local timezone before any dialing
- **Credit economy** — basic vs premium data buckets with atomic credit deduction (BullMQ + Redis)
- **AI-sync webhooks** — `/webhooks/ai-sync` accepts agent jobs (AI Sync Queue with compliance guardrails)
- **Custom CRM integration** — REST API (`/listings`, `/augmentpropertyrecord`, `/webhooks/ai-sync`, `/health`)

## Architecture

- **Frontend:** Next.js 14 (App Router) + Tailwind — `frontend/`
- **Backend:** Express + TypeScript — `backend/` (BullMQ queues, Postgres/`pg`, Redis)
- **AI:** DeepSeek V4 (fallback OpenAI) for record augmentation
- **Compliance:** `compliance.ts` — TCPA legal-hours guard on every queued job

### Key Backend Modules

| Module | Purpose |
|---|---|
| `src/queue.ts` | BullMQ `AI_Sync_Queue` — background lead sync with TCPA guard |
| `src/skiptrace.ts` | Multi-provider skip-trace cascade |
| `src/compliance.ts` | Timezone-aware legal calling hours |
| `src/credits.ts` | Credit deduction / ledger |
| `src/deduplicate.ts` | Cross-account record stitching |

## Quick Start

```bash
# Frontend (port 3005 in prod)
cd frontend && npm install --legacy-peer-deps && npm run dev

# Backend (port 3006 in prod)
cd backend && npm install && npm run dev   # ts-node --esm src/index.ts
```

Environment: `DATABASE_URL`, `REDIS_URL` (optional — degrades gracefully), `DEEPSEEK_API_KEY`.

## Status vs Vision (OmniLead Nexus)

### Implemented
- Frontend pages: Contacts, FSBO/Expired, Neighborhoods, Help Center, Settings & Sync
- Backend REST API (4 routes), AI Sync job queue with TCPA guardrail, credit deduction, skip-trace cascade, dedup
- DeepSeek-powered record augmentation

### Remaining (from VISION.md)
- Universal MLS ingestion gateway (RESO Web API abstraction) — per-state MLS credentials
- Interactive map prospecting (Mapbox/Supercluster polygon draws, saved lists)
- Tiered credit purchasing + Stripe billing + top-off UI
- Multi-LLM agent routing (OpenAI/Anthropic/Gemini/Hermes/OpenClaw adapters)
- Daily lead delivery reports (email), delivery schedule UI
- Import from file + custom field mappings, custom dispositions
- Search by phone/address across synced + imported records
- White-label API for major CRMs + custom integration builder

## Documentation

| File | Purpose |
|---|---|
| `VISION.md` | Full OmniLead Nexus product spec |
| `MEMORY.md` | Architecture notes and gotchas |
| `CHANGELOG.md` | Version history |
| `DEPLOY.md` | Deployment (Hetzner, port 3215) |
