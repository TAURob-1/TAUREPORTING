/**
 * Atlas Classification — Public API
 *
 * Simple Segments: composable building blocks where users pick one option per
 * dimension (Age, Income, Household Size, Education, Car Ownership, Housing)
 * and combine them to define a custom audience.
 */

export { SEGMENT_DIMENSIONS } from './simpleSegments.js';
export { loadMSOAData, scoreMSOAs, toAudienceScoreFormat } from './atlasScoring.js';

import { loadMSOAData, scoreMSOAs, toAudienceScoreFormat } from './atlasScoring.js';

/**
 * Build a simple segment from user selections.
 *
 * @param {Object} selections — one option key per dimension, e.g.
 *   { age: 'young_adults', income: 'high', housing: 'one_bed' }
 *
 * @returns {Promise<Array<{ zip3: string, score: number, demographics: Object }>>}
 *   Scored MSOAs sorted by fit (descending), compatible with generateRecommendations().
 */
export async function buildSimpleSegment(selections) {
  const rows = await loadMSOAData();
  const scored = await scoreMSOAs(selections, rows);
  return toAudienceScoreFormat(scored, rows);
}
