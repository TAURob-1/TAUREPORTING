import tombolaConfig from '@signal/tombola-co-uk/config.json';
import tombolaStatus from '@signal/tombola-co-uk/status.json';
import tombolaTraffic from '@signal/tombola-co-uk/summary/traffic_intelligence.json';
import tombolaSeo from '@signal/tombola-co-uk/summary/seo_intelligence.json';
import tombolaAiVisibility from '@signal/tombola-co-uk/summary/ai_visibility.json';
import tombolaInsights from '@signal/tombola-co-uk/summary/insights_and_actions.json';
import tombolaTrends from '@signal/tombola-co-uk/summary/trends_intelligence.json';
import tombolaSpend from '@signal/tombola-co-uk/data/spend/spend_estimation.json';

function monthLabel(isoDate) {
  const [year, month] = isoDate.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString('en-GB', { month: 'short' });
}

function num(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
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

function extractPlanningPriorities(insights = {}) {
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

function loadRealSignalData(countryCode = 'UK') {
  const advertiserDomain = tombolaConfig.domain || 'tombola.co.uk';
  const estimatedMonthlyVisits = tombolaTraffic?.main_company?.raw_metrics?.estimated_monthly_visits || {};
  const comparisonTable = Array.isArray(tombolaTraffic?.competitor_comparison_table)
    ? tombolaTraffic.competitor_comparison_table
    : [];
  const competitorDetails = tombolaTraffic?.competitor_details || {};

  const trafficComparison = comparisonTable
    .map((entry) => {
      const detail = competitorDetails?.[entry.domain]?.engagement || {};
      return {
        domain: entry.domain,
        visits: entry.monthly_visits || entry.visits,
        bounce_rate: entry.bounce_rate || detail.bounce_rate,
        pages_per_visit: entry.pages_per_visit || detail.page_per_visit,
        time_on_site: detail.time_on_site || detail.avg_visit_duration || entry.avg_duration,
      };
    })
    .filter((entry) => entry.domain && num(entry.visits) > 0);

  const gapGroups = tombolaSeo?.keyword_gaps || {};
  const opportunities = flattenKeywordGaps(gapGroups)
    .sort((a, b) => num(b.volume) - num(a.volume))
    .slice(0, 8);

  const highVolumeGapCount = Object.values(gapGroups).reduce(
    (sum, entry) => sum + num(entry?.total_opportunities),
    0
  );

  const aiScores = tombolaAiVisibility?.competitor_comparison?.scores || {};
  const aiRankings = Array.isArray(tombolaAiVisibility?.competitor_comparison?.rankings)
    ? tombolaAiVisibility.competitor_comparison.rankings
    : [];
  const companyKey = tombolaConfig.company_name || 'Tombola';
  const aiScore = num(aiScores?.[companyKey]?.overall, num(tombolaAiVisibility?.overall_score, 0));

  const spendRange = tombolaSpend?.estimated_annual_spend?.total_range || {};
  const sourceDate = (
    tombolaTraffic?.generated_at ||
    tombolaStatus?.completed_at ||
    tombolaConfig?.created_at ||
    new Date().toISOString()
  ).slice(0, 10);

  const strengths = tombolaInsights?.swot_analysis?.strengths || [];
  const opportunitiesNotes = tombolaInsights?.swot_analysis?.opportunities || [];
  const trendInterpretation = tombolaTrends?.brand_trend_summary?.interpretation;
  const trendDirection = tombolaTrends?.brand_trend_summary?.['12_month_trend'];

  return {
    source: {
      slug: tombolaConfig.slug || 'tombola-co-uk',
      company: tombolaConfig.company_name || 'Tombola',
      domain: advertiserDomain,
      country: tombolaConfig.country || 'GB',
      updatedAt: sourceDate,
    },
    trafficMain: {
      estimated_monthly_visits: estimatedMonthlyVisits,
    },
    trafficComparison,
    seoSummary: {
      trackedKeywords: num(tombolaSeo?.summary?.total_keywords),
      estimatedRankingKeywords: num(tombolaSeo?.summary?.top_10_generic),
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
      currency: countryCode === 'US' ? 'USD' : (tombolaSpend.currency || 'GBP'),
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
      planningPriorities: extractPlanningPriorities(tombolaInsights),
    },
  };
}

function computeChangePercent(trend) {
  if (trend.length < 2) return 0;
  const current = trend[trend.length - 1].visits;
  const previous = trend[trend.length - 2].visits;
  if (!previous) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function resolveDataset(advertiserId = 'demo', countryCode = 'US') {
  const normalizedCountry = countryCode === 'UK' ? 'UK' : 'US';
  if (advertiserId === 'tombola' || advertiserId === 'demo' || advertiserId === 'experian') {
    return loadRealSignalData(normalizedCountry);
  }
  return loadRealSignalData(normalizedCountry);
}

export function getSignalDataset(advertiserId = 'demo', countryCode = 'US') {
  const dataset = resolveDataset(advertiserId, countryCode);
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

export function getAdvisorContext(advertiserId = 'demo', countryCode = 'US') {
  const data = getSignalDataset(advertiserId, countryCode);
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
