# MEMORY

## Internal Architectural Observations

- **Frontend Tech Stack:** Next.js (TypeScript), Tailwind CSS, Mapbox GL / Google Maps API for drawing layers. Needs robust client-side caching (e.g., Supercluster) for map rendering performance.
- **Backend Tech Stack:** Node.js (TypeScript) acting as a RESTful API with native Webhook event handling.
- **Database Architecture:** PostgreSQL for relational data, including PostGIS for polygon mapping and spatial calculations. Redis and BullMQ for high-speed lead synchronization queues and webhook handling.
- **Data Standardization:** Critical to enforce RESO Web API standardization upon ingestion to handle disparate MLS formats uniformly.
- **Deduplication:** A strict deduplication mechanism combining lat/long and normalized address ensures clean records globally.
- **Queue System:** High-throughput Redis queue is mandatory for processing 1,000+ lead webhook queries from AI dialing agents efficiently.
- **Credit Hooks:** Ensure every advanced data pull performs an atomic check against a user’s ledger to avoid margin bleed.

## Codebase Traits & Design Preferences

- **Modularity:** High decoupling required between the Core API, the Credit System, and UI so the app can function as both a standalone SaaS and a CRM add-on.
- **Compliance:** Enforce TCPA quiet hours via automated overrides mapping property Zip code time zones.
- **Error Handling:** Fallback cascading skip-tracing needs to gracefully route from Provider A -> B -> C transparently to the user, tracking exact fractional costs based on successful delivery.
