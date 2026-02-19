# Codex Brief: TAU-Reporting AI Planning & Reporting Upgrade

## Project Context
Location: `/home/r2/TAU-Reporting/`  
Current state: React + Vite marketing planning tool with basic Syd.AI chat  
Stack: React + Vite + Anthropic Claude + Leaflet maps

## Requirements from Rob

### 1. AI Advisor Rename & Major Upgrade

**Current:** "Syd.AI Strategic Planner" - basic chat interface  
**Required:** "AI Planning and Reporting" - full-featured strategic agent

#### Remove All SID References
- SID is Intermedia-specific branding
- Replace with TAU branding throughout

#### Power with Sonnet 4.5
- Model: `anthropic/claude-sonnet-4-5`
- Not just chat - structured planning agent
- Streaming responses
- Tool use for data access

#### Data Access Required
The AI agent must have access to:

1. **Geo Demo Data**
   - UK: `/home/r2/TAU-Reporting/src/data/ukPostcodeDemographics.js`
   - US: `/home/r2/TAU-Reporting/src/data/zipDemographics.js`
   - Postcode/ZIP3 mapping data

2. **BARB Data** (UK TV measurement)
   - Current location: `/home/r2/TAU-Reporting/public/data/uk/uk-media-platforms.json`
   - Channel reach, demographics, viewing figures
   - Big screen (traditional TV) vs 4-screen (BVOD/streaming)

3. **Custom Instructions from MediaMath Repo**
   - Source: `/home/r2/mediamath/ai_coagents/prompts/`
   - Files: `generate_general_context.py`, `generate_ad_account_details.py`
   - Strategic planning prompts and context builders
   - Math tools pattern, memory tools pattern

4. **Signal Data for Selected Advertiser**
   - Current: `/home/r2/TAU-Reporting/src/data/signalIntegration.js` (hardcoded)
   - **Required:** Pull REAL data from `/home/r2/Signal/companies/{advertiser-slug}/`
   - Files to access:
     - `traffic_intelligence.json`
     - `summary.json`
     - `uk-media-intelligence.html` (parse if needed)
   - Make dynamic based on advertiser selection

#### Planning Features
- Allow selecting **segments** (from segment data)
- Allow selecting **media owners** as part of plan (ITV, Sky, Channel 4, etc.)
- Generate structured campaign plans
- Recommend audience strategies
- Budget allocation suggestions

### 2. Audience Targeting Page Improvements

**Current:** Manual segment selection only  
**Required:** Smart + Simple modes

#### Smart Mode (from AI Planner)
- If user used AI Planning, automatically populate audience from plan
- Show "Using AI Recommendations" badge
- Allow overrides

#### Simple Mode (Manual Selection)
- Basic demographics:
  - Gender: Male / Female / All
  - Age brackets: 18-24, 25-34, 35-44, 45-54, 55-64, 65+
  - Income brackets: <£25k, £25-50k, £50-75k, £75-100k, £100k+
- Quick audience builder without complex segments

#### Hybrid Mode
- Start with AI recommendations
- Refine with simple demographic filters

### 3. Campaign Planning Page Improvements

**Current:** Manual form entry  
**Required:** AI-assisted + Freestyle modes

#### AI-Assisted Mode
- Take data from AI Planning agent if used
- Pre-fill campaign details
- Show inherited values with badges
- Allow refinement

#### Freestyle Mode
- Traditional manual entry
- No AI assistance

### 4. Enhanced UK/US Media Page

**Current:** Basic UK media platform list  
**Required:** Comprehensive media intelligence dashboard

#### Core Features

**Volume Data by Channel**
- **Big Screen TV:** Traditional linear TV viewing
  - UK: BARB measurement (ITV1, BBC One, Channel 4, Sky Atlantic, etc.)
  - US: Nielsen equivalent (ABC, NBC, CBS, Fox, etc.)
- **4-Screen Viewing:** BVOD/streaming
  - UK: ITVX, BBC iPlayer, Channel 4 Streaming, etc.
  - US: Peacock, Paramount+, Hulu, etc.

**Audience Overlay**
- Show how **selected audience** performs on each channel
- "Your target audience indexes at 145 on ITV1"
- Demographics breakdown per channel
- Affinity scores

**Program-Level Intelligence**
- Top programs per channel
- Rotten Tomatoes scores (where available)
- Genre performance
- Daypart analysis

**TV Spots Data**
- **UK TV Spots:** Recent ad activity by channel
- **US TV Spots:** Equivalent competitive intelligence
- Show based on country selection
- Competitor spend patterns

#### Data Structure
```
UK Media Page (if country = UK):
- BARB Volume Data
  - Big Screen: ITV1 (6.2M viewers, Demo: ABC1 skew)
  - 4 Screen: ITVX (1.8M streamers, Demo: younger skew)
- Selected Audience Performance
  - "Males 25-34" → ITV1 index 132, ITVX index 178
- Program Intelligence
  - Top shows, ratings, Rotten Tomatoes scores
- TV Spots Activity
  - Recent advertiser activity, category trends

US Media Page (if country = US):
- Nielsen Volume Data (best available proxy)
  - Big Screen: NBC (8.5M viewers)
  - 4 Screen: Peacock (2.1M streamers)
- Selected Audience Performance
  - Same overlay logic
- Program Intelligence
  - Same structure
- TV Spots Activity
  - US competitive intelligence
```

### 5. Integration Requirements

#### Signal Data Integration
- Currently: Hardcoded mock data in `src/data/signalIntegration.js`
- Required: Dynamic loading from `/home/r2/Signal/companies/`
- API endpoint or direct file read
- Advertiser selector determines which Signal folder to pull from

#### BARB Data Expansion
- Extend current `uk-media-platforms.json`
- Add big screen vs 4-screen breakout
- Add demographic indices per channel
- Add program-level data

#### US Data Sourcing
- Find/create US Nielsen-equivalent data
- Match UK structure for consistency
- Network reach, demographics, program performance

#### Rotten Tomatoes Integration
- API or scraped data for program ratings
- Show scores alongside program names
- Genre insights

#### TV Spots Data
- UK: AdIntel or equivalent source
- US: iSpot or equivalent
- Recent activity by channel/advertiser
- Category spend trends

## Current File Structure

```
src/
├── App.jsx                             # Main app, routing
├── components/
│   ├── StrategicAdvisor.jsx           # RENAME to AIPlanningReporting.jsx
│   ├── AudienceTargeting.jsx          # ENHANCE with simple mode
│   ├── CampaignPlanning.jsx           # ENHANCE with AI assist
│   └── [other components]
├── data/
│   ├── signalIntegration.js           # REPLACE with dynamic Signal loading
│   ├── audienceDefinitions.js         # OK, may extend
│   ├── ukPostcodeDemographics.js      # INTEGRATE with AI agent
│   ├── zipDemographics.js             # INTEGRATE with AI agent
│   ├── marketData.js                  # EXPAND for media page
│   └── countryChannelInventory.js     # EXPAND for 4-screen data
└── config/
    └── [anthropic config]
```

## Implementation Plan Request

**Codex: Analyze the current TAU-Reporting code and provide a detailed implementation plan covering:**

1. **AI Planning and Reporting Agent**
   - How to rename and rebrand from Syd.AI
   - Architecture for Sonnet 4.5 powered agent
   - Tool definitions for data access (geo, BARB, Signal)
   - Integration of MediaMath prompts/instructions
   - Segment and media owner selection UI
   - Structured planning output

2. **Real Signal Data Integration**
   - Replace hardcoded `signalIntegration.js`
   - Dynamic loading from `/home/r2/Signal/companies/{slug}/`
   - Advertiser selector component
   - File reading strategy (API vs direct)
   - Error handling for missing data

3. **Audience Targeting Enhancements**
   - AI-inherited audience mode
   - Simple demographic selector (gender, age, income)
   - Hybrid mode
   - UI/UX for mode switching

4. **Campaign Planning Enhancements**
   - AI-assisted mode (inherit from AI planner)
   - Freestyle mode
   - Badge/indicator system for inherited values

5. **Enhanced Media Page**
   - Big screen vs 4-screen breakout
   - Audience overlay (selected audience performance per channel)
   - Program intelligence integration
   - Rotten Tomatoes data
   - TV spots data (UK and US)
   - Country-aware display logic

6. **Data Structure Expansions**
   - BARB data format for big/4-screen
   - US Nielsen-equivalent structure
   - Program-level data schema
   - TV spots data schema
   - Demographic indices per channel

7. **Priority Order**
   - Which changes to tackle first
   - Dependencies between components
   - Data requirements before UI changes

8. **Estimated Time/Complexity**
   - Per feature/component
   - Total project estimate

9. **Libraries/Dependencies Needed**
   - Any new npm packages
   - External APIs
   - Data sources

## Success Criteria

- AI Planning and Reporting agent powered by Sonnet 4.5
- Access to all geo, BARB, and Signal data
- Real Signal data (not hardcoded)
- Simple audience targeting option
- AI-assisted campaign planning
- Comprehensive UK/US media page with 4-screen data
- Program intelligence and TV spots
- No SID branding anywhere

## References

### MediaMath Custom Instructions
- Location: `/home/r2/mediamath/ai_coagents/prompts/`
- Study the prompt generation patterns
- Adapt for TAU-Reporting context

### Signal Data Structure
- Location: `/home/r2/Signal/companies/{slug}/`
- Example: `/home/r2/Signal/companies/tombola-co-uk/`
- Files: `traffic_intelligence.json`, `summary.json`

### Current BARB Data
- `/home/r2/TAU-Reporting/public/data/uk/uk-media-platforms.json`
- Extend with big screen vs 4-screen
- Add demographic overlays

### UK Media Intelligence Example
- `/home/r2/Signal/companies/midnite-com/uk-media-intelligence.html`
- Shows how media data is structured in Signal
- Reference for integration

---

**Next Steps:**
1. Codex analyzes current code
2. Codex creates detailed implementation plan
3. Rob reviews plan
4. Codex implements in phases
5. R2 validates and commits
