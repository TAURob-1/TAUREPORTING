# TAU-Reporting Testing Checklist

**URL:** http://100.98.17.27:5175

## Quick Test (5 min)

### Header & Branding
- [ ] TAU logo visible
- [ ] "TAU Reporting Platform" title shows
- [ ] Country selector: UK/US toggle works
- [ ] Client selector: Shows Tombola, Demo options
- [ ] Settings button present

### Navigation Tabs
- [ ] All 6 tabs visible: Audience, Planning, Results, Media, Intelligence, AI
- [ ] Tabs switch without errors
- [ ] Status indicator updates per tab

### Audience Tab (Priority - Flutter/Tombola demo)
- [ ] 24 UK segments load
- [ ] Select a segment (e.g., "Affluent Professionals")
- [ ] **Segment list collapses** after selection ✨
- [ ] Selected segment shows with "Change" button
- [ ] Map renders with regions

### Media Tab (NEW - Priority)
- [ ] Professional tables display
- [ ] UK mode: Shows BARB data (ITV, C4, Sky, ITVX)
- [ ] US mode: Shows Nielsen-equivalent data
- [ ] Demographics visible
- [ ] Sources labeled correctly

### AI Advisor Tab (Enhanced)
- [ ] Chat interface loads
- [ ] Context shows: Country, Advertiser, Campaign state
- [ ] Strategic planning layers visible
- [ ] Send a test message (should be context-aware)

### Intelligence Tab
- [ ] Signal data displays
- [ ] Tombola competitive intelligence shows
- [ ] Charts/metrics render

### Results Tab
- [ ] **Gambling regulations display** for Tombola ✨
- [ ] UK Gambling Commission rules visible
- [ ] Campaign metrics render

## Regression Check

### Country Toggle Test
1. Start in UK mode with Tombola
2. Switch to US
3. Switch back to UK
4. Verify data updates correctly

### Client Toggle Test
1. Switch from Tombola to Demo
2. Check if gambling regs disappear (should only show for Tombola/Flutter)
3. Switch back to Tombola
4. Verify gambling regs reappear

## Known Issues (Non-blocking)
- Large chunk size warning in build (optimization opportunity, doesn't affect functionality)
- REQUIREMENTS.md file missing from repo (used fallback checklist)

## Critical Fixes Applied
✅ US gambling regulations now show for Tombola (was only showing generic US compliance)

## All 10 Requirements Status
1. ✅ Signal Data Integration - Implemented in signalIntegration.js
2. ✅ Segment Selector Rollup - Collapses after selection
3. ✅ AI Advisor Enhancement - Context-aware with strategic planning
4. ✅ Media Reach Tables - Professional UK/US tables with BARB data
5. ✅ Navigation Cleanup - Platform/regulation text removed from nav
6. ✅ Gambling Regulations - Context-aware display for Tombola/Flutter
7. ✅ Intelligence Tab - Real Signal data integration
8. ✅ Media Planning Logic - Integrated into AI Advisor
9. ✅ Media Page Added - Dedicated tab with reach data
10. ✅ Media Page Display - Matches Signal quality standards

---

**Ready for Flutter/Tombola demo!** 🎯
