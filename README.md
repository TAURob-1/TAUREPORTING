# CarShield CTV Campaign Intelligence Platform

## Overview
Interactive CTV campaign planning and measurement demo for CarShield/Intermedia.

## Architecture
- **Frontend:** React 18 + Vite + Tailwind CSS + Recharts + Leaflet
- **Data Layer:** Config-driven (see /src/data/)
- **No backend required** — all computation runs client-side

## Data Files (/src/data/)
| File | Purpose |
|------|---------|
| audienceDefinitions.js | 18 pre-built audience segments with scoring criteria |
| customAudienceConfig.js | NLP mappings and demographic builder config |
| channelInventory.js | 18 CTV + 4 traditional TV providers |
| planningConfig.js | Reach curves, audience overlaps, budget optimization |
| dashboardData.js | Campaign results and metrics |
| signalData.js | Signal Intelligence tab data |
| zipDemographics.js | ZIP code demographic mappings |
| zipMapping.js | ZIP to geographic region mapping |

## Modules (Separable)
1. **Audience Targeting** — Audience selection, affinity slider, geographic targeting
2. **Campaign Planning** — Budget allocation, reach/frequency, scenario comparison
3. **Campaign Results** — Measurement dashboard, incrementality testing
4. **Signal Intelligence** — Competitive intelligence overlay

Each module can operate independently. For measurement-only use cases, modules 1+3 suffice.

## Running
```bash
npm install
npm run dev -- --host
```

## Configuration
All audience, provider, and planning data is in `/src/data/` config files.
To add a new audience: edit `audienceDefinitions.js`
To add a new CTV provider: edit `channelInventory.js` + `planningConfig.js`
