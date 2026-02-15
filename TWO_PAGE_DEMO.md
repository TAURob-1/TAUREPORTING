# CarShield Two-Page Campaign Demo

## Overview
Complete pre-to-post campaign demonstration tool with two integrated pages:
1. **Campaign Planning** - Pre-campaign setup and targeting
2. **Campaign Results** - Post-campaign measurement and analysis

## Navigation
Simple tab-based navigation at the top of the page:
- 📋 **Campaign Planning** - Design your campaign
- 📊 **Campaign Results** - View performance metrics

Status indicator in bottom-right corner shows current mode (Pre-Campaign/Live Campaign)

---

## PAGE 1: Campaign Planning

### Purpose
Interactive tool for pre-campaign setup, market selection, and media planning.

### Features

#### 1. Interactive ZIP Code Selector
- **896 clickable ZIP regions** on interactive map
- **Click to toggle** - Add/remove ZIPs from campaign
- **Visual feedback**:
  - Blue fill = Selected for campaign
  - Gray fill = Not selected
  - Darker border on hover
- **Hover tooltips** show ZIP code and primary demographic segment
- **Zoom/pan** to explore specific regions

#### 2. Selected Markets Demographics Panel
Shows detailed demographics for each selected ZIP:
- **ZIP Code** - 3-digit prefix
- **Segment** - Primary demographic (e.g., "Suburban Families 35-54")
- **Income** - Income bracket (High/Upper-Middle/Middle)
- **Auto Ownership** - Vehicle ownership rate (High/Medium/Low)
- **Estimated Reach** - Households per ZIP (~18K-45K)
- **Remove button** - Click X to deselect

Example:
```
ZIP 900 (Los Angeles)
Segment: Urban Professionals 25-44
Income: High
Auto Own: High
~42.3K reach
```

#### 3. Campaign Summary Panel
Real-time calculations as you select markets and channels:
- **Target Markets** - Number of ZIP regions selected
- **Estimated Reach** - Total households (in millions)
- **Available Impressions** - From selected channels
- **Estimated Budget** - Based on CPM rates

#### 4. Channel Inventory - CTV Platforms
Clickable cards showing available CTV inventory:
- Roku (~2.4M impressions, $28 CPM)
- YouTube TV (~2.1M impressions, $32 CPM)
- Hulu (~1.8M impressions, $35 CPM)
- Pluto TV (~1.6M impressions, $22 CPM)
- Amazon Fire TV (~1.4M impressions, $30 CPM)
- Tubi (~1.2M impressions, $18 CPM)
- Paramount+ (~950K impressions, $26 CPM)
- Peacock (~850K impressions, $24 CPM)

**Total CTV:** ~11.3M impressions available

#### 5. Channel Inventory - Traditional TV
Linear TV options with higher reach but higher CPMs:
- Broadcast Networks (ABC/CBS/NBC/FOX) - ~4.8M impressions, $52 CPM
- Cable News Networks - ~3.2M impressions, $45 CPM
- Sports Networks (ESPN/FS1) - ~2.8M impressions, $58 CPM
- Cable Entertainment - ~2.4M impressions, $38 CPM

**Total Traditional TV:** ~13.2M impressions available

### Workflow
1. **Select target markets** - Click ZIP regions on map
2. **Review demographics** - Verify segment fit in demographics panel
3. **Choose media channels** - Select CTV and/or traditional TV platforms
4. **Check summary** - Review total reach, impressions, and budget
5. **Iterate** - Add/remove markets and channels as needed

### Use Cases
- **Market selection** - "Which ZIPs should we target?"
- **Budget planning** - "What reach can we get for $X budget?"
- **Channel mix** - "CTV vs. Traditional TV for this audience?"
- **Demographic verification** - "Are we reaching the right segments?"

---

## PAGE 2: Campaign Results

### Purpose
Post-campaign measurement dashboard showing actual performance and statistical analysis.

### Features

#### 1. Header
- Campaign name: "CarShield CTV Measurement Dashboard"
- Test period dates
- Live status indicator

#### 2. Key Metrics (Top Row)
Four high-level KPIs:
- **Total Impressions** - 24.8M (+12% vs target)
- **Unique Reach** - 8.2M (Avg freq: 3.02x)
- **Measured Lift** - +22.4% (95% confidence)
- **Estimated iROAS** - $3.80 (Above target $2.50)

#### 3. Geographic Test Design Map
Interactive choropleth showing actual test results:
- **Color coding**:
  - 🔵 Blue = Exposed regions (campaign ran)
  - ⚪ Gray = Holdout regions (control group)
  - 🟢 Green = High performer regions (top lift)
- **Click regions** for detailed results
- **Hover** for quick info
- **Zoom/pan** to explore

#### 4. Delivery Performance Chart
Line chart showing impressions over campaign period:
- Exposed group (blue line)
- Holdout group (gray line)
- Dates from Jan 15 - Feb 15

#### 5. CTV Providers Panel
Breakdown by platform:
- Roku (33% share, +18% lift)
- YouTube TV (27% share, +24% lift)
- Hulu (21% share, +21% lift)
- Pluto TV (19% share, +26% lift)

#### 6. Previous Campaign Results
Historical comparison:
- Summer Protection campaign (Aug-Sep 2024)
- +18.7% lift, $2.95 iROAS
- Key learning: "CTV drove 3x higher lift in high-intent DMAs"

#### 7. Statistical Confidence
Rigorous test design validation:
- **Exposed Group**: 45 DMAs, +22.4% lift, 95% confidence
- **Holdout Group**: 30 DMAs, -1.2% baseline
- **Test Result**: Significant (p=0.003, 94% power)

### Use Cases
- **Client reporting** - Show campaign performance
- **Statistical validation** - Prove incrementality
- **Channel optimization** - Which platforms drove lift?
- **Historical comparison** - Better than last campaign?

---

## Data Sources

### Demographics (Planning Page)
Based on realistic market segmentation:
- **Urban Professionals** - 25-44, high income, tech-savvy
- **Suburban Families** - 35-54, upper-middle income, high auto ownership
- **Working Families** - 35-54, middle income, practical buyers
- **Rural Homeowners** - 45-64, middle income, truck/SUV preference
- **Suburban Retirees** - 65+, upper-middle income, established vehicle owners

### Geographic Coverage
- **896 3-digit ZIP codes** covering continental US
- **Major DMAs represented**:
  - LA (900-928)
  - Dallas (750-769)
  - Atlanta (300-319)
  - Philadelphia (190-196)
  - Miami (330-349)
  - Boston (010-027)
  - Chicago (600-609)
  - And more...

### Channel Data
- **CTV platforms**: 8 major streaming services
- **Traditional TV**: 4 major network categories
- **CPM ranges**: $18-$58 based on platform and audience
- **Reach estimates**: Based on industry benchmarks

---

## Demo Flow

### Complete Walkthrough (5-10 minutes)

**Start on Planning Page:**

1. **"Let's plan a new CarShield campaign..."**
   - Show blank map with no selections
   - Explain the goal: Reach suburban families in high auto-ownership markets

2. **Select target markets**
   - Click LA region (900-928) - "High-value market"
   - Click Dallas (750-769) - "Strong truck/SUV ownership"
   - Click Atlanta (300-319) - "Growing market"
   - Watch demographics panel populate

3. **Review demographics**
   - Point out "Suburban Families 35-54" segments
   - Note "High" auto ownership across markets
   - Show estimated reach growing

4. **Select media channels**
   - Click Roku - "Biggest CTV platform"
   - Click YouTube TV - "Cord-cutters"
   - Click Hulu - "Premium content viewers"
   - Watch summary update with impressions and budget

5. **Review campaign summary**
   - "We're targeting X million households"
   - "With Y million impressions available"
   - "Estimated budget of $Z"

**Switch to Results Page:**

6. **"The campaign ran for 30 days..."**
   - Show header with test period dates
   - Point to "Live" status

7. **Review key metrics**
   - "Delivered 24.8M impressions - above target"
   - "Reached 8.2M unique households"
   - "Measured +22.4% lift - statistically significant"
   - "Generated $3.80 iROAS - 50% above target"

8. **Explore geographic results**
   - Click on LA region (green) - "High performer with +28% lift"
   - Click on Atlanta (green) - "Strong +31% lift"
   - Click on Philadelphia (gray) - "Holdout showed -1.8% baseline"

9. **Review channel performance**
   - "Pluto TV had highest lift at +26%"
   - "YouTube TV strong at +24%"
   - "All platforms delivered incremental lift"

10. **Validate statistical rigor**
    - "95% confidence interval"
    - "p-value of 0.003 - highly significant"
    - "Proper holdout design proves incrementality"

**Key Talking Points:**
- ✅ "We can plan targeting down to the ZIP code level"
- ✅ "Real demographic insights guide market selection"
- ✅ "Channel inventory helps optimize media mix"
- ✅ "Rigorous test design proves true incrementality"
- ✅ "End-to-end visibility from planning to results"

---

## Technical Details

### Page Navigation
Simple state-based switching (no React Router needed):
```javascript
const [currentPage, setCurrentPage] = useState('planning');
// Toggle between 'planning' and 'results'
```

### Data Flow
- **Planning Page**: User selections stored in React state
- **Results Page**: Static data from dashboardData.js
- **Future**: Planning selections could pre-populate Results page

### File Structure
```
src/
├── App.jsx                          Navigation wrapper
├── components/
│   ├── CampaignPlanning.jsx        Planning page
│   ├── CampaignResults.jsx         Results page
│   ├── USAMap.jsx                  Interactive map (results)
│   ├── Header.jsx                  Results header
│   ├── MetricCard.jsx              KPI cards
│   ├── DeliveryChart.jsx           Performance chart
│   ├── CTVProviders.jsx            Platform breakdown
│   ├── PreviousCampaign.jsx        Historical data
│   └── StatisticalConfidence.jsx   Test validation
├── data/
│   ├── zipDemographics.js          Demographic profiles
│   ├── channelInventory.js         Media inventory
│   ├── zipMapping.js               Test group assignments
│   └── dashboardData.js            Results data
└── index.css                        Global styles
```

### Performance
- **GeoJSON caching**: Same 5.6MB file loaded once, used on both pages
- **State management**: Lightweight React state for selections
- **No backend required**: Pure client-side demo

---

## Customization

### Add More ZIP Demographics
Edit `src/data/zipDemographics.js`:
```javascript
export const demographicProfiles = {
  '550': { 
    segment: 'Affluent Families 45+', 
    income: 'High', 
    autoOwnership: 'High' 
  },
  // Add more...
};
```

### Adjust Channel Inventory
Edit `src/data/channelInventory.js`:
```javascript
{
  name: 'New Platform',
  platform: 'CTV',
  impressions: 1000000,
  cpm: 25,
  reach: '3M households',
  color: '#ff6600',
  icon: 'NP'
}
```

### Modify Test Results
Edit `src/data/dashboardData.js`:
```javascript
{
  metrics: {
    totalImpressions: { value: 'XX.XM', ... },
    // Update values...
  }
}
```

---

## Browser Requirements
- Chrome/Edge/Brave 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (touch-enabled)

## Running the Demo
```bash
cd /home/r2/clawd/carshield-demo
npm run dev
# Open: http://localhost:5174
```

---

## Future Enhancements

### Phase 2 Ideas:
- [ ] Save/load campaign plans
- [ ] Connect planning → results (carry over selections)
- [ ] Export campaign plan to PDF
- [ ] Budget optimizer (maximize reach for budget)
- [ ] Demographic filters (show only certain segments)
- [ ] Historical campaign library
- [ ] A/B test different targeting strategies
- [ ] Real-time API integration
- [ ] Multi-user collaboration

### Advanced Features:
- [ ] Predictive lift modeling (estimate results during planning)
- [ ] Competitive market analysis
- [ ] Seasonality adjustments
- [ ] Creative asset management
- [ ] Automated reporting

---

## Status: ✅ READY FOR DEMO

**Both pages complete and functional**

**Access**: http://localhost:5174

**Toggle between Planning and Results** with top navigation tabs

**Complete pre-to-post campaign demonstration** in one unified tool
