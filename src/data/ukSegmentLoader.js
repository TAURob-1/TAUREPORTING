import atlasSegments from './segments/atlasImprovedSegments.json';

/**
 * Load and transform Atlas improved segments for use in audience targeting
 */
export function getUKSegments() {
  return Object.entries(atlasSegments.segments).map(([key, segment]) => ({
    id: key,
    name: segment.name,
    description: segment.description,
    postcodes: segment.postcodes,
    areas: segment.areas,
    demographics: segment.demographics,
    indicators: segment.indicators,
  }));
}

/**
 * Get a single segment by ID
 */
export function getSegmentById(id) {
  return atlasSegments.segments[id] || null;
}

/**
 * Get segment names for dropdown
 */
export function getSegmentOptions() {
  return Object.values(atlasSegments.segments).map((seg) => ({
    value: seg.name,
    label: seg.name,
  }));
}

/**
 * Get all postcodes that belong to a specific segment
 */
export function getSegmentPostcodes(segmentId) {
  const segment = atlasSegments.segments[segmentId];
  return segment ? segment.postcodes : [];
}

export default {
  getUKSegments,
  getSegmentById,
  getSegmentOptions,
  getSegmentPostcodes,
};
