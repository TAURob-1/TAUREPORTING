import { describe, it, expect } from 'vitest';
import { getWeightedAffinities } from '../../lib/audienceGraph/computeBlueprint.js';
import { CHANNEL_AFFINITY, CHANNEL_PLATFORM_KEYS } from '../../data/audienceGraph/channelAffinity.js';
import { EXAMPLE_AUDIENCES } from '../../data/audienceGraph/scores.js';

describe('getWeightedAffinities', () => {
  it('returns empty for no attributes', () => {
    expect(getWeightedAffinities([])).toHaveLength(0);
  });

  it('returns 6 platforms for young_affluent_skiers', () => {
    const { attributes } = EXAMPLE_AUDIENCES.young_affluent_skiers;
    const affinities = getWeightedAffinities(attributes);

    expect(affinities).toHaveLength(6);
    // YouTube CTV should be highest for young digital audience
    expect(affinities[0].platformKey).toBe('youtube_ctv');
  });

  it('returns scores in 0-100 range', () => {
    const { attributes } = EXAMPLE_AUDIENCES.young_affluent_skiers;
    const affinities = getWeightedAffinities(attributes);

    affinities.forEach((a) => {
      expect(a.affinity).toBeGreaterThanOrEqual(0);
      expect(a.affinity).toBeLessThanOrEqual(100);
    });
  });

  it('is sorted by affinity descending', () => {
    const { attributes } = EXAMPLE_AUDIENCES.business_travellers;
    const affinities = getWeightedAffinities(attributes);

    for (let i = 1; i < affinities.length; i++) {
      expect(affinities[i - 1].affinity).toBeGreaterThanOrEqual(affinities[i].affinity);
    }
  });

  it('includes platform metadata', () => {
    const { attributes } = EXAMPLE_AUDIENCES.young_affluent_skiers;
    const affinities = getWeightedAffinities(attributes);

    affinities.forEach((a) => {
      expect(a.label).toBeTruthy();
      expect(a.type).toMatch(/^(CTV|BVOD|Linear)$/);
      expect(a.owner).toBeTruthy();
      expect(a.cpm).toBeGreaterThan(0);
      expect(a.reach).toBeGreaterThan(0);
    });
  });
});

describe('CHANNEL_AFFINITY data integrity', () => {
  it('all scores are 0-100', () => {
    for (const [key, scores] of Object.entries(CHANNEL_AFFINITY)) {
      for (const [platform, value] of Object.entries(scores)) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      }
    }
  });

  it('every entry has all 6 platforms', () => {
    for (const [key, scores] of Object.entries(CHANNEL_AFFINITY)) {
      for (const pk of CHANNEL_PLATFORM_KEYS) {
        expect(scores[pk]).toBeDefined();
      }
    }
  });
});
