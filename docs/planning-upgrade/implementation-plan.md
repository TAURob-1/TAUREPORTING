# Implementation Plan

## Phase 0: Baseline and Contract Freeze
- Confirm API contract for chat (existing `/chat` + required planner payload fields).
- Freeze extracted planning prompt + rules in a dedicated module.
- Define planner state schema and storage key format.

## Phase 1: Navigation + Shell

### Goals
- Move AI tab to first position.
- Replace monolithic advisor UI with planner workspace shell and tabs.

### Files to modify
- `src/App.jsx`
  - Move advisor page to first item in `PAGES`.
  - Set default page to advisor/planner.
  - Update status label from `AI Advisor` to `AI Planner`.

### Files to create
- `src/components/planner/PlannerWorkspace.jsx`
- `src/components/planner/PlannerTabs.jsx`
- `src/components/planner/tabs/ChatTab.jsx`
- `src/components/planner/tabs/MediaPlanTab.jsx`
- `src/components/planner/tabs/PersonasTab.jsx`
- `src/components/planner/tabs/FlightingTab.jsx`
- `src/components/planner/tabs/SystemPromptTab.jsx`
- `src/components/planner/tabs/DataSourcesTab.jsx`

## Phase 2: Shared Planner State + Persistence

### Goals
- Introduce shared planner state and persistence.
- Keep state scoped by advertiser/country.

### Files to create
- `src/context/PlannerContext.jsx`
- `src/hooks/usePlannerState.js`
- `src/utils/plannerStorage.js`
- `src/data/plannerPromptTemplate.js`
- `src/data/plannerSchemas.js`

### Files to modify
- `src/context/PlatformContext.jsx`
  - No breaking changes; consume values from planner context only.

## Phase 3: Chat Integration with Planning Logic

### Goals
- Apply 10-layer prompt and planning behavior to live chat.
- Keep backend frontend-compatible (no LangGraph import).

### Files to modify
- `src/components/StrategicAdvisor.jsx`
  - Convert into wrapper that mounts `PlannerWorkspace`.
- `chat-api/server.py` (optional but recommended)
  - Replace current CTV-only system prompt with 10-layer planner prompt template.
  - Accept `planner_state` and `platform_context` fields in request model.

### Files to create
- `src/services/plannerChat.js` (request/response shaping)
- `src/utils/plannerResponseParser.js` (structured extraction for media plan/personas/flighting)

## Phase 4: Structured Artifacts + Validation

### Goals
- Make plan/personas/flighting first-class editable artifacts.
- Ensure safe parsing and state updates.

### Files to create
- `src/utils/flightingValidation.js`
- `src/utils/personaValidation.js`

### Files to modify
- `src/components/planner/tabs/FlightingTab.jsx`
- `src/components/planner/tabs/PersonasTab.jsx`
- `src/components/planner/tabs/MediaPlanTab.jsx`

## Phase 5: Signal-Driven Data Sources and Context

### Goals
- Replace tau-demo file-linking model with TAU Signal source model.
- Show which Signal datasets are currently active in planning context.

### Files to modify
- `src/data/signalIntegration.js`
  - Add helper returning selected context blocks for planner prompt injection.
- `src/components/planner/tabs/DataSourcesTab.jsx`

## Dependencies

### Required for MVP
- None strictly required beyond current stack.

### Optional additions
- `uuid` for stable flight IDs.
- `zod` for runtime validation of flighting/personas payloads.
- `marked` if rich markdown copy/export is needed like tau-demo tabs.

## Migration Strategy for Existing `StrategicAdvisor`
1. Keep `StrategicAdvisor.jsx` export path unchanged.
2. Internally switch it to render `PlannerWorkspace`.
3. Migrate old chat UI parts into `ChatTab` incrementally.
4. Remove legacy markdown renderer only after new tabs are stable.

## Backend Adaptation Plan (No Python LangGraph Import)
- Use existing chat endpoint style with stronger system prompt and richer context envelope.
- Emulate tool-update behavior via response conventions:
  - `MEDIA_PLAN_UPDATE`
  - `PERSONAS_UPDATE`
  - `FLIGHTING_UPDATE`
- Frontend parser updates state based on these blocks.
- If Clawdbot Gateway WS exists, add optional streaming transport while keeping HTTP fallback.

## Rollout Sequence
1. Ship navigation move and planner shell.
2. Ship shared state + persistence.
3. Ship 10-layer prompt/chat logic.
4. Ship structured artifact editing and parsing.
5. Enable gateway streaming (optional).
