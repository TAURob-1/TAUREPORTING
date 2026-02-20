const UK_AUDIENCE_BENCHMARKS = [
  {
    id: 'ultra_rich',
    label: 'Ultra Rich (£10M+ assets)',
    size: 150000,
    category: 'niche',
    patterns: [/ultra\s*rich/i, /super\s*rich/i, /\b10m\+?\b/i, /uhnw/i, /ultra\s*high\s*net\s*worth/i],
    broadenedPrimary: 'Affluent UK Adults',
  },
  {
    id: 'high_net_worth',
    label: 'High Net Worth (£1M+ assets)',
    size: 1200000,
    category: 'mid',
    patterns: [/high\s*net\s*worth/i, /\bhnw\b/i, /\b1m\+?\b/i],
    broadenedPrimary: 'Affluent UK Adults',
  },
  {
    id: 'affluent',
    label: 'Affluent (£100K+ income)',
    size: 3000000,
    category: 'mid',
    patterns: [/affluent/i, /wealthy/i, /high\s*income/i, /\b100k\+?\b/i],
    broadenedPrimary: 'Affluent UK Adults',
  },
  {
    id: 'luxury_car_owners',
    label: 'Luxury Car Owners',
    size: 800000,
    category: 'mid',
    patterns: [/luxury\s*car/i, /premium\s*car/i],
    broadenedPrimary: 'Affluent UK Adults',
  },
  {
    id: 'parents_0_5',
    label: 'Parents with kids 0-5',
    size: 4000000,
    category: 'broad',
    patterns: [/parents?.*(0\s*[-to]+\s*5|young\s*children|toddlers?)/i, /new\s*parents?/i],
    broadenedPrimary: 'UK Parents 25-44',
  },
  {
    id: 'gaming_enthusiasts',
    label: 'Gaming enthusiasts',
    size: 15000000,
    category: 'broad',
    patterns: [/gaming/i, /gamers?/i, /esports/i],
    broadenedPrimary: 'UK Adults 18-49',
  },
  {
    id: 'men_18_35',
    label: 'Men 18-35',
    size: 6000000,
    category: 'broad',
    patterns: [/men\s*18\s*[-to]+\s*35/i, /male\s*18\s*[-to]+\s*35/i],
    broadenedPrimary: 'Men 18-35',
  },
  {
    id: 'women_25_45',
    label: 'Women 25-45',
    size: 8000000,
    category: 'broad',
    patterns: [/women\s*25\s*[-to]+\s*45/i, /female\s*25\s*[-to]+\s*45/i],
    broadenedPrimary: 'Women 25-45',
  },
  {
    id: 'total_adults',
    label: 'Total Adults',
    size: 52000000,
    category: 'base',
    patterns: [/all\s*adults/i, /total\s*adults/i, /uk\s*adults/i],
    broadenedPrimary: 'UK Adults 18+',
  },
];

const UK_FALLBACK_SIZE = 4500000;

function matchAudienceBenchmark(input = '', countryCode = 'UK') {
  if (countryCode !== 'UK') return null;
  return UK_AUDIENCE_BENCHMARKS.find((entry) => entry.patterns.some((pattern) => pattern.test(input)));
}

export function estimateAudienceSize(primaryAudienceInput = '', countryCode = 'UK') {
  const input = String(primaryAudienceInput || '').trim();
  if (!input) {
    return {
      size: null,
      category: 'unknown',
      source: 'empty',
      matchedLabel: null,
      broadenedPrimary: null,
    };
  }

  const matched = matchAudienceBenchmark(input, countryCode);
  if (matched) {
    return {
      size: matched.size,
      category: matched.category,
      source: 'benchmark',
      matchedLabel: matched.label,
      broadenedPrimary: matched.broadenedPrimary,
    };
  }

  if (countryCode === 'UK') {
    return {
      size: UK_FALLBACK_SIZE,
      category: 'mid',
      source: 'fallback',
      matchedLabel: 'Generic UK audience segment',
      broadenedPrimary: 'UK Adults 25-54',
    };
  }

  return {
    size: null,
    category: 'unknown',
    source: 'unsupported_country',
    matchedLabel: null,
    broadenedPrimary: null,
  };
}
