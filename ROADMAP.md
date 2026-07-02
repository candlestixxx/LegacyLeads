# ROADMAP

## Long-term Structural Milestones

### Phase 1: Core Foundation & Data Pipelines
- Stand up robust PostgreSQL (PostGIS) and Redis database layer.
- Build the "Ingestion Abstraction Layer" to normalize raw MLS and tax data to the RESO Web API standard.
- Build out the RESTful backend endpoints (GET /listings, POST /augmentpropertyrecord).
- Stand up the Next.js frontend with Mapbox GL integration and base component scaffolding.

### Phase 2: Credit Augmentation & Cascading Lookups
- Implement the smart skip-tracing cascade engine for layered vendor data pulling.
- Deploy the modular credit ledger system with atomic transactions (preventing negative margin).
- Implement basic and advanced data tier billing mechanics.

### Phase 3: High-Throughput & Agentic Connectivity
- Deploy BullMQ / Redis queues to handle 10k+ request/minute webhook spikes from AI dialers.
- Expose clear SDK endpoints for third-party AI agents (Gemini, Hermes, OpenClaw).
- Develop the deduplication and global cross-account record stitching engine.

### Phase 4: UI/UX Maturity & Compliance
- Finalize the frontend interactive map UI (Supercluster caching, drawing tools).
- Inject AI recommendation hot-sheet widgets to the dashboard.
- Enable TCPA / CAN-SPAM compliant localized dynamic "quiet hour" delivery rules.

### Phase 5: Production Readiness
- Finalize user manual and in-app help center docs mapping endpoints.
- Establish multi-tiered sub-account capabilities for Enterprise retail modes.
- Perform load-testing on massive geographic bounds (10,000+ polygon selections).
