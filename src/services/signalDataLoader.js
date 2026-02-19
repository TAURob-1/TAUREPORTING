const SIGNAL_ROOT = '/home/r2/Signal/companies';

const SIGNAL_FILES = {
  trafficRoot: import.meta.glob('/home/r2/Signal/companies/*/traffic_intelligence.json', { import: 'default' }),
  trafficSummary: import.meta.glob('/home/r2/Signal/companies/*/summary/traffic_intelligence.json', { import: 'default' }),
  seoRoot: import.meta.glob('/home/r2/Signal/companies/*/seo-analysis.json', { import: 'default' }),
  seoRootAlt: import.meta.glob('/home/r2/Signal/companies/*/seo_intelligence.json', { import: 'default' }),
  seoSummary: import.meta.glob('/home/r2/Signal/companies/*/summary/seo-analysis.json', { import: 'default' }),
  seoSummaryAlt: import.meta.glob('/home/r2/Signal/companies/*/summary/seo_intelligence.json', { import: 'default' }),
  competitiveRoot: import.meta.glob('/home/r2/Signal/companies/*/competitive-landscape.json', { import: 'default' }),
  competitiveRootAlt: import.meta.glob('/home/r2/Signal/companies/*/insights_and_actions.json', { import: 'default' }),
  competitiveSummary: import.meta.glob('/home/r2/Signal/companies/*/summary/competitive-landscape.json', { import: 'default' }),
  competitiveSummaryAlt: import.meta.glob('/home/r2/Signal/companies/*/summary/insights_and_actions.json', { import: 'default' }),
  spend: import.meta.glob('/home/r2/Signal/companies/*/data/spend/spend_estimation.json', { import: 'default' }),
  summaryMdRoot: import.meta.glob('/home/r2/Signal/companies/*/summary.md', { query: '?raw', import: 'default' }),
  summaryMdSummary: import.meta.glob('/home/r2/Signal/companies/*/summary/summary.md', { query: '?raw', import: 'default' }),
  summaryStrategic: import.meta.glob('/home/r2/Signal/companies/*/summary/strategic_brief.md', { query: '?raw', import: 'default' }),
  summaryJsonRoot: import.meta.glob('/home/r2/Signal/companies/*/summary.json', { import: 'default' }),
  summaryJsonSummary: import.meta.glob('/home/r2/Signal/companies/*/summary/summary.json', { import: 'default' }),
};

const ADVERTISER_SLUG_HINTS = {
  demo: ['tombola-co-uk', 'tombola-uk', 'tombola', 'midnite-com', 'midnite-uk', 'midnite'],
  tombola: ['tombola-co-uk', 'tombola-uk', 'tombola'],
  experian: ['experian-uk', 'experian-us', 'experian'],
  flutter: ['flutter', 'flutter-uk', 'betfair', 'paddypower'],
};

const SIGNAL_CACHE = new Map();

const KNOWN_SIGNAL_SLUGS = Array.from(
  new Set(
    [
      ...Object.keys(SIGNAL_FILES.trafficRoot),
      ...Object.keys(SIGNAL_FILES.trafficSummary),
      ...Object.keys(SIGNAL_FILES.seoRoot),
      ...Object.keys(SIGNAL_FILES.seoSummaryAlt),
      ...Object.keys(SIGNAL_FILES.competitiveSummaryAlt),
    ]
      .map((path) => {
        const match = path.match(/\/companies\/([^/]+)\//);
        return match ? match[1] : null;
      })
      .filter(Boolean)
  )
);

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function num(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildCompanyPath(slug, relativePath) {
  return `${SIGNAL_ROOT}/${slug}/${relativePath}`;
}

function createEmptySignalData(slug = null) {
  return {
    slug,
    traffic: null,
    seo: null,
    competitive: null,
    spend: null,
    summary: null,
    available: {
      traffic: false,
      seo: false,
      spend: false,
      insights: false,
      summary: false,
    },
  };
}

async function loadFromPaths(globMap, slug, relativePaths = []) {
  for (const relativePath of relativePaths) {
    const key = buildCompanyPath(slug, relativePath);
    const loader = globMap[key];
    if (!loader) continue;
    try {
      const payload = await loader();
      if (payload != null) {
        return payload;
      }
    } catch (error) {
      console.log('[SignalLoader] Failed load:', key, error?.message || error);
    }
  }
  return null;
}

function buildSlugCandidates(advertiserSlug, countryCode = 'US') {
  const cleanSlug = slugify(advertiserSlug);
  const hints = ADVERTISER_SLUG_HINTS[cleanSlug] || [];
  const countrySuffix = countryCode === 'UK' ? 'uk' : 'us';

  return Array.from(
    new Set([
      ...hints,
      cleanSlug,
      `${cleanSlug}-${countrySuffix}`,
      `${cleanSlug}-co-${countrySuffix}`,
    ].filter(Boolean))
  );
}

function resolveSignalSlug(advertiserSlug, countryCode = 'US') {
  const candidates = buildSlugCandidates(advertiserSlug, countryCode);
  const preferredSuffixes = countryCode === 'UK' ? ['-co-uk', '-uk'] : ['-us'];

  for (const candidate of candidates) {
    const exact = KNOWN_SIGNAL_SLUGS.find((slug) => slug === candidate);
    if (exact) return exact;
  }

  for (const candidate of candidates) {
    const prefixed = KNOWN_SIGNAL_SLUGS.find((slug) => slug.startsWith(candidate));
    if (prefixed) return prefixed;
  }

  for (const suffix of preferredSuffixes) {
    const bySuffix = KNOWN_SIGNAL_SLUGS.find((slug) => slug.endsWith(suffix));
    if (bySuffix) return bySuffix;
  }

  return KNOWN_SIGNAL_SLUGS[0] || null;
}

function monthLabel(isoDate) {
  const [year, month] = String(isoDate || '').split('-');
  if (!year || !month) return String(isoDate || '');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString('en-GB', { month: 'short' });
}

function formatDomainName(domain) {
  return String(domain || '')
    .replace(/^www\./, '')
    .replace('.com', '')
    .replace('.co.uk', '')
    .split(/[.-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatTrafficData(traffic) {
  const lines = ['**Traffic Intelligence:**'];

  const visitsByMonth = traffic?.main_company?.raw_metrics?.estimated_monthly_visits || {};
  const sorted = Object.entries(visitsByMonth).sort(([a], [b]) => a.localeCompare(b));
  const current = sorted[sorted.length - 1];

  if (current?.[1]) {
    lines.push(`- Monthly visits (${monthLabel(current[0])}): ${num(current[1]).toLocaleString()}`);
  }

  const topSources = Object.entries(traffic?.main_company?.raw_metrics?.traffic_sources || {})
    .sort(([, a], [, b]) => num(b) - num(a))
    .slice(0, 3)
    .map(([source, value]) => `${source.replace(/_/g, ' ')} (${(num(value) * 100).toFixed(1)}%)`);

  if (topSources.length > 0) {
    lines.push(`- Top traffic sources: ${topSources.join(', ')}`);
  }

  const topCompetitors = (traffic?.competitor_comparison_table || [])
    .filter((row) => row?.domain)
    .slice(0, 4)
    .map((row) => `${formatDomainName(row.domain)} (${num(row.monthly_visits || row.visits).toLocaleString()} visits)`);

  if (topCompetitors.length > 0) {
    lines.push(`- Traffic leaderboard: ${topCompetitors.join(' | ')}`);
  }

  return lines.join('\n');
}

function formatSEOData(seo) {
  const lines = ['**SEO Intelligence:**'];

  const totalKeywords = num(seo?.summary?.total_keywords);
  const top10 = num(seo?.summary?.top_10_generic);
  const gapGroups = seo?.keyword_gaps || {};
  const gapCount = Object.values(gapGroups).reduce((sum, item) => sum + num(item?.total_opportunities), 0);

  if (totalKeywords > 0) {
    lines.push(`- Ranking footprint: ${totalKeywords.toLocaleString()} tracked keywords`);
  }

  if (top10 > 0) {
    lines.push(`- Top-10 generic keywords: ${top10.toLocaleString()}`);
  }

  if (gapCount > 0) {
    lines.push(`- High-priority keyword gaps: ${gapCount.toLocaleString()}`);
  }

  const topKeywords = (seo?.generic_keywords?.top_10 || [])
    .slice(0, 5)
    .map((entry) => `${entry.keyword} (SV ${num(entry.search_volume).toLocaleString()})`);

  if (topKeywords.length > 0) {
    lines.push(`- Top opportunities: ${topKeywords.join(', ')}`);
  }

  return lines.join('\n');
}

function formatCompetitiveData(competitive) {
  const lines = ['**Competitive Intelligence:**'];

  const summary = competitive?.executive_summary;
  if (summary?.overall_position) {
    lines.push(`- Market position: ${summary.overall_position}`);
  }

  const rankings = Array.isArray(summary?.rankings) ? summary.rankings : [];
  const trafficRank = rankings.find((item) => item?.area?.toLowerCase().includes('traffic'));
  if (trafficRank?.rank) {
    lines.push(`- Traffic rank: ${trafficRank.rank}`);
  }

  const topCompetitors = (trafficRank?.entries || [])
    .filter((entry) => !entry?.is_subject)
    .slice(0, 3)
    .map((entry) => `${entry.name} (${entry.value})`);

  if (topCompetitors.length > 0) {
    lines.push(`- Main competitors: ${topCompetitors.join(', ')}`);
  }

  const nextSteps = (competitive?.next_steps || []).slice(0, 3);
  if (nextSteps.length > 0) {
    lines.push(`- Recommended focus: ${nextSteps.join(' | ')}`);
  }

  return lines.join('\n');
}

function formatSpendData(spend) {
  const lines = ['**Spend Estimates:**'];

  const total = spend?.estimated_annual_spend?.total;
  if (total) {
    lines.push(`- Estimated annual spend: ${total}`);
  }

  const channels = Object.entries(spend?.by_channel || {})
    .filter(([, value]) => value?.estimate)
    .slice(0, 3)
    .map(([channel, value]) => `${channel.replace(/_/g, ' ')} (${value.estimate})`);

  if (channels.length > 0) {
    lines.push(`- Channel range: ${channels.join(', ')}`);
  }

  const competitors = Object.entries(spend?.vs_competitors || {})
    .slice(0, 3)
    .map(([domain, value]) => `${formatDomainName(domain)} (${value.estimated_total || 'n/a'})`);

  if (competitors.length > 0) {
    lines.push(`- Competitor spend context: ${competitors.join(', ')}`);
  }

  return lines.join('\n');
}

function formatSummaryData(summaryText) {
  const compact = String(summaryText || '').replace(/\s+/g, ' ').trim();
  if (!compact) return '';
  return `**Intelligence Summary:**\n${compact.slice(0, 700)}`;
}

function summaryJsonToText(summaryJson) {
  if (!summaryJson) return null;

  const company = summaryJson?.company_name || summaryJson?.executive_summary?.company;
  const situation = summaryJson?.executive_summary?.situation;
  const overall = summaryJson?.executive_summary?.overall_position;

  const lines = [];
  if (company) lines.push(`Company: ${company}`);
  if (situation) lines.push(`Situation: ${situation}`);
  if (overall) lines.push(`Overall position: ${overall}`);

  return lines.join('\n');
}

export async function loadSignalData(advertiserSlug, countryCode = 'US') {
  const resolvedSlug = resolveSignalSlug(advertiserSlug, countryCode);
  if (!resolvedSlug) {
    console.log('[SignalLoader] No signal slug found for advertiser:', advertiserSlug);
    return createEmptySignalData(null);
  }

  const cacheKey = `${resolvedSlug}:${countryCode}`;
  if (SIGNAL_CACHE.has(cacheKey)) {
    return SIGNAL_CACHE.get(cacheKey);
  }

  const data = createEmptySignalData(resolvedSlug);

  data.traffic =
    (await loadFromPaths(SIGNAL_FILES.trafficRoot, resolvedSlug, ['traffic_intelligence.json'])) ||
    (await loadFromPaths(SIGNAL_FILES.trafficSummary, resolvedSlug, ['summary/traffic_intelligence.json']));
  data.available.traffic = Boolean(data.traffic);

  data.seo =
    (await loadFromPaths(SIGNAL_FILES.seoRoot, resolvedSlug, ['seo-analysis.json'])) ||
    (await loadFromPaths(SIGNAL_FILES.seoRootAlt, resolvedSlug, ['seo_intelligence.json'])) ||
    (await loadFromPaths(SIGNAL_FILES.seoSummary, resolvedSlug, ['summary/seo-analysis.json'])) ||
    (await loadFromPaths(SIGNAL_FILES.seoSummaryAlt, resolvedSlug, ['summary/seo_intelligence.json']));
  data.available.seo = Boolean(data.seo);

  data.competitive =
    (await loadFromPaths(SIGNAL_FILES.competitiveRoot, resolvedSlug, ['competitive-landscape.json'])) ||
    (await loadFromPaths(SIGNAL_FILES.competitiveRootAlt, resolvedSlug, ['insights_and_actions.json'])) ||
    (await loadFromPaths(SIGNAL_FILES.competitiveSummary, resolvedSlug, ['summary/competitive-landscape.json'])) ||
    (await loadFromPaths(SIGNAL_FILES.competitiveSummaryAlt, resolvedSlug, ['summary/insights_and_actions.json']));
  data.available.insights = Boolean(data.competitive);

  data.spend = await loadFromPaths(SIGNAL_FILES.spend, resolvedSlug, ['data/spend/spend_estimation.json']);
  data.available.spend = Boolean(data.spend);

  const markdownSummary =
    (await loadFromPaths(SIGNAL_FILES.summaryMdRoot, resolvedSlug, ['summary.md'])) ||
    (await loadFromPaths(SIGNAL_FILES.summaryMdSummary, resolvedSlug, ['summary/summary.md'])) ||
    (await loadFromPaths(SIGNAL_FILES.summaryStrategic, resolvedSlug, ['summary/strategic_brief.md']));

  if (markdownSummary) {
    data.summary = markdownSummary;
  } else {
    const summaryJson =
      (await loadFromPaths(SIGNAL_FILES.summaryJsonRoot, resolvedSlug, ['summary.json'])) ||
      (await loadFromPaths(SIGNAL_FILES.summaryJsonSummary, resolvedSlug, ['summary/summary.json']));
    data.summary = summaryJsonToText(summaryJson);
  }
  data.available.summary = Boolean(data.summary);

  SIGNAL_CACHE.set(cacheKey, data);
  return data;
}

export function formatSignalForPlanner(signalData, selectedSources = []) {
  if (!signalData) {
    return 'Signal data loading...';
  }

  const sections = [];

  if (selectedSources.includes('traffic') && signalData.traffic) {
    sections.push(formatTrafficData(signalData.traffic));
  }

  if (selectedSources.includes('seo') && signalData.seo) {
    sections.push(formatSEOData(signalData.seo));
  }

  if (selectedSources.includes('spend') && signalData.spend) {
    sections.push(formatSpendData(signalData.spend));
  }

  if (selectedSources.includes('insights') && signalData.competitive) {
    sections.push(formatCompetitiveData(signalData.competitive));
  }

  if (selectedSources.includes('summary') && signalData.summary) {
    sections.push(formatSummaryData(signalData.summary));
  }

  if (sections.length === 0) {
    return 'No Signal data available for the selected sources.';
  }

  const sourceLine = signalData.slug ? `Signal company source: ${signalData.slug}` : null;
  return [sourceLine, ...sections].filter(Boolean).join('\n\n');
}

export function getSignalAvailabilitySummary(signalData) {
  if (!signalData?.available) return 'none';

  return Object.entries(signalData.available)
    .filter(([, value]) => Boolean(value))
    .map(([key]) => key)
    .join(', ') || 'none';
}
