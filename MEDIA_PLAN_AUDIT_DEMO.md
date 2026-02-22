# Media Plan Audit Feature - Demo Guide

## Overview
New feature added for Rob's Tombola demo tomorrow. TAU can now audit media plans and flag issues with agency recommendations.

## What's New

### 1. CSV File Upload Support
- File upload now accepts: `.pdf`, `.txt`, `.docx`, `.csv`
- CSV files are automatically recognized as media plans
- Visual indicator:
  - **Purple badge (📄)** = Brief/Document (PDF/TXT/DOCX)
  - **Orange badge (📊)** = Media Plan (CSV)

### 2. New Quick Actions

#### 🔍 Audit Media Plan
- Analyzes uploaded media plan for:
  - Audience alignment (Spin Masters = Age 25-44, mobile-first)
  - Budget allocation (performance vs deal-driven)
  - Plan detail depth (targeting specs, CTV criteria)
  - Red flags (vague targeting, agency deals)
- Uses BARB data context for comparisons
- Caveats analysis appropriately

#### ❓ Questions for Agency
- Generates specific questions to ask Mediacom
- Uncovers deal-driven vs performance-driven decisions
- Gets missing targeting details
- Clarifies measurement strategy

### 3. Enhanced AI Context
System prompt now includes:
- BARB reach data (YouTube CTV: 35.6M, ITVX: 22.5M, C4: 18.2M)
- Red flag detection (>40% linear TV, vague targeting, deal language)
- Geographic targeting expectations (MSOA-level)
- Measurement strategy requirements

## Demo Flow

### Step 1: Upload Bad Media Plan
```
File: ~/TAU-Reporting/public/sample-media-plans/tombola-arcade-mediacom-v1.csv
```
- Navigate to Planner → Chat tab
- Click 📎 attachment button
- Upload `tombola-arcade-mediacom-v1.csv`
- Notice **orange badge** appears: "📊 Media Plan attached"

### Step 2: Audit the Plan
- Click **"🔍 Audit Media Plan"** quick action
- AI will flag:
  - ✗ 53.5% linear TV (too heavy for digital-first audience)
  - ✗ Vague targeting ("Adults 16+")
  - ✗ Mentions "partner agreements" (deal-driven language)
  - ✗ Lack of CTV targeting detail
  - ✗ No measurement strategy

### Step 3: Generate Agency Questions
- Click **"❓ Questions for Agency"** quick action
- AI generates specific questions like:
  - "Why 53.5% linear TV for a mobile-first audience?"
  - "What specific partner agreements drove the ITV/C4 weighting?"
  - "Can you provide demographic precision beyond 'Adults 16+'?"
  - "What CTV targeting criteria will be used?"
  - "What's the measurement and optimization strategy?"

### Step 4: Show Better Alternative (Optional)
- Remove bad plan, upload good plan
- File: `tombola-arcade-recommended.csv`
- Click "🔍 Audit Media Plan"
- AI will praise:
  - ✓ CTV-first (59.5% vs 53.5% linear)
  - ✓ YouTube CTV hero channel (35.7% based on 35.6M reach)
  - ✓ MSOA-level geographic targeting (500 priority areas)
  - ✓ Precise demographics (Age 25-44, income bands)
  - ✓ Detailed targeting specs

## Key Talking Points for Tombola

### The Problem
- Agencies like Mediacom/EMC often give vague, deal-driven plans
- Hard to distinguish performance strategy from inventory deals
- Lack of targeting precision = wasted spend

### TAU's Solution
- **Instant audit** of agency media plans
- **Data-driven critique** using BARB reach data
- **Specific questions** to challenge agency recommendations
- **Alternative strategies** based on audience intelligence

### The Differentiator
- Tombola doesn't need to blindly trust Mediacom
- TAU provides independent analysis and challenge
- Saves budget waste from deal-driven allocation
- Ensures plans match Spin Masters audience (25-44, mobile-first)

## Technical Notes

### Files Changed
1. `~/TAU-Reporting/src/components/planner/tabs/ChatTab.jsx`
   - Added CSV file support
   - Added `extractTextFromCSV()` function
   - Added 2 new quick actions: Audit + Questions
   - Visual file type indicators (purple/orange badges)

2. `~/TAU-Reporting/src/context/PlannerContext.jsx`
   - Enhanced system prompt with media plan audit guidance
   - BARB reach data context
   - Red flag detection rules

### Sample Files Location
- Bad plan: `~/TAU-Reporting/public/sample-media-plans/tombola-arcade-mediacom-v1.csv`
- Good plan: `~/TAU-Reporting/public/sample-media-plans/tombola-arcade-recommended.csv`

### Build Status
✅ Build successful (tested 2025-02-22)
✅ No errors or warnings
✅ Ready for production demo

## Troubleshooting

### If CSV doesn't upload:
- Check file size (<10MB)
- Verify `.csv` extension
- Clear browser cache

### If quick actions don't appear:
- Ensure a file is uploaded first (required)
- Check console for errors
- Refresh page

### If audit seems generic:
- Upload contains data (not empty CSV)
- System prompt loaded correctly
- Check Clawdbot Gateway is running

## Next Steps After Demo

If Tombola loves it:
1. Add DOCX parsing support
2. Export audit reports as PDF
3. Benchmark library (industry standards by vertical)
4. Historical plan comparison (track agency over time)
5. Automated deal-flag scoring

---

**Ready for Demo:** ✅  
**Last Updated:** 2025-02-22  
**Priority:** HIGH - Tombola demo tomorrow morning
