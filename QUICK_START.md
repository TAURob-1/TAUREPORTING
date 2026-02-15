# Audience Targeting - Quick Start Guide

## 🚀 Getting Started (2 minutes)

### Step 1: Start the App
```bash
cd /home/r2/clawd/carshield-demo
npm run dev
```
→ Opens at: **http://localhost:5174**

### Step 2: Navigate to Audience Targeting
- App opens to **"🎯 Audience Targeting"** tab by default
- If not, click the first tab in the navigation bar

### Step 3: Select Your Target Audience
You'll see a grid of 7 audience cards:

**Click any card** to select your audience:

1. **🎯 Prime Warranty Buyers** - Best for CarShield!
   - Age 45-64, income $75K+
   - Ideal for extended warranty products

2. **👨‍👩‍👧‍👦 Affluent Families** 
   - High income households with families
   - Premium segment

3. **🏡 Suburban Homeowners**
   - Middle-age homeowners
   - Established, stable segment

4. **🏙️ Urban Renters**
   - Younger urban population
   - Mobile, tech-savvy

5. **💰 Budget Conscious**
   - Lower income households
   - Value-focused consumers

6. **💎 Luxury Market**
   - High-income ($150K+)
   - Premium pricing opportunity

7. **👴 Senior Market**
   - Age 65+
   - Established households

### Step 4: View Recommendations
**Instantly after selection**, you'll see:

✅ **Summary Panel** with:
- Number of exposed ZIPs (green)
- Number of holdout ZIPs (yellow)
- Total population reach
- Split ratio percentage
- Geographic diversity scores

✅ **Interactive Map** with color-coding:
- **Green**: Recommended for ad exposure (darker = better fit)
- **Yellow**: Recommended for holdout/control
- **Gray**: Not recommended (low demographic fit)

### Step 5: Explore the Map
**Hover** over any ZIP region:
- See ZIP code + audience fit score in tooltip

**Click** any ZIP region:
- Opens detailed panel showing:
  - Audience fit score (0-100)
  - Population & household counts
  - Key demographics breakdown
  - Recommendation type

### Step 6: Adjust Settings (Optional)
Click **"⚙️ Advanced Settings"** to customize:

- **Exposed Ratio**: Slide 40% → 80% (default: 60%)
- **Min Score Threshold**: Set minimum fit score 30-70 (default: 50)
- **Max ZIP Regions**: Limit total ZIPs 50-200 (default: 100)

→ Map updates automatically!

### Step 7: Export Your Targeting Plan
Two export options at the bottom:

1. **📥 Export Configuration (JSON)**
   - Full setup with all settings
   - For campaign management systems
   - Includes all recommendations + stats

2. **📊 Export ZIP List (CSV)**
   - Simple spreadsheet format
   - Columns: ZIP3, Type, Score, Population, Households
   - For media buying teams

---

## 💡 Example Workflow

### For CarShield Campaign:

1. **Select**: "Prime Warranty Buyers" 🎯
2. **View**: 58 exposed ZIPs, 39 holdout ZIPs
3. **Check**: 45.2M population reach
4. **Explore**: Click ZIP "902" (California) → Score: 82
5. **Export**: Download CSV for media team
6. **Launch**: Run CTV ads in exposed ZIPs
7. **Measure**: Compare results vs holdout group

---

## 🎨 What You'll See

### Audience Selector Panel
```
┌─────────────────────────────────────────────────┐
│  🎯 Target Audience Selection                   │
│                                                  │
│  [🎯 Prime Warranty]  [👨‍👩‍👧‍👦 Affluent Families] │
│  [🏡 Suburban]        [🏙️ Urban Renters]       │
│  [💰 Budget]          [💎 Luxury]               │
│  [👴 Senior Market]                             │
│                                                  │
│  ┌─ Summary Stats ────────────────────────────┐ │
│  │ Exposed: 58 ZIPs  |  Holdout: 39 ZIPs     │ │
│  │ Population: 45.2M |  Split: 60/40         │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Interactive Map
```
┌─────────────────────────────────────────────────┐
│  🗺️ Geographic Targeting Map                    │
│                                                  │
│     [USA map with colored ZIP regions]          │
│     Green regions = Recommended exposed         │
│     Yellow regions = Recommended holdout        │
│     Gray regions = Not recommended              │
│                                                  │
│     Hover: Shows ZIP + score                    │
│     Click: Shows full demographics              │
└─────────────────────────────────────────────────┘
```

### ZIP Details Panel (on click)
```
┌─────────────────────────────────────────────────┐
│  ZIP Code Region: 902                      [✓ Recommended Exposed] │
│                                                  │
│  Audience Fit Score: 82/100                     │
│  Population: 4.2M residents                      │
│  Households: 1.5M households                     │
│                                                  │
│  Key Demographics:                               │
│  Age 45-64: 34%  |  Income $75-100K: 28%        │
│  Income $100K+: 42%  |  Middle Age HH: 58%      │
└─────────────────────────────────────────────────┘
```

---

## 🤔 Common Questions

**Q: Which audience should I choose?**
A: For CarShield, start with **Prime Warranty Buyers** - it's optimized for extended warranty products.

**Q: What's a good audience fit score?**
A: 
- 70-100: Excellent fit
- 50-70: Good fit
- 30-50: Moderate fit
- <30: Poor fit (filtered out by default)

**Q: How many ZIPs should I target?**
A: Default 100 ZIPs is a good starting point (60 exposed, 40 holdout). Adjust based on budget.

**Q: Why do I need a holdout group?**
A: To measure true campaign effectiveness! Compare sales in exposed ZIPs vs holdout to calculate incremental lift.

**Q: Can I target specific states?**
A: Not yet - current version uses demographic scoring across all US ZIPs. State filters coming in future update!

**Q: What if no ZIPs are recommended?**
A: Lower the "Min Score Threshold" in Advanced Settings. Default is 50 - try 40 or 35.

---

## 🎯 Tips for Best Results

1. **Start broad**: Use default settings first to see recommendations
2. **Explore the map**: Click 5-10 ZIPs to understand demographic patterns
3. **Compare audiences**: Try 2-3 different segments to find best fit
4. **Check diversity**: Good holdout groups have 60%+ geographic diversity
5. **Export early**: Save your configuration before making changes
6. **Match to product**: Luxury products → Luxury Market audience

---

## 🐛 Troubleshooting

**Map not loading?**
- Wait 2-3 seconds - demographic data is loading (369KB)
- Check browser console for errors

**ZIPs not colored?**
- Make sure you've selected an audience (click a card)
- Map will be gray/white until audience is selected

**No recommendations showing?**
- Lower the min score threshold in Advanced Settings
- Try a different audience segment

**Export not working?**
- Modern browsers may ask for download permission
- Check your Downloads folder
- Try the other export format (JSON vs CSV)

---

## 📞 Need Help?

Check the full documentation:
- **AUDIENCE_TARGETING_README.md** - Complete feature guide
- **DELIVERY_SUMMARY.md** - Technical implementation details

---

**Ready to target your audience intelligently!** 🎯
