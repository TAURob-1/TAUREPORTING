# TAU Reporting Platform - Project Brief

## Overview

Transform the CarShield demo into a **universal media attribution and planning platform** that works for any advertiser. This is TAU's flagship product demo — it needs to WOW clients like Tombola and Experian.

**Upcoming Demos:**
- **Tombola** — this week, full platform capabilities
- **Experian** — YouTube focused

## Core Transformation: CarShield → Universal

### What to Change

1. **Remove CarShield branding** — Make it configurable for any advertiser
2. **Add country selector** — UK or US (different data, platforms, regulations)
3. **Multi-platform support** — Linear TV, CTV, YouTube, Facebook Video, TikTok
4. **Real geo-demographic data** — UK MSOAs / US ZIP codes with actual demographics
5. **AI chat feature** — Natural language insights and queries
6. **MMM upload** — Media Mix Modelling coefficient import

### What to Keep

- React/Vite/Tailwind stack
- Dark theme aesthetic  
- Interactive map visualization
- Test/control group management

---

## Features Required

### 1. Country & Advertiser Selection (Header)

```
[Logo] TAU Reporting    [Country: UK ▼]  [Client: Demo ▼]  [Settings ⚙]
```

- **Country toggle**: UK / US
- Changes available platforms, geo data, regulations, currency
- **Client dropdown**: Demo mode + ability to configure for specific clients

### 2. Platform Support Matrix

| Platform | UK | US | Data Type |
|----------|----|----|-----------|
| Linear TV | ✓ (ITV, C4, Sky) | ✓ (Network, Cable) | GRPs, Reach, Frequency |
| CTV | ✓ (YouTube CTV, ITVX, C4 Streaming) | ✓ (YouTube CTV, Hulu, Peacock) | Impressions, Completion, Reach |
| YouTube | ✓ | ✓ | Views, VTR, CPV, Reach |
| Facebook Video | ✓ | ✓ | ThruPlays, Reach, Frequency |
| TikTok | ✓ | ✓ | Video Views, Reach, Engagement |
| Meta (Instagram) | ✓ | ✓ | ThruPlays, Reach |

### 3. Geographic Targeting & Holdouts

**UK Mode:**
- Map: UK regions, ITVRs, MSOAs
- Demographics from UK census data
- Variables: Age bands, Income, Occupation (SOC), Urban/Rural

**US Mode:**
- Map: States, DMAs, ZIP codes
- Demographics from Census/ACS
- Variables: Age, HHI, Education, Urban/Suburban/Rural

**Holdout Design:**
- Select test regions (colored on map)
- Select control regions (different color)
- Statistical matching: Show match quality score
- Power calculator: "With this split, you can detect X% lift at 95% confidence"

### 4. Media Data Input

**Linear TV Results Upload:**
```json
{
  "campaign": "Q1 2026 Brand",
  "platform": "ITV",
  "metrics": {
    "grps": 450,
    "reach_pct": 62.3,
    "frequency": 4.2,
    "spend": 850000
  }
}
```

**Digital Platform Integration:**
- YouTube: Connect via API or CSV upload
- Facebook: CSV upload or Marketing API
- TikTok: CSV upload

### 5. Media Mix Modelling (MMM) Upload

Allow upload of MMM outputs:
```json
{
  "model": "Robyn v3.10",
  "date_range": "2024-01-01 to 2025-12-31",
  "channels": [
    { "channel": "Linear TV", "coefficient": 0.042, "saturation": 0.78, "adstock": 0.65 },
    { "channel": "YouTube", "coefficient": 0.038, "saturation": 0.45, "adstock": 0.42 },
    { "channel": "Facebook", "coefficient": 0.029, "saturation": 0.62, "adstock": 0.35 }
  ]
}
```

**Visualization:**
- Response curves per channel
- Saturation analysis
- Predicted vs actual comparison
- Budget optimization scenarios

### 6. AI Chat Feature

**Location:** Slide-out panel or dedicated tab

**Capabilities:**
- "What was our most efficient channel last quarter?"
- "Show me the geographic split for the Q1 campaign"
- "Compare YouTube reach in London vs Manchester"
- "What's the recommended budget split for £500k?"

**Implementation:**
- Chat API endpoint (we have `/chat-api` already)
- Stream responses
- Context-aware: knows current filters, selected regions, uploaded data

### 7. Dashboard Views

**Tab 1: Campaign Overview**
- Total spend by channel (stacked bar)
- Reach/frequency curves
- Geographic heatmap of delivery

**Tab 2: Attribution Analysis**
- Incrementality by channel
- Test vs control performance
- Lift calculations with confidence intervals

**Tab 3: Planning**
- Budget allocator with sliders
- Predicted reach at different spend levels
- Audience overlap visualization

**Tab 4: MMM Insights** (when data uploaded)
- Response curves
- Marginal ROI by channel
- Saturation warnings

---

## What Makes This TOP CLASS

### 1. Data Quality
- Real UK BARB data (we have it from uk-media-intelligence.html)
- Real US Nielsen equivalents
- Actual geo-demographic data (not fake)

### 2. Incrementality Focus
- Not just ROAS — actual incremental lift measurement
- Statistical rigor: confidence intervals, power calculations
- Geo-matched test/control design

### 3. Cross-Platform Attribution
- Unified view across Linear + Digital
- Deduplicated reach estimation
- Frequency management across platforms

### 4. Smart Holdout Design
- Geographic matching algorithms
- Statistical power calculator
- "Similar region" suggestions based on demographics

### 5. The "Peppa Pig Problem"
- Include warnings about YouTube CTV demographics
- Show BARB vs Google-reported metrics
- Honest about what we know vs don't know

### 6. Executive Ready
- One-click export to PDF/PPTX (TAU branded)
- C-suite summary view
- Key metrics prominently displayed

### 7. Scenario Planning
- "What if we shift 10% from Linear to CTV?"
- Budget optimizer using MMM coefficients
- Reach/frequency trade-off visualization

---

## Technical Notes

### Data Files to Include

**UK Data (public/data/uk/):**
- `uk-media-platforms.json` — BARB data we already have
- `uk-audience-indices.json` — TGI-style indices by demographic
- `uk-regions.geojson` — Geographic boundaries
- `uk-demographics.json` — MSOA-level census data

**US Data (public/data/us/):**
- `us-media-platforms.json` — Nielsen equivalents
- `us-audience-indices.json` — MRI/Simmons style indices
- `us-dmas.geojson` — DMA boundaries
- `us-demographics.json` — ZIP-level census data

### API Endpoints

The chat-api folder already exists. Enhance it:
- `/api/chat` — AI conversation
- `/api/upload/mmm` — MMM file upload
- `/api/upload/campaign` — Campaign data upload
- `/api/export/report` — Generate PDF/PPTX

### Component Structure

```
src/
├── components/
│   ├── Header/
│   │   ├── CountrySelector.jsx
│   │   └── ClientSelector.jsx
│   ├── Map/
│   │   ├── UKMap.jsx
│   │   ├── USMap.jsx
│   │   └── HoldoutDesigner.jsx
│   ├── Dashboard/
│   │   ├── CampaignOverview.jsx
│   │   ├── AttributionAnalysis.jsx
│   │   ├── Planning.jsx
│   │   └── MMMInsights.jsx
│   ├── Chat/
│   │   └── AIChat.jsx
│   └── Upload/
│       ├── MMMUpload.jsx
│       └── CampaignUpload.jsx
├── data/
│   ├── uk/
│   └── us/
└── hooks/
    ├── useCountry.js
    └── useChat.js
```

---

## Priority Order

1. **Country selector + platform matrix** — Core architecture change
2. **UK media data integration** — We have this ready
3. **Map updates** — UK regions + US DMAs
4. **Holdout designer** — Test/control selection with statistics
5. **AI chat** — Enhance existing chat-api
6. **MMM upload** — File upload + visualization
7. **Export/reporting** — TAU-branded outputs

---

## Style Guide

- **Dark theme** — Keep the current aesthetic
- **TAU Purple**: #7c3aed (accent)
- **Charts**: Use Chart.js or Recharts (already in project)
- **Maps**: Leaflet or Mapbox (already in project)
- **Typography**: Clean, professional, data-dense

---

## Demo Scenarios

### Tombola Demo (Gambling/Gaming)
- UK focus
- CTV emphasis (Sky Sports, YouTube CTV)
- Geographic targeting for bingo and gambling audiences
- Show the "Peppa Pig problem" as honest insight

### Experian Demo (YouTube Focus)
- US focus
- YouTube deep-dive
- Audience segment targeting
- MMM integration with their data

---

## Success Criteria

1. ✅ Works for any advertiser (not just CarShield)
2. ✅ UK/US toggle changes all relevant data
3. ✅ All 6 platforms supported (Linear, CTV, YouTube, FB, TikTok, Instagram)
4. ✅ Interactive holdout design on map
5. ✅ AI chat provides useful insights
6. ✅ MMM upload and visualization works
7. ✅ Looks professional enough for C-suite demos
8. ✅ Runs on http://100.98.17.27:5174 (or similar)

---

## Reference Files

- UK Media Data: `/home/r2/Signal/companies/tombola-co-uk/summary/traffic_intelligence.json`
- UK Demographics: `/home/r2/Signal/data/uk_demographics.csv`
- Original CarShield: `/home/r2/clawd/carshield-demo/`

---

Get this running. Make it impressive. We're showing Tombola this week.
