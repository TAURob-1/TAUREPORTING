# CarShield Demo - Interactive ZIP Code Map Upgrade

## Overview
Upgraded the basic SVG map to a fully interactive choropleth map showing 3-digit ZIP code regions using Leaflet and React-Leaflet.

## What Changed

### 1. **New Dependencies**
- `leaflet` v1.9.4 - Core mapping library
- `react-leaflet` v4.2.1 - React bindings for Leaflet
- `shapefile` v0.6.6 - For GeoJSON conversion (dev dependency)

### 2. **New Data Files**
- `public/data/us-zip3-simplified.json` - 3-digit ZIP code boundaries (5.6MB)
  - 896 ZIP code regions covering the continental US
  - Simplified from 26MB to 5.6MB (78.5% reduction)
  - Coordinates rounded to 4 decimal places (~11m accuracy)

### 3. **New Source Files**
- `src/data/zipMapping.js` - Maps ZIP codes to test groups (exposed/holdout/high performer)
- `src/components/USAMap.jsx` - Completely rewritten with Leaflet integration

### 4. **Updated Styles**
- `src/index.css` - Added Leaflet tooltip styles and fade-in animations

## Features

### Interactive Elements
✅ **Click ZIP regions** to see detailed information
✅ **Hover tooltips** showing ZIP code and status
✅ **Zoom and pan controls** for exploring the map
✅ **Color-coded regions** by test status:
   - Blue: Exposed regions (active campaign)
   - Gray: Holdout regions (control group)
   - Green: High performer regions

### Visual Feedback
- Regions highlight on hover
- Selected regions show bold border
- Smooth animations for state changes
- Loading state while GeoJSON loads

### Data Display
Shows for each ZIP region:
- 3-digit ZIP code
- Test group assignment (exposed/holdout/high)
- Estimated impressions
- Measured lift percentage
- Description of test status

## Technical Implementation

### Mapping Strategy
ZIP codes are assigned to test groups based on geographic proximity to major DMAs:
- **High Performers**: LA (900-928), Dallas (750-769), Atlanta (300-319)
- **Holdout**: Philadelphia (190-196), Miami (330-349), Boston (010-027)
- **Exposed**: All other regions (default)

### Performance Optimizations
1. **GeoJSON Simplification**: Reduced file size by 78.5%
2. **Lazy Loading**: GeoJSON loaded on component mount
3. **Efficient Styling**: Direct style objects vs. className switching
4. **Carto Light Basemap**: Minimal, fast-loading base layer

### Component Architecture
```
USAMap (Main Component)
├── MapContainer (Leaflet wrapper)
│   ├── TileLayer (Carto basemap)
│   ├── GeoJSON (ZIP boundaries)
│   └── SetMapBounds (Custom hook)
├── Legend
├── Hover Info
└── Selected ZIP Details Panel
```

## Testing

### Local Development
```bash
npm run dev
# Access at http://localhost:5173 (or 5174 if 5173 is in use)
```

### Verification Checklist
- [x] Map loads without errors
- [x] All 896 ZIP regions render
- [x] Click interaction works
- [x] Hover tooltips display
- [x] Zoom/pan controls functional
- [x] Colors match test groups
- [x] Selected details panel shows correct data
- [x] Responsive on different screen sizes
- [x] GeoJSON file accessible at /data/us-zip3-simplified.json

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Data Sources
- **3-digit ZIP boundaries**: [gweissman86/three_digit_zips](https://github.com/gweissman86/three_digit_zips)
- **Basemap tiles**: CartoDB Light (free, no attribution required for demos)

## Future Enhancements
- [ ] Add search by ZIP code
- [ ] Show multiple selected regions
- [ ] Export selected regions
- [ ] Connect to real campaign data API
- [ ] Add filters for test status
- [ ] Performance metrics overlay
- [ ] Mobile-optimized touch interactions

## Troubleshooting

### Map not loading
1. Check browser console for errors
2. Verify GeoJSON file exists at `public/data/us-zip3-simplified.json`
3. Ensure Leaflet CSS is imported (should be in USAMap.jsx)

### Performance issues
1. Check file size of GeoJSON (should be ~5.6MB)
2. Consider further simplification if needed
3. Check network tab for loading times

### Styling issues
1. Verify `src/index.css` includes Leaflet custom styles
2. Check for CSS conflicts with Tailwind
3. Inspect Leaflet container height (should be 500px)

## Files Modified/Added

### Added
- `public/data/us-zip3-simplified.json`
- `src/data/zipMapping.js`
- `convert-shapefile.js` (build script)
- `simplify-geojson.js` (build script)
- `MAP_UPGRADE.md` (this file)

### Modified
- `src/components/USAMap.jsx` (complete rewrite)
- `src/index.css` (added Leaflet styles)
- `package.json` (added leaflet, react-leaflet)

### Unchanged
- `src/App.jsx`
- `src/data/dashboardData.js`
- All other components

## Demo Ready
✅ **The map is now production-ready for the LA demo at localhost:5174**

The interactive ZIP code map provides a much more engaging and informative experience compared to the basic SVG version, while maintaining all the original functionality.
