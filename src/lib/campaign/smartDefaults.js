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

export function getAudienceMediaRecommendations(audienceName = '') {
  const text = String(audienceName || '').toLowerCase();

  if (/affluent|wealth|high net worth|luxury|premium/.test(text)) {
    return {
      recommendedPlatforms: ['Sky', 'Amazon Prime Video', 'Facebook', 'Classic FM'],
      contentFocus: ['Drama', 'News', 'Premium Sports'],
      avoid: ['Youth-skewed short-form social', 'Mass daytime reality'],
      estimatedCombinedReach: '35M UK adults',
    };
  }

  if (/young|gen z|student|18-24|16-24/.test(text)) {
    return {
      recommendedPlatforms: ['TikTok', 'Instagram', 'YouTube', 'Spotify'],
      contentFocus: ['Short-form video', 'Music', 'Creator-led entertainment'],
      avoid: ['Daytime linear TV', 'Long-form legacy radio'],
      estimatedCombinedReach: '28M UK adults',
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
