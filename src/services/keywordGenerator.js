/**
 * Keyword Generator Service
 *
 * Calls /api/generate-keywords to dynamically generate keyword clusters
 * for audience attributes that lack static data. Results are cached in memory.
 */

const cache = new Map();

function cacheKey(attributes) {
  return attributes
    .map((a) => `${a.classKey}.${a.attrKey}`)
    .sort()
    .join('|');
}

/**
 * Generate keyword clusters for the given attributes via Claude API.
 * Returns array of { classKey, attrKey, label, clusters } — same shape as gatherKeywords().results
 */
export async function generateKeywords(selectedAttributes) {
  if (!selectedAttributes || selectedAttributes.length === 0) return [];

  const key = cacheKey(selectedAttributes);
  if (cache.has(key)) return cache.get(key);

  const response = await fetch('/api/generate-keywords', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selectedAttributes }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const keywordGroups = data.keywordGroups || [];

  cache.set(key, keywordGroups);
  return keywordGroups;
}
