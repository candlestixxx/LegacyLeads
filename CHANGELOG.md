# Changelog — OmniLead Nexus

All notable changes to this project are documented here.

---

## [1.1.0] — 2026-07-02 — Frontend Scaffolded

### Added
- **Next.js 16 Frontend:** Scaffolded with TypeScript, Tailwind CSS v4, App Router, and `src/` directory.
- **pnpm Migration:** Adopted pnpm as package manager (npm was unreliable in this environment); build scripts updated.
- **Production Build Verified:** Next.js compiles successfully (static generation, 2 routes).

### Changed
- `build.bat` — Added pnpm detection and fallback to npm.
- `start.bat` — Added pnpm detection for dev server.
- `setup.bat` — Will use pnpm install when available.

---

## [1.0.0] — 2026-07-02 — Initial Foundation

### Added
- **Repository Scaffold:** Initial git repository with `main` branch established.
- **README.md:** Comprehensive project specification including:
  - Architecture blueprint for national MLS data ingestion
  - Interactive mapping & custom list engine specification
  - Multi-LLM & AI agent integration architecture (Hermes, OpenAI, Anthropic, Gemini, OpenClaw)
  - Credit monetization & tiered business logic
  - UI/UX wireframe mapping for dashboard, API portal, and settings panels
  - Compliance & TCPA guardrail requirements
- **VERSION.md:** Centralized version governance file (v1.0.0, build 20260702.1).
- **ROADMAP.md:** Major milestones and structural development phases.
- **TODO.md:** Granular short-term tasks and immediate implementation items.
- **VISION.md:** Comprehensive project vision and ultimate goal documentation.
- **MEMORY.md:** Internal architectural observations and design preferences.
- **DEPLOY.md:** Deployment and environment setup instructions.
- **IDEAS.md:** Creative ideas for pivots, refactoring, and feature expansions.
- **HANDOFF.md:** Session handoff documentation for successor models.
