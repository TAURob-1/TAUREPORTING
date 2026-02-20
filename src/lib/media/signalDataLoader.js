function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

async function fetchMediaResource(resource) {
  try {
    const response = await fetch(`/api/media/${resource}`);
    if (!response.ok) return [];
    const data = await response.json();
    return safeArray(data);
  } catch (error) {
    console.warn(`[signalDataLoader] Failed to load ${resource}:`, error);
    return [];
  }
}

function normalizeMediaData(records = [], type) {
  return safeArray(records).map((entry, index) => ({
    id: entry.id || `${type}_${index + 1}`,
    name: entry.name || entry.channel || entry.station || `${type} item ${index + 1}`,
    type,
    genre: entry.genre || entry.category || 'General',
    reach: entry.reach || entry.monthlyReach || null,
    source: entry.source || 'Signal',
    raw: entry,
  }));
}

export async function loadSignalMediaData() {
  const [channels, ctv, radio] = await Promise.all([
    fetchMediaResource('channels'),
    fetchMediaResource('ctv'),
    fetchMediaResource('radio'),
  ]);

  const normalized = {
    channels: normalizeMediaData(channels, 'tv'),
    ctv: normalizeMediaData(ctv, 'ctv'),
    radio: normalizeMediaData(radio, 'radio'),
  };

  const hasSignalData = normalized.channels.length > 0 || normalized.ctv.length > 0 || normalized.radio.length > 0;

  return {
    ...normalized,
    hasSignalData,
    source: hasSignalData ? 'Signal Media API' : 'Static fallback',
  };
}
