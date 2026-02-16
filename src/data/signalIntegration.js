function monthLabel(isoDate) {
  const [year, month] = isoDate.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString('en-GB', { month: 'short' });
}

function formatDomainName(domain) {
  const cleaned = domain.replace('www.', '').replace('.com', '').replace('.co.uk', '');
  return cleaned
    .split(/[.-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function toTrend(estimatedMonthlyVisits) {
  return Object.entries(estimatedMonthlyVisits).map(([date, visits]) => ({
    month: monthLabel(date),
    visits,
  }));
}

function buildShareRows(trafficComparison, advertiserDomain) {
  const total = trafficComparison.reduce((sum, row) => sum + Number(row.visits || 0), 0);
  return trafficComparison.map((row) => {
    const visits = Number(row.visits || 0);
    return {
      name: row.domain === advertiserDomain ? 'Advertiser' : formatDomainName(row.domain),
      domain: row.domain,
      visits,
      share: total > 0 ? Number(((visits / total) * 100).toFixed(1)) : 0,
      bounceRate: Number(row.bounce_rate || 0),
      pagesPerVisit: Number(row.pages_per_visit || row.page_per_visit || 0),
      timeOnSite: Number(row.time_on_site || 0),
      isAdvertiser: row.domain === advertiserDomain,
    };
  });
}

const SIGNAL_DATASETS = {
  flutter: {
    UK: {
      source: {
        slug: 'midnite-com',
        company: 'Midnite',
        domain: 'midnite.com',
        country: 'GB',
        updatedAt: '2025-12-26',
      },
      trafficMain: {
        estimated_monthly_visits: {
          '2025-09-01': 1291488,
          '2025-10-01': 1362130,
          '2025-11-01': 1454118,
        },
      },
      trafficComparison: [
        { domain: 'midnite.com', visits: '1454118', bounce_rate: '0.3247867347248143', time_on_site: '361.6739759210068', pages_per_visit: '7.162724676777663' },
        { domain: 'bet365.com', visits: '45877760', bounce_rate: '0.4142321645000676', time_on_site: '617.2609758663162', pages_per_visit: '6.706549045395075' },
        { domain: 'skybet.com', visits: '12740694', bounce_rate: '0.25436062273969373', time_on_site: '613.9507727972165', pages_per_visit: '6.447025345948085' },
        { domain: 'paddypower.com', visits: '10986951', bounce_rate: '0.24179699348405292', time_on_site: '569.1628930756758', pages_per_visit: '8.862480238673168' },
        { domain: 'betfair.com', visits: '10207019', bounce_rate: '0.22181702266446446', time_on_site: '696.442978686012', pages_per_visit: '11.53883411295374' },
      ],
      seoSummary: {
        trackedKeywords: 300,
        estimatedRankingKeywords: 5403,
        highVolumeGapCount: 791,
        topKeywordVolume: 110480,
        opportunities: [
          { keyword: 'fa premier league', volume: 9140000, competitor: 'Paddy Power' },
          { keyword: 'bet365', volume: 5000000, competitor: 'Bet365' },
          { keyword: 'sky bet', volume: 4090000, competitor: 'Sky Bet' },
          { keyword: 'football today', volume: 5000000, competitor: 'Paddy Power' },
        ],
      },
      aiVisibility: {
        score: 50,
        rankings: [
          { name: 'Midnite', score: 50, rank: 1 },
          { name: 'Bet365', score: 50, rank: 2 },
          { name: 'Betfair', score: 50, rank: 3 },
          { name: 'Skybet', score: 25, rank: 4 },
          { name: 'Paddypower', score: 25, rank: 5 },
        ],
      },
      spend: {
        annualMin: 2808020,
        annualMax: 5258444,
        currency: 'GBP',
      },
      insights: [
        'Midnite has strong direct traffic quality but remains a smaller share-of-voice player versus Bet365 and Sky Bet.',
        'High-volume SEO gaps cluster around UK football discovery terms and sportsbook branded terms.',
        'Linear TV plus YouTube CTV can close awareness gaps quickly while maintaining measurable response.',
      ],
      advisorBrief: {
        planningPriorities: [
          'Protect compliance first: UKGC and CAP/BCAP checks on every creative and placement.',
          'Use ITV/Channel 4/Sky for trusted scale, then ITVX + YouTube CTV for incremental younger reach.',
          'Prioritize SEO and paid search around non-brand football intent terms to reduce reliance on direct traffic.',
        ],
      },
    },
    US: {
      source: {
        slug: 'fanduel-casino-us',
        company: 'FanDuel Casino US',
        domain: 'casino.fanduel.com',
        country: 'US',
        updatedAt: '2026-01-12',
      },
      trafficMain: {
        estimated_monthly_visits: {
          '2025-10-01': 1670873,
          '2025-11-01': 1635617,
          '2025-12-01': 1728186,
        },
      },
      trafficComparison: [
        { domain: 'casino.fanduel.com', visits: '1728186', bounce_rate: '0.2634534202802249', time_on_site: '430.235463812318', pages_per_visit: '6.244271779158986' },
        { domain: 'casino.betmgm.com', visits: '217552', bounce_rate: '0.5558482166833056', time_on_site: '111.18120253782826', pages_per_visit: '1.9235207789413649' },
        { domain: 'caesars.com', visits: '7689868', bounce_rate: '0.39782656721144877', time_on_site: '261.92749665222317', pages_per_visit: '4.823856742214915' },
        { domain: 'casino.draftkings.com', visits: '1597821', bounce_rate: '0.3677837307399922', time_on_site: '337.3971715270476', pages_per_visit: '4.350225734612293' },
      ],
      seoSummary: {
        trackedKeywords: 300,
        estimatedRankingKeywords: 10314,
        highVolumeGapCount: 434,
        topKeywordVolume: 400890,
        opportunities: [
          { keyword: 'online casino', volume: 301000, competitor: 'BetMGM Casino' },
          { keyword: 'casinos', volume: 1220000, competitor: 'DraftKings Casino' },
          { keyword: 'hotel near me', volume: 11100000, competitor: 'Caesars' },
          { keyword: 'online casinos', volume: 301000, competitor: 'DraftKings Casino' },
        ],
      },
      aiVisibility: {
        score: 37.5,
        rankings: [
          { name: 'Casino (BetMGM)', score: 50, rank: 1 },
          { name: 'FanDuel Casino US', score: 37.5, rank: 2 },
          { name: 'Caesars', score: 25, rank: 3 },
        ],
      },
      spend: {
        annualMin: 45471,
        annualMax: 136413,
        currency: 'GBP',
      },
      insights: [
        'Caesars dominates traffic share in this comparison cohort, with FanDuel and DraftKings close for second tier visibility.',
        'FanDuel shows stronger engagement quality than BetMGM in page depth and bounce profile.',
        'Top SEO gaps include both category-intent casino terms and adjacent high-volume conversion pathways.',
      ],
      advisorBrief: {
        planningPriorities: [
          'Use CTV for upper-funnel demand shaping, then paid search retargeting for state-eligible users.',
          'Anchor creative to trust and game variety while controlling frequency to reduce fatigue.',
          'Treat compliance and geo-eligibility as mandatory constraints in every media recommendation.',
        ],
      },
    },
  },
  experian: {
    UK: {
      source: {
        slug: 'worldremit-com',
        company: 'WorldRemit (Signal proxy for UK data-services planning)',
        domain: 'worldremit.com',
        country: 'GB',
        updatedAt: '2026-02-02',
      },
      trafficMain: {
        estimated_monthly_visits: {
          '2025-10-01': 712859,
          '2025-11-01': 659740,
          '2025-12-01': 777211,
        },
      },
      trafficComparison: [
        { domain: 'worldremit.com', visits: '777211', bounce_rate: '0.47681474924253536', time_on_site: '61.503596274054225', pages_per_visit: '2.084908395724453' },
        { domain: 'sendwave.com', visits: '1068690', bounce_rate: '0.6089030120092981', time_on_site: '56.021694956493', pages_per_visit: '1.4939788062509494' },
        { domain: 'wise.com', visits: '44334498', bounce_rate: '0.5389082276666636', time_on_site: '197.8103484222214', pages_per_visit: '4.973121970198788' },
        { domain: 'remitly.com', visits: '7576485', bounce_rate: '0.44769874069235', time_on_site: '215.05729754150963', pages_per_visit: '3.784086207763353' },
        { domain: 'westernunion.com', visits: '11047993', bounce_rate: '0.3517840209802105', time_on_site: '610.6796478506122', pages_per_visit: '7.621541343789139' },
        { domain: 'moneygram.com', visits: '3662743', bounce_rate: '0.28415551052285054', time_on_site: '810.5876401370476', pages_per_visit: '5.333937110960685' },
      ],
      seoSummary: {
        trackedKeywords: 300,
        estimatedRankingKeywords: 0,
        highVolumeGapCount: 409,
        topKeywordVolume: 0,
        opportunities: [
          { keyword: 'money transfer', volume: null, competitor: 'Wise' },
          { keyword: 'send money abroad', volume: null, competitor: 'Remitly' },
          { keyword: 'secure online transfers', volume: null, competitor: 'Western Union' },
          { keyword: 'rate comparison journeys', volume: null, competitor: 'Wise' },
        ],
      },
      aiVisibility: {
        score: 50,
        rankings: [
          { name: 'Remitly', score: 74.5, rank: 1 },
          { name: 'Sendwave', score: 67.5, rank: 2 },
          { name: 'Wise', score: 66.5, rank: 3 },
          { name: 'WorldRemit', score: 50, rank: 4 },
          { name: 'Western Union', score: 35.4, rank: 5 },
        ],
      },
      spend: {
        annualMin: null,
        annualMax: null,
        currency: 'GBP',
      },
      insights: [
        'Proxy category shows concentrated winner-takes-most traffic dynamics, with Wise holding dominant share.',
        'For Experian UK planning, CTV + YouTube should emphasize trust, education, and explainers over direct response only.',
        'SEO opportunity lies in intent-rich comparison journeys and financial decision support content.',
      ],
      advisorBrief: {
        planningPriorities: [
          'Build authority creative on YouTube CTV around trust, data quality, and outcome proof.',
          'Use ITVX and premium BVOD to improve credibility in high-value household segments.',
          'Treat organic search and landing page depth as a conversion multiplier for media spend.',
        ],
      },
    },
    US: {
      source: {
        slug: 'worldremit-com',
        company: 'WorldRemit (Signal proxy)',
        domain: 'worldremit.com',
        country: 'US',
        updatedAt: '2026-02-02',
      },
      trafficMain: {
        estimated_monthly_visits: {
          '2025-10-01': 712859,
          '2025-11-01': 659740,
          '2025-12-01': 777211,
        },
      },
      trafficComparison: [
        { domain: 'worldremit.com', visits: '777211', bounce_rate: '0.47681474924253536', time_on_site: '61.503596274054225', pages_per_visit: '2.084908395724453' },
        { domain: 'wise.com', visits: '44334498', bounce_rate: '0.5389082276666636', time_on_site: '197.8103484222214', pages_per_visit: '4.973121970198788' },
        { domain: 'remitly.com', visits: '7576485', bounce_rate: '0.44769874069235', time_on_site: '215.05729754150963', pages_per_visit: '3.784086207763353' },
      ],
      seoSummary: {
        trackedKeywords: 300,
        estimatedRankingKeywords: 0,
        highVolumeGapCount: 409,
        topKeywordVolume: 0,
        opportunities: [
          { keyword: 'financial guidance journeys', volume: null, competitor: 'Wise' },
          { keyword: 'comparison-led intent content', volume: null, competitor: 'Remitly' },
        ],
      },
      aiVisibility: {
        score: 50,
        rankings: [
          { name: 'Remitly', score: 74.5, rank: 1 },
          { name: 'Wise', score: 66.5, rank: 2 },
          { name: 'WorldRemit', score: 50, rank: 3 },
        ],
      },
      spend: {
        annualMin: null,
        annualMax: null,
        currency: 'USD',
      },
      insights: [
        'US planning should prioritize high-trust video environments and measurable lower-funnel conversion routes.',
        'Competitor sets in this proxy indicate sharp SEO concentration and significant brand trust effects.',
      ],
      advisorBrief: {
        planningPriorities: [
          'Use YouTube CTV and premium AVOD for authority building before direct conversion asks.',
          'Shift incremental budget into high-intent search and CRM lookalikes for efficiency.',
        ],
      },
    },
  },
};

function computeChangePercent(trend) {
  if (trend.length < 2) return 0;
  const current = trend[trend.length - 1].visits;
  const previous = trend[trend.length - 2].visits;
  if (!previous) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function resolveDataset(advertiserId = 'demo', countryCode = 'US') {
  const byAdvertiser = SIGNAL_DATASETS[advertiserId] || SIGNAL_DATASETS.flutter;
  return byAdvertiser[countryCode] || byAdvertiser.US || SIGNAL_DATASETS.flutter.US;
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
