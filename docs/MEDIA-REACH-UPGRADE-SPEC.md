# TAU-Reporting Media & Audience Upgrades

## Overview
Three integrated upgrades to make TAU-Reporting a genuinely insightful media planning tool.

---

## 1. Primary Audience Integration

### Current State
- Primary audience selected in AI Planner (Campaign Name, Dates, Primary Audience)
- Audience Targeting section is separate
- No flow between them

### Target State
- Primary audience from AI Planner flows automatically into Audience Targeting
- Shows on geo map as the custom audience
- Becomes the default targeting foundation

### Implementation
- Update `PlatformContext` to pass primary audience from campaign config → Audience Targeting
- Audience Targeting component uses primary audience as default custom audience
- Geo map highlights regions based on primary audience demographics

---

## 2. Smart Audience Sizing

### Problem
If target audience is too niche (< 500k people in UK), geo targeting becomes impractical.

### Solution: Two-Tier Audience System

**Rule:** If estimated UK audience < 500k:
- **Primary Audience** = Broader category (e.g., "Affluent UK Adults")
- **Secondary Audience** = Tight refinement (e.g., "Ultra-high net worth, £10M+ assets")
- Secondary applied outside of geo (via platform targeting, creative, etc.)

**Example:**
- User input: "UK super rich"
- System detects: < 500k people
- **Primary Audience** → "Wealthy UK Adults" (broader, geo-targetable)
- **Secondary Audience** → "Ultra-high net worth" (refined in platform settings)
- UI shows both clearly with explanation

### Audience Size Estimates (UK)
**Data source:** Use Signal's demographic data or hardcoded lookup table:

| Audience Segment | Estimated UK Size | Category |
|------------------|-------------------|----------|
| Total Adults | 52M | Base |
| Men 18-35 | 6M | Broad |
| Women 25-45 | 8M | Broad |
| Affluent (£100K+ income) | 3M | Mid |
| High Net Worth (£1M+ assets) | 1.2M | Mid |
| **Ultra Rich (£10M+ assets)** | **150K** | **Niche** |
| Gaming enthusiasts | 15M | Broad |
| Luxury car owners | 800K | Mid |
| Parents with kids 0-5 | 4M | Broad |

**Threshold:** 500k
- **Above 500k** → Use as primary audience for geo targeting
- **Below 500k** → Elevate to broader primary, keep original as secondary

### Smart Defaults Logic
```javascript
function segmentAudience(primaryAudienceInput) {
  const sizeEstimate = estimateAudienceSize(primaryAudienceInput);
  
  if (sizeEstimate < 500000) {
    return {
      primary: broaden(primaryAudienceInput), // "Ultra Rich" → "Affluent"
      secondary: primaryAudienceInput,        // "Ultra Rich"
      reasoning: `Audience size estimated at ${formatNumber(sizeEstimate)}. Using broader primary for geo targeting, with secondary refinement.`
    };
  }
  
  return {
    primary: primaryAudienceInput,
    secondary: null,
    reasoning: `Audience size estimated at ${formatNumber(sizeEstimate)}. Suitable for direct geo targeting.`
  };
}
```

---

## 3. Campaign Planning Inheritance

### Current State
- Campaign Planning exists separately
- No connection to AI Planner output

### Target State
- Budget from AI Planner → auto-populates Campaign Planning budget
- Media mix recommendations from AI → pre-fill Campaign Planning allocations
- Dates from campaign config → Campaign Planning timeline

### Implementation
- Campaign Planning reads from shared `planningState` in `PlatformContext`
- If AI has suggested budget allocation → pre-fill
- If AI has suggested media mix → show as starting point
- User can override/refine

---

## 4. Media Reach Tab - Major Enrichment

### Current State
- Basic list of TV/CTV publishers
- Not very insightful

### Target State
**Genuinely insightful media landscape intelligence**

### Data Sources to Integrate

**A. Signal Media Data** (`/home/r2/Signal/Media/`)
- **Programming data** (`Media/channels.json`, `Media/ctv.json`, `Media/radio.json`)
- **Publisher reach** (TV, CTV, radio, DOOH)
- **Content categories** (kids, sports, news, drama)

**B. Platform Data** (hardcoded or API)
- Google (YouTube, Display, Search)
- Meta (Facebook, Instagram)
- Amazon (Prime Video, IMDb TV, Twitch)
- Spotify (Audio ads)
- TikTok (Video ads)

**C. Demographic Preferences** (hardcoded lookup tables or Signal data)
- Which publishers do different age groups prefer?
- Which channels do different genders prefer?
- Which platforms do different income levels prefer?

### New Structure

#### Section 1: Major Platforms
**Table:**
| Platform | Reach (UK) | Formats | Targeting Capabilities | Best For |
|----------|------------|---------|------------------------|----------|
| Google (YouTube) | 45M adults | Video, Display | Intent, Interest, Demographics | Broad reach, intent targeting |
| Meta (Facebook/Instagram) | 42M adults | Video, Display, Stories | Demographics, Interests, Lookalike | Social engagement, visual brands |
| Amazon Advertising | 28M Prime members | Video, Display, Sponsored Products | Purchase intent, lifestyle | E-commerce, premium audiences |
| Spotify | 18M active | Audio ads | Music taste, mood, demographics | Commuters, younger demos |
| TikTok | 22M active | Short video | Trending content, young demos | Gen Z, viral creative |

#### Section 2: TV & CTV Publishers
**Current list + enrichment:**
- ITV, Channel 4, Sky, BBC (current)
- Add programming insights: "ITV Drama peaks 8-10pm, 25-54 audience"
- Add reach by demographic
- Add "Best for" recommendations

**Table:**
| Publisher | Reach | Key Shows/Content | Audience Profile | Best For |
|-----------|-------|-------------------|------------------|----------|
| ITV | 42M | Soaps, Drama, Reality | 25-54, Female skew | Mainstream brands, emotional storytelling |
| Channel 4 | 38M | Comedy, Reality, Alt. | 16-34, urban | Youth brands, challenger brands |
| Sky | 24M | Sports, Docs, Premium | 35-54, affluent | Premium brands, sports fans |

#### Section 3: Content Category Insights
**From Signal programming data:**

**Table:**
| Content Type | Main Platforms | Audience | Example Shows/Channels |
|--------------|----------------|----------|------------------------|
| Kids Cartoons | YouTube, Netflix, Disney+ | Parents 25-40, Kids 4-12 | Peppa Pig, Bluey, PAW Patrol |
| Sports | Sky Sports, BT Sport, DAZN | 18-54, Male skew | Premier League, F1, Rugby |
| News | BBC News, Sky News, YouTube | 45+, high engagement | BBC News at 10, Sky News |
| Reality TV | ITV, Channel 4, Netflix | 16-34, Female skew | Love Island, TOWIE |
| Drama | BBC, ITV, Netflix | 25-54, evening viewing | Line of Duty, Bridgerton |

#### Section 4: Audience Preference Breakdown

**By Age Group:**
| Age Group | Preferred Platforms | Preferred Content | Viewing Habits |
|-----------|--------------------|--------------------|----------------|
| 16-24 | TikTok, Instagram, YouTube | Short-form, trending, music | Mobile-first, evening peaks |
| 25-34 | YouTube, Instagram, Spotify | On-demand, lifestyle, comedy | Streaming dominant, flex schedule |
| 35-44 | Facebook, YouTube, TV | News, drama, family content | Mixed linear + streaming, primetime |
| 45-54 | Facebook, TV, Radio | News, drama, talk radio | Linear TV strong, morning radio |
| 55+ | TV, Radio, Facebook | News, soaps, classic drama | Linear TV primary, daytime viewing |

**By Gender:**
| Publisher/Platform | Male Skew | Female Skew | Notes |
|--------------------|-----------|-------------|-------|
| Sky Sports | 75% | 25% | Heavy male skew |
| ITV Soaps | 30% | 70% | Female prime audience |
| Gaming (Twitch, YouTube Gaming) | 65% | 35% | Male skew but growing female |
| Instagram | 40% | 60% | Female skew, visual content |
| TikTok | 45% | 55% | Slight female skew |

**By Income Level:**
| Platform/Publisher | Affluent (£75K+) | Mid (£30-75K) | Mass (< £30K) |
|--------------------|------------------|---------------|---------------|
| Sky Premium | High | Medium | Low |
| Amazon Prime Video | High | High | Medium |
| ITV/Channel 4 | Medium | High | High |
| Spotify Premium | Medium | High | Medium |
| Free streaming (ITVX, All4) | Low | Medium | High |

#### Section 5: Recommendations for Primary Audience

**Dynamic section based on selected primary audience**

**Example: Primary Audience = "Affluent UK Adults 35-54"**

**Recommended Publishers:**
1. **Sky** - Premium content, matches demographic profile, strong reach in target
2. **Amazon Prime Video** - High Prime membership in affluent demos
3. **Facebook** - Strong reach, precise income targeting available
4. **Radio (Smooth FM, Classic FM)** - Commuter reach, affluent skew

**Content Recommendations:**
- Drama (evening viewing, high engagement)
- News/Current affairs (morning & evening)
- Premium sports (football, rugby, golf)

**Avoid:**
- Youth-skewed platforms (TikTok)
- Daytime TV (wrong viewing time)
- Mass-market reality TV (wrong audience profile)

**Estimated Combined Reach:** 35M UK adults (67% of total, 85% of target)

---

## Implementation Approach

### Stage 1: Primary Audience Flow
**Goal:** Get primary audience flowing from AI Planner → Audience Targeting → Geo Map

**Files:**
- `src/context/PlatformContext.jsx` (add primary audience to state)
- `src/components/AudienceTargeting.jsx` (read from context, use as default)
- `src/components/BudgetAllocator.jsx` (geo map uses primary audience)

**Exit Criteria:** Primary audience from campaign config appears in Audience Targeting and influences geo map

---

### Stage 2: Smart Audience Sizing
**Goal:** Detect niche audiences, auto-create primary/secondary split

**Files:**
- `src/lib/data/audienceSizes.ts` (lookup table)
- `src/lib/campaign/smartDefaults.ts` (add audience segmentation logic)
- `src/components/planner/tabs/ChatTab.jsx` (show primary/secondary in UI)
- `src/components/AudienceTargeting.jsx` (display both tiers)

**Exit Criteria:** When user enters "Ultra Rich UK", system suggests "Affluent UK" as primary and shows reasoning

---

### Stage 3: Campaign Planning Inheritance
**Goal:** Budget & media mix from AI flows into Campaign Planning

**Files:**
- `src/components/CampaignPlanning.jsx` (read budget from shared state)
- `src/lib/campaign/smartDefaults.ts` (generate media mix recommendations)
- `src/context/PlatformContext.jsx` (add media mix to planning state)

**Exit Criteria:** When AI suggests "£500k budget, 40% Digital, 30% TV, 30% Audio", Campaign Planning pre-fills these values

---

### Stage 4: Media Reach - Data Integration
**Goal:** Load Signal media data + create platform/demographic lookup tables

**Files:**
- `src/lib/data/mediaPlatforms.ts` (Google, Meta, Amazon, Spotify, TikTok)
- `src/lib/data/publisherData.ts` (TV/CTV publishers with enrichment)
- `src/lib/data/contentCategories.ts` (Programming types from Signal)
- `src/lib/data/audiencePreferences.ts` (Age/Gender/Income breakdowns)
- `src/lib/media/signalDataLoader.ts` (load from `/home/r2/Signal/Media/`)

**Exit Criteria:** All data structures loaded and available to Media Reach component

---

### Stage 5: Media Reach - UI Rebuild
**Goal:** Rich, insightful Media Reach tab

**Files:**
- `src/components/MediaReach.jsx` (complete rebuild)
- `src/components/media/PlatformTable.tsx` (Major Platforms)
- `src/components/media/PublisherTable.tsx` (TV/CTV enriched)
- `src/components/media/ContentInsights.tsx` (Programming data)
- `src/components/media/AudiencePreferences.tsx` (Demographics)
- `src/components/media/RecommendationsPanel.tsx` (Dynamic based on primary audience)

**Exit Criteria:** Media Reach tab shows all 5 sections, genuinely insightful, responds to primary audience selection

---

## Success Criteria

1. ✅ Primary audience flows through entire system (AI Planner → Audience Targeting → Geo Map → Campaign Planning)
2. ✅ Niche audiences (< 500k) automatically get primary/secondary split with clear explanation
3. ✅ Campaign Planning inherits budget and media mix from AI recommendations
4. ✅ Media Reach tab provides genuinely useful insights about UK media landscape
5. ✅ Media recommendations update dynamically based on selected primary audience
6. ✅ All data integrated from Signal's media database where available

---

## Test Cases

**Test 1: Broad Audience**
- Input: "UK Parents with Young Children"
- Expected: Direct primary audience (4M UK), no secondary, geo targeting enabled

**Test 2: Niche Audience**
- Input: "UK Ultra High Net Worth Individuals"
- Expected: Primary = "Affluent UK Adults" (3M), Secondary = "Ultra High Net Worth" (150k), explanation shown

**Test 3: AI Budget Flow**
- AI suggests: "£1M budget, 50% Digital, 30% TV, 20% Audio"
- Expected: Campaign Planning pre-fills with these values

**Test 4: Media Recommendations**
- Primary Audience: "Affluent UK Adults 35-54"
- Expected: Media Reach recommends Sky, Amazon, premium channels, avoids TikTok/youth platforms

---

## Technical Notes

**Signal Media Data Location:**
- `/home/r2/Signal/Media/channels.json` (TV channels)
- `/home/r2/Signal/Media/ctv.json` (CTV platforms)
- `/home/r2/Signal/Media/radio.json` (Radio stations)

**Data Loading:**
```javascript
async function loadSignalMediaData() {
  const channels = await fetch('/api/media/channels').then(r => r.json());
  const ctv = await fetch('/api/media/ctv').then(r => r.json());
  const radio = await fetch('/api/media/radio').then(r => r.json());
  return { channels, ctv, radio };
}
```

**Alternatively:** Bundle minimal media data directly in frontend if backend API not needed.
