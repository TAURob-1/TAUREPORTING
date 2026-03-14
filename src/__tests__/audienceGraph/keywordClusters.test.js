import { describe, it, expect } from 'vitest';
import { gatherKeywords } from '../../lib/audienceGraph/computeBlueprint.js';
import { KEYWORD_CLUSTERS, KEYWORD_CLASS_DEFAULTS } from '../../data/audienceGraph/keywordClusters.js';
import { EXAMPLE_AUDIENCES } from '../../data/audienceGraph/scores.js';

describe('gatherKeywords', () => {
  it('returns empty results for no attributes', () => {
    const { results, missingAttributes } = gatherKeywords([]);
    expect(results).toHaveLength(0);
    expect(missingAttributes).toHaveLength(0);
  });

  it('returns skiing clusters for young_affluent_skiers', () => {
    const { attributes } = EXAMPLE_AUDIENCES.young_affluent_skiers;
    const { results } = gatherKeywords(attributes);

    expect(results.length).toBeGreaterThan(0);

    // Should find skiing-related clusters
    const skiingResult = results.find((r) => r.attrKey === 'skiing_winter_sports');
    expect(skiingResult).toBeDefined();
    expect(skiingResult.clusters.length).toBeGreaterThan(0);
  });

  it('uses class defaults for attributes without specific clusters', () => {
    const attributes = [{ classKey: 'DEMO', attrKey: 'age_25_34' }];
    const { results } = gatherKeywords(attributes);

    // DEMO doesn't have specific clusters, should use KEYWORD_CLASS_DEFAULTS
    expect(results.length).toBeGreaterThan(0);
  });

  it('returns missingAttributes for attributes without specific KEYWORD_CLUSTERS entry', () => {
    const attributes = [
      { classKey: 'DEMO', attrKey: 'age_65_plus' },
      { classKey: 'BEHAV', attrKey: 'skiing_winter_sports' },
    ];
    const { results, missingAttributes } = gatherKeywords(attributes);

    // DEMO.age_65_plus has no specific entry → should be in missingAttributes
    expect(missingAttributes.some((a) => a.classKey === 'DEMO' && a.attrKey === 'age_65_plus')).toBe(true);

    // BEHAV.skiing_winter_sports has a specific entry → should NOT be missing
    expect(missingAttributes.some((a) => a.attrKey === 'skiing_winter_sports')).toBe(false);

    // Both should still produce results (DEMO via class default, BEHAV via specific clusters)
    expect(results.length).toBe(2);
  });
});

describe('KEYWORD_CLASS_DEFAULTS', () => {
  it('CONTEXT class default exists with valid keywords', () => {
    const ctx = KEYWORD_CLASS_DEFAULTS.CONTEXT;
    expect(ctx).toBeDefined();
    expect(Array.isArray(ctx)).toBe(true);
    expect(ctx.length).toBeGreaterThan(0);
    expect(ctx[0].group).toBeTruthy();
    expect(ctx[0].keywords.length).toBeGreaterThanOrEqual(3);

    for (const kw of ctx[0].keywords) {
      expect(kw.term).toBeTruthy();
      expect(typeof kw.volume).toBe('number');
      expect(typeof kw.cpc).toBe('number');
      expect(kw.competition).toBeGreaterThanOrEqual(0);
      expect(kw.competition).toBeLessThanOrEqual(1);
    }
  });
});

describe('KEYWORD_CLUSTERS data integrity', () => {
  it('all clusters have required fields', () => {
    for (const [key, clusters] of Object.entries(KEYWORD_CLUSTERS)) {
      expect(Array.isArray(clusters)).toBe(true);

      for (const cluster of clusters) {
        expect(cluster.group).toBeTruthy();
        expect(Array.isArray(cluster.keywords)).toBe(true);
        expect(cluster.keywords.length).toBeGreaterThan(0);

        for (const kw of cluster.keywords) {
          expect(kw.term).toBeTruthy();
          expect(typeof kw.volume).toBe('number');
          expect(kw.volume).toBeGreaterThan(0);
          expect(typeof kw.cpc).toBe('number');
          expect(kw.cpc).toBeGreaterThan(0);
          expect(typeof kw.competition).toBe('number');
          expect(kw.competition).toBeGreaterThanOrEqual(0);
          expect(kw.competition).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it('skiing keywords have CPC in reasonable range', () => {
    const skiClusters = KEYWORD_CLUSTERS['BEHAV.skiing_winter_sports'];
    expect(skiClusters).toBeDefined();

    const allKeywords = skiClusters.flatMap((c) => c.keywords);
    const avgCpc = allKeywords.reduce((sum, kw) => sum + kw.cpc, 0) / allKeywords.length;

    // Average CPC for ski keywords should be in £0.30 – £4 range
    expect(avgCpc).toBeGreaterThanOrEqual(0.3);
    expect(avgCpc).toBeLessThanOrEqual(4);
  });

  it('CSV format validation - all keywords can be serialized', () => {
    for (const [key, clusters] of Object.entries(KEYWORD_CLUSTERS)) {
      for (const cluster of clusters) {
        for (const kw of cluster.keywords) {
          const csv = `${cluster.group},${kw.term},${kw.volume},${kw.cpc},${kw.competition}`;
          expect(csv).toBeTruthy();
          expect(csv.split(',').length).toBe(5);
        }
      }
    }
  });
});
