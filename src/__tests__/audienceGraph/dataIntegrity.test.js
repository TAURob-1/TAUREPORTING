import { describe, it, expect } from 'vitest';
import { ATTRIBUTE_CLASSES, MECHANISM_KEYS } from '../../data/audienceGraph/scores.js';
import { CHANNEL_AFFINITY, CHANNEL_PLATFORM_KEYS } from '../../data/audienceGraph/channelAffinity.js';
import { DAYPART_PROFILES } from '../../data/audienceGraph/daypartProfiles.js';
import { KEYWORD_CLUSTERS, KEYWORD_CLASS_DEFAULTS } from '../../data/audienceGraph/keywordClusters.js';

describe('Cross-data integrity', () => {
  const allAttributeKeys = [];
  for (const [classKey, cls] of Object.entries(ATTRIBUTE_CLASSES)) {
    for (const attrKey of Object.keys(cls.attributes)) {
      allAttributeKeys.push(`${classKey}.${attrKey}`);
    }
  }

  it('every attribute has CHANNEL_AFFINITY entry', () => {
    const missing = allAttributeKeys.filter((key) => !CHANNEL_AFFINITY[key]);
    expect(missing).toEqual([]);
  });

  it('every attribute has DAYPART_PROFILES entry', () => {
    const missing = allAttributeKeys.filter((key) => !DAYPART_PROFILES[key]);
    expect(missing).toEqual([]);
  });

  it('DAYPART_PROFILES entries have exactly 24 hourly values', () => {
    for (const key of allAttributeKeys) {
      const profile = DAYPART_PROFILES[key];
      expect(profile.hourly).toHaveLength(24);
    }
  });

  it('CHANNEL_AFFINITY entries have all 6 platforms', () => {
    for (const key of allAttributeKeys) {
      const affinity = CHANNEL_AFFINITY[key];
      for (const pk of CHANNEL_PLATFORM_KEYS) {
        expect(typeof affinity[pk]).toBe('number');
      }
    }
  });

  it('CHANNEL_AFFINITY scores are all 0-100', () => {
    for (const key of allAttributeKeys) {
      const affinity = CHANNEL_AFFINITY[key];
      for (const [pk, score] of Object.entries(affinity)) {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      }
    }
  });

  it('all attributes have mechanism scores (direct or default)', () => {
    for (const [classKey, cls] of Object.entries(ATTRIBUTE_CLASSES)) {
      for (const [attrKey, attr] of Object.entries(cls.attributes)) {
        for (const mk of MECHANISM_KEYS) {
          // Either attribute-level or class-level defaults
          const hasAttr = attr.scores?.[mk] !== undefined;
          const hasDefault = cls.defaults?.[mk] !== undefined;
          expect(hasAttr || hasDefault).toBe(true);
        }
      }
    }
  });

  it('keyword data has entries or class defaults for every class', () => {
    const classes = Object.keys(ATTRIBUTE_CLASSES);
    for (const classKey of classes) {
      const hasSpecific = Object.keys(KEYWORD_CLUSTERS).some((k) => k.startsWith(classKey + '.'));
      const hasDefault = KEYWORD_CLASS_DEFAULTS[classKey] !== undefined;
      expect(hasSpecific || hasDefault).toBe(true);
    }
  });
});
