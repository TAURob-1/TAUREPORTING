import {
  PROVIDER_PLANNING as US_PROVIDER_PLANNING,
  REACH_PARAMS as US_REACH_PARAMS,
  generateFrequencyDistribution,
} from './planningConfig';

export const MARKET_UNIVERSE = {
  US: 131000000,
  UK: 28400000,
};

export const UK_PROVIDER_PLANNING = {
  youtube_ctv_uk: {
    id: 'youtube_ctv_uk',
    name: 'YouTube CTV',
    totalHouseholds: 15600000,
    avgCPM: 14,
    minBudget: 5000,
    maxFrequencyCap: 10,
    audienceOverlap: {
      itvx: 0.32,
      c4_streaming: 0.25,
      itv_linear: 0.28,
      channel4_linear: 0.24,
      sky_linear: 0.22,
    },
  },
  itvx: {
    id: 'itvx',
    name: 'ITVX',
    totalHouseholds: 9900000,
    avgCPM: 18,
    minBudget: 8000,
    maxFrequencyCap: 8,
    audienceOverlap: {
      youtube_ctv_uk: 0.32,
      c4_streaming: 0.30,
      itv_linear: 0.52,
      channel4_linear: 0.35,
      sky_linear: 0.25,
    },
  },
  c4_streaming: {
    id: 'c4_streaming',
    name: 'C4 Streaming',
    totalHouseholds: 8000000,
    avgCPM: 17,
    minBudget: 8000,
    maxFrequencyCap: 8,
    audienceOverlap: {
      youtube_ctv_uk: 0.25,
      itvx: 0.30,
      itv_linear: 0.32,
      channel4_linear: 0.50,
      sky_linear: 0.20,
    },
  },
  itv_linear: {
    id: 'itv_linear',
    name: 'ITV Linear',
    totalHouseholds: 19700000,
    avgCPM: 24,
    minBudget: 10000,
    maxFrequencyCap: 6,
    audienceOverlap: {
      youtube_ctv_uk: 0.28,
      itvx: 0.52,
      c4_streaming: 0.32,
      channel4_linear: 0.48,
      sky_linear: 0.36,
    },
  },
  channel4_linear: {
    id: 'channel4_linear',
    name: 'Channel 4',
    totalHouseholds: 18600000,
    avgCPM: 22,
    minBudget: 10000,
    maxFrequencyCap: 6,
    audienceOverlap: {
      youtube_ctv_uk: 0.24,
      itvx: 0.35,
      c4_streaming: 0.50,
      itv_linear: 0.48,
      sky_linear: 0.33,
    },
  },
  sky_linear: {
    id: 'sky_linear',
    name: 'Sky',
    totalHouseholds: 11400000,
    avgCPM: 30,
    minBudget: 10000,
    maxFrequencyCap: 7,
    audienceOverlap: {
      youtube_ctv_uk: 0.22,
      itvx: 0.25,
      c4_streaming: 0.20,
      itv_linear: 0.36,
      channel4_linear: 0.33,
    },
  },
};

const UK_REACH_PARAMS = {
  youtube_ctv_uk: { maxReachPct: 0.549, k: 1.1 },
  itvx: { maxReachPct: 0.347, k: 1.05 },
  c4_streaming: { maxReachPct: 0.28, k: 1.0 },
  itv_linear: { maxReachPct: 0.694, k: 0.85 },
  channel4_linear: { maxReachPct: 0.655, k: 0.82 },
  sky_linear: { maxReachPct: 0.401, k: 0.9 },
};

const US_BUDGET_PRESETS = [
  { value: 50000 },
  { value: 150000 },
  { value: 500000 },
  { value: 1000000 },
];

const UK_BUDGET_PRESETS = [
  { value: 25000 },
  { value: 100000 },
  { value: 250000 },
  { value: 500000 },
];

export function getBudgetPresets(countryCode = 'US') {
  return countryCode === 'UK' ? UK_BUDGET_PRESETS : US_BUDGET_PRESETS;
}

// Keep default export for backward compat
export const BUDGET_PRESETS = US_BUDGET_PRESETS;

export function getProviderPlanning(countryCode = 'US') {
  return countryCode === 'UK' ? UK_PROVIDER_PLANNING : US_PROVIDER_PLANNING;
}

function getReachParams(countryCode = 'US') {
  return countryCode === 'UK' ? UK_REACH_PARAMS : US_REACH_PARAMS;
}

export function getMarketUniverse(countryCode = 'US') {
  return MARKET_UNIVERSE[countryCode] || MARKET_UNIVERSE.US;
}

export function calculateTotalImpressions(allocations, countryCode = 'US') {
  const planning = getProviderPlanning(countryCode);
  return Object.entries(allocations)
    .filter(([, budget]) => budget > 0)
    .reduce((sum, [providerId, budget]) => {
      const provider = planning[providerId];
      if (!provider || provider.avgCPM <= 0) return sum;
      return sum + (budget / provider.avgCPM) * 1000;
    }, 0);
}

export function calculateGRPs(allocations, countryCode = 'US') {
  const universe = getMarketUniverse(countryCode);
  if (universe <= 0) return 0;
  const impressions = calculateTotalImpressions(allocations, countryCode);
  return Math.round((impressions / universe) * 100 * 10) / 10;
}

export function calcProviderReach(providerId, budget, countryCode = 'US') {
  const params = getReachParams(countryCode)[providerId];
  const provider = getProviderPlanning(countryCode)[providerId];
  const universe = getMarketUniverse(countryCode);
  if (!params || !provider || universe <= 0) return 0;

  const maxReach = params.maxReachPct * universe;
  const impressions = (budget / provider.avgCPM) * 1000;
  const reach = maxReach * (1 - Math.exp(-params.k * impressions / maxReach));
  return Math.round(reach);
}

export function calcProviderFrequency(providerId, budget, countryCode = 'US') {
  const provider = getProviderPlanning(countryCode)[providerId];
  if (!provider) return 0;
  const impressions = (budget / provider.avgCPM) * 1000;
  const reach = calcProviderReach(providerId, budget, countryCode);
  if (reach === 0) return 0;
  return impressions / reach;
}

export function calcCombinedMetrics(allocations, countryCode = 'US') {
  const planning = getProviderPlanning(countryCode);
  const universe = getMarketUniverse(countryCode);
  const entries = Object.entries(allocations).filter(([, budget]) => budget > 0);
  if (entries.length === 0) {
    return { reach: 0, frequency: 0, blendedCPM: 0, grps: 0 };
  }

  const reaches = {};
  let totalBudget = 0;
  const totalImpressions = calculateTotalImpressions(allocations, countryCode);

  for (const [providerId, budget] of entries) {
    reaches[providerId] = calcProviderReach(providerId, budget, countryCode);
    totalBudget += budget;
  }

  const ids = entries.map(([providerId]) => providerId);
  let grossReach = 0;
  for (const providerId of ids) {
    grossReach += reaches[providerId];
  }

  let overlapDeduction = 0;
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i];
      const b = ids[j];
      const overlapRate = planning[a]?.audienceOverlap?.[b] || 0;
      const smallerReach = Math.min(reaches[a], reaches[b]);
      overlapDeduction += smallerReach * overlapRate;
    }
  }

  const deduplicatedReach = Math.max(
    Math.round(grossReach - overlapDeduction),
    Math.max(...Object.values(reaches))
  );

  const cappedReach = Math.min(deduplicatedReach, universe);
  const frequency = cappedReach > 0 ? totalImpressions / cappedReach : 0;
  const blendedCPM = totalImpressions > 0 ? (totalBudget / totalImpressions) * 1000 : 0;

  return {
    reach: cappedReach,
    frequency: Math.round(frequency * 10) / 10,
    blendedCPM: Math.round(blendedCPM * 100) / 100,
    grps: Math.round((totalImpressions / universe) * 100 * 10) / 10,
  };
}

export function autoOptimize(totalBudget, enabledProviderIds, countryCode = 'US') {
  const INCREMENT = 5000;
  const MAX_PROVIDER_PCT = 0.25;
  const maxPerProvider = Math.max(INCREMENT * 2, Math.floor(totalBudget * MAX_PROVIDER_PCT));
  const minSeed = Math.min(Math.floor(totalBudget * 0.05), 25000);

  const allocations = {};
  let remaining = totalBudget;

  enabledProviderIds.forEach((providerId) => {
    const seed = Math.min(minSeed, Math.floor(remaining / enabledProviderIds.length));
    allocations[providerId] = seed;
    remaining -= seed;
  });

  while (remaining >= INCREMENT) {
    let bestId = null;
    let bestMarginalReach = -1;
    const currentReach = calcCombinedMetrics(allocations, countryCode).reach;

    for (const providerId of enabledProviderIds) {
      if (allocations[providerId] + INCREMENT > maxPerProvider) continue;

      const testAlloc = { ...allocations, [providerId]: allocations[providerId] + INCREMENT };
      const newReach = calcCombinedMetrics(testAlloc, countryCode).reach;
      const marginalReach = newReach - currentReach;

      const freq = calcProviderFrequency(providerId, allocations[providerId] + INCREMENT, countryCode);
      const maxFreq = getProviderPlanning(countryCode)[providerId]?.maxFrequencyCap || 10;
      const penalizedReach = freq > maxFreq
        ? marginalReach * (maxFreq / freq) * 0.3
        : marginalReach;

      if (penalizedReach > bestMarginalReach) {
        bestMarginalReach = penalizedReach;
        bestId = providerId;
      }
    }

    if (bestId && bestMarginalReach > 0) {
      allocations[bestId] += INCREMENT;
      remaining -= INCREMENT;
    } else {
      const active = enabledProviderIds.filter((providerId) => allocations[providerId] < maxPerProvider);
      if (active.length > 0) {
        const extra = Math.floor(remaining / active.length);
        active.forEach((providerId) => {
          allocations[providerId] += extra;
        });
        remaining -= extra * active.length;
      }
      break;
    }
  }

  if (remaining > 0 && enabledProviderIds.length > 0) {
    const topId = Object.entries(allocations).sort(([, a], [, b]) => b - a)[0][0];
    allocations[topId] += remaining;
  }

  return allocations;
}

export function generateReachCurve(enabledProviderIds, maxBudget, steps = 20, countryCode = 'US') {
  const points = [];
  const perProvider = 1 / enabledProviderIds.length;
  for (let i = 0; i <= steps; i++) {
    const budget = Math.round((maxBudget / steps) * i);
    const allocations = {};
    enabledProviderIds.forEach((providerId) => {
      allocations[providerId] = Math.round(budget * perProvider);
    });
    const { reach } = calcCombinedMetrics(allocations, countryCode);
    points.push({ budget, reach });
  }
  return points;
}

export { generateFrequencyDistribution };
