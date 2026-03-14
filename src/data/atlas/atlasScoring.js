/**
 * Atlas Simple Segment Scoring Engine
 *
 * Loads the MSOA CSV and scores each MSOA against user-selected dimension options.
 * Two scoring modes:
 *   - Share-based dimensions (age, household_size, education, car_ownership, housing):
 *     score = (sum of selected columns / total population) * 100
 *   - Quintile dimensions (income):
 *     MSOAs ranked by sourceColumn; score = 100 if in the selected percentile band, 0 otherwise
 *
 * When multiple dimensions are selected, scores are combined via geometric mean
 * so an MSOA must index highly on ALL selected dimensions.
 */

import { SEGMENT_DIMENSIONS } from './simpleSegments.js';

const CSV_PATH = '/data/uk/raw/uk_demographics_enriched_msoa.csv';

// ---------------------------------------------------------------------------
// CSV Parsing
// ---------------------------------------------------------------------------

let _cachedRows = null;

/**
 * Fetch and parse the MSOA CSV into an array of row objects.
 * Results are cached after the first call.
 */
export async function loadMSOAData() {
  if (_cachedRows) return _cachedRows;

  const response = await fetch(CSV_PATH);
  if (!response.ok) throw new Error(`Failed to load MSOA CSV: ${response.status}`);
  const text = await response.text();
  _cachedRows = parseCSV(text);
  return _cachedRows;
}

/**
 * Parse CSV text that may contain quoted fields with commas/newlines.
 * Returns an array of objects keyed by header names.
 */
function parseCSV(text) {
  const lines = text.split('\n');
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line);
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      const h = headers[j].trim();
      const raw = (values[j] || '').trim();
      // Try to parse as number; keep as string if it fails
      const num = Number(raw);
      row[h] = raw !== '' && !isNaN(num) ? num : raw;
    }
    rows.push(row);
  }
  return rows;
}

/**
 * Parse a single CSV line respecting quoted fields.
 */
function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

// ---------------------------------------------------------------------------
// Quintile computation
// ---------------------------------------------------------------------------

/**
 * Build a Map<msoa21cd, quintileScore> for a quintile-type dimension.
 * MSOAs are sorted by sourceColumn; each is assigned 100 if it falls within
 * the selected percentile band, else 0.
 */
function computeQuintileScores(rows, dimension, optionKey) {
  const option = dimension.options[optionKey];
  const col = dimension.sourceColumn;
  const [pLow, pHigh] = option.percentileRange;

  // Sort by source column ascending
  const sorted = rows
    .map((r, idx) => ({ idx, value: typeof r[col] === 'number' ? r[col] : NaN }))
    .filter(d => !isNaN(d.value))
    .sort((a, b) => a.value - b.value);

  const n = sorted.length;
  const scores = new Map();

  sorted.forEach((entry, rank) => {
    const percentile = (rank / n) * 100;
    // Score: 100 inside the band, linearly tapered outside
    if (percentile >= pLow && percentile < pHigh) {
      scores.set(rows[entry.idx].msoa21cd, 100);
    } else {
      // Distance from nearest edge of the band, tapered to 0 at the extremes
      const distFromBand = percentile < pLow
        ? pLow - percentile
        : percentile - pHigh;
      const maxDist = Math.max(pLow, 100 - pHigh);
      const tapered = Math.max(0, 100 - (distFromBand / Math.max(maxDist, 1)) * 100);
      scores.set(rows[entry.idx].msoa21cd, Math.round(tapered));
    }
  });

  return scores;
}

// ---------------------------------------------------------------------------
// Share-based scoring
// ---------------------------------------------------------------------------

/**
 * Compute share score for a share-based dimension option.
 * score = (sum of option columns / reference total) * 100
 *
 * For household-related dimensions (household_size, car_ownership, housing)
 * the reference total is the relevant "Total" column for that group.
 * For population-based dimensions (age) the reference is sum_total.
 *
 * The raw share is then converted to a 0–100 index relative to the national
 * average share: score = (local_share / national_avg_share) * 50, capped at 100.
 */
function computeShareScores(rows, dimensionKey, dimension, optionKey) {
  const option = dimension.options[optionKey];
  const cols = option.columns;

  // Determine the denominator column
  const totalColMap = {
    household_size: 'Household size: Total: All household spaces; measures: Value',
    car_ownership: 'Number of cars or vans: Total: All households',
    housing: 'Number of bedrooms: Total: All households',
    education: 'Highest level of qualification: Total: All usual residents aged 16 years and over'
  };
  const totalCol = totalColMap[dimensionKey] || 'sum_total';

  // First pass: compute raw shares and national totals
  let nationalNumerator = 0;
  let nationalDenominator = 0;
  const rawShares = [];

  for (const row of rows) {
    const denom = typeof row[totalCol] === 'number' ? row[totalCol] : 0;
    if (denom <= 0) {
      rawShares.push({ msoa: row.msoa21cd, share: 0 });
      continue;
    }
    let numerator = 0;
    for (const c of cols) {
      const v = row[c];
      if (typeof v === 'number') numerator += v;
    }
    nationalNumerator += numerator;
    nationalDenominator += denom;
    rawShares.push({ msoa: row.msoa21cd, share: numerator / denom });
  }

  const nationalAvg = nationalDenominator > 0
    ? nationalNumerator / nationalDenominator
    : 0;

  // Second pass: index each MSOA relative to national average
  // Index of 1.0 (matches national avg) → score 50; index of 2.0+ → score 100
  const scores = new Map();
  for (const { msoa, share } of rawShares) {
    if (nationalAvg <= 0) {
      scores.set(msoa, 0);
      continue;
    }
    const index = share / nationalAvg;
    const score = Math.min(100, Math.round(index * 50));
    scores.set(msoa, score);
  }

  return scores;
}

// ---------------------------------------------------------------------------
// Combination logic
// ---------------------------------------------------------------------------

/**
 * Score all MSOAs for a selection of dimension options.
 *
 * @param {Object} selections — e.g. { age: 'young_adults', income: 'high', housing: 'one_bed' }
 * @param {Array}  [rows]     — pre-loaded MSOA rows (if omitted, will be fetched)
 * @returns {Promise<Array<{ msoa: string, score: number, dimensionScores: Object }>>}
 *          Sorted by score descending.
 */
export async function scoreMSOAs(selections, rows) {
  if (!rows) rows = await loadMSOAData();

  const dimensionKeys = Object.keys(selections);
  if (dimensionKeys.length === 0) return [];

  // Compute per-dimension score maps
  const scoreMaps = {};
  for (const dimKey of dimensionKeys) {
    const optKey = selections[dimKey];
    const dim = SEGMENT_DIMENSIONS[dimKey];
    if (!dim) throw new Error(`Unknown dimension: ${dimKey}`);
    if (!dim.options[optKey]) throw new Error(`Unknown option "${optKey}" for dimension "${dimKey}"`);

    if (dim.type === 'quintile') {
      scoreMaps[dimKey] = computeQuintileScores(rows, dim, optKey);
    } else {
      scoreMaps[dimKey] = computeShareScores(rows, dimKey, dim, optKey);
    }
  }

  // Combine via geometric mean across dimensions
  const results = [];
  for (const row of rows) {
    const msoa = row.msoa21cd;
    const dimScores = {};
    let product = 1;
    let allPositive = true;

    for (const dimKey of dimensionKeys) {
      const s = scoreMaps[dimKey].get(msoa) ?? 0;
      dimScores[dimKey] = s;
      if (s <= 0) {
        allPositive = false;
        break;
      }
      product *= s;
    }

    const combined = allPositive
      ? Math.round(Math.pow(product, 1 / dimensionKeys.length))
      : 0;

    results.push({ msoa, score: combined, dimensionScores: dimScores });
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

// ---------------------------------------------------------------------------
// Output adapter — maps scored MSOAs to the format used by scoreZIPsForAudience
// ---------------------------------------------------------------------------

/**
 * Convert scored MSOAs into the { zip3, score, demographics } format
 * expected by generateRecommendations().
 */
export function toAudienceScoreFormat(scoredMSOAs, rows) {
  const rowMap = new Map();
  for (const r of rows) rowMap.set(r.msoa21cd, r);

  return scoredMSOAs.map(({ msoa, score, dimensionScores }) => {
    const row = rowMap.get(msoa) || {};
    return {
      zip3: msoa,
      score,
      dimensionScores,
      demographics: {
        population: row.sum_total || 0,
        medianIncome: row.med_inc || 0,
        dominantSector: row.dominant_sector || ''
      }
    };
  });
}
