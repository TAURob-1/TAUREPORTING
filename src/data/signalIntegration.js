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
  tombola: {
    UK: {
      source: {
        slug: 'tombola-co-uk',
        company: 'Tombola',
        domain: 'tombola.co.uk',
        country: 'GB',
        updatedAt: '2026-01-17',
      },
      trafficMain: {
        estimated_monthly_visits: {
          '2025-09-01': 3756366,
          '2025-10-01': 3652379,
          '2025-11-01': 4315535,
        },
      },
      trafficComparison: [
        { domain: 'tombola.co.uk', visits: '4315535', bounce_rate: '0.19254960827371592', time_on_site: '845.9591400119313', pages_per_visit: '8.815966673103373' },
        { domain: 'galabingo.com', visits: '3292891', bounce_rate: '0.2878033390187394', time_on_site: '266.9958316229738', pages_per_visit: '6.739066089216041' },
        { domain: 'foxybingo.com', visits: '2189929', bounce_rate: '0.2693000933406354', time_on_site: '406.304709154357', pages_per_visit: '6.00840219917026' },
        { domain: 'buzzbingo.com', visits: '1350197', bounce_rate: '0.2854495301803092', time_on_site: '299.49093462792746', pages_per_visit: '5.376553124327996' },
        { domain: 'meccabingo.com', visits: '1224883', bounce_rate: '0.2752023628272206', time_on_site: '427.2569610794973', pages_per_visit: '6.577342307677028' },
      ],
      seoSummary: {
        trackedKeywords: 300,
        estimatedRankingKeywords: 79,
        highVolumeGapCount: 606,
        topKeywordVolume: 14800,
        opportunities: [
          { keyword: 'neptune play', volume: 14800, competitor: 'Gala Bingo' },
          { keyword: 'free bingo no deposit sites', volume: 4400, competitor: 'Mecca Bingo' },
          { keyword: 'online bingo website', volume: 2900, competitor: 'Foxy Bingo' },
          { keyword: 'bingo online', volume: 6600, competitor: 'Buzz Bingo' },
        ],
      },
      aiVisibility: {
        score: 50.7,
        rankings: [
          { name: 'Tombola', score: 50.7, rank: 1 },
          { name: 'Galabingo', score: 50, rank: 2 },
          { name: 'Foxybingo', score: 50, rank: 3 },
          { name: 'Meccabingo', score: 25, rank: 4 },
          { name: 'Buzzbingo', score: 25, rank: 5 },
        ],
      },
      spend: {
        annualMin: 18100000,
        annualMax: 33700000,
        currency: 'GBP',
      },
      insights: [
        'Tombola leads this UK bingo cohort on traffic volume and engagement quality, with 8.8 pages per visit and low bounce.',
        'Signal identifies 606 SEO opportunity gaps where competitor content can still intercept high-intent bingo journeys.',
        'ITV, Channel 4, and Sky plus ITVX/YouTube CTV should be used to defend share and add incremental UK reach.',
      ],
      advisorBrief: {
        planningPriorities: [
          'Protect compliance first: UKGC and CAP/BCAP checks on every creative and placement.',
          'Use ITV/Channel 4/Sky for trusted scale, then ITVX + YouTube CTV for incremental younger reach.',
          'Prioritize non-brand bingo SEO and high-intent paid search while protecting Tombola brand terms.',
        ],
      },
    },
    US: {
      source: {
        slug: 'tombola-uk',
        company: 'Tombola (UK benchmark for US view)',
        domain: 'tombola.co.uk',
        country: 'GB',
        updatedAt: '2026-01-17',
      },
      trafficMain: {
        estimated_monthly_visits: {
          '2025-09-01': 3756366,
          '2025-10-01': 3652379,
          '2025-11-01': 4315535,
        },
      },
      trafficComparison: [
        { domain: 'tombola.co.uk', visits: '4315535', bounce_rate: '0.19254960827371592', time_on_site: '845.9591400119313', pages_per_visit: '8.815966673103373' },
        { domain: 'galabingo.com', visits: '3292891', bounce_rate: '0.2878033390187394', time_on_site: '266.9958316229738', pages_per_visit: '6.739066089216041' },
        { domain: 'foxybingo.com', visits: '2189929', bounce_rate: '0.2693000933406354', time_on_site: '406.304709154357', pages_per_visit: '6.00840219917026' },
        { domain: 'buzzbingo.com', visits: '1350197', bounce_rate: '0.2854495301803092', time_on_site: '299.49093462792746', pages_per_visit: '5.376553124327996' },
      ],
      seoSummary: {
        trackedKeywords: 300,
        estimatedRankingKeywords: 79,
        highVolumeGapCount: 606,
        topKeywordVolume: 14800,
        opportunities: [
          { keyword: 'neptune play', volume: 14800, competitor: 'Gala Bingo' },
          { keyword: 'free bingo no deposit sites', volume: 4400, competitor: 'Mecca Bingo' },
          { keyword: 'online bingo website', volume: 2900, competitor: 'Foxy Bingo' },
          { keyword: 'bingo online', volume: 6600, competitor: 'Buzz Bingo' },
        ],
      },
      aiVisibility: {
        score: 50.7,
        rankings: [
          { name: 'Tombola', score: 50.7, rank: 1 },
          { name: 'Galabingo', score: 50, rank: 2 },
          { name: 'Foxybingo', score: 50, rank: 3 },
          { name: 'Meccabingo', score: 25, rank: 4 },
          { name: 'Buzzbingo', score: 25, rank: 5 },
        ],
      },
      spend: {
        annualMin: 18100000,
        annualMax: 33700000,
        currency: 'USD',
      },
      insights: [
        'US view currently uses the Tombola UK benchmark dataset from Signal while preserving full planning functionality.',
        'Tombola benchmark data shows strong site engagement and high direct share relative to the selected bingo cohort.',
        'Priority remains high-attention video plus search capture, with compliance guardrails maintained by market.',
      ],
      advisorBrief: {
        planningPriorities: [
          'Use CTV for upper-funnel demand shaping, then paid search retargeting for high-intent users.',
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
  const byAdvertiser = SIGNAL_DATASETS[advertiserId] || SIGNAL_DATASETS.tombola;
  return byAdvertiser[countryCode] || byAdvertiser.US || SIGNAL_DATASETS.tombola.US;
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
