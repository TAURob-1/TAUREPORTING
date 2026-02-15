# Audience Targeting Feature

## Overview

The CarShield demo now includes intelligent audience targeting that automatically recommends which ZIP codes to target (exposed) vs use as holdout controls, based on demographic fit.

## Features

### 1. Predefined Audience Segments (7 segments)

- **Prime Warranty Buyers** 🎯 - Age 45-64, income $75K+, ideal for warranty products
- **Affluent Families** 👨‍👩‍👧‍👦 - High income households with family composition
- **Suburban Homeowners** 🏡 - Middle-age homeowners in suburban areas
- **Urban Renters** 🏙️ - Younger urban population, rental households
- **Budget Conscious** 💰 - Lower income households, value-focused
- **Luxury Market** 💎 - High-income households ($150K+)
- **Senior Market** 👴 - Age 65+, established households

### 2. Smart ZIP Recommendation Engine

- **Demographic Scoring**: Each 3-digit ZIP is scored 0-100 based on fit with selected audience
- **Exposed/Holdout Split**: Automatically suggests ~60/40 split (configurable)
- **Geographic Diversity**: Ensures holdout groups are geographically distributed
- **Population Reach**: Calculates total population reach for each group

### 3. Interactive Map Visualization

- **Color-coded regions**:
  - Green: Recommended exposed ZIPs (darker = higher score)
  - Yellow: Recommended holdout ZIPs
  - Gray: Not recommended (below score threshold)
- **Hover tooltips**: Show ZIP code and audience fit score
- **Click for details**: View full demographics and scoring breakdown

### 4. Advanced Configuration

- **Exposed Ratio**: Adjust split from 40/60 to 80/20
- **Min Score Threshold**: Filter ZIPs by minimum audience fit (30-70)
- **Max ZIP Regions**: Limit total ZIPs included (50-200)

### 5. Export Capabilities

- **JSON Export**: Full configuration with all settings and recommendations
- **CSV Export**: ZIP list with scores and demographics for media planning

## Technical Implementation

### Data Processing

1. **Demographics Processing** (`scripts/processDemographics.js`)
   - Converts 5-digit ZIP CSVs to 3-digit aggregations
   - Merges age, income, household data
   - Outputs optimized JSON: `public/data/zip3-demographics.json`

2. **Run processing**:
   ```bash
   node scripts/processDemographics.js
   ```

### Scoring Algorithm

Each audience has weighted criteria. For example, "Prime Warranty Buyers":

```javascript
criteria: [
  { field: 'age_45_64_pct', weight: 40, min: 25, target: 35 },
  { field: 'income_75_100k', weight: 25, min: 15, target: 25 },
  { field: 'income_100k_plus', weight: 25, min: 20, target: 35 },
  { field: 'households_middle_pct', weight: 10, min: 40, target: 55 }
]
```

Score calculation:
- Below `min`: Scaled 0-50 points
- At `min`: 50 points
- Between `min` and `target`: Linear 50-100
- At/above `target`: 100 points
- Final score: Weighted average of all criteria

### Component Architecture

```
AudienceTargeting (main container)
├── AudienceSelector (audience picker + summary stats)
├── USAMapWithAudience (interactive Leaflet map)
└── Detailed statistics panel
```

### Key Files

- `/src/components/AudienceTargeting.jsx` - Main container component
- `/src/components/AudienceSelector.jsx` - Audience selection UI
- `/src/components/USAMapWithAudience.jsx` - Interactive map with recommendations
- `/src/data/audienceDefinitions.js` - Audience definitions + scoring logic
- `/scripts/processDemographics.js` - Data processing script
- `/public/data/zip3-demographics.json` - Processed demographic data (894 ZIPs)

## Usage

1. **Navigate to "Audience Targeting" tab** in the main app

2. **Select an audience segment** from the grid

3. **View automatic recommendations**:
   - Green ZIPs = Recommended for exposure
   - Yellow ZIPs = Recommended for holdout
   - Summary statistics displayed

4. **Adjust settings** (optional):
   - Click "Advanced Settings" to modify split ratio, thresholds

5. **Explore the map**:
   - Hover over ZIPs to see scores
   - Click for detailed demographic breakdown

6. **Export results**:
   - Download JSON configuration for campaign setup
   - Download CSV for media planning systems

## Data Sources

Demographics from: `/home/r2/clawd/intermedia-ctv-prototype/data/demographics/`

- Age/Gender: `US_Age_Gender_Breakdown_by_zipcode(2023).csv`
- Income: `US_Demographics_Average-Income_zipcode_2023.csv`
- Household: `US_Demographics_Household-Age_zipcode_2022.csv`
- Family Size: `US_Demographics_Household-Family-Size_zipcode_2022.csv`

## Future Enhancements

Potential additions:
- Custom audience builder (user-defined criteria)
- Historical campaign performance overlay
- A/B test multiple audience definitions
- Import customer data for lookalike modeling
- State-level targeting recommendations
- Integration with CTV inventory availability
- Budget optimization based on CPM by region
- Competitive audience overlap analysis

## Statistics Explained

- **Audience Fit Score**: 0-100 score based on demographic match
- **Geographic Diversity**: Measure of regional spread (0-100)
- **Exposed Ratio**: Percentage of ZIPs allocated to exposed group
- **Avg Score**: Mean audience fit across ZIP group
- **Score Range**: Min-max scores in exposed group
- **Total Population**: Sum of residents in selected ZIPs
- **Qualified ZIPs**: ZIPs meeting minimum score threshold

---

Built for the CarShield CTV campaign demo - showcasing intelligent geo-targeting with demographic insights.
