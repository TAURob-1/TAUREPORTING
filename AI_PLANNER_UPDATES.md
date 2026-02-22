# AI Planner System Prompt Updates (2026-02-22)

## Changes Made

Based on Rob's feedback, refined the AI planner to be more nuanced and consultative vs prescriptive.

---

## 1. Signal Data Positioning

**Before:** Signal insights pushed to top of analysis  
**After:** Signal data as SUPPORTING evidence, not lead insight

**Example:**
- ❌ "According to Signal data, Tombola's audience is 55-75 women..."
- ✅ "The brief targets 18-44 men. Signal data shows Tombola's current strength is older women (55-75), so this represents a NEW audience segment requiring distinct positioning."

**Impact:** Signal validates/challenges assumptions but doesn't dominate the narrative.

---

## 2. Audience Targeting Precision

**Before:** Accepted broad demographics without question  
**After:** Acknowledge breadth, push for sub-segmentation

**New Guidance:**
- "18-44 men" = 11M+ UK adults (too broad to hit with limited budget)
- Budget + frequency constraints (3-5 exposures) = can only reach 40-50% of total
- ALWAYS ask: "What behavioral, attitudinal, or contextual signals define the PRIORITY segment?"

**Sub-Segmentation Approaches:**
1. Behavioral: Gaming app users, competitor site visitors, casino content viewers
2. Contextual: Mobile gaming moments (commute, lunch, evening)
3. Geographic: High-propensity MSOAs (income, age concentration)
4. Attitudinal: Lookalike from existing high-value customers
5. Lifecycle: Lapsed players (reactivation) vs cold prospects (acquisition)

**Example Output:**
"The brief targets 18-44 men (11M+ people). With a £4.2M budget and 3-5 exposure frequency target, you can realistically reach ~8-9M unique users (45-50% of total). This requires prioritization. What behavioral or contextual signals define the CORE segment within 18-44?"

---

## 3. Geographic Targeting

**Before:** Aggressively pushed MSOA concentration  
**After:** Suggest as OPTION with benefits + trade-offs, don't mandate

**New Language:**
- "A geo-focused approach COULD help maximize budget efficiency and enable holdout testing"
- "You could concentrate on 500 high-propensity MSOAs OR go national – trade-offs below"
- "Geographic targeting is an OPTION that could help..." (not "You MUST do MSOA targeting")

**Benefits Highlighted:**
1. Budget efficiency: 20-30% CPM reduction via supply concentration
2. Holdout capability: 10% of markets as control group for incrementality
3. Phased scaling: Prove-out Month 1, expand if working
4. Better frequency: Limited geography = higher frequency vs national thin reach

**Trade-offs Acknowledged:**
- Lower absolute reach ceiling
- Requires MSOA/postcode data access
- Some platforms (Linear TV) don't support tight geo-targeting
- Risk: Missing high-value customers outside priority geographies

---

## 4. Plan Pushback & Agency Questions

**Before:** Vague critique ("this could be better")  
**After:** Clear pushback with data, specific agency questions

**New Approach When Disagreeing:**
1. **STATE CLEARLY:** "This allocation appears counter to the data we have on reach and audience fit"
2. **CITE SPECIFIC DATA:** "BARB data shows YouTube CTV reaches 35.6M ad-supported users (57.8% UK adults), while this plan allocates only 15%"
3. **SUGGEST CLARIFICATION QUESTIONS:** "Questions for Mediacom:"
   - "Why 71% CTV for mobile-first audience? Please show demographic indexing data."
   - "What rebates or incentives does your agency receive on ITV/C4 that might influence this allocation?"
   - "Can you provide CTV targeting specs – behavioral, contextual, geographic – not just 'Adults 18+'?"

**Question Templates Added:**
- "The brief specifies [mobile-first] audience. Why does this plan allocate X% to [linear TV/lean-back channels]?"
- "This plan shows [vague targeting]. Can you break down sub-segments within [broad demographic] and budget prioritization?"
- "The rationale mentions 'partner agreements' for [platform]. How do agency deals influence this vs client outcomes?"
- "Where's the testing budget? Spending £XM on untested [creative/positioning] carries significant risk."

**Tone:**
- Not adversarial: "We want to help ensure the plan delivers for [client]"
- Data-driven: "Based on BARB reach data..." / "Industry benchmarks suggest..."
- Constructive: "This could be strengthened by..." / "Consider whether..."

---

## 5. Tone & Framing

**Updated to Always:**
1. **Acknowledge strengths first** - "This is a strong brief. The commercial logic is clear..."
2. **Frame improvements as 'tightening'** - Not "fixing" but "where the brief could be tightened"
3. **Caveat recommendations** - "Indicative plan based on available data. [Agency/Client] to validate with proprietary sources."
4. **Use ranges, not point estimates** - "65-70% reach with 8-12 frequency" (not "68% reach, 10 frequency")

**Key Language Patterns:**
- "We recommend the team considers whether..."
- "This gives agencies a planning anchor without pretending precision that doesn't exist"
- "The strategic direction should hold even as specific metrics are refined"

**Avoid:**
- Absolute statements without caveats
- Making up data or statistics
- Ignoring stated constraints
- Point estimates instead of ranges

---

## Updated Quick Action Templates

### "📋 Analyze Brief" 
Now includes:
- Acknowledge strengths first
- Note if target is too broad, suggest sub-segmentation
- Use Signal as supporting context (not lead)
- Suggest geo as option (not mandate)
- Always caveat: "Indicative plan based on available data..."

### "🔍 Audit Media Plan"
Now includes:
- Start with what's strong
- If target is broad (18-44 = 11M+), FLAG IT with budget/frequency math
- If plan counters data, STATE CLEARLY with citations
- Generate specific agency clarification questions
- Suggest geo as option if missing
- Use Signal appropriately (supporting, not lead)
- Always caveat: "Without full performance data or MMM..."

---

## Files Changed

1. **`src/context/PlannerContext.jsx`**
   - Added `<audience_targeting_precision>` section to system prompt
   - Added `<geographic_targeting_guidance>` section
   - Enhanced `<media_plan_audit>` with pushback framework
   - Enhanced `<data_context>` with Signal positioning guidance

2. **`src/components/planner/tabs/ChatTab.jsx`**
   - Updated "Analyze Brief" quick action template
   - Updated "Audit Media Plan" quick action template
   - More nuanced, consultative tone throughout

---

## Expected Behavior Changes

**Before:**
- AI: "You should do MSOA targeting. Allocate 60% to mobile platforms."
- Agency gets defensive, client confused

**After:**
- AI: "A geo-focused approach COULD help maximize budget and enable holdout testing – trade-offs below. If mobile-first is priority, consider whether 71% CTV allocation aligns with where 'Spin Masters' spend media time. Questions for agency: Why X% on [channel] for [mobile audience]? Show demographic indexing."
- Agency can't dodge specific questions, client empowered with data

---

## Testing Checklist

- [ ] Upload Arcade brief PDF → "Analyze Brief" → Check it doesn't lead with Signal data
- [ ] Check if AI flags "18-44 men" as too broad and suggests sub-segmentation
- [ ] Check if geo targeting is framed as "COULD help" (not "MUST do")
- [ ] Upload `highCTV_plan.csv` → "Audit Media Plan" → Check for clear pushback ("counter to data")
- [ ] Verify AI generates specific agency questions (not vague "provide more detail")
- [ ] Confirm tone is consultative (acknowledge strengths first, then tighten gaps)

---

## Commit Message

```
Refine AI planner system prompt for nuanced analysis

- Signal data as supporting evidence, not lead insight
- Acknowledge broad demographics (18-44 = millions), push for sub-segmentation
- Suggest geo targeting as option (budget efficiency + holdout testing), not mandate
- Clear pushback when plans counter data (cite BARB, suggest agency questions)
- Tone: acknowledge strengths first, then tighten gaps
- Always caveat recommendations with data limitations
```

---

**Status:** Ready for live testing in Tombola demo (Feb 23)
