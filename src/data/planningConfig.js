// Planning configuration for budget allocation, reach/frequency modeling,
// and provider optimization in the Campaign Planning tab.

// US TV households baseline (Nielsen estimate)
export const US_TV_HOUSEHOLDS = 131000000;

// Provider-level planning data for reach/frequency and budget optimization
export const PROVIDER_PLANNING = {
  youtube_ctv: {
    id: 'youtube_ctv',
    name: 'YouTube (CTV)',
    totalHouseholds: 120000000,
    avgCPM: 24,
    minBudget: 10000,
    maxFrequencyCap: 12,
    audienceOverlap: {
      roku: 0.35, hulu: 0.25, disney_plus: 0.20, amazon_fire_tv: 0.30,
      peacock: 0.22, tiktok_ctv: 0.18, tubi: 0.28, netflix: 0.15,
      paramount_plus: 0.14, samsung_tv_plus: 0.24, max_hbo: 0.12,
      pluto_tv: 0.26, lg_channels: 0.20, vizio_watchfree: 0.18,
      fubo: 0.10, espn_plus: 0.16, apple_tv_plus: 0.08
    },
    strengths: ['young_professionals', 'tech_adopters', 'entertainment_seekers'],
    daypartSkew: { morning: 0.8, afternoon: 1.0, evening: 1.3, primetime: 1.1, latenight: 0.9 }
  },
  roku: {
    id: 'roku',
    name: 'Roku',
    totalHouseholds: 80000000,
    avgCPM: 26,
    minBudget: 8000,
    maxFrequencyCap: 10,
    audienceOverlap: {
      youtube_ctv: 0.35, hulu: 0.30, disney_plus: 0.22, amazon_fire_tv: 0.15,
      peacock: 0.25, tiktok_ctv: 0.12, tubi: 0.32, netflix: 0.20,
      paramount_plus: 0.18, samsung_tv_plus: 0.10, max_hbo: 0.15,
      pluto_tv: 0.30, lg_channels: 0.08, vizio_watchfree: 0.06,
      fubo: 0.12, espn_plus: 0.14, apple_tv_plus: 0.10
    },
    strengths: ['cord_cutters', 'suburban_families', 'value_seekers'],
    daypartSkew: { morning: 0.7, afternoon: 0.9, evening: 1.4, primetime: 1.3, latenight: 0.8 }
  },
  hulu: {
    id: 'hulu',
    name: 'Hulu',
    totalHouseholds: 51000000,
    avgCPM: 32,
    minBudget: 12000,
    maxFrequencyCap: 8,
    audienceOverlap: {
      youtube_ctv: 0.25, roku: 0.30, disney_plus: 0.45, amazon_fire_tv: 0.22,
      peacock: 0.28, tiktok_ctv: 0.15, tubi: 0.18, netflix: 0.32,
      paramount_plus: 0.25, samsung_tv_plus: 0.12, max_hbo: 0.28,
      pluto_tv: 0.14, lg_channels: 0.08, vizio_watchfree: 0.06,
      fubo: 0.15, espn_plus: 0.20, apple_tv_plus: 0.18
    },
    strengths: ['young_professionals', 'entertainment_seekers', 'binge_watchers'],
    daypartSkew: { morning: 0.5, afternoon: 0.7, evening: 1.5, primetime: 1.6, latenight: 1.0 }
  },
  amazon_fire_tv: {
    id: 'amazon_fire_tv',
    name: 'Amazon Fire TV',
    totalHouseholds: 74000000,
    avgCPM: 28,
    minBudget: 10000,
    maxFrequencyCap: 10,
    audienceOverlap: {
      youtube_ctv: 0.30, roku: 0.15, hulu: 0.22, disney_plus: 0.20,
      peacock: 0.18, tiktok_ctv: 0.14, tubi: 0.25, netflix: 0.22,
      paramount_plus: 0.16, samsung_tv_plus: 0.08, max_hbo: 0.18,
      pluto_tv: 0.22, lg_channels: 0.06, vizio_watchfree: 0.05,
      fubo: 0.10, espn_plus: 0.15, apple_tv_plus: 0.12
    },
    strengths: ['online_shoppers', 'tech_adopters', 'suburban_families'],
    daypartSkew: { morning: 0.6, afternoon: 0.8, evening: 1.4, primetime: 1.3, latenight: 0.7 }
  },
  disney_plus: {
    id: 'disney_plus',
    name: 'Disney+',
    totalHouseholds: 46000000,
    avgCPM: 38,
    minBudget: 15000,
    maxFrequencyCap: 6,
    audienceOverlap: {
      youtube_ctv: 0.20, roku: 0.22, hulu: 0.45, amazon_fire_tv: 0.20,
      peacock: 0.22, tiktok_ctv: 0.12, tubi: 0.10, netflix: 0.35,
      paramount_plus: 0.28, samsung_tv_plus: 0.10, max_hbo: 0.30,
      pluto_tv: 0.08, lg_channels: 0.06, vizio_watchfree: 0.04,
      fubo: 0.08, espn_plus: 0.25, apple_tv_plus: 0.22
    },
    strengths: ['families_with_children', 'suburban_families', 'entertainment_seekers'],
    daypartSkew: { morning: 0.9, afternoon: 1.2, evening: 1.4, primetime: 1.2, latenight: 0.4 }
  },
  peacock: {
    id: 'peacock',
    name: 'Peacock',
    totalHouseholds: 34000000,
    avgCPM: 28,
    minBudget: 8000,
    maxFrequencyCap: 10,
    audienceOverlap: {
      youtube_ctv: 0.22, roku: 0.25, hulu: 0.28, amazon_fire_tv: 0.18,
      disney_plus: 0.22, tiktok_ctv: 0.10, tubi: 0.20, netflix: 0.24,
      paramount_plus: 0.22, samsung_tv_plus: 0.12, max_hbo: 0.20,
      pluto_tv: 0.18, lg_channels: 0.08, vizio_watchfree: 0.06,
      fubo: 0.18, espn_plus: 0.20, apple_tv_plus: 0.12
    },
    strengths: ['sports_fans', 'news_viewers', 'entertainment_seekers'],
    daypartSkew: { morning: 0.8, afternoon: 0.9, evening: 1.3, primetime: 1.5, latenight: 0.6 }
  },
  tiktok_ctv: {
    id: 'tiktok_ctv',
    name: 'TikTok (CTV)',
    totalHouseholds: 28000000,
    avgCPM: 22,
    minBudget: 5000,
    maxFrequencyCap: 15,
    audienceOverlap: {
      youtube_ctv: 0.18, roku: 0.12, hulu: 0.15, amazon_fire_tv: 0.14,
      disney_plus: 0.12, peacock: 0.10, tubi: 0.16, netflix: 0.12,
      paramount_plus: 0.08, samsung_tv_plus: 0.10, max_hbo: 0.08,
      pluto_tv: 0.14, lg_channels: 0.06, vizio_watchfree: 0.05,
      fubo: 0.04, espn_plus: 0.08, apple_tv_plus: 0.06
    },
    strengths: ['gen_z', 'young_professionals', 'trend_followers'],
    daypartSkew: { morning: 0.6, afternoon: 1.1, evening: 1.2, primetime: 0.9, latenight: 1.4 }
  },
  tubi: {
    id: 'tubi',
    name: 'Tubi',
    totalHouseholds: 64000000,
    avgCPM: 16,
    minBudget: 5000,
    maxFrequencyCap: 14,
    audienceOverlap: {
      youtube_ctv: 0.28, roku: 0.32, hulu: 0.18, amazon_fire_tv: 0.25,
      disney_plus: 0.10, peacock: 0.20, tiktok_ctv: 0.16, netflix: 0.14,
      paramount_plus: 0.12, samsung_tv_plus: 0.22, max_hbo: 0.10,
      pluto_tv: 0.35, lg_channels: 0.18, vizio_watchfree: 0.20,
      fubo: 0.08, espn_plus: 0.10, apple_tv_plus: 0.05
    },
    strengths: ['value_seekers', 'cord_cutters', 'diverse_audiences'],
    daypartSkew: { morning: 0.7, afternoon: 1.0, evening: 1.3, primetime: 1.2, latenight: 1.1 }
  },
  netflix: {
    id: 'netflix',
    name: 'Netflix',
    totalHouseholds: 85000000,
    avgCPM: 42,
    minBudget: 20000,
    maxFrequencyCap: 5,
    audienceOverlap: {
      youtube_ctv: 0.15, roku: 0.20, hulu: 0.32, amazon_fire_tv: 0.22,
      disney_plus: 0.35, peacock: 0.24, tiktok_ctv: 0.12, tubi: 0.14,
      paramount_plus: 0.22, samsung_tv_plus: 0.12, max_hbo: 0.30,
      pluto_tv: 0.10, lg_channels: 0.08, vizio_watchfree: 0.06,
      fubo: 0.10, espn_plus: 0.15, apple_tv_plus: 0.20
    },
    strengths: ['premium_viewers', 'binge_watchers', 'young_professionals'],
    daypartSkew: { morning: 0.4, afternoon: 0.6, evening: 1.5, primetime: 1.7, latenight: 1.2 }
  },
  paramount_plus: {
    id: 'paramount_plus',
    name: 'Paramount+',
    totalHouseholds: 32000000,
    avgCPM: 30,
    minBudget: 8000,
    maxFrequencyCap: 8,
    audienceOverlap: {
      youtube_ctv: 0.14, roku: 0.18, hulu: 0.25, amazon_fire_tv: 0.16,
      disney_plus: 0.28, peacock: 0.22, tiktok_ctv: 0.08, tubi: 0.12,
      netflix: 0.22, samsung_tv_plus: 0.10, max_hbo: 0.24,
      pluto_tv: 0.28, lg_channels: 0.06, vizio_watchfree: 0.05,
      fubo: 0.14, espn_plus: 0.18, apple_tv_plus: 0.12
    },
    strengths: ['sports_fans', 'entertainment_seekers', 'families_with_children'],
    daypartSkew: { morning: 0.6, afternoon: 0.8, evening: 1.3, primetime: 1.5, latenight: 0.7 }
  },
  samsung_tv_plus: {
    id: 'samsung_tv_plus',
    name: 'Samsung TV+',
    totalHouseholds: 42000000,
    avgCPM: 18,
    minBudget: 5000,
    maxFrequencyCap: 12,
    audienceOverlap: {
      youtube_ctv: 0.24, roku: 0.10, hulu: 0.12, amazon_fire_tv: 0.08,
      disney_plus: 0.10, peacock: 0.12, tiktok_ctv: 0.10, tubi: 0.22,
      netflix: 0.12, paramount_plus: 0.10, max_hbo: 0.08,
      pluto_tv: 0.24, lg_channels: 0.15, vizio_watchfree: 0.12,
      fubo: 0.06, espn_plus: 0.08, apple_tv_plus: 0.04
    },
    strengths: ['smart_tv_users', 'cord_cutters', 'value_seekers'],
    daypartSkew: { morning: 0.7, afternoon: 0.9, evening: 1.3, primetime: 1.2, latenight: 0.9 }
  },
  max_hbo: {
    id: 'max_hbo',
    name: 'Max (HBO)',
    totalHouseholds: 36000000,
    avgCPM: 40,
    minBudget: 15000,
    maxFrequencyCap: 6,
    audienceOverlap: {
      youtube_ctv: 0.12, roku: 0.15, hulu: 0.28, amazon_fire_tv: 0.18,
      disney_plus: 0.30, peacock: 0.20, tiktok_ctv: 0.08, tubi: 0.10,
      netflix: 0.30, paramount_plus: 0.24, samsung_tv_plus: 0.08,
      pluto_tv: 0.08, lg_channels: 0.05, vizio_watchfree: 0.04,
      fubo: 0.10, espn_plus: 0.12, apple_tv_plus: 0.18
    },
    strengths: ['premium_viewers', 'entertainment_seekers', 'urban_professionals'],
    daypartSkew: { morning: 0.3, afternoon: 0.5, evening: 1.4, primetime: 1.8, latenight: 1.3 }
  },
  pluto_tv: {
    id: 'pluto_tv',
    name: 'Pluto TV',
    totalHouseholds: 80000000,
    avgCPM: 15,
    minBudget: 5000,
    maxFrequencyCap: 15,
    audienceOverlap: {
      youtube_ctv: 0.26, roku: 0.30, hulu: 0.14, amazon_fire_tv: 0.22,
      disney_plus: 0.08, peacock: 0.18, tiktok_ctv: 0.14, tubi: 0.35,
      netflix: 0.10, paramount_plus: 0.28, samsung_tv_plus: 0.24,
      max_hbo: 0.08, lg_channels: 0.18, vizio_watchfree: 0.20,
      fubo: 0.06, espn_plus: 0.08, apple_tv_plus: 0.04
    },
    strengths: ['value_seekers', 'cord_cutters', 'channel_surfers'],
    daypartSkew: { morning: 0.8, afternoon: 1.1, evening: 1.2, primetime: 1.1, latenight: 1.0 }
  },
  lg_channels: {
    id: 'lg_channels',
    name: 'LG Channels',
    totalHouseholds: 30000000,
    avgCPM: 20,
    minBudget: 5000,
    maxFrequencyCap: 12,
    audienceOverlap: {
      youtube_ctv: 0.20, roku: 0.08, hulu: 0.08, amazon_fire_tv: 0.06,
      disney_plus: 0.06, peacock: 0.08, tiktok_ctv: 0.06, tubi: 0.18,
      netflix: 0.08, paramount_plus: 0.06, samsung_tv_plus: 0.15,
      max_hbo: 0.05, pluto_tv: 0.18, vizio_watchfree: 0.14,
      fubo: 0.04, espn_plus: 0.06, apple_tv_plus: 0.03
    },
    strengths: ['smart_tv_users', 'value_seekers', 'older_demographics'],
    daypartSkew: { morning: 0.8, afternoon: 1.0, evening: 1.2, primetime: 1.1, latenight: 0.8 }
  },
  vizio_watchfree: {
    id: 'vizio_watchfree',
    name: 'Vizio WatchFree+',
    totalHouseholds: 24000000,
    avgCPM: 17,
    minBudget: 5000,
    maxFrequencyCap: 12,
    audienceOverlap: {
      youtube_ctv: 0.18, roku: 0.06, hulu: 0.06, amazon_fire_tv: 0.05,
      disney_plus: 0.04, peacock: 0.06, tiktok_ctv: 0.05, tubi: 0.20,
      netflix: 0.06, paramount_plus: 0.05, samsung_tv_plus: 0.12,
      max_hbo: 0.04, pluto_tv: 0.20, lg_channels: 0.14,
      fubo: 0.03, espn_plus: 0.05, apple_tv_plus: 0.02
    },
    strengths: ['smart_tv_users', 'value_seekers', 'casual_viewers'],
    daypartSkew: { morning: 0.7, afternoon: 1.0, evening: 1.3, primetime: 1.1, latenight: 0.8 }
  },
  fubo: {
    id: 'fubo',
    name: 'Fubo',
    totalHouseholds: 16000000,
    avgCPM: 34,
    minBudget: 10000,
    maxFrequencyCap: 8,
    audienceOverlap: {
      youtube_ctv: 0.10, roku: 0.12, hulu: 0.15, amazon_fire_tv: 0.10,
      disney_plus: 0.08, peacock: 0.18, tiktok_ctv: 0.04, tubi: 0.08,
      netflix: 0.10, paramount_plus: 0.14, samsung_tv_plus: 0.06,
      max_hbo: 0.10, pluto_tv: 0.06, lg_channels: 0.04,
      vizio_watchfree: 0.03, espn_plus: 0.28, apple_tv_plus: 0.08
    },
    strengths: ['sports_fans', 'live_tv_viewers', 'cord_cutters'],
    daypartSkew: { morning: 0.6, afternoon: 1.0, evening: 1.5, primetime: 1.6, latenight: 0.5 }
  },
  espn_plus: {
    id: 'espn_plus',
    name: 'ESPN+',
    totalHouseholds: 26000000,
    avgCPM: 36,
    minBudget: 10000,
    maxFrequencyCap: 8,
    audienceOverlap: {
      youtube_ctv: 0.16, roku: 0.14, hulu: 0.20, amazon_fire_tv: 0.15,
      disney_plus: 0.25, peacock: 0.20, tiktok_ctv: 0.08, tubi: 0.10,
      netflix: 0.15, paramount_plus: 0.18, samsung_tv_plus: 0.08,
      max_hbo: 0.12, pluto_tv: 0.08, lg_channels: 0.06,
      vizio_watchfree: 0.05, fubo: 0.28, apple_tv_plus: 0.12
    },
    strengths: ['sports_fans', 'young_professionals', 'male_demographics'],
    daypartSkew: { morning: 0.5, afternoon: 1.2, evening: 1.5, primetime: 1.4, latenight: 0.6 }
  },
  apple_tv_plus: {
    id: 'apple_tv_plus',
    name: 'Apple TV+',
    totalHouseholds: 20000000,
    avgCPM: 40,
    minBudget: 15000,
    maxFrequencyCap: 5,
    audienceOverlap: {
      youtube_ctv: 0.08, roku: 0.10, hulu: 0.18, amazon_fire_tv: 0.12,
      disney_plus: 0.22, peacock: 0.12, tiktok_ctv: 0.06, tubi: 0.05,
      netflix: 0.20, paramount_plus: 0.12, samsung_tv_plus: 0.04,
      max_hbo: 0.18, pluto_tv: 0.04, lg_channels: 0.03,
      vizio_watchfree: 0.02, fubo: 0.08, espn_plus: 0.12
    },
    strengths: ['premium_viewers', 'tech_adopters', 'high_income'],
    daypartSkew: { morning: 0.4, afternoon: 0.6, evening: 1.4, primetime: 1.7, latenight: 1.1 }
  }
};

// Reach curve parameters per provider
// Model: Reach = maxReach * (1 - e^(-k * impressions / maxReach))
// maxReachPct = maximum % of US TV households reachable by this provider
// k = curve steepness (higher = faster saturation)
export const REACH_PARAMS = {
  youtube_ctv:     { maxReachPct: 0.42, k: 1.1 },
  roku:            { maxReachPct: 0.35, k: 0.95 },
  hulu:            { maxReachPct: 0.22, k: 1.05 },
  amazon_fire_tv:  { maxReachPct: 0.32, k: 1.0 },
  disney_plus:     { maxReachPct: 0.18, k: 1.15 },
  peacock:         { maxReachPct: 0.15, k: 0.90 },
  tiktok_ctv:      { maxReachPct: 0.12, k: 1.30 },
  tubi:            { maxReachPct: 0.28, k: 0.85 },
  netflix:         { maxReachPct: 0.38, k: 1.20 },
  paramount_plus:  { maxReachPct: 0.14, k: 0.95 },
  samsung_tv_plus: { maxReachPct: 0.18, k: 0.80 },
  max_hbo:         { maxReachPct: 0.16, k: 1.10 },
  pluto_tv:        { maxReachPct: 0.28, k: 0.80 },
  lg_channels:     { maxReachPct: 0.10, k: 0.85 },
  vizio_watchfree: { maxReachPct: 0.08, k: 0.80 },
  fubo:            { maxReachPct: 0.07, k: 1.00 },
  espn_plus:       { maxReachPct: 0.11, k: 1.05 },
  apple_tv_plus:   { maxReachPct: 0.08, k: 1.15 }
};

// Budget presets for quick selection
export const BUDGET_PRESETS = [
  { label: 'Test ($50K)', value: 50000 },
  { label: 'Regional ($150K)', value: 150000 },
  { label: 'National ($500K)', value: 500000 },
  { label: 'Enterprise ($1M+)', value: 1000000 }
];

// Map channel inventory names → planning config IDs
export const CHANNEL_TO_PROVIDER_ID = {
  'YouTube (CTV)': 'youtube_ctv',
  'Roku': 'roku',
  'Hulu': 'hulu',
  'Amazon Fire TV': 'amazon_fire_tv',
  'Disney+': 'disney_plus',
  'Peacock': 'peacock',
  'TikTok (CTV)': 'tiktok_ctv',
  'Tubi': 'tubi',
  'Netflix': 'netflix',
  'Paramount+': 'paramount_plus',
  'Samsung TV+': 'samsung_tv_plus',
  'Max (HBO)': 'max_hbo',
  'Pluto TV': 'pluto_tv',
  'LG Channels': 'lg_channels',
  'Vizio WatchFree+': 'vizio_watchfree',
  'Fubo': 'fubo',
  'ESPN+': 'espn_plus',
  'Apple TV+': 'apple_tv_plus'
};

// ── Reach/Frequency calculation utilities ──────────────────────────

/**
 * Calculate the number of households reached for a single provider
 * given a dollar budget, using the logarithmic reach curve.
 */
export function calcProviderReach(providerId, budget) {
  const params = REACH_PARAMS[providerId];
  const provider = PROVIDER_PLANNING[providerId];
  if (!params || !provider) return 0;

  const maxReach = params.maxReachPct * US_TV_HOUSEHOLDS;
  const impressions = (budget / provider.avgCPM) * 1000; // budget → impressions
  const reach = maxReach * (1 - Math.exp(-params.k * impressions / maxReach));
  return Math.round(reach);
}

/**
 * Calculate average frequency for a single provider given budget and reach.
 */
export function calcProviderFrequency(providerId, budget) {
  const provider = PROVIDER_PLANNING[providerId];
  if (!provider) return 0;
  const impressions = (budget / provider.avgCPM) * 1000;
  const reach = calcProviderReach(providerId, budget);
  if (reach === 0) return 0;
  return impressions / reach;
}

/**
 * Calculate deduplicated reach across multiple providers using a
 * simplified inclusion-exclusion approach (pairwise overlaps).
 * Returns { reach, frequency, blendedCPM }.
 */
export function calcCombinedMetrics(allocations) {
  // allocations: { [providerId]: dollarAmount }
  const entries = Object.entries(allocations).filter(([, v]) => v > 0);
  if (entries.length === 0) return { reach: 0, frequency: 0, blendedCPM: 0 };

  // Individual reaches
  const reaches = {};
  let totalImpressions = 0;
  let totalBudget = 0;

  for (const [id, budget] of entries) {
    reaches[id] = calcProviderReach(id, budget);
    const provider = PROVIDER_PLANNING[id];
    if (provider) {
      totalImpressions += (budget / provider.avgCPM) * 1000;
      totalBudget += budget;
    }
  }

  // Simple additive reach with pairwise overlap deduction
  let grossReach = 0;
  const ids = entries.map(([id]) => id);

  for (const id of ids) {
    grossReach += reaches[id];
  }

  // Deduct pairwise overlaps
  let overlapDeduction = 0;
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i];
      const b = ids[j];
      const overlapRate = PROVIDER_PLANNING[a]?.audienceOverlap?.[b] || 0;
      const smallerReach = Math.min(reaches[a], reaches[b]);
      overlapDeduction += smallerReach * overlapRate;
    }
  }

  const deduplicatedReach = Math.max(
    Math.round(grossReach - overlapDeduction),
    Math.max(...Object.values(reaches)) // At minimum, largest single reach
  );

  // Cap at US_TV_HOUSEHOLDS
  const cappedReach = Math.min(deduplicatedReach, US_TV_HOUSEHOLDS);
  const frequency = cappedReach > 0 ? totalImpressions / cappedReach : 0;
  const blendedCPM = totalImpressions > 0 ? (totalBudget / totalImpressions) * 1000 : 0;

  return {
    reach: cappedReach,
    frequency: Math.round(frequency * 10) / 10,
    blendedCPM: Math.round(blendedCPM * 100) / 100
  };
}

/**
 * Auto-optimize: allocate a total budget across enabled providers
 * to maximize deduplicated reach using a greedy marginal-reach approach.
 * Allocates in $5K increments.
 */
export function autoOptimize(totalBudget, enabledProviderIds) {
  const INCREMENT = 5000;
  // No single provider should get more than 25% of budget (ensures spread across providers)
  const MAX_PROVIDER_PCT = 0.25;
  const maxPerProvider = Math.max(INCREMENT * 2, Math.floor(totalBudget * MAX_PROVIDER_PCT));
  
  // Seed each enabled provider with a minimum allocation (ensures all get something)
  const minSeed = Math.min(Math.floor(totalBudget * 0.05), 25000); // 5% or $25K, whichever is less
  
  const allocations = {};
  let remaining = totalBudget;
  
  // Seed each provider with minimum allocation
  enabledProviderIds.forEach(id => {
    const seed = Math.min(minSeed, Math.floor(remaining / enabledProviderIds.length));
    allocations[id] = seed;
    remaining -= seed;
  });

  while (remaining >= INCREMENT) {
    let bestId = null;
    let bestMarginalReach = -1;
    const currentReach = calcCombinedMetrics(allocations).reach;

    for (const id of enabledProviderIds) {
      // Skip if at max allocation cap
      if (allocations[id] + INCREMENT > maxPerProvider) continue;

      // Test adding INCREMENT to this provider
      const testAlloc = { ...allocations, [id]: allocations[id] + INCREMENT };
      const newReach = calcCombinedMetrics(testAlloc).reach;
      const marginalReach = newReach - currentReach;

      // Also check frequency cap – diminishing returns past cap
      const freq = calcProviderFrequency(id, allocations[id] + INCREMENT);
      const maxFreq = PROVIDER_PLANNING[id]?.maxFrequencyCap || 10;
      const penalizedReach = freq > maxFreq
        ? marginalReach * (maxFreq / freq) * 0.3 // heavy penalty for over-frequency
        : marginalReach;

      if (penalizedReach > bestMarginalReach) {
        bestMarginalReach = penalizedReach;
        bestId = id;
      }
    }

    if (bestId && bestMarginalReach > 0) {
      allocations[bestId] += INCREMENT;
      remaining -= INCREMENT;
    } else {
      // All providers capped or no marginal gain — distribute remainder evenly
      const active = enabledProviderIds.filter(id => allocations[id] < maxPerProvider);
      if (active.length > 0) {
        const extra = Math.floor(remaining / active.length);
        active.forEach(id => { allocations[id] += extra; });
        remaining -= extra * active.length;
      }
      break;
    }
  }

  // Allocate any dust remainder to the provider with the most budget
  if (remaining > 0 && enabledProviderIds.length > 0) {
    const topId = Object.entries(allocations)
      .sort(([, a], [, b]) => b - a)[0][0];
    allocations[topId] += remaining;
  }

  return allocations;
}

/**
 * Generate reach curve data points for charting.
 * Returns array of { budget, reach } from 0 to maxBudget.
 */
export function generateReachCurve(enabledProviderIds, maxBudget, steps = 20) {
  const points = [];
  // Use proportional split (much faster than running autoOptimize per step)
  const perProvider = 1 / enabledProviderIds.length;
  for (let i = 0; i <= steps; i++) {
    const budget = Math.round((maxBudget / steps) * i);
    const alloc = {};
    enabledProviderIds.forEach(id => {
      alloc[id] = Math.round(budget * perProvider);
    });
    const { reach } = calcCombinedMetrics(alloc);
    points.push({ budget, reach });
  }
  return points;
}

/**
 * Generate frequency distribution estimate for a given combined metric set.
 * Returns array of { label, pct } buckets.
 */
export function generateFrequencyDistribution(avgFrequency) {
  if (avgFrequency <= 0) {
    return [
      { label: '1x', pct: 0 },
      { label: '2x', pct: 0 },
      { label: '3x', pct: 0 },
      { label: '4x', pct: 0 },
      { label: '5x+', pct: 0 },
      { label: 'Not reached', pct: 100 }
    ];
  }

  // Model frequency distribution as roughly Poisson-like
  // Skewed by the average frequency
  const base1 = Math.max(5, 40 - avgFrequency * 5);
  const base2 = Math.max(5, 30 - avgFrequency * 2);
  const base3 = Math.min(25, 10 + avgFrequency * 3);
  const base4 = Math.min(20, 5 + avgFrequency * 3);
  const base5 = Math.min(25, avgFrequency * 4);
  const baseNot = Math.max(3, 15 - avgFrequency * 2);

  const total = base1 + base2 + base3 + base4 + base5 + baseNot;

  return [
    { label: '1x', pct: Math.round(base1 / total * 100) },
    { label: '2x', pct: Math.round(base2 / total * 100) },
    { label: '3x', pct: Math.round(base3 / total * 100) },
    { label: '4x', pct: Math.round(base4 / total * 100) },
    { label: '5x+', pct: Math.round(base5 / total * 100) },
    { label: 'Not reached', pct: Math.round(baseNot / total * 100) }
  ];
}
