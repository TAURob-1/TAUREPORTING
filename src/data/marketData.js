import ukMediaIntelligence from '/home/r2/Signal/markets/uk/media/summary/uk_media_intelligence.json';

export const COUNTRY_MARKET_CONTEXT = {
  UK: {
    countryCode: 'UK',
    marketLabel: 'United Kingdom',
    population: 58106824,
    households: 24182655,
    avgMedianIncome: 46433,
    primaryVideoFocus: ['YouTube CTV', 'ITVX', 'Channel 4 Streaming'],
    demographicsSource: 'Signal /companies/tombola-co-uk/summary/traffic_intelligence.json (ONS/MSOA aligned enrichment)',
    marketSizingSource: 'ONS-aligned MSOA aggregation from Signal enrichment',
  },
  US: {
    countryCode: 'US',
    marketLabel: 'United States',
    population: 335555510,
    households: 82327247,
    avgMedianIncome: null,
    primaryVideoFocus: ['YouTube CTV', 'Roku', 'Hulu'],
    demographicsSource: 'TAU ZIP3 demographic model (/public/data/zip3-demographics.json)',
    marketSizingSource: 'US ZIP3 population aggregation (Census-aligned model)',
  },
};

export const MEDIA_REACH_BY_COUNTRY = {
  UK: {
    title: 'UK Media Reach (BARB/Signal)',
    subtitle: 'Reach among UK individuals, Dec 2025',
    rows: [
      {
        platform: 'YouTube',
        channel: 'Digital Video / CTV',
        reach: '51.9M',
        reachPct: '80.0%',
        keyDemo: 'Near-universal video usage; mixed adult + family co-viewing',
        source: 'BARB 4-Screen Dashboard (Dec 2025) + TAU Signal synthesis',
      },
      {
        platform: 'BBC',
        channel: 'Linear + iPlayer',
        reach: '50.9M',
        reachPct: '78.4%',
        keyDemo: 'Broad UK adult reach; public-service inventory (non-commercial)',
        source: 'BARB 4-Screen Dashboard (Dec 2025)',
      },
      {
        platform: 'Netflix',
        channel: 'SVOD / Ad tier',
        reach: '47.1M',
        reachPct: '72.6%',
        keyDemo: 'High streaming penetration, strong 16-44 viewing share',
        source: 'BARB 4-Screen + platform earnings disclosures (Q4 2025)',
      },
      {
        platform: 'ITV Linear',
        channel: 'Linear TV',
        reach: '45.0M',
        reachPct: '69.4%',
        keyDemo: 'Broad adults 25-64; mass-market TV; high ad availability',
        source: 'BARB 4-Screen Dashboard (Dec 2025)',
      },
      {
        platform: 'Channel 4',
        channel: 'Linear TV',
        reach: '42.5M',
        reachPct: '65.5%',
        keyDemo: 'Younger skewing adults; urban index',
        source: 'BARB 4-Screen Dashboard (Dec 2025)',
      },
      {
        platform: 'Sky',
        channel: 'Linear TV',
        reach: '37.2M',
        reachPct: '57.3%',
        keyDemo: 'Premium sports/news households',
        source: 'BARB 4-Screen Dashboard (Dec 2025)',
      },
      {
        platform: 'YouTube CTV',
        channel: 'CTV',
        reach: '37.5M',
        reachPct: '57.8%',
        keyDemo: 'Cross-age digital video users',
        source: 'BARB TV-sets panel + 4-Screen cross-device blend',
      },
      {
        platform: 'ITVX',
        channel: 'CTV',
        reach: '22.5M',
        reachPct: '34.7%',
        keyDemo: 'Broadcast VOD audiences; light-linear homes',
        source: 'BARB BVOD + ITV ecosystem reporting',
      },
      {
        platform: 'C4 Streaming',
        channel: 'CTV',
        reach: '18.2M',
        reachPct: '28.0%',
        keyDemo: 'Younger adults and incremental BVOD',
        source: 'BARB BVOD + Channel 4 reporting',
      },
    ],
  },
  US: {
    title: 'US Media Reach (Nielsen/TAU)',
    subtitle: 'Modeled monthly household reach aligned to Nielsen Total Audience planning baselines',
    rows: [
      {
        platform: 'YouTube CTV',
        channel: 'CTV',
        reach: '102M HH',
        reachPct: '78%',
        keyDemo: 'Adults 18-49 and broad co-viewing households',
        source: 'Nielsen Total Audience (cross-platform TV) + TAU planning normalization',
      },
      {
        platform: 'Roku',
        channel: 'CTV',
        reach: '72M HH',
        reachPct: '55%',
        keyDemo: 'Cord-cutters and ad-supported streaming homes',
        source: 'Nielsen panel estimates + platform ad-supported household blend',
      },
      {
        platform: 'Hulu',
        channel: 'CTV',
        reach: '51M HH',
        reachPct: '39%',
        keyDemo: 'Adults 18-34 and family co-viewing',
        source: 'Nielsen Total Audience + Disney platform guidance',
      },
      {
        platform: 'NBC / Peacock Ecosystem',
        channel: 'Linear + CTV',
        reach: '64M HH',
        reachPct: '49%',
        keyDemo: 'Sports and entertainment primetime',
        source: 'Nielsen network planning baselines + NBCU platform reports',
      },
      {
        platform: 'Disney / ESPN / Hulu Stack',
        channel: 'Linear + CTV',
        reach: '83M HH',
        reachPct: '63%',
        keyDemo: 'Families, sports, multicultural audiences',
        source: 'Nielsen network planning baselines + Disney ad-supported reach',
      },
      {
        platform: 'Amazon Fire TV + Prime Video AVOD',
        channel: 'CTV',
        reach: '56M HH',
        reachPct: '43%',
        keyDemo: 'Commerce-intent and connected homes',
        source: 'Nielsen + Amazon Ads platform planning baselines',
      },
    ],
  },
};

function reachPctToNumber(value) {
  const n = Number(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function getMediaDataQuality(countryCode = 'US') {
  const table = getMediaReachTable(countryCode);
  const rows = table.rows || [];
  const hasSourceCoverage = rows.every((row) => {
    const source = String(row.source || '').toLowerCase();
    if (countryCode === 'UK') return source.includes('barb');
    return source.includes('nielsen');
  });
  const hasReachCoverage = rows.every((row) => reachPctToNumber(row.reachPct) > 0);
  const hasDemoCoverage = rows.every((row) => String(row.keyDemo || '').length > 12);
  const topReach = rows.reduce((max, row) => Math.max(max, reachPctToNumber(row.reachPct)), 0);

  const checks = [
    { name: countryCode === 'UK' ? 'BARB source coverage' : 'Nielsen source coverage', passed: hasSourceCoverage },
    { name: 'Reach values present', passed: hasReachCoverage },
    { name: 'Demographic descriptors present', passed: hasDemoCoverage },
    { name: 'Top platform reach plausibility', passed: topReach >= 30 },
  ];

  const passed = checks.filter((item) => item.passed).length;
  return {
    passed,
    total: checks.length,
    grade: passed === checks.length ? 'Professional' : passed >= 3 ? 'Needs review' : 'Insufficient',
    checks,
    reviewedAt: countryCode === 'UK'
      ? (ukMediaIntelligence?.uk_media_intelligence?.generated_at || null)
      : null,
  };
}

export function getMediaIntelligenceSummary(countryCode = 'US') {
  if (countryCode !== 'UK') {
    return {
      highlights: ['US dataset currently uses Nielsen-aligned planning baselines with TAU normalization.'],
      keyMetrics: null,
      generatedAt: null,
      source: 'Nielsen planning baselines',
    };
  }

  const payload = ukMediaIntelligence?.uk_media_intelligence || {};
  return {
    highlights: payload.highlights || [],
    keyMetrics: payload.key_metrics || null,
    generatedAt: payload.generated_at || null,
    source: 'Signal /markets/uk/media/summary/uk_media_intelligence.json',
  };
}

const UK_GAMBLING_RULES = [
  {
    title: 'UK Gambling Commission Licence Conditions',
    description: 'Ads must not target under-18s and must include safer gambling messaging where appropriate.',
    source: 'UK Gambling Commission / LCCP',
  },
  {
    title: 'CAP & BCAP Gambling Advertising Codes',
    description: 'No appeal to youth culture; no suggestion gambling solves financial or social problems.',
    source: 'ASA CAP/BCAP Codes',
  },
  {
    title: 'Watershed and Content Controls',
    description: 'Stricter placement and creative controls around TV and online video inventory adjacent to youth audiences.',
    source: 'Ofcom Broadcasting Code + CAP guidance',
  },
  {
    title: 'Compliance Operations',
    description: 'Maintain approval logs, audience exclusion evidence, and geo-controls for UK-only inventory where required.',
    source: 'TAU compliance checklist',
  },
];

const UK_GENERAL_RULES = [
  {
    title: 'UK GDPR and PECR',
    description: 'Audience activation must follow consent and lawful processing requirements for personal data.',
    source: 'ICO / UK GDPR',
  },
  {
    title: 'CAP / BCAP Ad Standards',
    description: 'Creative claims must be substantiated and not misleading across TV, CTV, and digital placements.',
    source: 'ASA CAP/BCAP Codes',
  },
];

const US_GENERAL_RULES = [
  {
    title: 'FTC Truth in Advertising',
    description: 'Performance claims and comparisons must be evidence-based and clearly disclosed.',
    source: 'FTC',
  },
  {
    title: 'FCC Broadcast Rules',
    description: 'Linear placements should comply with sponsor identification and placement standards.',
    source: 'FCC',
  },
  {
    title: 'US Privacy Compliance (State-level)',
    description: 'Campaign activation should support opt-out rights and data minimization under applicable state laws.',
    source: 'CCPA/CPRA + other state privacy regimes',
  },
];

const US_GAMBLING_RULES = [
  {
    title: 'State-by-State Gambling Advertising Rules',
    description: 'Creative, targeting, and offer language must comply with each licensed state jurisdiction.',
    source: 'State Gaming Commissions',
  },
  {
    title: 'Age-Gating and Audience Exclusions',
    description: 'Campaign delivery must enforce 21+ targeting, suppress underage audiences, and apply youth-safe placements.',
    source: 'Platform policy + state regulatory guidance',
  },
  {
    title: 'Responsible Gambling Disclosures',
    description: 'Include required responsible gambling messaging and clear terms for promotions and bonus offers.',
    source: 'State regulations + operator compliance standards',
  },
  {
    title: 'FTC and Consumer Protection Standards',
    description: 'Claims must be truthful, not misleading, and transparent about eligibility, risks, and material terms.',
    source: 'FTC',
  },
];

export function getRegulations(countryCode = 'US', advertiser = {}) {
  const vertical = (advertiser.vertical || '').toLowerCase();
  const advertiserName = advertiser.name || 'Advertiser';
  const isGambling = vertical.includes('gambling') || vertical.includes('betting');

  if (countryCode === 'UK' && isGambling) {
    return {
      title: `${advertiserName}: UK Gambling Advertising Compliance`,
      tone: 'high',
      rules: UK_GAMBLING_RULES,
    };
  }

  if (countryCode === 'UK') {
    return {
      title: 'UK Media & Data Compliance',
      tone: 'medium',
      rules: UK_GENERAL_RULES,
    };
  }

  if (isGambling) {
    return {
      title: `${advertiserName}: US Gambling Advertising Compliance`,
      tone: 'high',
      rules: US_GAMBLING_RULES,
    };
  }

  return {
    title: 'US Media & Data Compliance',
    tone: 'medium',
    rules: US_GENERAL_RULES,
  };
}

export function getMediaReachTable(countryCode = 'US') {
  return MEDIA_REACH_BY_COUNTRY[countryCode] || MEDIA_REACH_BY_COUNTRY.US;
}

export function getCountryMarketContext(countryCode = 'US') {
  return COUNTRY_MARKET_CONTEXT[countryCode] || COUNTRY_MARKET_CONTEXT.US;
}
