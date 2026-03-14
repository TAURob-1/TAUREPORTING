import { describe, it, expect } from 'vitest';
import { getCompositeHourly, getCompositeDow } from '../../lib/audienceGraph/computeBlueprint.js';
import { DAYPART_PROFILES } from '../../data/audienceGraph/daypartProfiles.js';
import { EXAMPLE_AUDIENCES } from '../../data/audienceGraph/scores.js';

describe('getCompositeHourly', () => {
  it('returns 24 values defaulting to 100 for no attributes', () => {
    const result = getCompositeHourly([]);
    expect(result).toHaveLength(24);
    result.forEach((v) => expect(v).toBe(100));
  });

  it('returns 24 values for young_affluent_skiers', () => {
    const { attributes } = EXAMPLE_AUDIENCES.young_affluent_skiers;
    const result = getCompositeHourly(attributes);

    expect(result).toHaveLength(24);
    result.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(200);
    });
  });

  it('young audience shows evening peak', () => {
    const attributes = [
      { classKey: 'DEMO', attrKey: 'age_18_24' },
      { classKey: 'DEMO', attrKey: 'age_25_34' },
    ];
    const result = getCompositeHourly(attributes);

    // Hours 20-22 (primetime) should be higher than hours 3-5 (overnight)
    const primetime = (result[20] + result[21] + result[22]) / 3;
    const overnight = (result[3] + result[4] + result[5]) / 3;
    expect(primetime).toBeGreaterThan(overnight);
  });

  it('commute window shows morning peak', () => {
    const attributes = [{ classKey: 'CONTEXT', attrKey: 'commute_window' }];
    const result = getCompositeHourly(attributes);

    // Hours 7-9 (morning commute) should be above average
    const morningCommute = (result[7] + result[8] + result[9]) / 3;
    expect(morningCommute).toBeGreaterThan(100);
  });
});

describe('getCompositeDow', () => {
  it('returns 7 values defaulting to 100 for no attributes', () => {
    const result = getCompositeDow([]);
    expect(result).toHaveLength(7);
    result.forEach((v) => expect(v).toBe(100));
  });

  it('returns 7 values for any template', () => {
    for (const audience of Object.values(EXAMPLE_AUDIENCES)) {
      const result = getCompositeDow(audience.attributes);
      expect(result).toHaveLength(7);
    }
  });
});

describe('DAYPART_PROFILES data integrity', () => {
  it('every profile has exactly 24 hourly values', () => {
    for (const [key, profile] of Object.entries(DAYPART_PROFILES)) {
      expect(profile.hourly).toHaveLength(24);
    }
  });

  it('hourly values are in 0-200 range', () => {
    for (const [key, profile] of Object.entries(DAYPART_PROFILES)) {
      for (const value of profile.hourly) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(200);
      }
    }
  });

  it('hourly averages are near 100', () => {
    for (const [key, profile] of Object.entries(DAYPART_PROFILES)) {
      const avg = profile.hourly.reduce((sum, v) => sum + v, 0) / 24;
      // Average should be roughly near 100 (between 50 and 130 is reasonable)
      expect(avg).toBeGreaterThanOrEqual(50);
      expect(avg).toBeLessThanOrEqual(130);
    }
  });

  it('every profile has peak array', () => {
    for (const [key, profile] of Object.entries(DAYPART_PROFILES)) {
      expect(Array.isArray(profile.peak)).toBe(true);
      expect(profile.peak.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('every profile has 7 dow values', () => {
    for (const [key, profile] of Object.entries(DAYPART_PROFILES)) {
      expect(profile.dow).toHaveLength(7);
    }
  });
});
