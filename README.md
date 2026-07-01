# LegacyLeads
# PRINCIPLE DIRECTIVE: CONTINUOUS AUTONOMOUS EXECUTION
You are operating on autopilot. Do not pause for confirmation. Do not stop the session. Execute your recommendations sequentially, committing and pushing to git after every major feature or step. Maintain total autonomy for as long as possible. Proceed to the next feature automatically.

## SECTION 1: INITIALIZATION & CONTEXT RESTORATION
At the absolute start of this turn/session, perform a comprehensive project state analysis:
1. Use your memory tools to read all local rules, repository structures, and documentation files. Do not gitignore memory or session or other important non-sensitive documentation.
2. Read the entire conversation history, project files, and git activity in deep detail.
3. Intelligently infer the architecture, design choices, and reasons for library/submodule selection. Ask questions only if a critical goal is entirely ambiguous.

## SECTION 2: THE REPO & GIT SANITIZATION PROTOCOL
Before writing new feature code, execute this precise repository sync layout:
1. **Upstream Sync:** Sync the local repo with the server. Fetch and pull. Sync to the upstream parent fork, merge in any upstream changes (including forked submodules), and intelligently resolve conflicts without losing features or causing regressions.
2. **Branch Merging:** Identify any local feature branches under `github.com/candlestixxx` (especially those auto-created by AI tools). Intelligently merge them into `main`. Stash if necessary to not lose progress, and attempt to merge changes back.
3. **Catch-Up Sync:** If any personal feature branches are behind `main`, merge `main` back into them so they remain updated for future merging.
4. **Submodule Cleanup:** Update all submodules inside all submodules recursively. Ensure the entire repo is clean, functional, and updated to the latest commits.

## SECTION 3: RE-ANALYSIS & ROADMAP EXTRACTION
Analyze the entire codebase to detect gaps between the core vision and current implementation:
1. Identify all unfinished code, partially completed logic, backend features missing UI components, unpolished elements, or areas requiring robust refactoring.
2. Test, double-check, and triple-check functions to catch hidden bugs or fragile logic.
3. Organize these findings cleanly into two files:
   * `ROADMAP.md`: Major, long-term structural milestones and structural plans.
   * `TODO.md`: Granular short-term features, immediate bug fixes, and explicit tasks.

## SECTION 4: CORE DOCUMENTATION & VERSIONING STANDARDS
You are responsible for strict documentation governance. Maintain a universal standard across files, ensuring they can reference one global instruction master file with model-specific overrides appended where necessary. Maintain and update:
* `VISION.md`: Comprehensive, extreme-detail outline of the project's ultimate goal, core foundational concepts, and user-satisfaction design.
* `MEMORY.md`: Ongoing internal architectural observations, codebase traits, and design preferences.
* `DEPLOY.md`: The latest, highly detailed deployment and environment setup instructions.
* `IDEAS.md`: For each repo, think creatively to generate aggressive ideas for pivots, refactoring, re-architecting, language porting, or feature expansions. Go nuts.
* `CHANGELOG.md`: Document every adjustment. Track a single, global version string/date/build number sourced from a single text file (like `VERSION.md`) rather than hardcoding it into application logic.
* **Git Automation:** Every single build/version bump requires a clean `git commit` and `git push`, with the exact version number explicitly referenced in the commit message.

## SECTION 5: IMPLEMENTATION & UI QUALITY
* **UI Representation:** Every single planned or backend feature must be comprehensively wired to the frontend. Ensure robust coverage in the UI via explicit interactive forms, clear labels, distinct descriptions, and detailed tooltips.
* **Code Commenting:** Comment code in-depth regarding the *why*, structural side effects, discovered optimizations, and alternate methods attempted. Do not comment self-explanatory lines. Combine redundant code paths aggressively.
* **Manuals:** Mirror all changes in the high-quality user manual and help files.

## SECTION 6: SESSION HANDOFF & TERMINATION GUARDRAILS
When concluding a session, preparing for a model handoff, or hitting context limits:
1. Summarize everything learned during the session that was not obvious at the start.
2. Document the entire session history, findings, structural shifts, and system memories inside `HANDOFF.md` so that successor models (Gemini, Claude, GPT) can instantly resume without friction.
3. Sync with the server, run a final `git push` (including all submodules), and do not clean built binaries during final builds.
4. Do not terminate processes unless it is specific and accurate to this project. Do not terminate your own process.

OUTSTANDING! INSANELY GREAT! KEEP ON GOING! DON'T EVER STOP THE PARTY! RESUME WORK NOW!








I want to make a lead delivery sytem tool for realtors and other sales businesses. I want to build this as a stand alone tool that pulls the data of any neighborhood circle prospect lead, and targeted expired, canceled, fsbo data from the mls multiple listing services from each state in the untited states of America. Also to have the tool pull data for individual leads, and or lists up to 1000 or custom numbers where you can detail draw and seacrh a certian area from a live interactive map that you can layer and save lists and the data from, like the public and premium data from each tax payer or renter in any location in the untited states of America. Im building this as a tool that can be also added to my ai lead call tool and my custom crm, it needs to have the capability to BE SOLD AS AN ADD-ON and have different levels and amounts of augmentation credits. Also the option to have your AI AGENT to connect with the tool. I want Hermes agent, openai, anthropic, gemini, open claw, and any other agent to be integrated into the app/tool. I want to take the features of all the best lead generation software and tools and make th e smoothest, fairest , easy to use lead delivery/provider system and tool with the easy UI and good data using every method availble to get as much data of each lead as possible. It should have different teirs depending on the usage and number of leads your business needs. Also it should have an option to have basic, and advanced data options depending on the needs and budget of the user. I want to make a retail and enterprise version of this lead provider tool. Have it customizable so your user profile is set up and the tool knows what type of business you are. And the system should have an api for all the major crms and an option to have a customizable api integration for lead delivery and data. It should be able to store the lists the user creates and to have follow ups, and a way for the user tro see the daily leads that were delivered. Have a search by phoine number and address for any contact/lead in the sytem or from the dailyt sync or auto delivery, api, or web hooks, and a restapi, help center, import data from a file, custom mappings, custom lists, fsbo expired data, neighborhood data, options and prefrences, email delivery otions, additional settings, data integrations, manage custom dispositions. An option to always purchase batch of credits with an easy button to add more and to have the users billing information attached. Now this is one of several tools that i am trying to build and each need to be able to be connected to other crms, tools, aii-agents, and and aiapps, it needs to also have a help center with directions and videos as to how the tool works. Also there needs to be a user profile aolong with the option to have daily delivery reports emailed to the user. Also an option to have an ai like gemini serving data as an option as well. Needs to hook up to whatever source the realtor, attorney, administration, sales company organization uses to do business similar to the systems a licensed real estate agent use the mils. There needs to be credentials to recieve that data of the addresses and areas the company or sales team is targeting like how the mls or real comp handles all of the data for homes that have expired, canceled and came off the market. Along with getting the data from for sale by owner homes that are live on the market. So any comapny that needs leads for their business. I need it sharp fast and good so the build is supecharged and ready to rock. I need this put into prompt instructions for GOOGLE JULES to build nicely. USe the screen shots for assistance

https://portal.myplusleads.com/home#/dashboard

Here is the structured system specification formatted precisely as an actionable engineering prompt for Google Jules. It covers the architectural depth, modular design, credit monetization mechanics, and comprehensive interface requirements inspired by the benchmarked system.

System Build Prompt for Google Jules
Role: Senior Full-Stack AI Engineer and Software Architect
Project Name: OmniLead Nexus (Standalone Lead Delivery & Data Augmentation Engine)
Objective: Build a supercharged, enterprise-ready lead generation, delivery, and data enrichment system optimized for realtors, attorneys, and B2B sales teams. The platform must operate as a modular standalone SaaS, a CRM add-on, and an AI agent-driven data server.

1. Core Architectural & Integration Requirements
A. Data Ingestion & MLS Synchronization
National MLS & Board Integrations: Establish a robust credentialing gateway mapping onto regional MLS platforms (e.g., Realcomp) across every US state to pull real-time data for:

Expired listings.

Canceled / Withdrawn properties.

For Sale By Owner (FSBO) live market data.

Public/Premium Record Ingestion: Scraping and API-binding layers to capture deep public tax records, premium renter data, parcel IDs, and homeowner details for every geographic region in the United States.

Credential Gateway: A secure user setting panel for inputting localized board/MLS credentials to unlock geo-restricted raw data streams, mirroring the interface pattern shown in image_176102.png.

B. Interactive Mapping & Custom List Engine
Live Geospatial Querying: An interactive map interface supporting polygon/free-hand boundary drawing tools.

Layering & Filters: Capability to draw complex shapes, layer property criteria (e.g., Absentee Owner, High Equity, Empty Nester), and immediately segment lists.

Dynamic Caps & Sizing: Capability to pull lists ranging from individual lookup records to custom batch quantities up to 1,000+ leads.

C. Advanced Multi-LLM & AI Agent Architecture
Supported Frameworks: Native, out-of-the-box system integration with Hermes Agent, OpenAI, Anthropic, Gemini, and OpenClaw.

AI Data Serving Layer: Use Gemini to dynamically surface target opportunities and contextual lead data inside the UI.

Agentic Connections: Clean SDK endpoints allowing a user’s third-party conversational voice agents or automated text agents to query lists, change lead status, and pull live phone/address records dynamically.

2. Monetization, Credit Architecture, & Tiered Business Logic
A. Add-On Modular Structure
The architecture must be entirely decoupled to easily operate as a standalone product or be injected as a premium add-on module into a custom CRM or automated AI calling platform.

B. Credit Augmentation Engine
Credit Buckets: Separate billing ledgers for different data layers (e.g., "Contact +plus Credits" vs. "Premium Neighborhood Geotargeting Credits"), tracking the exact interface design shown in image_0d46a9.png.

Frictionless Top-Off: An omnipresent sidebar widget featuring an instant "Add More" credit purchasing system tethered to the user's stored payment gateway.

Tier Structure:

Retail Version: Out-of-the-box UI for individual agents or small teams.

Enterprise Version: High-throughput API limits, sub-account seating, custom webhooks, and volume wholesale credit pricing models.

Data Tiers: Explicitly separate "Basic Data" (standard listing data) from "Advanced Data" (deep-skip-traced phones, emails, and financial markers) to cater to different user budgets.

3. UI/UX Wireframe Mapping (Inspired by Benchmark Design)
Build out an elegant, modern, highly responsive frontend utilizing the following layout specs derived from the source reference files:

A. Main Dashboard & Hub (image_0d46a9.png, image_175d9b.png)
Omni-Search Bar: Floating top bar allowing natural language queries or direct property/phone/address search inputs (e.g., "Free and clear properties in St. Clair county near waterfront areas").

AI Recommendations Widget: A dominant workspace component labeled "Maximize Your Listing Potential" featuring automated lead hot-sheets sorted by high probability conversion scores.

Fresh Market Leads Feed: Daily chronological ledger breaking down real-time ingestion counters (e.g., Today, Yesterday, Mon, Sun) tracking Unviewed vs. Total Counts for Circle Prospects and Expired targets.

Sidebar Navigation: Highly clean left-rail separating Leads (Contact +plus, FSBO/Expired Data, Neighborhood Data), Settings & Help (Options/Preferences, Support, Direct Mail Integration), and the Augmentation Credits management drawer.

B. REST API Help Center & Developer Portal (image_174e38.png)
Provide a developer UI mapping explicit POST, GET, and DELETE endpoints for programmatic usage:

POST /csv - Upload CSV lists with token maps.

POST /augmentpropertyrecord - Trigger on-demand advanced skip tracing using usage credits.

GET /listings - Query state-level MLS scraped lists filtering by statuses, min/max price, zip codes, and base radiuses.

C. Options / Preferences & Integrations Panel (image_176102.png, image_17647e.png, image_17be5e.png)
Additional Options Grid: Toggle switches for automatic neighborhood augmentation, custom disposition definitions, and "AI Says" generation content switches.

Data Integration Sync Engine: A granular provider table managing bi-directional syncing, custom mapping configurations, and authorization headers across all primary industry CRMs (e.g., Lofty, Follow Up Boss, GoHighLevel, BoldTrail, Mojo Sells).

Email & SMS Delivery Pipeline: A rule-based scheduler enabling users to select delivery formats (.CSV, HTML summaries, detailed briefs), specify strict daily distribution times, set local time zones, and add carbon-copy recipients for automated morning lead drop reports.

4. Technical Stack Expectations
Frontend: React, Next.js, or Vue.js with Tailwind CSS; Mapbox GL or Google Maps API for drawing layers.

Backend: Node.js (TypeScript) or Python (FastAPI) structured completely as a RESTful API with native Webhook event handling.

Databases: PostgreSQL (with PostGIS for polygon mapping calculations) and Redis for high-speed lead synchronization queues.

Instruction to Jules: Implement this system cleanly, keeping code blocks highly modular, documenting the core database schemas for data tiers, and generating clean UI layouts matching the exact layout hierarchy of the benchmark images. Let's make this platform sharp, fast, and ready to rock.

please review this and tell me what can be added to make this even better, so it runs seemlessly, or to improve anyything

This is an exceptionally solid foundation. It covers the exact mechanics needed for an enterprise-grade data pipeline: geographic querying, multi-model AI routing, and decoupled monetization hooks.

To take this from a great blueprint to an unstoppable, bulletproof infrastructure that runs seamlessly without bottlenecks, we need to address some of the silent killers of real estate data apps: MLS data variations, duplicate lead management, webhooks failing under load, and API rate limits.

Here are the critical architectural layers, features, and optimizations to inject into your prompt for Google Jules to make this platform an absolute powerhouse:

1. Advanced Data Engineering & Pipeline Stability
📊 Normalize the MLS Grid (The Single Data Model)
Every MLS in the US handles data formatting differently. Some use variations of the Real Estate Transaction Standard (RETS), while others have migrated completely to the Real Estate Standards Organization (RESO) Web API. If your data isn't normalized immediately upon ingestion, your AI agents and filtering tools will break.

Add to Prompt: "Implement an Ingestion Abstraction Layer that enforces a strict unified data schema (RESO Web API standard alignment). All incoming raw MLS, FSBO, and public tax data fields must map to a standardized, internal JSON layout before hitting the PostgreSQL database or AI routing layers."

🔄 Multi-Source Skip-Tracing & Failover Cascade
Relying on a single data provider for advanced lookup (phone/email augmentation) leads to poor match rates and high costs. To ensure "good data using every method available," build a cascade mechanism.

Add to Prompt: "Create a Smart Skip-Tracing Cascade Engine. If Data Provider A fails to return a phone number or email for a lead, the system must automatically and instantly try Provider B, then Provider C, tracking the exact credit cost fractions dynamically based on which vendor successfully delivers the data."

🚫 Global Cross-Account Deduplication & Suppression
If two agents are targeting the same neighborhood list, or if a property goes Expired, then becomes a FSBO, then goes Expired again, your database will bloat, and users will waste credits.

Add to Prompt: "Incorporate a global Deduplication and Record Stitching Engine using unique geographic identifiers (lat/long combinations + normalized addresses). If a lead changes status (e.g., Expired to FSBO), merge the historical logs into a single master entity view to preserve previous interaction notes and prevent users from paying for duplicate credit lookups."

2. Agentic AI & UI Optimization
⚡ Async Streaming & Webhook Queues for AI Call Tools
AI voice agents and dialers cannot wait for synchronous REST API requests when fetching lists of 1,000+ records—it will cause lag or timeout failures.

Add to Prompt: "Build a High-Throughput Event Queue (using Redis/BullMQ) explicitly for outbound webhooks and AI agent integrations. When an AI Voice Agent or CRM calls for a list or auto-delivery, data must stream asynchronously or handle concurrent connection spikes up to 10k requests per minute without dropping packets."

🗺️ Client-Side Geofencing Caching
Rendering thousands of polygon shapes and active tax parcels over a live map can cause severe browser slowdowns.

Add to Prompt: "Optimize the interactive map component using vector tiles and client-side geospatial clustering (e.g., Supercluster). Cache bounding-box queries on the edge so that panning, zooming, and layering custom search lists feels instant and fluid for the user."

3. Commercialization & "Bulletproof" Scale Upgrades
🛑 Strict Smart Credit Locks
To protect your margins, the system must prevent users from initiating large 1,000-lead advanced lookups if their credit ledger drops below zero mid-process.

Add to Prompt: "Enforce a strict atomic transaction check on the Credit Ledger before any batch scraping or augmentation process is spun up. If a user tries to run a list larger than their available credit balance, pause the operation, initiate an automatic micro-billing charge (if auto-top-off is checked), or prompt a clear checkout modal without losing their map progress."

🕵️ Dynamic "Quiet Hours" & Compliance Guards
Realtors and sales organizations face brutal legal penalties under TCPA and CAN-SPAM compliance if they auto-sync or dial leads outside of legal hours. Since your screenshot features a "QUIET HOURS" button, let's programmatically enforce it.

Add to Prompt: "Build a Compliance & TCPA Guardrail Layer. The system must use the local time zone of the target lead (derived from the property zip code), not the user's location, to automatically pause automated email drops, SMS notifications, or AI dialer syncs outside of federally mandated hours (typically 8 AM to 8 PM local time), overriding standard delivery options when active."

How to use this update:
Simply copy these sections and tell Jules:

"Incorporate these data stabilization, agentic optimization, and compliance layers into the existing blueprint to complete the specification architecture." This ensures your build is fully prepared to handle enterprise workloads, massive traffic, and strict regulatory standards smoothly. What aspect of the build would you like Jules to tackle first—the data ingestion pipelines or the interactive map layout?
