# TAU-Reporting AI Upgrade Implementation Plan

**Generated:** 2026-02-18 23:11  
**Scope:** Rename Syd.AI → "AI Planning and Reporting", power with Sonnet 4.5, real Signal integration, enhanced audience targeting & campaign planning, enhanced media page

---

## 1) High-Level Goal

Transform the current TAU-Reporting demo from:
- Hardcoded Signal data
- Basic Syd.AI chat
- Single-mode audience/campaign forms

Into:
- **AI Planning & Reporting** powered by Claude Sonnet 4.5
- Real Signal data integration (dynamic by advertiser)
- Dual-mode audience targeting (AI + simple demographic selector)
- Dual-mode campaign planning (AI-assisted + freestyle)
- Enhanced media page (big screen breakout, audience overlay, program intelligence, TV spots)

---

## 2) Core Requirements

### Data & Backend
1. **Signal Integration**: Pull real data from `/home/r2/Signal/companies/{slug}/`
2. **Dynamic Advertiser Discovery**: Backend API to list available advertisers
3. **Media Data v2**: Migrate UK/US media platforms to normalized v2 schema
4. **Program Intelligence**: Add Rotten Tomatoes + show/program metadata
5. **TV Spots**: Add UK/US TV spot intelligence

### AI Agent
6. **Rename**: Syd.AI → "AI Planning & Reporting"
7. **Model**: Claude Sonnet 4.5 (tool-enabled, streaming)
8. **Tools**: Signal query, audience research, media reach, campaign planning helpers
9. **Context-Aware**: Use country, advertiser, campaign state, Signal data

### UI Enhancements
10. **Audience Targeting**: AI mode + simple demographic mode (switchable)
11. **Campaign Planning**: AI-assisted mode + freestyle mode (switchable)
12. **Inheritance Badges**: Show which fields inherited vs overridden
13. **Media Page**: Enhanced display (big screen, audience overlay, program intel, TV spots)
14. **Navigation**: Remove platform/regulation text from nav bar

---

## 3) Architecture

```
┌─────────────────────────────────────────────────┐
│  Frontend (React)                                │
│  ┌────────────────┐  ┌──────────────────────┐  │
│  │ AI Planning &  │  │  Audience/Campaign   │  │
│  │   Reporting    │  │   (Dual Modes)       │  │
│  └────────────────┘  └──────────────────────┘  │
│           │                    │                 │
│           v                    v                 │
│  ┌──────────────────────────────────────────┐  │
│  │       signalApi.js / mediaApi.js          │  │
│  └──────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │
                  v (HTTP/SSE)
┌─────────────────────────────────────────────────┐
│  Backend (FastAPI)                               │
│  ┌────────────────┐  ┌──────────────────────┐  │
│  │ ai/agent.py    │  │  data/signal_repo.py │  │
│  │ (Sonnet 4.5 +  │  │  data/media_repo.py  │  │
│  │  tools)        │  │  data/geo_repo.py    │  │
│  └────────────────┘  └──────────────────────┘  │
│           │                    │                 │
│           v                    v                 │
│  ┌──────────────────────────────────────────┐  │
│  │  /home/r2/Signal/companies/{slug}/       │  │
│  │  public/data/uk/* , public/data/us/*     │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 4) Data Schema Changes

### Signal Data Structure (Expected)
```
/home/r2/Signal/companies/{slug}/
  traffic_intelligence.json
  summary.json
  uk-media-intelligence.html (or similar)
  ...
```

### Media Platforms v2 Schema
```json
{
  "version": "2.0",
  "country": "UK",
  "platforms": [
    {
      "id": "itv-barb",
      "name": "ITV",
      "type": "linear",
      "reach": { "weekly": 25.4, "monthly": 42.1 },
      "demographics": { "18-34": 18, "35-54": 32, ... },
      "source": "BARB",
      "updated": "2026-01-15"
    },
    ...
  ]
}
```

### Program Intelligence Schema
```json
{
  "shows": [
    {
      "id": "love-island-uk",
      "title": "Love Island",
      "platform": "itv",
      "genre": ["Reality", "Romance"],
      "rating": { "rt": 72, "imdb": 6.8 },
      "demographics": { "18-24": 35, "25-34": 28 },
      "airtime": "21:00",
      "seasonActive": true
    },
    ...
  ]
}
```

### TV Spots Schema
```json
{
  "spots": [
    {
      "advertiser": "Tombola",
      "platform": "ITV",
      "show": "Love Island",
      "airDate": "2026-02-15",
      "estimatedCost": 45000,
      "audienceSize": 2.8
    },
    ...
  ]
}
```

---

## 5) Backend Implementation

### New Files

#### `chat-api/ai/providers.py`
```python
"""LLM provider clients (Anthropic, OpenRouter fallback)."""
import os
from anthropic import AsyncAnthropic

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
```

#### `chat-api/ai/schemas.py`
```python
"""Pydantic schemas for AI agent tool inputs/outputs."""
from pydantic import BaseModel
from typing import List, Optional

class AudienceResearchInput(BaseModel):
    country: str
    advertiser: Optional[str]
    demographics: Optional[dict]

class MediaReachInput(BaseModel):
    country: str
    platforms: List[str]
    audience: Optional[dict]
```

#### `chat-api/ai/tools.py`
```python
"""Tool functions for AI agent."""
from .schemas import AudienceResearchInput, MediaReachInput
from ..data.signal_repo import get_signal_summary
from ..data.media_repo import get_media_reach

async def audience_research(input: AudienceResearchInput) -> dict:
    """Query Signal + demographics data for audience insights."""
    signal = await get_signal_summary(input.country, input.advertiser)
    return {"signal": signal, "demographics": input.demographics}

async def media_reach_query(input: MediaReachInput) -> dict:
    """Get reach/cost for specified platforms + audience."""
    return await get_media_reach(input.country, input.platforms, input.audience)
```

#### `chat-api/ai/prompts.py`
```python
"""System prompts for AI Planning & Reporting agent."""

SYSTEM_PROMPT = """
You are the AI Planning & Reporting agent for TAU-Reporting, a campaign planning platform.

Your role:
- Help users define target audiences
- Recommend media platforms based on reach + cost
- Assist with campaign planning (creative, budget allocation)
- Surface competitive intelligence from Signal data
- Be context-aware: use country, advertiser, campaign state

You have access to:
- Signal competitive data (traffic, SEO, ads)
- BARB/Nielsen media reach data
- Program intelligence (shows, demographics)
- TV spots data

Be concise, actionable, and data-driven.
"""

TOOL_DESCRIPTIONS = [
    {
        "name": "audience_research",
        "description": "Query Signal data + demographics for audience insights.",
        "input_schema": {...}  # from schemas.py
    },
    {
        "name": "media_reach_query",
        "description": "Get reach and cost for specified platforms and audience.",
        "input_schema": {...}
    }
]
```

#### `chat-api/ai/agent.py`
```python
"""Main AI agent orchestration (Sonnet 4.5 + tools + streaming)."""
import json
from .providers import client
from .prompts import SYSTEM_PROMPT, TOOL_DESCRIPTIONS
from .tools import audience_research, media_reach_query

async def stream_ai_response(messages: list, context: dict):
    """
    Stream AI Planning & Reporting agent responses (SSE).
    
    Args:
        messages: Chat history
        context: { country, advertiser, campaign_state }
    
    Yields:
        SSE-formatted chunks
    """
    tools_map = {
        "audience_research": audience_research,
        "media_reach_query": media_reach_query
    }
    
    async with client.messages.stream(
        model="claude-sonnet-4.5",
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=messages,
        tools=TOOL_DESCRIPTIONS
    ) as stream:
        async for event in stream:
            if event.type == "content_block_delta":
                yield f"data: {json.dumps({'type': 'text', 'content': event.delta.text})}\n\n"
            elif event.type == "tool_use":
                tool_name = event.tool_use.name
                tool_input = event.tool_use.input
                result = await tools_map[tool_name](tool_input)
                yield f"data: {json.dumps({'type': 'tool_result', 'result': result})}\n\n"
```

#### `chat-api/data/signal_repo.py`
```python
"""Access Signal data from /home/r2/Signal/companies/"""
import json
from pathlib import Path

SIGNAL_BASE = Path("/home/r2/Signal/companies")

async def list_advertisers() -> list[str]:
    """Return list of available advertiser slugs."""
    return [d.name for d in SIGNAL_BASE.iterdir() if d.is_dir()]

async def get_signal_summary(country: str, advertiser: str) -> dict:
    """Load traffic_intelligence.json + summary data for advertiser."""
    adv_path = SIGNAL_BASE / advertiser
    traffic = json.load((adv_path / "traffic_intelligence.json").open())
    return {"traffic": traffic, "advertiser": advertiser}
```

#### `chat-api/data/media_repo.py`
```python
"""Load media reach data (UK/US platforms v2)."""
import json
from pathlib import Path

def load_media_platforms(country: str) -> dict:
    """Load v2 media platforms for country."""
    path = Path(f"public/data/{country.lower()}/{country.lower()}-media-platforms-v2.json")
    return json.load(path.open())

async def get_media_reach(country: str, platforms: list[str], audience: dict) -> dict:
    """Calculate reach/cost for platforms + audience filter."""
    data = load_media_platforms(country)
    # Filter + aggregate logic here
    return {"reach": data, "platforms": platforms}
```

#### `chat-api/data/geo_repo.py`
```python
"""Country/geo utilities."""

SUPPORTED_COUNTRIES = ["UK", "US"]

def validate_country(country: str) -> bool:
    return country.upper() in SUPPORTED_COUNTRIES
```

---

## 6) Frontend Implementation

### New Components

#### `src/components/AIPlanningReporting.jsx`
```jsx
import { useState, useEffect } from 'react';
import { usePlatform } from '../context/PlatformContext';

export default function AIPlanningReporting() {
  const { country, advertiser } = usePlatform();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, context: { country, advertiser } })
    });
    const reader = res.body.getReader();
    // SSE streaming logic...
  };

  return (
    <div className="ai-planning-reporting">
      <h2>AI Planning & Reporting</h2>
      <div className="chat-history">
        {messages.map((m, i) => <div key={i}>{m.content}</div>)}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

#### `src/components/AudienceModeSwitch.jsx`
```jsx
export default function AudienceModeSwitch({ mode, onChange }) {
  return (
    <div className="mode-switch">
      <button
        className={mode === 'ai' ? 'active' : ''}
        onClick={() => onChange('ai')}
      >
        AI Mode
      </button>
      <button
        className={mode === 'simple' ? 'active' : ''}
        onClick={() => onChange('simple')}
      >
        Simple Mode
      </button>
    </div>
  );
}
```

#### `src/components/SimpleDemographicSelector.jsx`
```jsx
export default function SimpleDemographicSelector({ value, onChange }) {
  return (
    <div className="simple-demographics">
      <label>Age Range:</label>
      <select value={value.ageMin} onChange={(e) => onChange({ ...value, ageMin: e.target.value })}>
        <option value={18}>18+</option>
        <option value={25}>25+</option>
        <option value={35}>35+</option>
      </select>
      {/* Gender, Income, etc. */}
    </div>
  );
}
```

#### `src/components/PlanningModeSwitch.jsx`
```jsx
export default function PlanningModeSwitch({ mode, onChange }) {
  return (
    <div className="planning-mode-switch">
      <button
        className={mode === 'ai-assisted' ? 'active' : ''}
        onClick={() => onChange('ai-assisted')}
      >
        AI-Assisted
      </button>
      <button
        className={mode === 'freestyle' ? 'active' : ''}
        onClick={() => onChange('freestyle')}
      >
        Freestyle
      </button>
    </div>
  );
}
```

#### `src/components/InheritedFieldBadge.jsx`
```jsx
export default function InheritedFieldBadge({ inherited }) {
  if (!inherited) return null;
  return <span className="inherited-badge">Inherited from AI</span>;
}
```

#### Enhanced Media Components
```jsx
// src/components/media/ScreenTypeBreakout.jsx
// Big Screen (>42") vs 4-screen (TV/tablet/phone/PC) toggle

// src/components/media/AudienceOverlayTable.jsx
// Platform x Audience matrix showing reach

// src/components/media/ProgramIntelligencePanel.jsx
// Show list with RT scores, demographics, airtimes

// src/components/media/TVSpotsPanel.jsx
// Competitor TV spots table
```

---

## 7) Implementation Phases

### Phase 1: Foundation (Backend APIs + Shared State)
1. Build `chat-api/data/signal_repo.py` — advertiser discovery + Signal data loading
2. Build `chat-api/data/media_repo.py` — load UK/US v2 media platforms
3. Build `chat-api/data/geo_repo.py` — country validation
4. Add `/api/advertisers` endpoint (list available)
5. Add `/api/signal/{advertiser}` endpoint (get Signal summary)
6. Extend `PlatformContext` with `aiPlan` state (stores AI-generated audience/campaign)

**Dependency:** Required before UI inheritance features.

---

### Phase 2: AI Agent Core
1. Build `chat-api/ai/providers.py` — Anthropic client
2. Build `chat-api/ai/schemas.py` — Pydantic tool schemas
3. Build `chat-api/ai/tools.py` — `audience_research`, `media_reach_query`
4. Build `chat-api/ai/prompts.py` — System prompt + tool descriptions
5. Build `chat-api/ai/agent.py` — Sonnet 4.5 streaming + tool orchestration
6. Add `/api/ai/chat` SSE endpoint
7. Rename "Syd.AI" → "AI Planning & Reporting" throughout codebase

**Dependency:** Requires foundation endpoints.

---

### Phase 3: Audience + Campaign Inheritance
1. Build `AudienceModeSwitch.jsx`
2. Build `SimpleDemographicSelector.jsx`
3. Refactor `AudienceTargeting.jsx`:
   - Add mode switch
   - When mode = 'ai': show AI chat + inherit from `aiPlan.audience`
   - When mode = 'simple': show demographic dropdowns
4. Build `PlanningModeSwitch.jsx`
5. Build `InheritedFieldBadge.jsx`
6. Refactor `CampaignPlanning.jsx`:
   - Add mode switch
   - When mode = 'ai-assisted': show AI chat + inherit from `aiPlan.campaign`, mark inherited fields with badge
   - When mode = 'freestyle': plain form
7. Add override detection: if user edits inherited field, remove badge

**Dependency:** Requires stable `aiPlan` schema from Phase 2.

---

### Phase 4: Enhanced Media Intelligence Page
1. Migrate `public/data/uk/uk-media-platforms.json` → v2 schema
2. Migrate `public/data/us/us-media-platforms.json` → v2 schema
3. Create `public/data/uk/program-intelligence.json` (extract from Signal + Rotten Tomatoes)
4. Create `public/data/us/program-intelligence.json`
5. Create `public/data/uk/tv-spots.json` (if available from Signal)
6. Create `public/data/us/tv-spots.json`
7. Build `ScreenTypeBreakout.jsx` — big screen vs 4-screen toggle
8. Build `AudienceOverlayTable.jsx` — platform x audience matrix
9. Build `ProgramIntelligencePanel.jsx` — show cards with RT scores
10. Build `TVSpotsPanel.jsx` — competitor spot table
11. Refactor `MediaReach.jsx` to integrate new sub-components

**Dependency:** Requires new media/program/spots schemas.

---

### Phase 5: Hardening and QA
1. Remove all "Syd" / "SID" remnants from codebase
2. Add error states for AI agent (streaming fail, tool errors)
3. Add loading states (skeletons for AI responses, data fetches)
4. Regression test:
   - Country toggle (UK ↔ US)
   - Advertiser selector (dynamic list)
   - Audience modes (AI ↔ simple)
   - Campaign modes (AI-assisted ↔ freestyle)
   - Media page (all new panels)
5. Performance audit (lazy load heavy components)
6. Accessibility audit (ARIA labels, keyboard nav)

---

## 8) Estimated Time / Complexity

- **Foundation APIs + advertiser dynamic loading:** 2-3 days (Medium)
- **AI Planning & Reporting agent + Sonnet 4.5 + tools + streaming:** 3-5 days (High)
- **Audience modes (AI/simple/hybrid):** 2-3 days (Medium)
- **Campaign modes (AI-assisted/freestyle + inheritance badges):** 2-3 days (Medium)
- **Enhanced media page + overlays/program/spots:** 3-4 days (High)
- **Data schema migration + seed data prep:** 2-4 days (High, data-dependent)
- **QA/regression/perf polish:** 1-2 days (Medium)

**Total expected:** 15-24 working days depending on external data readiness.

---

## 9) Libraries and Data Sources Needed

### Frontend npm
- `@tanstack/react-query` — API caching/retries
- `zod` — runtime schema validation
- `eventsource-parser` — SSE streaming parse

### Backend Python
- `httpx` — provider/data HTTP
- `sse-starlette` — SSE responses
- `orjson` — large JSON parsing
- `beautifulsoup4` + `lxml` — `uk-media-intelligence.html` extraction
- optional `cachetools` — TTL cache

### Data Sources
- Signal: `/home/r2/Signal/companies/{slug}/...`
- BARB-derived baseline: `public/data/uk/uk-media-platforms.json` → migrate to v2
- US baseline data already present in `public/data/us/*` → normalize to v2
- Program intelligence: Signal media outputs + curated enrichment
- Rotten Tomatoes: API/ETL feed with periodic snapshotting
- TV spots: UK/US spot intelligence feed snapshots

---

## 10) Concrete File Plan

### Modify
- `src/App.jsx`
- `src/context/PlatformContext.jsx`
- `src/components/AudienceTargeting.jsx`
- `src/components/AudienceSelector.jsx`
- `src/components/CampaignPlanning.jsx`
- `src/components/MediaReach.jsx`
- `src/components/SignalIntelligence.jsx`
- `src/config/platformConfig.js`
- `chat-api/server.py`

### Create
- `src/components/AIPlanningReporting.jsx`
- `src/components/AudienceModeSwitch.jsx`
- `src/components/SimpleDemographicSelector.jsx`
- `src/components/PlanningModeSwitch.jsx`
- `src/components/InheritedFieldBadge.jsx`
- `src/components/media/ScreenTypeBreakout.jsx`
- `src/components/media/AudienceOverlayTable.jsx`
- `src/components/media/ProgramIntelligencePanel.jsx`
- `src/components/media/TVSpotsPanel.jsx`
- `src/services/signalApi.js`
- `src/services/mediaApi.js`
- `src/utils/audienceMapping.js`
- `src/utils/planToCampaignState.js`
- `chat-api/ai/providers.py`
- `chat-api/ai/agent.py`
- `chat-api/ai/tools.py`
- `chat-api/ai/prompts.py`
- `chat-api/ai/schemas.py`
- `chat-api/data/signal_repo.py`
- `chat-api/data/geo_repo.py`
- `chat-api/data/media_repo.py`
- `public/data/uk/uk-media-platforms-v2.json`
- `public/data/us/us-media-platforms-v2.json`
- `public/data/uk/program-intelligence.json`
- `public/data/us/program-intelligence.json`
- `public/data/uk/tv-spots.json`
- `public/data/us/tv-spots.json`

---

**End of Plan**
