# Audience Graph — Manual Test Plan

10-scenario checklist for verifying the Audience Graph integration.

## Pre-requisites
- `npm run dev` running on port 5175
- Server running on port 5176 (for chat tests)

---

## Scenarios

### 1. Template Load: Young Affluent Women Who Ski
- [ ] Navigate to Graph tab
- [ ] Select "Young Affluent Women Who Ski" from template dropdown
- [ ] Verify 5 attributes appear as pills: DEMO.age_25_34, DEMO.gender_female, SOCIO.income_high, BEHAV.skiing_winter_sports, CONTEXT.seasonal_winter
- [ ] Verify scoring matrix shows 5 rows x 8 mechanism columns
- [ ] Verify M-CHAN drill-down shows YouTube CTV + ITVX as highest affinity

### 2. M-KEY Drill-Down: Skiing Keywords
- [ ] With Young Affluent Skiers loaded, click "Drill Down" on Search mechanism card
- [ ] Verify skiing-related keyword clusters appear (Trip Planning, Equipment, Snow Conditions, Lessons)
- [ ] Verify keyword CPCs are in £0.30–£4 range
- [ ] Verify sortable table works (click Volume header to sort)

### 3. M-TIME Drill-Down: Evening Peak
- [ ] Click "Drill Down" on Temporal mechanism card
- [ ] Verify 24-hour line chart shows evening peak (hours 19-22 above average)
- [ ] Verify daypart cards highlight Primetime and Early Evening as peak
- [ ] Verify day-of-week strip shows weekend slightly higher

### 4. Score Editing
- [ ] Click on a P or S value in the scoring matrix
- [ ] Enter a new value (e.g., change P from 4 to 5)
- [ ] Verify the W column updates (P × S recalculated)
- [ ] Verify blueprint bars and donut chart reflect new allocation
- [ ] Open a drill-down and verify it reflects the changed scores

### 5. Keyword CSV Export
- [ ] Open M-KEY drill-down
- [ ] Click "Export CSV" button
- [ ] Verify downloaded file has columns: Group, Term, Volume, CPC, Competition
- [ ] Verify file contains correct data matching the displayed keywords

### 6. All 5 Templates Across All Drill-Downs
- [ ] Load each template: young_affluent_skiers, business_travellers, lapsed_gym_london, budget_family_shoppers, premium_tech_adopters
- [ ] For each template, open all 7 mechanism drill-downs (M_CHAN through M_LAL)
- [ ] Verify no console errors, all views render data

### 7. Chat with Active Blueprint
- [ ] Load a template on Graph tab
- [ ] Switch to Planner tab (AI Planner)
- [ ] Ask: "What targeting mechanisms should I prioritize for this audience?"
- [ ] Verify the AI response references graph data (mechanism allocations, channel affinities)
- [ ] Verify "[Audience Graph State]" section appears in system context (check console logs)

### 8. Chat Graph Navigation
- [ ] In Planner chat, if AI responds with [GRAPH:drilldown:M_CHAN], verify notification appears
- [ ] If AI responds with [GRAPH:navigate], verify app switches to Graph tab
- [ ] Test manually by checking parseAIResponse handles these tags

### 9. Media Reach Graph Banner
- [ ] Load a template on Graph tab (e.g., Young Affluent Skiers)
- [ ] Navigate to Media tab
- [ ] Verify purple banner appears: "Audience Graph suggests: YouTube CTV (XX), ..."
- [ ] Click "View Graph" button on banner
- [ ] Verify navigates back to Graph tab

### 10. Clear All + State Reset
- [ ] On Graph tab, load a template
- [ ] Click "Clear All" button
- [ ] Verify all attributes removed, scoring matrix hidden
- [ ] Verify drill-down panel closes
- [ ] Navigate to Media tab — verify graph banner is gone
- [ ] Navigate back to Graph tab — verify clean state

---

## Automated Tests
Run with `npm test` (vitest):
- `computeBlueprint.test.js` — 15 tests
- `channelAffinity.test.js` — 7 tests
- `keywordClusters.test.js` — 6 tests
- `daypartProfiles.test.js` — 11 tests
- `dataIntegrity.test.js` — 7 tests
- `responseParser.test.js` — 8 tests

## Data Validation
Run with `node scripts/validate-audience-graph-data.js` — 9 checks.
