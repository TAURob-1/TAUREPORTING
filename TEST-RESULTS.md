# TAU-Reporting Test Results

Date: 2026-02-17
Tester: Codex (in-sandbox validation)

## Scope Requested
1. Start dev server on `5175`
2. Browser test core flows (country/client/tabs/segment selector/AI/regulations/media)
3. Verify all 10 `REQUIREMENTS.md` items
4. Record issues
5. Fix critical bugs if found

## Environment Outcome
- `npm run dev -- --host --port 5175` could not start in this sandbox.
- Error: `listen EPERM: operation not permitted` on `0.0.0.0:5175` and `127.0.0.1:5175`.
- Because local listening is blocked here, full live browser clicking was **not possible** in this run.

## Functional Validation Results
Validation method used: source inspection + build validation (`npm run build`) + logic tracing.

| Area | Result | Evidence |
|---|---|---|
| Country toggle (UK/US) | PASS | Header country select bound to `countryCode` and `setCountryCode` in `src/App.jsx` |
| Client selector (Tombola) | PASS | Client select includes `tombola` in `src/config/platformConfig.js` and wired in `src/App.jsx` |
| All tabs (Audience, Planning, Results, Media, Intelligence, AI) | PASS | `PAGES` contains all 6 and routed in `src/App.jsx` |
| Segment selector collapses after selection | PASS | `handleAudienceChange` sets `isSegmentSelectorExpanded(false)` in `src/components/AudienceTargeting.jsx`; collapsed summary UI in `src/components/AudienceSelector.jsx` |
| AI Advisor strategic planning context | PASS | Context envelope includes advertiser/country/planning state/planning layers in `src/components/StrategicAdvisor.jsx` |
| Gambling regulations for Tombola | PASS (after fix) | `getRegulations` now returns gambling-specific rules for UK and US in `src/data/marketData.js` |
| Media page professional tables + BARB data | PASS | Structured table with country source labels; UK rows use BARB entries in `src/components/MediaReach.jsx` and `src/data/marketData.js` |

## REQUIREMENTS.md Verification
- `REQUIREMENTS.md` was not present in repository (searched with `rg --files -g '*REQUIREMENTS*.md'` and `find`).
- Fallback used: 10-item success criteria in `FEATURE_COMPLETE.md`.
- Result against that 10-item checklist: **addressed in codebase** (audience segments/scoring/splits/map/stats/export/docs/integration/performance paths present).

## Issues Found
1. Critical (fixed): Tombola in US returned only generic US compliance instead of gambling-specific compliance.
   - Fix: Added `US_GAMBLING_RULES` and gambling branch in `getRegulations`.
   - File: `src/data/marketData.js`

2. Blocker (not app-code): Sandbox disallows local HTTP listeners, preventing true browser E2E execution.

3. Documentation gap: `REQUIREMENTS.md` missing, so direct 10-item verification source was unavailable.

## Build/Regression Check
- `npm run build` completed successfully after fix.
- No compile/runtime build errors.
- Existing large-chunk warning remains (non-blocking).

## Summary for Rob
- Core requested workflows are implemented and logically wired.
- One critical compliance gap was fixed (Tombola gambling rules now cover US as well as UK).
- Live click-through browser proof could not be produced in this sandbox due port-binding restrictions.
- Recommend a final manual E2E pass in an unrestricted environment using `npm run dev -- --host --port 5175`.
