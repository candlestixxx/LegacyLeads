# OmniLead Nexus — System Memory & Architectural Observations

## Repository Structure
```
C:/Users/jakeg/workspace/LegacyLeads/
├── README.md           # Project specification & protocol instructions
├── VERSION.md          # Centralized version/build governance
├── CHANGELOG.md        # Change log
├── ROADMAP.md          # Long-term milestones
├── TODO.md             # Immediate task backlog
├── VISION.md           # Project vision & core tenets
├── MEMORY.md           # This file — architectural observations
├── DEPLOY.md           # Deployment & environment setup
├── IDEAS.md            # Creative expansion ideas
├── HANDOFF.md          # Session handoff documentation
├── backend/            # Node.js/TypeScript API service
│   ├── src/index.ts    # Entry point
│   ├── dist/           # Compiled output
│   ├── package.json    # omnilead-nexus-backend
│   └── tsconfig.json
├── frontend/           # Next.js 16 web application
│   ├── src/app/        # App Router pages
│   ├── AGENTS.md       # AI agent rules for Next.js 16
│   ├── CLAUDE.md       # Agent reference
│   └── package.json
├── *.bat               # Execution scripts (build, start, setup)
└── .gitignore
```

## Key Architectural Decisions
1. **Single repository monorepo** approach — all modules within one repo for simplicity during initial build phase. Future extraction into submodules may be warranted for the AI agent SDK and CRM integration packages.
2. **No submodules currently** — the README specifies submodule management in its protocol, but no submodules exist yet. Will add as the system grows.
3. **Version scheme** uses VERSION.md as single source of truth rather than hardcoding in application code.
4. **pnpm is the package manager** — npm is unreliable in this environment (extreme slowness, tarball corruption). Use `pnpm install` consistently.

## Design Preferences
- Clean, modern UI with minimal friction for credit purchasing
- Dark/light mode support (future)
- Keyboard shortcuts for power users (future)
- Interactive map should feel native, not laggy

## Potential Pain Points Identified
1. MLS data formatting varies wildly by region — the ingestion abstraction layer is critical
2. Deduplication at scale requires careful geospatial indexing
3. Credit atomicity during high-concurrency batch operations needs careful transaction design
4. TCPA compliance is legally non-negotiable — must be architected in from day one

## Observations
- The README.md doubles as both project documentation AND a protocol/instruction file for AI coding agents. This is intentional per the "PRINCIPLE DIRECTIVE" section.
- First commit (d8cd14d) established the README with the full OmniLead Nexus specification.
- No build scripts, no package.json, no configuration files exist yet — this is a greenfield project.
