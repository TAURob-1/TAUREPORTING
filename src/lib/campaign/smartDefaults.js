import { estimateAudienceSize } from '../data/audienceSizes';

export const UK_AUDIENCE_THRESHOLD = 500000;

function formatSize(size) {
  if (!size || Number.isNaN(size)) return 'unknown size';
  if (size >= 1000000) return `${(size / 1000000).toFixed(1)}M`;
  if (size >= 1000) return `${Math.round(size / 1000)}k`;
  return String(size);
}

function sanitizeAudienceText(value, fallback = 'UK Adults 18+') {
  const text = String(value || '').trim();
  return text || fallback;
}

export function segmentAudience(primaryAudienceInput, countryCode = 'UK') {
  const rawInput = sanitizeAudienceText(primaryAudienceInput, countryCode === 'UK' ? 'UK Adults 18+' : 'Adults 18-49');
  const estimate = estimateAudienceSize(rawInput, countryCode);
  const sizeEstimate = estimate.size;

  if (countryCode === 'UK' && Number.isFinite(sizeEstimate) && sizeEstimate < UK_AUDIENCE_THRESHOLD) {
    const primary = sanitizeAudienceText(estimate.broadenedPrimary || 'Affluent UK Adults');
    return {
      inputAudience: rawInput,
      primaryAudience: primary,
      secondaryAudience: rawInput,
      sizeEstimate,
      category: estimate.category,
      threshold: UK_AUDIENCE_THRESHOLD,
      isNiche: true,
      reasoning: `Audience size estimated at ${formatSize(sizeEstimate)} UK adults. Using broader primary for geo targeting with secondary refinement.` ,
      source: estimate.source,
      matchedLabel: estimate.matchedLabel,
    };
  }

  return {
    inputAudience: rawInput,
    primaryAudience: rawInput,
    secondaryAudience: null,
    sizeEstimate,
    category: estimate.category,
    threshold: countryCode === 'UK' ? UK_AUDIENCE_THRESHOLD : null,
    isNiche: false,
    reasoning: Number.isFinite(sizeEstimate)
      ? `Audience size estimated at ${formatSize(sizeEstimate)}. Suitable for direct geo targeting.`
      : 'Audience size estimate unavailable. Using direct primary targeting.',
    source: estimate.source,
    matchedLabel: estimate.matchedLabel,
  };
}

function normalizeMediaMixPercentages(mediaMix = {}) {
  const entries = Object.entries(mediaMix).filter(([, value]) => Number(value) > 0);
  const total = entries.reduce((sum, [, value]) => sum + Number(value), 0);
  if (entries.length === 0 || total <= 0) return null;

  return entries.reduce((acc, [channel, value]) => {
    acc[channel] = Math.round((Number(value) / total) * 100);
    return acc;
  }, {});
}

export function buildCampaignInheritance({
  aiBudget,
  aiMediaBudgets,
  fallbackBudget,
}) {
  const budget = Number(aiBudget) > 0 ? Number(aiBudget) : Number(fallbackBudget) > 0 ? Number(fallbackBudget) : 0;
  const mediaMix = normalizeMediaMixPercentages(aiMediaBudgets);

  return {
    campaignBudget: budget,
    mediaBudgets: aiMediaBudgets || {},
    mediaMix,
    hasAiBudget: Number(aiBudget) > 0,
    hasAiMediaMix: !!mediaMix,
  };
}

const CATEGORY_PROVIDER_MAP = {
  UK: {
    digital: ['youtube_ctv_uk', 'itvx', 'c4_streaming'],
    tv: ['itv_linear', 'channel4_linear', 'sky_linear'],
    audio: ['youtube_ctv_uk'],
    social: ['youtube_ctv_uk'],
    search: ['youtube_ctv_uk'],
  },
  US: {
    digital: ['youtube_ctv', 'roku', 'tiktok_ctv', 'tubi'],
    tv: ['hulu', 'peacock', 'paramount_plus', 'netflix', 'max_hbo'],
    audio: ['youtube_ctv'],
    social: ['tiktok_ctv', 'youtube_ctv'],
    search: ['youtube_ctv'],
  },
};

function normalizeChannelKey(key) {
  return String(key || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .trim();
}

function mapChannelToCategory(key) {
  const normalized = normalizeChannelKey(key);
  if (!normalized) return null;
  if (normalized.includes('digit')) return 'digital';
  if (normalized.includes('tv') || normalized.includes('linear') || normalized.includes('broadcast')) return 'tv';
  if (normalized.includes('audio') || normalized.includes('radio')) return 'audio';
  if (normalized.includes('social') || normalized.includes('meta') || normalized.includes('tiktok')) return 'social';
  if (normalized.includes('search') || normalized.includes('google')) return 'search';
  return null;
}

function distributeEvenly(amount, providerIds = []) {
  if (!providerIds.length || amount <= 0) return {};
  const perProvider = Math.floor(amount / providerIds.length);
  const remainder = amount - perProvider * providerIds.length;
  return providerIds.reduce((acc, id, index) => {
    acc[id] = perProvider + (index === 0 ? remainder : 0);
    return acc;
  }, {});
}

export function mapMediaMixToProviderBudgets(mediaMix, campaignBudget, countryCode = 'US') {
  const totalBudget = Number(campaignBudget) || 0;
  if (totalBudget <= 0 || !mediaMix || typeof mediaMix !== 'object') return {};

  const categoryMap = CATEGORY_PROVIDER_MAP[countryCode] || CATEGORY_PROVIDER_MAP.US;
  const allocations = {};
  const entries = Object.entries(mediaMix).filter(([, pct]) => Number(pct) > 0);

  entries.forEach(([channel, pct]) => {
    const category = mapChannelToCategory(channel);
    const providerIds = (category && categoryMap[category]) || categoryMap.digital || [];
    const amount = Math.round((Number(pct) / 100) * totalBudget);
    const split = distributeEvenly(amount, providerIds);
    Object.entries(split).forEach(([providerId, budget]) => {
      allocations[providerId] = (allocations[providerId] || 0) + budget;
    });
  });

  return allocations;
}

function parseAgeRange(text) {
  const rangeMatch = text.match(/(\d{1,2})\s*-\s*(\d{1,2})/);
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1], 10), max: parseInt(rangeMatch[2], 10) };
  }
  const plusMatch = text.match(/(\d{1,2})\s*\+/);
  if (plusMatch) {
    return { min: parseInt(plusMatch[1], 10), max: 99 };
  }
  return null;
}

export function getAudienceMediaRecommendations(audienceName = '') {
  const text = String(audienceName || '').toLowerCase();
  const ageRange = parseAgeRange(text);

  if (/affluent|wealth|high net worth|luxury|premium/.test(text)) {
    return {
      recommendedPlatforms: ['Sky', 'Amazon Prime Video', 'Facebook', 'Classic FM'],
      contentFocus: ['Drama', 'News', 'Premium Sports'],
      avoid: ['Youth-skewed short-form social', 'Mass daytime reality'],
      estimatedCombinedReach: '35M UK adults',
    };
  }

  // Detect young/youth audiences including age ranges where max <= 40 or min < 30
  const isYouthAudience = /young|gen z|student|18-24|16-24/.test(text)
    || (ageRange && (ageRange.max <= 40 || ageRange.min < 30));

  if (isYouthAudience) {
    // If age range spans across (e.g. 19-36, 18-35), include both social + traditional
    const isWideRange = ageRange && ageRange.max > 30;
    return {
      recommendedPlatforms: isWideRange
        ? ['TikTok', 'YouTube', 'Instagram', 'Spotify', 'ITVX', 'Meta']
        : ['TikTok', 'Instagram', 'YouTube', 'Spotify'],
      contentFocus: isWideRange
        ? ['Short-form video', 'Music', 'Creator-led entertainment', 'Prime-time CTV', 'Podcasts']
        : ['Short-form video', 'Music', 'Creator-led entertainment'],
      avoid: isWideRange
        ? ['Daytime linear TV', 'Legacy print media']
        : ['Daytime linear TV', 'Long-form legacy radio'],
      estimatedCombinedReach: isWideRange ? '32M UK adults' : '28M UK adults',
    };
  }

  if (/parents|family|kids|children/.test(text)) {
    return {
      recommendedPlatforms: ['YouTube', 'ITVX', 'Channel 4', 'Meta'],
      contentFocus: ['Family entertainment', 'Drama', 'Parenting content'],
      avoid: ['Late-night youth content'],
      estimatedCombinedReach: '30M UK adults',
    };
  }

  return {
    recommendedPlatforms: ['Google/YouTube', 'Meta', 'ITV', 'Sky'],
    contentFocus: ['Broad entertainment', 'News', 'Prime-time video'],
    avoid: ['Over-specialized niche channels without scale'],
    estimatedCombinedReach: '32M UK adults',
  };
}
