/**
 * Audience Graph — Core Computation Module
 *
 * Pure functions extracted from audience-graph.html for testability.
 * All functions are stateless — pass data in, get results out.
 */

import {
  MECHANISMS, MECHANISM_KEYS, ATTRIBUTE_CLASSES, MECHANISM_RECOMMENDATIONS,
} from '../../data/audienceGraph/scores.js';
import { CHANNEL_PLATFORMS, CHANNEL_PLATFORM_KEYS, CHANNEL_AFFINITY } from '../../data/audienceGraph/channelAffinity.js';
import { KEYWORD_CLUSTERS, KEYWORD_CLASS_DEFAULTS } from '../../data/audienceGraph/keywordClusters.js';
import { DAYPART_PROFILES, DAY_OF_WEEK_LABELS } from '../../data/audienceGraph/daypartProfiles.js';
import { getAggregatedPlatformTargeting } from '../../data/audienceGraph/platformTargeting.js';

/**
 * Get P/S score for a specific attribute–mechanism pair, with optional overrides.
 * Falls back to class defaults if no attribute-level score exists.
 */
export function getScore(classKey, attrKey, mechKey, dim, scoreOverrides = {}) {
  const overrideKey = `${classKey}.${attrKey}.${mechKey}.${dim}`;
  if (scoreOverrides[overrideKey] !== undefined) {
    return Number(scoreOverrides[overrideKey]);
  }

  const cls = ATTRIBUTE_CLASSES[classKey];
  if (!cls) return 0;

  const attr = cls.attributes[attrKey];
  if (attr?.scores?.[mechKey]?.[dim] !== undefined) {
    return attr.scores[mechKey][dim];
  }

  if (cls.defaults?.[mechKey]?.[dim] !== undefined) {
    return cls.defaults[mechKey][dim];
  }

  return 0;
}

/**
 * Compute the full blueprint for a set of selected attributes.
 *
 * @param {Array<{classKey: string, attrKey: string}>} selectedAttributes
 * @param {Object} scoreOverrides - optional overrides keyed as "CLASS.attr.MECH.dim"
 * @returns {{ rows, mechTotals, grandTotal, ranked }}
 */
export function computeBlueprint(selectedAttributes = [], scoreOverrides = {}) {
  if (selectedAttributes.length === 0) {
    return { rows: [], mechTotals: {}, grandTotal: 0, ranked: [] };
  }

  const rows = [];
  const mechTotals = {};
  MECHANISM_KEYS.forEach((mk) => { mechTotals[mk] = 0; });

  for (const { classKey, attrKey } of selectedAttributes) {
    const cls = ATTRIBUTE_CLASSES[classKey];
    if (!cls) continue;
    const attr = cls.attributes[attrKey];
    if (!attr) continue;

    const row = { classKey, attrKey, label: attr.label, classLabel: cls.label, scores: {} };

    for (const mk of MECHANISM_KEYS) {
      const P = getScore(classKey, attrKey, mk, 'P', scoreOverrides);
      const S = getScore(classKey, attrKey, mk, 'S', scoreOverrides);
      const W = P * S;
      row.scores[mk] = { P, S, W };
      mechTotals[mk] += W;
    }

    rows.push(row);
  }

  const grandTotal = Object.values(mechTotals).reduce((sum, v) => sum + v, 0);

  const ranked = MECHANISM_KEYS
    .map((mk) => ({
      key: mk,
      ...MECHANISMS[mk],
      total: mechTotals[mk],
      pct: grandTotal > 0 ? (mechTotals[mk] / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  // Normalize percentages to sum to exactly 100
  if (grandTotal > 0) {
    const rawSum = ranked.reduce((sum, r) => sum + r.pct, 0);
    if (rawSum > 0) {
      ranked.forEach((r) => { r.pct = (r.pct / rawSum) * 100; });
    }
  }

  return { rows, mechTotals, grandTotal, ranked };
}

/**
 * Get recommendation text for a mechanism based on its allocation percentage.
 */
export function getMechanismRecommendation(mechKey, pct) {
  const rec = MECHANISM_RECOMMENDATIONS[mechKey];
  if (!rec) return '';
  if (pct >= 15) return rec.high;
  if (pct >= 8) return rec.mid;
  return rec.low;
}

/**
 * Compute weighted channel affinity scores across selected attributes.
 * Returns array of { platformKey, label, type, owner, cpm, reach, color, affinity }
 * sorted by affinity descending.
 */
export function getWeightedAffinities(selectedAttributes = []) {
  if (selectedAttributes.length === 0) return [];

  const totals = {};
  CHANNEL_PLATFORM_KEYS.forEach((pk) => { totals[pk] = 0; });
  let count = 0;

  for (const { classKey, attrKey } of selectedAttributes) {
    const key = `${classKey}.${attrKey}`;
    const affinities = CHANNEL_AFFINITY[key];
    if (!affinities) continue;

    for (const pk of CHANNEL_PLATFORM_KEYS) {
      totals[pk] += affinities[pk] || 0;
    }
    count++;
  }

  if (count === 0) return [];

  return CHANNEL_PLATFORM_KEYS.map((pk) => ({
    platformKey: pk,
    ...CHANNEL_PLATFORMS[pk],
    affinity: Math.round(totals[pk] / count),
  })).sort((a, b) => b.affinity - a.affinity);
}

/**
 * Gather keyword clusters for selected attributes.
 * Returns { results: [...], missingAttributes: [...] }
 * - results: array of { classKey, attrKey, label, clusters }
 * - missingAttributes: attributes with no specific KEYWORD_CLUSTERS or class default
 */
export function gatherKeywords(selectedAttributes = []) {
  const results = [];
  const missingAttributes = [];

  for (const { classKey, attrKey } of selectedAttributes) {
    const key = `${classKey}.${attrKey}`;
    const cls = ATTRIBUTE_CLASSES[classKey];
    const attr = cls?.attributes[attrKey];
    if (!attr) continue;

    let clusters = KEYWORD_CLUSTERS[key];
    if (!clusters) {
      clusters = KEYWORD_CLASS_DEFAULTS[classKey] || [];
    }

    if (clusters.length > 0) {
      results.push({
        classKey,
        attrKey,
        label: attr.label,
        clusters,
      });
    }

    // Flag as missing if no specific clusters exist (only class default or nothing)
    if (!KEYWORD_CLUSTERS[key]) {
      missingAttributes.push({ classKey, attrKey, label: attr.label });
    }
  }

  return { results, missingAttributes };
}

/**
 * Compute composite hourly engagement profile across selected attributes.
 * Returns array of 24 values (index=hour, value=engagement index, 100=average).
 */
export function getCompositeHourly(selectedAttributes = []) {
  if (selectedAttributes.length === 0) return new Array(24).fill(100);

  const composite = new Array(24).fill(0);
  let count = 0;

  for (const { classKey, attrKey } of selectedAttributes) {
    const key = `${classKey}.${attrKey}`;
    const profile = DAYPART_PROFILES[key];
    if (!profile?.hourly || profile.hourly.length !== 24) continue;

    for (let h = 0; h < 24; h++) {
      composite[h] += profile.hourly[h];
    }
    count++;
  }

  if (count === 0) return new Array(24).fill(100);

  return composite.map((v) => Math.round(v / count));
}

/**
 * Get composite day-of-week profile across selected attributes.
 * Returns array of 7 values (Mon–Sun).
 */
export function getCompositeDow(selectedAttributes = []) {
  if (selectedAttributes.length === 0) return new Array(7).fill(100);

  const composite = new Array(7).fill(0);
  let count = 0;

  for (const { classKey, attrKey } of selectedAttributes) {
    const key = `${classKey}.${attrKey}`;
    const profile = DAYPART_PROFILES[key];
    if (!profile?.dow || profile.dow.length !== 7) continue;

    for (let d = 0; d < 7; d++) {
      composite[d] += profile.dow[d];
    }
    count++;
  }

  if (count === 0) return new Array(7).fill(100);

  return composite.map((v) => Math.round(v / count));
}

/**
 * Build Atlas geo-segment link from selected attributes.
 */
export function buildAtlasLink(selectedAttributes = []) {
  const attrToParam = {
    'DEMO.age_18_24': 'age=18-24',
    'DEMO.age_25_34': 'age=25-34',
    'DEMO.age_35_44': 'age=35-44',
    'DEMO.age_45_54': 'age=45-54',
    'DEMO.age_55_64': 'age=55-64',
    'DEMO.age_65_plus': 'age=65+',
    'DEMO.gender_male': 'gender=male',
    'DEMO.gender_female': 'gender=female',
    'SOCIO.income_low': 'income=low',
    'SOCIO.income_mid': 'income=mid',
    'SOCIO.income_high': 'income=high',
    'GEO.urban': 'geo=urban',
    'GEO.suburban': 'geo=suburban',
    'GEO.rural': 'geo=rural',
    'GEO.london': 'geo=london',
    'GEO.regional_cities': 'geo=regional',
  };

  const params = selectedAttributes
    .map(({ classKey, attrKey }) => attrToParam[`${classKey}.${attrKey}`])
    .filter(Boolean);

  if (params.length === 0) return null;
  return `atlas-segments.html?${params.join('&')}`;
}

/**
 * Build a summary string for the chat context envelope.
 * Includes full mechanism allocation with tiers, keyword clusters,
 * platform targeting, daypart peaks, and channel affinities.
 */
export function buildGraphContextSummary(audienceGraphState) {
  if (!audienceGraphState?.currentBlueprint) {
    return 'Active blueprint: No';
  }

  const { currentBlueprint, selectedAttributes } = audienceGraphState;
  const { ranked } = currentBlueprint;
  const attrs = selectedAttributes || [];
  const lines = ['Active blueprint: Yes'];

  // --- Mechanism Allocation ---
  lines.push('', '## Mechanism Allocation');
  for (const r of ranked) {
    if (r.pct < 1) continue;
    const tier = r.pct >= 15 ? 'HIGH' : r.pct >= 8 ? 'MID' : 'LOW';
    const rec = getMechanismRecommendation(r.key, r.pct);
    lines.push(`${r.short}: ${r.pct.toFixed(0)}% [${tier}]${rec ? ` — ${rec}` : ''}`);
  }

  // --- Selected Attributes ---
  lines.push('', '## Selected Attributes');
  for (const { classKey, attrKey } of attrs) {
    const cls = ATTRIBUTE_CLASSES[classKey];
    const attr = cls?.attributes[attrKey];
    const label = attr?.label || attrKey;
    lines.push(`${classKey}.${attrKey} (${label})`);
  }

  // --- Keyword Clusters ---
  const kw = gatherKeywords(attrs);
  if (kw.results.length > 0) {
    lines.push('', '## Keyword Clusters (M_KEY)');
    for (const result of kw.results.slice(0, 2)) {
      const clusterParts = [];
      for (const cluster of result.clusters.slice(0, 2)) {
        const topTerms = cluster.keywords
          .slice(0, 3)
          .map((k) => {
            const vol = k.volume >= 1000 ? `${(k.volume / 1000).toFixed(0)}K/mo` : `${k.volume}/mo`;
            return `${k.term} (${vol}, £${k.cpc.toFixed(2)})`;
          })
          .join(', ');
        clusterParts.push(`${cluster.group}: [${topTerms}]`);
      }
      lines.push(`- ${result.label}: ${clusterParts.join('; ')}`);
    }
  }

  // --- Platform Targeting ---
  const platforms = getAggregatedPlatformTargeting(attrs);
  if (platforms.length > 0) {
    lines.push('', '## Platform Targeting');
    for (const p of platforms.slice(0, 5)) {
      const natives = p.entries.filter((e) => e.ease === 'native');
      const segments = natives.slice(0, 3).map((e) => e.segment).join(', ');
      const suffix = segments ? ` (${segments})` : '';
      lines.push(`- ${p.label}: ${natives.length} native${suffix}`);
    }
  }

  // --- Daypart Peaks ---
  const hourly = getCompositeHourly(attrs);
  const dow = getCompositeDow(attrs);
  const peakHours = hourly
    .map((v, h) => ({ h, v }))
    .filter((x) => x.v >= 115)
    .sort((a, b) => b.v - a.v)
    .slice(0, 5)
    .map((x) => `${String(x.h).padStart(2, '0')}:00 (${x.v})`);
  const peakDays = dow
    .map((v, d) => ({ d, v }))
    .filter((x) => x.v >= 105)
    .sort((a, b) => b.v - a.v)
    .map((x) => `${DAY_OF_WEEK_LABELS[x.d]} (${x.v})`);

  if (peakHours.length > 0 || peakDays.length > 0) {
    lines.push('', '## Daypart Peaks');
    if (peakHours.length > 0) lines.push(`Peak hours: ${peakHours.join(', ')}`);
    if (peakDays.length > 0) lines.push(`Peak days: ${peakDays.join(', ')}`);
  }

  // --- Channel Affinities ---
  const affinities = getWeightedAffinities(attrs);
  if (affinities.length > 0) {
    lines.push('', '## Channel Affinities');
    lines.push(affinities.map((a) => `${a.label} (${a.affinity})`).join(', '));
  }

  return lines.join('\n');
}
