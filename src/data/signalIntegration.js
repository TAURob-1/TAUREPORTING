import { formatSignalForPlanner } from '../services/signalDataLoader';

// Signal data is symlinked: /home/r2/TAU-Reporting/signal-data -> /home/r2/Signal/companies
const SIGNAL_ROOT = '/signal-data';

const SIGNAL_FILES = {
  config: import.meta.glob('/signal-data/*/config.json', { import: 'default' }),
  status: import.meta.glob('/signal-data/*/status.json', { import: 'default' }),
  summaryRoot: import.meta.glob('/signal-data/*/summary.json', { import: 'default' }),
  summaryNested: import.meta.glob('/signal-data/*/summary/summary.json', { import: 'default' }),
  traffic: import.meta.glob('/signal-data/*/summary/traffic_intelligence.json', { import: 'default' }),
  seo: import.meta.glob('/signal-data/*/summary/seo_intelligence.json', { import: 'default' }),
  aiVisibility: import.meta.glob('/signal-data/*/summary/ai_visibility.json', { import: 'default' }),
  insights: import.meta.glob('/signal-data/*/summary/insights_and_actions.json', { import: 'default' }),
  trends: import.meta.glob('/signal-data/*/summary/trends_intelligence.json', { import: 'default' }),
  spend: import.meta.glob('/signal-data/*/data/spend/spend_estimation.json', { import: 'default' }),
  strategicBrief: import.meta.glob('/signal-data/*/strategic_brief/*.txt', { query: '?raw', import: 'default' }),
  summaryMd: import.meta.glob('/signal-data/*/summary/strategic_brief.md', { query: '?raw', import: 'default' }),
};

const ADVERTISER_SLUG_HINTS = {
  demo: ['tombola-co-uk', 'tombola-uk', 'tombola', 'midnite-com', 'midnite-uk', 'midnite'],
  tombola: ['tombola-co-uk', 'tombola-uk', 'tombola'],
  experian: ['experian-uk', 'experian-us', 'experian'],
  flutter: ['flutter', 'flutter-uk', 'betfair', 'paddypower'],
};

const SIGNAL_DATA_CACHE = new Map();
const SIGNAL_SLUGS = Array.from(new Set(
  [
    ...Object.keys(SIGNAL_FILES.traffic),
    ...Object.keys(SIGNAL_FILES.config),
    ...Object.keys(SIGNAL_FILES.seo),
    ...Object.keys(SIGNAL_FILES.insights),
    ...Object.keys(SIGNAL_FILES.strategicBrief),
  ]
    .map((path) => {
      const match = path.match(/\/signal-data\/([^/]+)\//);
      return match ? match[1] : null;
    })
    .filter(Boolean)
));

function monthLabel(isoDate) {
  const [year, month] = isoDate.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString('en-GB', { month: 'short' });
}

function num(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function buildCompanyPath(slug, relative) {
  return `${SIGNAL_ROOT}/${slug}/${relative}`;
}

async function loadJson(globMap, slug, relativePath) {
  const key = buildCompanyPath(slug, relativePath);
  const loader = globMap[key];
  if (!loader) return null;
  try {
    return await loader();
  } catch (error) {
    return null;
  }
}

function buildSlugCandidates(advertiserId, countryCode, advertiser = {}) {
  const id = slugify(advertiserId);
  const nameSlug = slugify(advertiser.name);
  const contextSlug = slugify(advertiser.slug);
  const countrySuffix = countryCode === 'UK' ? 'uk' : 'us';

  const hints = ADVERTISER_SLUG_HINTS[id] || [];
  const candidates = [
    ...hints,
    contextSlug,
    nameSlug,
    id,
    `${contextSlug}-${countrySuffix}`,
    `${nameSlug}-${countrySuffix}`,
    `${id}-${countrySuffix}`,
  ].filter(Boolean);

  return Array.from(new Set(candidates));
}

function chooseSignalSlug(advertiserId, countryCode, advertiser = {}) {
  const candidates = buildSlugCandidates(advertiserId, countryCode, advertiser);
  const countrySuffix = countryCode === 'UK' ? ['-co-uk', '-uk'] : ['-us'];

  for (const candidate of candidates) {
    const countryExact = SIGNAL_SLUGS.find((slug) => slug === candidate && countrySuffix.some((suffix) => slug.endsWith(suffix)));
    if (countryExact) return countryExact;
  }

  for (const candidate of candidates) {
    const countrySpecific = SIGNAL_SLUGS.find((slug) =>
      slug.startsWith(`${candidate}-`) && countrySuffix.some((suffix) => slug.endsWith(suffix))
    );
    if (countrySpecific) return countrySpecific;
  }

  const exact = candidates.find((candidate) => SIGNAL_SLUGS.includes(candidate));
  if (exact) return exact;

  for (const candidate of candidates) {
    const prefix = SIGNAL_SLUGS.find((slug) => slug.startsWith(candidate));
    if (prefix) return prefix;
  }

  if (countryCode === 'UK') {
    return SIGNAL_SLUGS.find((slug) => slug.endsWith('co-uk') || slug.endsWith('-uk')) || 'tombola-co-uk';
  }
  return SIGNAL_SLUGS.find((slug) => slug.endsWith('-us')) || 'tombola-co-uk';
}

function formatDomainName(domain) {
  const cleaned = String(domain || '')
    .replace(/^www\./, '')
    .replace('.com', '')
    .replace('.co.uk', '');
  return cleaned
    .split(/[.-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function toTrend(estimatedMonthlyVisits = {}) {
  return Object.entries(estimatedMonthlyVisits)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, visits]) => ({
      month: monthLabel(date),
      visits: num(visits),
    }));
}

function buildShareRows(trafficComparison, advertiserDomain) {
  const total = trafficComparison.reduce((sum, row) => sum + num(row.visits), 0);
  return trafficComparison.map((row) => {
    const visits = num(row.visits);
    return {
      name: row.domain === advertiserDomain ? 'Advertiser' : formatDomainName(row.domain),
      domain: row.domain,
      visits,
      share: total > 0 ? Number(((visits / total) * 100).toFixed(1)) : 0,
      bounceRate: num(row.bounce_rate),
      pagesPerVisit: num(row.pages_per_visit || row.page_per_visit),
      timeOnSite: num(row.time_on_site),
      isAdvertiser: row.domain === advertiserDomain,
    };
  });
}

function flattenKeywordGaps(keywordGaps = {}) {
  const rows = [];
  Object.entries(keywordGaps).forEach(([competitorDomain, payload]) => {
    const keywords = Array.isArray(payload?.all_gap_keywords) ? payload.all_gap_keywords : [];
    keywords.forEach((entry) => {
      rows.push({
        keyword: entry.keyword,
        volume: num(entry.search_volume, null),
        competitor: formatDomainName(competitorDomain),
      });
    });
  });
  return rows;
}

function extractPlanningPriorities(insights) {
  if (!insights) return [];
  const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  const collected = [];
  const strategicAreas = Object.values(insights.strategic_areas || {});

  strategicAreas.forEach((area) => {
    (area.recommendations || []).forEach((entry) => {
      collected.push({
        priority: String(entry.priority || '').toUpperCase(),
        action: String(entry.action || '').trim(),
      });
    });
  });

  const ordered = collected
    .filter((entry) => entry.action)
    .sort((a, b) => (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99))
    .slice(0, 3)
    .map((entry) => `${entry.priority}: ${entry.action}`);

  if (ordered.length > 0) return ordered;
  return (insights.next_steps || []).slice(0, 3);
}

async function loadRealSignalData(slug, countryCode = 'UK') {
  const cacheKey = `${slug}:${countryCode}`;
  if (SIGNAL_DATA_CACHE.has(cacheKey)) {
    return SIGNAL_DATA_CACHE.get(cacheKey);
  }

  console.log('[SignalIntegration] Loading data for slug:', slug, 'Known slugs:', SIGNAL_SLUGS);
  console.log('[SignalIntegration] Glob keys (traffic):', Object.keys(SIGNAL_FILES.traffic));
  console.log('[SignalIntegration] Glob keys (config):', Object.keys(SIGNAL_FILES.config));

  const [
    config,
    status,
    summaryRoot,
    summaryNested,
    traffic,
    seo,
    aiVisibility,
    insights,
    trends,
    spend,
  ] = await Promise.all([
    loadJson(SIGNAL_FILES.config, slug, 'config.json'),
    loadJson(SIGNAL_FILES.status, slug, 'status.json'),
    loadJson(SIGNAL_FILES.summaryRoot, slug, 'summary.json'),
    loadJson(SIGNAL_FILES.summaryNested, slug, 'summary/summary.json'),
    loadJson(SIGNAL_FILES.traffic, slug, 'summary/traffic_intelligence.json'),
    loadJson(SIGNAL_FILES.seo, slug, 'summary/seo_intelligence.json'),
    loadJson(SIGNAL_FILES.aiVisibility, slug, 'summary/ai_visibility.json'),
    loadJson(SIGNAL_FILES.insights, slug, 'summary/insights_and_actions.json'),
    loadJson(SIGNAL_FILES.trends, slug, 'summary/trends_intelligence.json'),
    loadJson(SIGNAL_FILES.spend, slug, 'data/spend/spend_estimation.json'),
  ]);

  console.log('[SignalIntegration] Loaded:', {
    config: !!config, traffic: !!traffic, seo: !!seo,
    aiVisibility: !!aiVisibility, insights: !!insights, spend: !!spend,
  });
  if (traffic) {
    console.log('[SignalIntegration] Traffic keys:', Object.keys(traffic));
    console.log('[SignalIntegration] Comparison table rows:', traffic?.competitor_comparison_table?.length);
    console.log('[SignalIntegration] Estimated monthly visits:', traffic?.main_company?.raw_metrics?.estimated_monthly_visits);
  }

  const summary = summaryRoot || summaryNested || {};
  const advertiserDomain = config?.domain || traffic?.main_company?.domain || `${slug}.com`;
  const estimatedMonthlyVisits = traffic?.main_company?.raw_metrics?.estimated_monthly_visits
    || traffic?.main_company?.estimated_monthly_visits
    || {};
  const comparisonTable = Array.isArray(traffic?.competitor_comparison_table)
    ? traffic.competitor_comparison_table
    : [];
  const competitorDetails = traffic?.competitor_details || {};

  const trafficComparison = comparisonTable
    .map((entry) => {
      const detail = competitorDetails?.[entry.domain]?.engagement || {};
      const rawVisits = entry.monthly_visits || entry.visits || detail.visits;
      return {
        domain: entry.domain,
        visits: num(rawVisits),
        bounce_rate: num(entry.bounce_rate || detail.bounce_rate),
        pages_per_visit: num(entry.pages_per_visit || detail.page_per_visit),
        time_on_site: num(detail.time_on_site || detail.avg_visit_duration || entry.avg_duration),
      };
    })
    .filter((entry) => entry.domain && entry.visits > 0);

  const gapGroups = seo?.keyword_gaps || {};
  const opportunities = flattenKeywordGaps(gapGroups)
    .sort((a, b) => num(b.volume) - num(a.volume))
    .slice(0, 8);

  const highVolumeGapCount = Object.values(gapGroups).reduce(
    (sum, entry) => sum + num(entry?.total_opportunities),
    0
  );

  const aiScores = aiVisibility?.competitor_comparison?.scores || {};
  const aiRankings = Array.isArray(aiVisibility?.competitor_comparison?.rankings)
    ? aiVisibility.competitor_comparison.rankings
    : [];
  const companyKey = config?.company_name || summary?.company_name || slug;
  const aiScore = num(aiScores?.[companyKey]?.overall, num(aiVisibility?.overall_score, 0));

  const spendRange = spend?.estimated_annual_spend?.total_range || {};
  const sourceDate = (
    traffic?.generated_at ||
    status?.completed_at ||
    config?.created_at ||
    summary?.generated_at ||
    new Date().toISOString()
  ).slice(0, 10);

  const swot = insights?.swot_analysis || insights?.swot || {};
  const strengths = swot.strengths || [];
  const opportunitiesNotes = swot.opportunities || [];
  const trendInterpretation = trends?.brand_trend_summary?.interpretation;
  const trendDirection = trends?.brand_trend_summary?.['12_month_trend'];

  const dataset = {
    source: {
      slug: config?.slug || slug,
      company: config?.company_name || summary?.company_name || formatDomainName(advertiserDomain),
      domain: advertiserDomain,
      country: config?.country || summary?.country || (countryCode === 'US' ? 'US' : 'GB'),
      updatedAt: sourceDate,
    },
    trafficMain: {
      estimated_monthly_visits: estimatedMonthlyVisits,
    },
    trafficComparison,
    seoSummary: {
      trackedKeywords: num(seo?.summary?.total_keywords),
      estimatedRankingKeywords: num(seo?.summary?.top_10_generic),
      highVolumeGapCount,
      topKeywordVolume: num(opportunities[0]?.volume),
      opportunities,
    },
    aiVisibility: {
      score: aiScore,
      rankings: aiRankings.map((entry) => ({
        name: entry.name,
        score: num(entry.score),
        rank: num(entry.rank),
      })),
    },
    spend: {
      annualMin: num(spendRange.min, null),
      annualMax: num(spendRange.max, null),
      currency: countryCode === 'US' ? 'USD' : (spend?.currency || 'GBP'),
    },
    insights: [
      strengths[0]?.point,
      strengths[1]?.point,
      opportunitiesNotes[0]?.point,
      trendInterpretation && trendDirection
        ? `${trendInterpretation} (${trendDirection} over the last 12 months).`
        : trendInterpretation,
    ].filter(Boolean).slice(0, 4),
    advisorBrief: {
      planningPriorities: extractPlanningPriorities(insights),
    },
  };

  SIGNAL_DATA_CACHE.set(cacheKey, dataset);
  return dataset;
}

function computeChangePercent(trend) {
  if (trend.length < 2) return 0;
  const current = trend[trend.length - 1].visits;
  const previous = trend[trend.length - 2].visits;
  if (!previous) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

async function resolveDataset(advertiserId = 'demo', countryCode = 'US', advertiser = {}) {
  const normalizedCountry = countryCode === 'UK' ? 'UK' : 'US';
  const slug = chooseSignalSlug(advertiserId, normalizedCountry, advertiser);
  return loadRealSignalData(slug, normalizedCountry);
}

export async function getSignalDataset(advertiserId = 'demo', countryCode = 'US', advertiser = {}) {
  const dataset = await resolveDataset(advertiserId, countryCode, advertiser);
  const trend = toTrend(dataset.trafficMain.estimated_monthly_visits);
  const marketShare = buildShareRows(dataset.trafficComparison, dataset.source.domain);
  const advertiserRow = marketShare.find((row) => row.isAdvertiser) || marketShare[0];

  return {
    ...dataset,
    traffic: {
      trend,
      marketShare,
      currentMonth: {
        visits: trend[trend.length - 1]?.visits || advertiserRow?.visits || 0,
        month: trend[trend.length - 1]?.month || '-',
        changePct: computeChangePercent(trend),
      },
    },
    summary: {
      marketShare: advertiserRow?.share || 0,
      monthlyVisits: advertiserRow?.visits || 0,
      seoGapCount: dataset.seoSummary.highVolumeGapCount,
      aiVisibilityScore: dataset.aiVisibility.score,
    },
  };
}

export async function getAdvisorContext(advertiserId = 'demo', countryCode = 'US', advertiser = {}) {
  const data = await getSignalDataset(advertiserId, countryCode, advertiser);
  return {
    signalSource: data.source,
    competitiveSnapshot: {
      advertiserShare: data.summary.marketShare,
      monthlyVisits: data.summary.monthlyVisits,
      seoGapCount: data.summary.seoGapCount,
      aiVisibilityScore: data.summary.aiVisibilityScore,
      topCompetitors: data.traffic.marketShare
        .filter((row) => !row.isAdvertiser)
        .slice(0, 3)
        .map((row) => ({ name: row.name, share: row.share })),
    },
    planningPriorities: data.advisorBrief.planningPriorities,
  };
}

export function getSelectedSignalContext(selectedDataSources = [], signalDataOrAdvertiser = null) {
  if (!selectedDataSources || selectedDataSources.length === 0) {
    return 'No Signal data sources selected. Enable data sources in the menu to include competitive intelligence.';
  }

  if (
    signalDataOrAdvertiser &&
    typeof signalDataOrAdvertiser === 'object' &&
    'available' in signalDataOrAdvertiser
  ) {
    return formatSignalForPlanner(signalDataOrAdvertiser, selectedDataSources);
  }

  if (typeof signalDataOrAdvertiser === 'string' && signalDataOrAdvertiser.trim()) {
    return `Signal data requested for advertiser: ${signalDataOrAdvertiser}`;
  }

  return 'Signal data loading...';
}
