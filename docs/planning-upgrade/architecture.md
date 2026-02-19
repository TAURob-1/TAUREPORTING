# TAU-Reporting AI Planning Architecture

## Objective
Integrate the `tau-demo-multi-tenant-media-planner` planning system into TAU-Reporting as the core AI foundation, while keeping TAU-Reporting frontend-first and excluding auth/multi-tenancy/database features.

## What To Extract (and What Not)

### Extract
- **7-layer planning framework** (layers 1-7 only) and behavioral protocol from `prompt.py`.
- Planner state model pattern from `types.ts` + `useMediaPlannerPro.ts`.
- **Simplified tabbed UX pattern:** Chat, Media Plan, System Prompt (3 tabs only).
- Structured outputs pattern: markdown media plan, flighting data for Campaign Planning, personas data for Audience Targeting.

### Do Not Extract
- CopilotKit runtime dependency chain (unless phase-2 decision).
- LangGraph backend graph orchestration.
- Mongo/Postgres checkpointing.
- Brand-document linking API/auth server actions.

## Decision: CopilotKit vs Custom

### Recommendation
Use a **custom React implementation** (TAU-native) now; keep CopilotKit as a future optional phase.

### Why (for TAU-Reporting current architecture)
- TAU-Reporting is React + Vite with a simple `/chat` API integration today.
- CopilotKit usage in tau-demo depends on a backend coagent/graph runtime and server actions not present in TAU-Reporting.
- Pulling CopilotKit now would add framework mismatch and migration risk for little functional gain in phase 1.

### Tradeoff summary
- Custom approach pros: low integration risk, minimal dependencies, fits current `StrategicAdvisor.jsx` flow, faster to ship.
- Custom approach cons: you manually manage orchestration/state updates.
- CopilotKit pros: richer coagent patterns, built-in state render hooks.
- CopilotKit cons: heavier migration, backend coupling, added complexity not needed for immediate goal.

## Target Architecture (Recommended)

### Frontend
- New feature shell component: `src/components/planner/PlannerWorkspace.jsx`.
- State provider: `src/context/PlannerContext.jsx`.
- **3 Main Tab Views:**
  - `ChatTab` (7-layer planning conversation)
  - `MediaPlanTab` (markdown artifact)
  - `SystemPromptTab` (editable prompt)
- **Integrated with Existing Pages:**
  - Personas → Audience Targeting page (existing map view)
  - Flighting → Campaign Planning page (existing planning view)
  - Data Sources → Sub-menu/dropdown (not main tab)

### Backend/API usage
- Keep existing `VITE_CHAT_API` integration path.
- Send a structured payload from chat:
  - `message`
  - `history`
  - `planner_state` (media plan/personas/flighting/layer progress)
  - `platform_context` (country, advertiser, planning state)
  - `signal_context` (from `getAdvisorContext`)
  - `system_prompt` (10-layer prompt template)
- Optional streaming:
  - First keep HTTP POST `/chat`.
  - Add WebSocket/SSE only if Clawdbot Gateway already supports it.

## State Persistence Strategy

### Recommendation
Use **React Context + localStorage** with advertiser/country scoped keys.

### Key design
- In-memory source of truth via `PlannerContext`.
- Persist snapshot per scope key:
  - `tau_planner:${advertiserSlug}:${countryCode}`
- Auto-save on state changes (debounced).
- Hydrate on load and when advertiser/country changes.

### Why
- No backend DB required.
- Keeps sessions persistent across refreshes.
- Aligns with constraints and TAU-Reporting’s current frontend-only behavior.

## Data Flow
1. User sends chat message in `ChatTab`.
2. Workspace builds `contextEnvelope` from Platform + Signal + Planner state.
3. API call to `/chat` (or gateway endpoint).
4. Assistant response can include structured blocks (plan/persona/flighting updates).
5. Parser applies updates to shared planner state.
6. Tabs render updated artifacts immediately.
7. State persisted to localStorage.

## Navigation Integration
- In `src/App.jsx`, move advisor page to first slot in `PAGES`.
- Default `currentPage` should become planner page key.
- Rename recommendation:
  - `fullLabel`: `AI Planner`
  - `label`: `Planner`
- Keep route key stable (`advisor`) during migration to avoid widespread breakage; optional later rename to `planner`.

## Migration Positioning
- `StrategicAdvisor.jsx` becomes the migration shell and later splits into planner components.
- Existing demo-response fallback stays as resilience path until backend contract is stable.
