/**
 * Channel Affinity Scores — M-CHAN Drill-Down Data
 *
 * Maps ~50 audience attributes → platform affinity scores (0–100) for 6 UK platforms.
 * Affinity 100 = perfect match, 0 = no relevance.
 * CPM in GBP, reach in millions (BARB 4-Screen, Dec 2025).
 */

const CHANNEL_PLATFORMS = {
  youtube_ctv:    { label: 'YouTube CTV',    type: 'CTV',    owner: 'Google',       cpm: 14, reach: 35.6, color: '#FF0000' },
  itvx:           { label: 'ITVX',           type: 'BVOD',   owner: 'ITV plc',      cpm: 18, reach: 22.5, color: '#00B2A9' },
  c4_streaming:   { label: 'C4 Streaming',   type: 'BVOD',   owner: 'Channel 4',    cpm: 17, reach: 18.2, color: '#0A0A0A' },
  itv_linear:     { label: 'ITV Linear',     type: 'Linear', owner: 'ITV plc',      cpm: 24, reach: 45.0, color: '#1E90FF' },
  channel4_linear:{ label: 'Channel 4',      type: 'Linear', owner: 'Channel 4',    cpm: 22, reach: 42.5, color: '#333333' },
  sky_linear:     { label: 'Sky',            type: 'Linear', owner: 'Sky/Comcast',  cpm: 30, reach: 37.2, color: '#003366' }
};

const CHANNEL_PLATFORM_KEYS = Object.keys(CHANNEL_PLATFORMS);

const CHANNEL_AFFINITY = {
  // ─── DEMO ───
  'DEMO.age_18_24':     { youtube_ctv: 92, itvx: 65, c4_streaming: 70, itv_linear: 35, channel4_linear: 45, sky_linear: 30 },
  'DEMO.age_25_34':     { youtube_ctv: 85, itvx: 72, c4_streaming: 68, itv_linear: 45, channel4_linear: 52, sky_linear: 38 },
  'DEMO.age_35_44':     { youtube_ctv: 70, itvx: 68, c4_streaming: 60, itv_linear: 65, channel4_linear: 62, sky_linear: 55 },
  'DEMO.age_45_54':     { youtube_ctv: 55, itvx: 58, c4_streaming: 50, itv_linear: 75, channel4_linear: 70, sky_linear: 68 },
  'DEMO.age_55_64':     { youtube_ctv: 38, itvx: 45, c4_streaming: 40, itv_linear: 82, channel4_linear: 78, sky_linear: 72 },
  'DEMO.age_65_plus':   { youtube_ctv: 25, itvx: 35, c4_streaming: 30, itv_linear: 88, channel4_linear: 82, sky_linear: 75 },
  'DEMO.gender_male':   { youtube_ctv: 72, itvx: 55, c4_streaming: 52, itv_linear: 62, channel4_linear: 58, sky_linear: 68 },
  'DEMO.gender_female': { youtube_ctv: 68, itvx: 65, c4_streaming: 62, itv_linear: 70, channel4_linear: 68, sky_linear: 55 },

  // ─── SOCIO ───
  'SOCIO.income_low':          { youtube_ctv: 70, itvx: 62, c4_streaming: 55, itv_linear: 72, channel4_linear: 65, sky_linear: 35 },
  'SOCIO.income_mid':          { youtube_ctv: 65, itvx: 60, c4_streaming: 58, itv_linear: 68, channel4_linear: 65, sky_linear: 55 },
  'SOCIO.income_high':         { youtube_ctv: 75, itvx: 55, c4_streaming: 52, itv_linear: 58, channel4_linear: 55, sky_linear: 85 },
  'SOCIO.education_degree':    { youtube_ctv: 72, itvx: 58, c4_streaming: 62, itv_linear: 55, channel4_linear: 60, sky_linear: 65 },
  'SOCIO.education_vocational':{ youtube_ctv: 55, itvx: 60, c4_streaming: 48, itv_linear: 70, channel4_linear: 62, sky_linear: 52 },
  'SOCIO.education_none':      { youtube_ctv: 60, itvx: 58, c4_streaming: 42, itv_linear: 75, channel4_linear: 60, sky_linear: 40 },
  'SOCIO.homeowner':           { youtube_ctv: 55, itvx: 52, c4_streaming: 48, itv_linear: 72, channel4_linear: 68, sky_linear: 78 },
  'SOCIO.renter':              { youtube_ctv: 78, itvx: 65, c4_streaming: 62, itv_linear: 52, channel4_linear: 55, sky_linear: 35 },

  // ─── GEO ───
  'GEO.urban':           { youtube_ctv: 80, itvx: 62, c4_streaming: 65, itv_linear: 58, channel4_linear: 60, sky_linear: 60 },
  'GEO.suburban':        { youtube_ctv: 65, itvx: 60, c4_streaming: 55, itv_linear: 70, channel4_linear: 68, sky_linear: 65 },
  'GEO.rural':           { youtube_ctv: 42, itvx: 48, c4_streaming: 40, itv_linear: 78, channel4_linear: 72, sky_linear: 55 },
  'GEO.london':          { youtube_ctv: 85, itvx: 58, c4_streaming: 65, itv_linear: 52, channel4_linear: 58, sky_linear: 72 },
  'GEO.regional_cities': { youtube_ctv: 72, itvx: 65, c4_streaming: 58, itv_linear: 68, channel4_linear: 65, sky_linear: 58 },

  // ─── BEHAV ───
  'BEHAV.tech_enthusiast':      { youtube_ctv: 90, itvx: 45, c4_streaming: 50, itv_linear: 30, channel4_linear: 35, sky_linear: 42 },
  'BEHAV.fitness_active':       { youtube_ctv: 78, itvx: 60, c4_streaming: 55, itv_linear: 55, channel4_linear: 58, sky_linear: 45 },
  'BEHAV.frequent_traveller':   { youtube_ctv: 72, itvx: 55, c4_streaming: 52, itv_linear: 58, channel4_linear: 55, sky_linear: 68 },
  'BEHAV.skiing_winter_sports': { youtube_ctv: 75, itvx: 52, c4_streaming: 48, itv_linear: 55, channel4_linear: 52, sky_linear: 70 },
  'BEHAV.grocery_frequent':     { youtube_ctv: 52, itvx: 68, c4_streaming: 55, itv_linear: 80, channel4_linear: 75, sky_linear: 48 },
  'BEHAV.diy_home_improvement': { youtube_ctv: 72, itvx: 62, c4_streaming: 55, itv_linear: 68, channel4_linear: 72, sky_linear: 52 },
  'BEHAV.gaming':               { youtube_ctv: 92, itvx: 38, c4_streaming: 42, itv_linear: 25, channel4_linear: 30, sky_linear: 35 },

  // ─── PSYCH ───
  'PSYCH.health_conscious':     { youtube_ctv: 72, itvx: 62, c4_streaming: 60, itv_linear: 58, channel4_linear: 62, sky_linear: 48 },
  'PSYCH.eco_conscious':        { youtube_ctv: 68, itvx: 55, c4_streaming: 65, itv_linear: 50, channel4_linear: 62, sky_linear: 40 },
  'PSYCH.luxury_oriented':      { youtube_ctv: 70, itvx: 48, c4_streaming: 50, itv_linear: 55, channel4_linear: 52, sky_linear: 85 },
  'PSYCH.price_sensitive_psych':{ youtube_ctv: 72, itvx: 70, c4_streaming: 62, itv_linear: 75, channel4_linear: 72, sky_linear: 35 },

  // ─── PURCH ───
  'PURCH.premium_buyer':         { youtube_ctv: 68, itvx: 48, c4_streaming: 45, itv_linear: 55, channel4_linear: 50, sky_linear: 82 },
  'PURCH.price_sensitive_purch': { youtube_ctv: 72, itvx: 68, c4_streaming: 60, itv_linear: 75, channel4_linear: 72, sky_linear: 32 },
  'PURCH.auto_intender':         { youtube_ctv: 75, itvx: 58, c4_streaming: 52, itv_linear: 65, channel4_linear: 60, sky_linear: 72 },
  'PURCH.fashion_buyer':         { youtube_ctv: 78, itvx: 62, c4_streaming: 65, itv_linear: 55, channel4_linear: 60, sky_linear: 52 },
  'PURCH.fmcg_regular':          { youtube_ctv: 55, itvx: 70, c4_streaming: 58, itv_linear: 82, channel4_linear: 78, sky_linear: 48 },

  // ─── CONTEXT ───
  'CONTEXT.seasonal_summer':  { youtube_ctv: 72, itvx: 62, c4_streaming: 58, itv_linear: 65, channel4_linear: 62, sky_linear: 55 },
  'CONTEXT.seasonal_winter':  { youtube_ctv: 65, itvx: 68, c4_streaming: 62, itv_linear: 75, channel4_linear: 70, sky_linear: 72 },
  'CONTEXT.commute_window':   { youtube_ctv: 80, itvx: 55, c4_streaming: 50, itv_linear: 35, channel4_linear: 38, sky_linear: 30 },
  'CONTEXT.evening_leisure':  { youtube_ctv: 70, itvx: 72, c4_streaming: 68, itv_linear: 82, channel4_linear: 78, sky_linear: 75 },
  'CONTEXT.back_to_school':   { youtube_ctv: 68, itvx: 65, c4_streaming: 58, itv_linear: 72, channel4_linear: 68, sky_linear: 55 },

  // ─── MEDIA ───
  'MEDIA.digital_heavy':     { youtube_ctv: 95, itvx: 72, c4_streaming: 70, itv_linear: 30, channel4_linear: 35, sky_linear: 28 },
  'MEDIA.tv_heavy':          { youtube_ctv: 40, itvx: 65, c4_streaming: 55, itv_linear: 90, channel4_linear: 85, sky_linear: 82 },
  'MEDIA.social_heavy':      { youtube_ctv: 88, itvx: 55, c4_streaming: 52, itv_linear: 28, channel4_linear: 32, sky_linear: 22 },
  'MEDIA.print_traditional': { youtube_ctv: 25, itvx: 42, c4_streaming: 38, itv_linear: 80, channel4_linear: 75, sky_linear: 70 },
  'MEDIA.podcast_audio':     { youtube_ctv: 78, itvx: 50, c4_streaming: 48, itv_linear: 40, channel4_linear: 42, sky_linear: 35 }
};
