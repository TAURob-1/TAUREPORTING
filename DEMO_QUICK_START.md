# 🚀 Tombola Demo Quick Start - Feb 23

## Pre-Demo Setup (5 minutes before)

### 1. Start the Application
```bash
cd ~/TAU-Reporting
npm run dev
```
Open browser to: http://localhost:5174/

### 2. Navigate to Chat Tab
1. Click "Planner" in the top navigation
2. Click "Chat" tab
3. You should see the welcome message and **3 new quick action buttons**:
   - 📋 Analyze Brief
   - 📊 Media Plan Only
   - 🎯 Competitive Analysis

### 3. Upload the Brief (OPTIONAL - can do live)
- Click the **📎 button** (next to Send)
- Select: `~/Signal/companies/tombola-co-uk/arcade_brief/Arcade 2.0 - 2026 Planning Brief v2.pdf`
- Wait for green success message: "✅ Document loaded - [X] words processed"
- You'll see a purple badge showing the attached document

## Live Demo Script

### Opening (10 seconds)
"Let me show you how TAU-Reporting can analyze your brief in real-time..."

### Step 1: Upload (15 seconds)
- Click 📎 button
- Select the PDF: "Arcade 2.0 - 2026 Planning Brief v2.pdf"
- **Point out**: "Notice it processes the PDF right in the browser - no server upload needed"
- **Show**: Purple document badge appears

### Step 2: Quick Action (5 seconds)
- Click **"📋 Analyze Brief"** button
- **Point out**: "Watch how it auto-populates with a structured prompt"
- **Show**: The input field fills with the analysis template

### Step 3: Send & Analysis (30-60 seconds)
- Click **"Send"**
- **Point out**: Loading message "🤔 Analyzing brief... (this may take 30-60 seconds)"
- **While waiting, say**: "The AI is reading through your entire 6.4MB brief, understanding the objectives, target audience, and budget constraints..."

### Step 4: Results (30 seconds)
- **Show**: AI response with:
  - Brief critique and improvements
  - Paid media plan recommendations
  - Media mix breakdown
  - Budget allocations
- **Point out**: "Notice how it automatically updates the media budgets in the platform"
- **Show**: Green notification bar with sync details

### Closing (15 seconds)
"And that's it - in under 90 seconds, we've gone from a PDF brief to a structured media plan. This is what we can do for every campaign."

## Key Talking Points

1. **Speed**: "From brief upload to AI recommendations in 60 seconds"
2. **Intelligence**: "Uses the same 7-layer planning framework TAU uses internally"
3. **Integration**: "Automatically syncs budgets, media mix, and campaign data to the platform"
4. **Live Data**: "This is analyzing YOUR actual Arcade 2.0 brief, not a demo"
5. **Flexibility**: "You can also upload competitor briefs, strategy docs, research reports..."

## Backup Plan

**If PDF upload fails:**
```bash
# Use the .txt version instead
~/Signal/companies/tombola-co-uk/arcade_brief/arcade_brief.txt
```

**If internet is slow:**
- Pre-upload the document before the demo starts
- Have the prompt already filled in
- Just click Send during the demo

**If AI is too slow:**
- While waiting: Show the other quick action buttons
- Explain the planning layers
- Show the Signal integration tab

## After Demo - Next Steps

1. "We can customize these templates for your specific brief formats"
2. "Add Tombola-specific quick actions (e.g., 'Check against last year's Arcade campaign')"
3. "Integrate with your existing brief repository"
4. "Set up automated brief analysis pipeline"

## Technical Confidence Boosters

**If they ask "How does it work?"**
- "Client-side PDF parsing with pdfjs-dist library"
- "Sends to Anthropic Claude Sonnet 4 API"
- "Auto-detects structured data and syncs to platform state"

**If they ask "Is our data secure?"**
- "Processed entirely in your browser, no document uploads to TAU servers"
- "Uses Anthropic API with enterprise-grade encryption"
- "No data retention, immediate deletion after analysis"

**If they ask "What else can it do?"**
- "All 7 planning layers: Strategy, Channels, Audience, Measurement, Creative, Flighting, Personas"
- "Signal competitive intelligence integration"
- "Media plan generation with 40+ provider templates"
- "Automated budget allocation across channels"

## Pre-Demo Checklist
- [ ] Dev server running on localhost:5174
- [ ] Browser open to Planner > Chat tab
- [ ] PDF file location confirmed: `~/Signal/companies/tombola-co-uk/arcade_brief/`
- [ ] Quick action buttons visible
- [ ] Document upload icon (📎) visible
- [ ] Network connection stable
- [ ] No browser console errors

## Screenshot Moments
1. Empty chat with quick action buttons
2. Document uploaded with purple badge
3. Prompt auto-populated in input field
4. Loading state with analysis message
5. AI response with media plan
6. Success notification showing synced data

---

**🎯 Goal**: Make them think "This would save us hours on every campaign"

**💡 Remember**: This is THEIR brief being analyzed in real-time. That's powerful.

**⏱️ Total Demo Time**: 90 seconds max
