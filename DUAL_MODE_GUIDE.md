# Dual-Mode AI Planner Guide

## The Two Modes

Your AI planner now operates in two distinct modes depending on the context:

---

## 🤝 MODE 1: Consultative (Auditing External Work)

**When:** Evaluating agency plans, client briefs, uploaded CSVs/PDFs

**Stance:** Diplomatic advisor helping client hold agency accountable

**Tone:** Questioning, empowering, suggesting

**Language Examples:**
- ❌ "You MUST do MSOA targeting"
- ✅ "A geo-focused approach **COULD** help maximize budget and enable holdout testing. Trade-offs below..."
- ❌ "This plan is wrong"
- ✅ "This allocation **appears counter to the data** we have on reach and audience fit. Questions for Mediacom..."
- ❌ "Do sub-segmentation"
- ✅ "You might want to clarify: what sub-segment prioritization exists beneath this broad demographic?"

**Purpose:** Generate specific questions the client can ask their agency, not replace the agency

---

## 💪 MODE 2: Directive (Proposing TAU's Recommendations)

**When:** Client asks "What would you recommend?" or "How should we approach this?"

**Stance:** Confident strategist taking ownership

**Tone:** Clear, action-oriented, forthright

**Language Examples:**
- ❌ "You could maybe consider possibly trying..."
- ✅ "**We recommend** starting focused: concentrate Month 1 spend on 500 high-propensity MSOAs..."
- ❌ "Geographic targeting is an option if you want..."
- ✅ "**Start with** a focused geographic approach: 500 MSOAs deliver 20-30% CPM reduction and enable holdout testing. Prove-out Month 1, scale Month 2-3 if CPA targets hold."
- ❌ "You might want to think about sub-segments"
- ✅ "**Target beneath the demographic:** Behavioral (gaming app users, competitor visitors), Contextual (mobile moments: commute, lunch, evening), Geographic (500 high-propensity MSOAs), Lookalike (top 20% existing players)."

**Purpose:** Deliver a clear, actionable plan that TAU stands behind

---

## Side-by-Side Comparison

| Topic | MODE 1: Consultative | MODE 2: Directive |
|-------|---------------------|-------------------|
| **Geographic Targeting** | "A geo approach COULD help maximize budget and enable holdout testing. Trade-offs: lower reach ceiling vs better frequency." | "We recommend starting focused: concentrate Month 1 spend on 500 high-propensity MSOAs (20-30% CPM reduction, enables holdout testing). Prove-out, then scale Month 2-3 if CPA holds." |
| **Sub-Segmentation** | "You might want to clarify: what sub-segment prioritization exists beneath '18-44 men'?" | "Target: Gaming app users, competitor site visitors, lookalike from top 20% existing players, mobile moments (commute/lunch/evening)." |
| **Channel Mix** | "Consider whether 71% CTV allocation aligns with mobile-first audience behavior." | "This plan prioritizes mobile-first platforms (38% TikTok + Meta + Twitch) where 'Spin Masters' spend media time, vs CTV (35% for scale, not dominance)." |
| **Testing Budget** | "Where's the testing budget? Spending £4.2M on untested positioning carries risk." | "10% testing budget (£420K): validate creative variants and channel mix March 1-27, kill losers, scale winners April-June." |
| **Agency Questions** | "Questions for Mediacom: Why 71% CTV for mobile-first audience? Show demographic indexing." | N/A (not auditing, proposing) |

---

## How the AI Knows Which Mode

**Triggers MODE 1 (Consultative):**
- User clicks "🔍 Audit Media Plan"
- User asks "What do you think of this plan/brief?"
- User asks "What questions should I ask the agency?"
- Analyzing uploaded CSV/PDF from external source

**Triggers MODE 2 (Directive):**
- User clicks "📋 Analyze Brief" (Question 2: "What would you recommend?")
- User clicks "📊 Media Plan Only"
- User asks "What would you recommend as a plan?"
- User asks "How should we approach this?"

---

## Quick Action Buttons Updated

### 📋 Analyze Brief
**Question 1** → MODE 1 (consultative critique)
- "You might want to clarify..."
- "SUGGEST it as an option..."

**Question 2** → MODE 2 (directive recommendation)
- "We recommend..."
- "Start with..."
- "This plan prioritizes..."

### 🔍 Audit Media Plan
**Entire response** → MODE 1 (consultative)
- Acknowledge strengths first
- Flag issues with data citations
- Generate specific questions for agency
- SUGGEST improvements as options

### 📊 Media Plan Only
**Entire response** → MODE 2 (directive)
- "We recommend..."
- Take ownership of channel mix, targeting, geo strategy
- Be confident and specific

---

## Examples of MODE 2 (Directive) Language

### Geographic Strategy
"We recommend starting focused rather than going national. **Concentrate Month 1 spend on 500 high-propensity MSOAs** (Age 25-44 concentration >30%, income £30-60K, urban/suburban). This delivers:
- 20-30% CPM reduction via supply concentration
- Holdout capability (10% markets as control for incrementality)
- Phased scaling (prove-out Month 1, expand Month 2-3 if CPA <£250)

If performance holds, expand to 1,000 MSOAs Month 2, national Month 3."

### Targeting Precision
"The brief targets '18-44 men' (11M+ UK adults). With £4.2M budget and 3-5 exposure frequency, realistic reach is 8-9M (45-50% of total). This requires prioritization.

**We recommend targeting beneath the demographic:**
1. **Behavioral:** Gaming app users, competitor site visitors (Sky Vegas, 888 Casino), casino content viewers, slots streamers
2. **Contextual:** Mobile gaming moments (commute 7-9am/5-7pm, lunch 12-2pm, evening 8-11pm)
3. **Geographic:** 500 high-propensity MSOAs (income, age concentration, urban/suburban)
4. **Attitudinal:** Lookalike from top 20% existing Arcade players (175K database)
5. **Lifecycle:** Reactivation (lapsed players, £10-20 CPA) before cold acquisition (£250+ CPA)"

### Channel Mix
"This plan prioritizes mobile-first platforms where 'Spin Masters' spend media time:
- **TikTok 18%** (£756K): #1 platform Age 25-34, gaming vertical, Spark Ads from real winners
- **Meta 15%** (£630K): Instagram Reels 70%, Facebook gaming groups 30%, lookalike from existing players
- **YouTube CTV 15%** (£630K): Scale + targeting, gaming content adjacency, NOT the hero (mobile is)
- **Testing 10%** (£420K): Validate creative/channel mix before scaling

CTV total = 35% (scale, not dominance). Mobile total = 38% (where target actually is)."

---

## What Changed

**Files Modified:**
1. `src/context/PlannerContext.jsx` - Added `<dual_mode_positioning>` section to system prompt
2. `src/components/planner/tabs/ChatTab.jsx` - Updated quick action templates with mode indicators
3. `AI_PLANNER_UPDATES.md` - Documentation of all changes

**System Prompt Additions:**
- 120+ lines defining MODE 1 vs MODE 2 behavior
- Clear examples of language differences
- Triggers for each mode
- Side-by-side comparison table

---

## Testing Checklist

**MODE 1 (Consultative):**
- [ ] Upload `highCTV_plan.csv` → Click "🔍 Audit Media Plan"
- [ ] Check for: "COULD help", "Consider whether", "Questions for Mediacom"
- [ ] Verify it generates specific agency questions (not vague)
- [ ] Confirm tone is diplomatic, not adversarial

**MODE 2 (Directive):**
- [ ] Upload Arcade brief PDF → Click "📋 Analyze Brief" → Read Question 2
- [ ] Check for: "We recommend", "Start with", "Concentrate on"
- [ ] Verify geographic strategy is forthright: "We recommend starting focused: 500 MSOAs..."
- [ ] Confirm targeting is specific (not "consider sub-segmentation" but actual sub-segments listed)
- [ ] Check channel mix takes a position: "This plan prioritizes..."

---

## Expected Behavior for Tombola Demo

**Scenario 1: Audit Mediacom's highCTV Plan**
User uploads `highCTV_plan.csv` → Clicks "🔍 Audit Media Plan"

**AI Response (MODE 1 - Consultative):**
"This plan shows 71% CTV allocation. For a mobile-first 'Spin Masters' audience (Age 25-44), this **appears counter to the data** we have on where this demographic spends media time.

**Questions for Mediacom:**
1. Why 71% CTV for mobile-first audience? Please show demographic indexing data.
2. TikTok is only 6% - why so low when it's the #1 platform for Age 25-34? 
3. What CTV targeting specs – behavioral, contextual, geographic – beyond 'Adults 18+'?
4. The rationale mentions 'brand safety pending review' - is this masking platform bias toward CTV?

**Geo Strategy:**
A geo-focused approach **COULD** help maximize budget efficiency and enable holdout testing. Trade-offs: lower reach ceiling vs better frequency and incrementality measurement."

---

**Scenario 2: Recommend TAU's Plan**
User uploads Arcade brief → Clicks "📋 Analyze Brief" or "📊 Media Plan Only"

**AI Response (MODE 2 - Directive):**
"**We recommend** a mobile-first approach with focused geographic start:

**Channel Mix:**
- TikTok 18% (£756K): #1 platform Age 25-34, gaming vertical
- Meta 15% (£630K): Instagram Reels priority, lookalike from 175K existing players
- YouTube CTV 15% (£630K): Scale, not dominance
- Testing 10% (£420K): Validate before scaling

**Geographic Strategy:**
**Start focused:** Concentrate Month 1 spend on 500 high-propensity MSOAs (20-30% CPM reduction, enables holdout testing). Prove-out, then scale Month 2-3 if CPA <£250.

**Targeting Beneath Demographics:**
The brief targets '18-44 men' (11M+ people, can only reach 45-50% with budget).

**We recommend:**
- Behavioral: Gaming app users, competitor visitors
- Contextual: Mobile moments (commute, lunch, evening)
- Geographic: 500 high-propensity MSOAs
- Lookalike: Top 20% existing Arcade players"

---

## The Key Difference

**MODE 1:** Empower client to ask good questions → Hold agency accountable
**MODE 2:** Take ownership → Deliver clear, actionable plan

Both modes are data-grounded and caveated, but **tone and confidence level shift dramatically** based on whether you're critiquing or creating.

---

**Status:** Live on port 5175, ready for Tombola demo Feb 23 🚀
