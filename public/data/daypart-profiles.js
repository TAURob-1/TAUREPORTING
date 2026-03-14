/**
 * Daypart Profiles — M-TIME Drill-Down Data
 *
 * Hourly engagement indexes (hours 0–23, 100 = average) per attribute.
 * Values >100 indicate above-average engagement, <100 below-average.
 * Peak arrays name the strongest daypart windows.
 */

const DAYPART_LABELS = {
  early_morning:    { label: 'Early Morning',    hours: [5, 6],          color: '#fbbf24' },
  morning_commute:  { label: 'Morning Commute',  hours: [7, 8, 9],      color: '#f59e0b' },
  late_morning:     { label: 'Late Morning',      hours: [10, 11],       color: '#eab308' },
  lunchtime:        { label: 'Lunchtime',          hours: [12, 13],       color: '#84cc16' },
  afternoon:        { label: 'Afternoon',          hours: [14, 15, 16],   color: '#22c55e' },
  evening_commute:  { label: 'Evening Commute',   hours: [17, 18],       color: '#14b8a6' },
  early_evening:    { label: 'Early Evening',      hours: [19, 20],       color: '#0ea5e9' },
  primetime:        { label: 'Primetime',          hours: [20, 21, 22],   color: '#6366f1' },
  late_night:       { label: 'Late Night',         hours: [23, 0, 1],     color: '#8b5cf6' },
  overnight:        { label: 'Overnight',          hours: [2, 3, 4],      color: '#6b7280' }
};

const DAY_OF_WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DAYPART_PROFILES = {
  // ─── DEMO ───
  //                                    0h   1h   2h   3h   4h   5h   6h   7h   8h   9h  10h  11h  12h  13h  14h  15h  16h  17h  18h  19h  20h  21h  22h  23h
  'DEMO.age_18_24': {
    hourly: [60, 45, 35, 25, 20, 15, 20, 40, 55, 65, 75, 80, 95, 90, 85, 80, 90, 105, 120, 140, 150, 155, 145, 110],
    peak: ['primetime', 'late_night'],
    dow: [90, 88, 92, 95, 115, 120, 100]
  },
  'DEMO.age_25_34': {
    hourly: [45, 35, 25, 20, 15, 20, 35, 60, 80, 85, 90, 95, 105, 100, 90, 85, 95, 110, 125, 135, 140, 135, 120, 75],
    peak: ['primetime', 'early_evening'],
    dow: [95, 92, 95, 98, 110, 115, 98]
  },
  'DEMO.age_35_44': {
    hourly: [35, 25, 18, 15, 12, 20, 45, 75, 95, 100, 105, 105, 110, 105, 95, 90, 95, 110, 120, 125, 130, 125, 105, 60],
    peak: ['primetime', 'late_morning'],
    dow: [100, 98, 100, 102, 105, 102, 95]
  },
  'DEMO.age_45_54': {
    hourly: [30, 22, 15, 12, 10, 25, 55, 85, 100, 105, 108, 110, 112, 108, 100, 95, 100, 108, 115, 120, 125, 118, 95, 50],
    peak: ['primetime', 'lunchtime'],
    dow: [102, 100, 102, 100, 100, 100, 95]
  },
  'DEMO.age_55_64': {
    hourly: [25, 18, 12, 10, 10, 30, 60, 90, 105, 112, 115, 118, 120, 115, 108, 105, 100, 105, 110, 115, 120, 112, 85, 42],
    peak: ['lunchtime', 'primetime'],
    dow: [105, 102, 105, 100, 98, 98, 92]
  },
  'DEMO.age_65_plus': {
    hourly: [18, 12, 8, 8, 10, 35, 65, 95, 110, 120, 125, 128, 130, 125, 118, 112, 105, 100, 108, 112, 115, 105, 72, 35],
    peak: ['late_morning', 'lunchtime'],
    dow: [105, 105, 108, 102, 95, 95, 90]
  },
  'DEMO.gender_male': {
    hourly: [50, 38, 28, 22, 18, 22, 40, 70, 88, 95, 100, 102, 105, 100, 95, 92, 95, 105, 115, 125, 130, 128, 115, 72],
    peak: ['primetime', 'early_evening'],
    dow: [98, 96, 98, 100, 105, 108, 100]
  },
  'DEMO.gender_female': {
    hourly: [40, 30, 22, 18, 15, 25, 48, 78, 92, 100, 108, 110, 112, 108, 100, 95, 98, 108, 118, 125, 128, 122, 100, 58],
    peak: ['primetime', 'late_morning'],
    dow: [100, 98, 100, 102, 108, 105, 92]
  },

  // ─── SOCIO ───
  'SOCIO.income_low': {
    hourly: [55, 42, 32, 25, 20, 20, 35, 55, 70, 80, 90, 95, 105, 100, 100, 98, 105, 110, 120, 130, 135, 130, 115, 80],
    peak: ['primetime', 'early_evening'],
    dow: [95, 92, 95, 98, 108, 112, 105]
  },
  'SOCIO.income_mid': {
    hourly: [40, 30, 22, 18, 15, 22, 42, 72, 90, 98, 105, 108, 110, 105, 98, 95, 98, 108, 118, 125, 130, 125, 105, 62],
    peak: ['primetime', 'lunchtime'],
    dow: [100, 98, 100, 100, 105, 105, 95]
  },
  'SOCIO.income_high': {
    hourly: [35, 25, 18, 15, 12, 25, 50, 82, 100, 108, 112, 110, 108, 105, 95, 90, 92, 105, 115, 122, 128, 125, 110, 62],
    peak: ['primetime', 'morning_commute'],
    dow: [105, 102, 105, 102, 100, 95, 88]
  },
  'SOCIO.education_degree': {
    hourly: [38, 28, 20, 15, 12, 22, 45, 78, 95, 105, 110, 108, 108, 105, 95, 90, 92, 108, 118, 125, 130, 125, 108, 60],
    peak: ['primetime', 'morning_commute'],
    dow: [105, 100, 102, 100, 102, 98, 92]
  },
  'SOCIO.education_vocational': {
    hourly: [42, 32, 25, 20, 18, 25, 45, 70, 85, 92, 98, 100, 108, 105, 100, 98, 100, 108, 118, 128, 132, 128, 110, 68],
    peak: ['primetime', 'early_evening'],
    dow: [98, 96, 98, 100, 108, 108, 95]
  },
  'SOCIO.education_none': {
    hourly: [52, 40, 30, 25, 22, 22, 38, 58, 72, 82, 90, 95, 102, 100, 100, 98, 102, 108, 118, 130, 135, 130, 118, 82],
    peak: ['primetime', 'early_evening'],
    dow: [95, 92, 95, 98, 110, 112, 102]
  },
  'SOCIO.homeowner': {
    hourly: [32, 24, 18, 14, 12, 25, 50, 80, 98, 105, 110, 112, 112, 108, 100, 95, 98, 108, 118, 125, 128, 122, 100, 55],
    peak: ['primetime', 'lunchtime'],
    dow: [102, 100, 102, 100, 100, 100, 95]
  },
  'SOCIO.renter': {
    hourly: [55, 42, 32, 25, 20, 18, 32, 55, 72, 82, 90, 95, 100, 98, 92, 88, 95, 108, 122, 135, 142, 138, 125, 85],
    peak: ['primetime', 'late_night'],
    dow: [95, 92, 95, 98, 112, 115, 100]
  },

  // ─── GEO ───
  'GEO.urban': {
    hourly: [55, 42, 32, 25, 20, 22, 38, 68, 88, 98, 105, 108, 108, 105, 98, 92, 95, 108, 120, 132, 138, 135, 122, 80],
    peak: ['primetime', 'late_night'],
    dow: [98, 95, 98, 100, 108, 112, 98]
  },
  'GEO.suburban': {
    hourly: [38, 28, 20, 16, 14, 22, 45, 75, 92, 100, 108, 110, 112, 108, 100, 95, 98, 108, 118, 125, 130, 125, 105, 58],
    peak: ['primetime', 'lunchtime'],
    dow: [100, 98, 100, 100, 105, 105, 95]
  },
  'GEO.rural': {
    hourly: [28, 20, 15, 12, 12, 30, 58, 85, 100, 108, 115, 118, 120, 115, 108, 105, 100, 105, 112, 118, 122, 115, 88, 42],
    peak: ['lunchtime', 'late_morning'],
    dow: [105, 102, 105, 100, 98, 98, 92]
  },
  'GEO.london': {
    hourly: [58, 45, 35, 28, 22, 22, 38, 68, 90, 100, 108, 110, 108, 105, 98, 92, 95, 110, 122, 135, 140, 138, 125, 85],
    peak: ['primetime', 'late_night'],
    dow: [100, 98, 100, 102, 110, 115, 98]
  },
  'GEO.regional_cities': {
    hourly: [48, 35, 28, 22, 18, 22, 40, 70, 88, 98, 105, 108, 110, 105, 98, 95, 98, 108, 120, 130, 135, 130, 115, 72],
    peak: ['primetime', 'early_evening'],
    dow: [98, 96, 98, 100, 108, 110, 98]
  },

  // ─── BEHAV ───
  'BEHAV.tech_enthusiast': {
    hourly: [65, 50, 38, 28, 22, 18, 28, 55, 75, 88, 95, 98, 105, 100, 95, 88, 92, 105, 120, 138, 148, 150, 140, 100],
    peak: ['primetime', 'late_night'],
    dow: [95, 92, 95, 98, 108, 115, 105]
  },
  'BEHAV.fitness_active': {
    hourly: [30, 22, 15, 12, 15, 40, 85, 110, 100, 90, 85, 88, 105, 95, 85, 80, 90, 115, 135, 130, 120, 108, 85, 45],
    peak: ['early_morning', 'evening_commute'],
    dow: [105, 102, 105, 100, 98, 110, 95]
  },
  'BEHAV.frequent_traveller': {
    hourly: [40, 30, 22, 18, 15, 25, 48, 78, 95, 108, 115, 112, 110, 105, 95, 88, 90, 100, 115, 125, 130, 125, 108, 62],
    peak: ['late_morning', 'primetime'],
    dow: [105, 100, 100, 98, 105, 105, 92]
  },
  'BEHAV.skiing_winter_sports': {
    hourly: [42, 32, 22, 18, 15, 22, 42, 68, 85, 95, 105, 108, 110, 105, 98, 92, 95, 108, 122, 135, 140, 135, 118, 70],
    peak: ['primetime', 'early_evening'],
    dow: [92, 90, 92, 98, 110, 118, 108]
  },
  'BEHAV.grocery_frequent': {
    hourly: [25, 18, 12, 10, 10, 22, 45, 72, 88, 100, 115, 120, 125, 118, 108, 100, 95, 105, 115, 120, 118, 108, 85, 42],
    peak: ['lunchtime', 'late_morning'],
    dow: [95, 95, 98, 100, 105, 118, 98]
  },
  'BEHAV.diy_home_improvement': {
    hourly: [25, 18, 12, 10, 10, 22, 42, 65, 82, 95, 110, 118, 115, 110, 105, 100, 98, 105, 115, 120, 118, 108, 88, 42],
    peak: ['late_morning', 'lunchtime'],
    dow: [88, 85, 88, 92, 98, 130, 125]
  },
  'BEHAV.gaming': {
    hourly: [85, 68, 52, 38, 28, 15, 18, 30, 42, 55, 65, 72, 80, 78, 75, 78, 85, 100, 125, 148, 160, 165, 155, 120],
    peak: ['primetime', 'late_night'],
    dow: [90, 88, 92, 95, 112, 125, 115]
  },

  // ─── PSYCH ───
  'PSYCH.health_conscious': {
    hourly: [28, 20, 15, 12, 15, 42, 78, 105, 100, 95, 92, 95, 108, 105, 95, 88, 90, 108, 125, 130, 125, 115, 92, 45],
    peak: ['early_morning', 'early_evening'],
    dow: [108, 105, 108, 102, 98, 100, 88]
  },
  'PSYCH.eco_conscious': {
    hourly: [35, 25, 18, 15, 12, 22, 42, 72, 90, 100, 110, 112, 112, 108, 100, 95, 95, 105, 118, 128, 132, 125, 105, 58],
    peak: ['primetime', 'late_morning'],
    dow: [102, 100, 102, 100, 102, 100, 95]
  },
  'PSYCH.luxury_oriented': {
    hourly: [42, 32, 22, 18, 14, 20, 38, 65, 82, 95, 105, 108, 110, 108, 100, 95, 98, 108, 122, 135, 140, 138, 120, 72],
    peak: ['primetime', 'early_evening'],
    dow: [100, 98, 100, 102, 108, 108, 92]
  },
  'PSYCH.price_sensitive_psych': {
    hourly: [45, 35, 25, 20, 18, 20, 38, 62, 80, 92, 105, 110, 115, 112, 108, 102, 100, 108, 118, 128, 130, 125, 110, 68],
    peak: ['lunchtime', 'primetime'],
    dow: [95, 92, 95, 98, 110, 118, 100]
  },

  // ─── PURCH ───
  'PURCH.premium_buyer': {
    hourly: [38, 28, 20, 16, 14, 22, 40, 68, 85, 98, 108, 112, 112, 108, 100, 95, 98, 108, 120, 130, 135, 130, 112, 62],
    peak: ['primetime', 'lunchtime'],
    dow: [102, 100, 102, 100, 105, 102, 90]
  },
  'PURCH.price_sensitive_purch': {
    hourly: [48, 38, 28, 22, 18, 18, 35, 58, 75, 88, 100, 108, 115, 112, 108, 102, 100, 108, 118, 130, 132, 128, 115, 75],
    peak: ['lunchtime', 'primetime'],
    dow: [95, 92, 95, 98, 112, 120, 102]
  },
  'PURCH.auto_intender': {
    hourly: [35, 25, 18, 15, 12, 20, 38, 62, 80, 95, 108, 115, 118, 112, 105, 98, 95, 105, 118, 128, 132, 128, 108, 58],
    peak: ['lunchtime', 'primetime'],
    dow: [95, 92, 95, 98, 102, 118, 108]
  },
  'PURCH.fashion_buyer': {
    hourly: [52, 40, 30, 22, 18, 18, 30, 55, 72, 85, 98, 105, 108, 105, 100, 95, 98, 110, 125, 138, 142, 138, 122, 78],
    peak: ['primetime', 'early_evening'],
    dow: [95, 92, 98, 100, 110, 118, 100]
  },
  'PURCH.fmcg_regular': {
    hourly: [28, 20, 15, 12, 10, 22, 45, 72, 88, 100, 112, 118, 122, 118, 108, 102, 98, 105, 115, 120, 118, 108, 88, 42],
    peak: ['lunchtime', 'late_morning'],
    dow: [98, 95, 98, 100, 105, 118, 100]
  },

  // ─── CONTEXT ───
  'CONTEXT.seasonal_summer': {
    hourly: [42, 32, 22, 18, 15, 22, 40, 65, 82, 92, 100, 105, 108, 105, 100, 98, 100, 112, 125, 135, 138, 132, 115, 68],
    peak: ['primetime', 'early_evening'],
    dow: [92, 90, 92, 95, 108, 120, 115]
  },
  'CONTEXT.seasonal_winter': {
    hourly: [45, 35, 25, 20, 15, 20, 38, 62, 80, 90, 98, 102, 108, 105, 100, 98, 102, 110, 122, 132, 138, 135, 120, 72],
    peak: ['primetime', 'early_evening'],
    dow: [95, 92, 95, 98, 108, 115, 105]
  },
  'CONTEXT.commute_window': {
    hourly: [20, 15, 10, 8, 8, 28, 75, 145, 170, 140, 80, 65, 60, 58, 55, 60, 80, 150, 165, 110, 72, 55, 40, 25],
    peak: ['morning_commute', 'evening_commute'],
    dow: [120, 118, 120, 118, 115, 55, 48]
  },
  'CONTEXT.evening_leisure': {
    hourly: [40, 30, 20, 15, 10, 12, 18, 30, 42, 55, 62, 68, 72, 70, 65, 62, 70, 95, 130, 155, 168, 165, 148, 85],
    peak: ['primetime', 'late_night'],
    dow: [92, 90, 92, 98, 115, 125, 108]
  },
  'CONTEXT.back_to_school': {
    hourly: [30, 22, 15, 12, 10, 20, 42, 70, 88, 100, 112, 118, 115, 110, 105, 100, 98, 108, 120, 125, 122, 112, 88, 45],
    peak: ['late_morning', 'primetime'],
    dow: [105, 102, 105, 100, 98, 110, 88]
  },

  // ─── MEDIA ───
  'MEDIA.digital_heavy': {
    hourly: [65, 52, 40, 30, 22, 18, 28, 55, 78, 92, 100, 105, 108, 105, 100, 95, 98, 108, 122, 138, 148, 150, 140, 100],
    peak: ['primetime', 'late_night'],
    dow: [95, 92, 95, 98, 108, 115, 105]
  },
  'MEDIA.tv_heavy': {
    hourly: [35, 25, 18, 14, 10, 15, 28, 52, 68, 78, 82, 85, 90, 88, 82, 80, 88, 105, 128, 148, 158, 155, 132, 72],
    peak: ['primetime', 'early_evening'],
    dow: [98, 95, 98, 100, 102, 108, 105]
  },
  'MEDIA.social_heavy': {
    hourly: [72, 58, 45, 35, 25, 18, 25, 48, 68, 82, 92, 95, 100, 98, 92, 88, 95, 110, 128, 145, 152, 150, 142, 105],
    peak: ['primetime', 'late_night'],
    dow: [92, 90, 92, 95, 112, 120, 108]
  },
  'MEDIA.print_traditional': {
    hourly: [15, 10, 8, 8, 10, 30, 58, 90, 112, 125, 132, 130, 128, 122, 112, 105, 98, 92, 88, 85, 82, 72, 52, 28],
    peak: ['late_morning', 'morning_commute'],
    dow: [108, 105, 108, 105, 100, 92, 85]
  },
  'MEDIA.podcast_audio': {
    hourly: [25, 18, 12, 10, 10, 32, 72, 130, 145, 120, 95, 85, 82, 80, 78, 80, 88, 125, 140, 118, 95, 82, 62, 35],
    peak: ['morning_commute', 'evening_commute'],
    dow: [108, 105, 108, 105, 102, 88, 82]
  }
};
