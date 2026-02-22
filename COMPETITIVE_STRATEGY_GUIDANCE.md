# Competitive Strategy vs Media Planning Conventions

## The Distinction

The AI planner now separates two types of questions:

---

## 📊 Core Media Plan Questions

**When user asks:**
- "What's the media plan?"
- "How should we allocate budget?"
- "What channels should we use?"
- Building Layer 3 (Channel Planning)

**AI Response:**
- Follow PAID MEDIA conventions (channels, budgets, targeting, measurement, flighting)
- Standard media planning structure
- Don't mix strategic insights into budget tables

**Example:**
```
Channel Mix:
- TikTok 18% (£756K)
- Meta 15% (£630K)
- YouTube CTV 15% (£630K)
- ITVX 10% (£420K)
- C4 10% (£420K)
- Programmatic 10% (£420K)
- Twitch 5% (£210K)
- Audio 5% (£210K)
- Testing 10% (£420K)
- Contingency 2% (£84K)
```

---

## 🎯 Competitive Strategy Questions

**When user asks:**
- "How do I compete in a crowded market?"
- "What's our competitive advantage?"
- "How do we beat [competitor]?"
- "What should we do that others aren't?"

**AI Response:**
- GO BEYOND paid media to owned channels, strategic advantages, creative differentiation
- Use Signal intelligence to identify competitive gaps
- Reference advantages outside the media plan

---

## 8 Strategic Levers for Competitive Advantage

### 1. Owned Channel Leverage
**Signal Data:** Tombola 71.58% direct traffic (vs competitors ~67%)

**Insight:** Owned channels (email, push, in-app) can deliver 40-50% of NDP target at fraction of paid media cost

**Recommendation:**
"£500K email/push reactivation (175K existing players) BEFORE scaling £4.2M paid media. Reactivation CPA £10-20 vs cold acquisition £254."

---

### 2. AI Visibility Advantage
**Signal Data:** Tombola 50.7% AI visibility, Competitors 0-10%

**Insight:** AI search is future discovery, competitors ignoring it

**Recommendation:**
"£200K AI SEO investment (content, schema, entity building) = 6-12 month compounding advantage while competitors ignore it."

---

### 3. Reactivation vs Acquisition Economics
**Signal Data:** 175K existing Arcade players

**Insight:** Warm audience cheaper to convert than cold prospects

**Recommendation:**
"Prove positioning with existing players FIRST (Month 1 reactivation), then scale cold acquisition (Month 2-3). Validates creative/messaging before £4.2M spend."

---

### 4. Market Timing Windows
**Signal Data:** Competitor activity patterns, seasonal gaps

**Insight:** April tax increase = competitors retreating

**Recommendation:**
"Launch April = less competitive noise, lower CPMs. Concentrate spend Apr-May (competitor gap), ease off June as they return."

---

### 5. Creative Differentiation
**Signal Data:** Tombola = exclusive proprietary games, Competitors = generic branded slots (Playtech, NetEnt)

**Insight:** "You can't play these anywhere else" beats generic positioning

**Recommendation:**
"Make exclusivity the hero: 'UK's only exclusive slots' vs 'For Fun's Sake' generic messaging. Test both in March, scale winner."

---

### 6. Emerging Platform Head Start
**Signal Data:** Competitors not yet heavy on TikTok gaming vertical

**Insight:** 18M UK users, Age 18-34, gaming content massive

**Recommendation:**
"Heavy TikTok allocation (18%) = 3-6 month head start before competitors follow. Own the platform while it's underpriced."

---

### 7. Data & Targeting Precision
**Signal Data:** 175K existing player database

**Insight:** Proprietary lookalike data competitors don't have

**Recommendation:**
"Lookalike 1-3% from top 20% existing players across all platforms. Warm start vs cold prospecting = 30-40% better conversion."

---

### 8. Geographic Arbitrage
**Signal Data:** Competitors go national (broad reach)

**Insight:** Concentrated spend = lower CPMs, higher frequency

**Recommendation:**
"Focus on 500 high-propensity MSOAs (20-30% CPM reduction). Prove-out, own those markets, then expand. Competitors waste budget on low-propensity geographies."

---

## Example: "How Do We Compete?" Response

**Question:** "How do we compete in the crowded casino market?"

**AI Response:**

"Beyond the paid media plan, you have three strategic advantages competitors lack:

### 1. **Owned Channel Strength**
71.58% direct traffic (vs ~67% avg) = 175K engaged players. 

**Opportunity:** Reactivation CPA £10-20 vs cold acquisition £254.

**Recommendation:** £500K email/push/in-app reactivation FIRST. Prove 'Spin Masters' positioning with existing players (they know Tombola, lower barrier). If it works, THEN scale £4.2M paid media to cold prospects.

**Impact:** 40-50% of 41K NDP target from owned channels = lower risk, higher ROI.

---

### 2. **AI Visibility Gap**
Tombola: 50.7% AI presence  
Competitors: 0-10%

**Opportunity:** AI search (ChatGPT, Perplexity, Google SGE) is future discovery. Competitors ignoring it.

**Recommendation:** £200K AI SEO investment (content clusters, schema markup, entity optimization) = 6-12 month compounding advantage while competitors sleep.

**Impact:** Own AI search for 'best UK slots' before competitors wake up.

---

### 3. **Exclusive Games Positioning**
Tombola: Proprietary exclusive slots  
Competitors: Generic Playtech/NetEnt branded games

**Opportunity:** 'You can't play these anywhere else' is unique.

**Recommendation:** Make exclusivity the hero. Not 'For Fun's Sake' (generic), but 'UK's Only Exclusive Slots' (specific, defensible).

**Impact:** Customer love signals show 'unique games' as top reason to play. Lean into it.

---

### 4. **Market Timing**
April tax increase = competitors retreating.

**Recommendation:** Launch April = less noise, lower CPMs. Concentrate spend Apr-May (competitor gap), ease off June.

**Impact:** Own the market window while competitors pause.

---

**Paid Media Plan (separate):**  
TikTok 18%, Meta 15%, YouTube CTV 15%, ITVX 10%, C4 10%, Programmatic 10%, Twitch 5%, Audio 5%, Testing 10%, Contingency 2%

[Standard media plan details follow...]"

---

## Quick Action Updated

**Old:** "🎯 Competitive Analysis"  
**New:** "🎯 How to Compete"

**Template now includes:**
- Owned channel leverage
- AI visibility gaps
- Reactivation economics
- Market timing
- Creative differentiation
- Emerging platforms
- Data precision
- Geographic arbitrage

Then provides conventional paid media plan separately.

---

## Key Principle

**Media Plan = Conventional Paid Media Structure**  
(Channels, budgets, targeting, measurement, flighting)

**Competitive Strategy = Signal Intelligence + Owned Channels + Strategic Advantages**  
(Go beyond paid media to owned channels, AI visibility, creative differentiation, market timing)

**Don't mix them unless user explicitly asks "how do I compete?"**

---

## Files Changed

1. `src/context/PlannerContext.jsx` (+90 lines)
   - Added `<competitive_strategy_vs_media_planning>` section
   - 8 strategic levers with Signal data examples

2. `src/components/planner/tabs/ChatTab.jsx` (+16 lines)
   - Updated "🎯 Competitive Analysis" → "🎯 How to Compete"
   - Enhanced template with 8 strategic considerations

---

**Commit:** `78ca177` - Separate competitive strategy from media planning conventions

**Status:** Live on port 5175, ready for testing 🚀
