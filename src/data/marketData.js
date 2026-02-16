export const COUNTRY_MARKET_CONTEXT = {
  UK: {
    countryCode: 'UK',
    marketLabel: 'United Kingdom',
    population: 58106824,
    households: 24182655,
    avgMedianIncome: 46433,
    primaryVideoFocus: ['YouTube CTV', 'ITVX', 'Channel 4 Streaming'],
    demographicsSource: 'Signal /companies/midnite-com/uk_demographics_enriched_msoa.csv (ONS/MSOA derived)',
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
        platform: 'ITV Linear',
        channel: 'Linear TV',
        reach: '45.0M',
        reachPct: '69.4%',
        keyDemo: 'Broad adults 25-64; mass-market TV',
        source: 'BARB 4-Screen (Signal extraction)',
      },
      {
        platform: 'Channel 4',
        channel: 'Linear TV',
        reach: '42.5M',
        reachPct: '65.5%',
        keyDemo: 'Younger skewing adults; urban index',
        source: 'BARB 4-Screen (Signal extraction)',
      },
      {
        platform: 'Sky',
        channel: 'Linear TV',
        reach: '37.2M',
        reachPct: '57.3%',
        keyDemo: 'Premium sports/news households',
        source: 'BARB 4-Screen (Signal extraction)',
      },
      {
        platform: 'YouTube CTV',
        channel: 'CTV',
        reach: '37.5M',
        reachPct: '57.8%',
        keyDemo: 'Cross-age digital video users',
        source: 'BARB 4-Screen (Signal extraction)',
      },
      {
        platform: 'ITVX',
        channel: 'CTV',
        reach: '22.5M',
        reachPct: '34.7%',
        keyDemo: 'Broadcast VOD audiences; light-linear homes',
        source: 'BARB 4-Screen (Signal extraction)',
      },
      {
        platform: 'C4 Streaming',
        channel: 'CTV',
        reach: '18.2M',
        reachPct: '28.0%',
        keyDemo: 'Younger adults and incremental BVOD',
        source: 'BARB 4-Screen (Signal extraction)',
      },
    ],
  },
  US: {
    title: 'US Media Reach (Nielsen/TAU)',
    subtitle: 'Modeled monthly reach from Nielsen Total Audience planning baselines',
    rows: [
      {
        platform: 'YouTube CTV',
        channel: 'CTV',
        reach: '102M HH',
        reachPct: '78%',
        keyDemo: 'Adults 18-49 and broad co-viewing households',
        source: 'Nielsen Total Audience blend (TAU planning model)',
      },
      {
        platform: 'Roku',
        channel: 'CTV',
        reach: '72M HH',
        reachPct: '55%',
        keyDemo: 'Cord-cutters and ad-supported streaming homes',
        source: 'Nielsen + platform audience blend (TAU model)',
      },
      {
        platform: 'Hulu',
        channel: 'CTV',
        reach: '51M HH',
        reachPct: '39%',
        keyDemo: 'Adults 18-34 and family co-viewing',
        source: 'Nielsen Total Audience blend (TAU planning model)',
      },
      {
        platform: 'NBC / Peacock Ecosystem',
        channel: 'Linear + CTV',
        reach: '64M HH',
        reachPct: '49%',
        keyDemo: 'Sports and entertainment primetime',
        source: 'Nielsen network planning baselines',
      },
      {
        platform: 'Disney / ESPN / Hulu Stack',
        channel: 'Linear + CTV',
        reach: '83M HH',
        reachPct: '63%',
        keyDemo: 'Families, sports, multicultural audiences',
        source: 'Nielsen network planning baselines',
      },
      {
        platform: 'Amazon Fire TV + Prime Video AVOD',
        channel: 'CTV',
        reach: '56M HH',
        reachPct: '43%',
        keyDemo: 'Commerce-intent and connected homes',
        source: 'Nielsen + platform planning baselines',
      },
    ],
  },
};

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

export function getRegulations(countryCode = 'US', advertiser = {}) {
  const vertical = (advertiser.vertical || '').toLowerCase();
  const isGambling = vertical.includes('gambling') || vertical.includes('betting');

  if (countryCode === 'UK' && isGambling) {
    return {
      title: 'UK Gambling Advertising Compliance',
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
