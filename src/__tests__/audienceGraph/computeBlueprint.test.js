import { describe, it, expect } from 'vitest';
import {
  getScore,
  computeBlueprint,
  getMechanismRecommendation,
  buildAtlasLink,
  buildGraphContextSummary,
} from '../../lib/audienceGraph/computeBlueprint.js';
import { EXAMPLE_AUDIENCES } from '../../data/audienceGraph/scores.js';

describe('getScore', () => {
  it('returns attribute-level score when available', () => {
    expect(getScore('DEMO', 'age_25_34', 'M_GEO', 'P')).toBe(4);
    expect(getScore('DEMO', 'age_25_34', 'M_GEO', 'S')).toBe(4);
  });

  it('returns class defaults for missing attribute scores', () => {
    // class defaults should still return valid numbers
    const p = getScore('DEMO', 'age_25_34', 'M_KEY', 'P');
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThanOrEqual(5);
  });

  it('returns 0 for invalid classKey', () => {
    expect(getScore('INVALID', 'age_25_34', 'M_GEO', 'P')).toBe(0);
  });

  it('applies score overrides', () => {
    const overrides = { 'DEMO.age_25_34.M_GEO.P': 5 };
    expect(getScore('DEMO', 'age_25_34', 'M_GEO', 'P', overrides)).toBe(5);
  });
});

describe('computeBlueprint', () => {
  it('returns empty result for no attributes', () => {
    const result = computeBlueprint([]);
    expect(result.rows).toHaveLength(0);
    expect(result.grandTotal).toBe(0);
    expect(result.ranked).toHaveLength(0);
  });

  it('computes blueprint for young_affluent_skiers', () => {
    const { attributes } = EXAMPLE_AUDIENCES.young_affluent_skiers;
    const result = computeBlueprint(attributes);

    expect(result.rows).toHaveLength(5);
    expect(result.grandTotal).toBeGreaterThan(0);
    expect(result.ranked).toHaveLength(8);

    // Percentages should sum to ~100
    const pctSum = result.ranked.reduce((sum, r) => sum + r.pct, 0);
    expect(pctSum).toBeCloseTo(100, 0);

    // Each mechanism should have valid fields
    result.ranked.forEach((r) => {
      expect(r.key).toMatch(/^M_/);
      expect(r.pct).toBeGreaterThanOrEqual(0);
      expect(r.total).toBeGreaterThanOrEqual(0);
    });
  });

  it('computes correctly with score overrides', () => {
    const attributes = [{ classKey: 'DEMO', attrKey: 'age_25_34' }];
    const overrides = { 'DEMO.age_25_34.M_GEO.P': 5, 'DEMO.age_25_34.M_GEO.S': 5 };

    const result = computeBlueprint(attributes, overrides);
    const geoRow = result.rows[0].scores.M_GEO;

    expect(geoRow.P).toBe(5);
    expect(geoRow.S).toBe(5);
    expect(geoRow.W).toBe(25);
  });

  it('handles all 5 example audiences', () => {
    for (const [key, audience] of Object.entries(EXAMPLE_AUDIENCES)) {
      const result = computeBlueprint(audience.attributes);
      expect(result.rows.length).toBe(audience.attributes.length);
      expect(result.grandTotal).toBeGreaterThan(0);
    }
  });
});

describe('getMechanismRecommendation', () => {
  it('returns high recommendation for >= 15%', () => {
    const rec = getMechanismRecommendation('M_GEO', 18);
    expect(rec).toContain('Strong');
  });

  it('returns mid recommendation for 8-14%', () => {
    const rec = getMechanismRecommendation('M_GEO', 10);
    expect(rec).toContain('Moderate');
  });

  it('returns low recommendation for < 8%', () => {
    const rec = getMechanismRecommendation('M_GEO', 5);
    expect(rec).toContain('Weak');
  });
});

describe('buildAtlasLink', () => {
  it('builds link from geo attributes', () => {
    const attrs = [{ classKey: 'GEO', attrKey: 'london' }];
    const link = buildAtlasLink(attrs);
    expect(link).toContain('atlas-segments.html');
    expect(link).toContain('geo=london');
  });

  it('returns null for no matching attributes', () => {
    const attrs = [{ classKey: 'BEHAV', attrKey: 'gaming' }];
    expect(buildAtlasLink(attrs)).toBeNull();
  });
});

describe('buildGraphContextSummary', () => {
  it('returns "No" when no blueprint', () => {
    expect(buildGraphContextSummary({})).toContain('No');
  });

  it('builds summary with active blueprint', () => {
    const { attributes } = EXAMPLE_AUDIENCES.young_affluent_skiers;
    const blueprint = computeBlueprint(attributes);
    const summary = buildGraphContextSummary({
      selectedAttributes: attributes,
      currentBlueprint: blueprint,
    });

    expect(summary).toContain('Active blueprint: Yes');
    expect(summary).toContain('## Mechanism Allocation');
    expect(summary).toContain('## Selected Attributes');
    expect(summary).toContain('## Channel Affinities');
    expect(summary).toContain('## Keyword Clusters');
    expect(summary).toContain('## Platform Targeting');
    expect(summary).toContain('## Daypart Peaks');
  });
});
