/**
 * Custom Audience Builder configuration
 * Demographic dimensions, NLP keyword mappings, and CSV processing
 */

export const DEMOGRAPHIC_DIMENSIONS = {
  ageRanges: [
    { id: 'under_25', label: 'Under 25', field: 'age_under_25_pct' },
    { id: '25_44', label: '25-44', field: 'age_25_44_pct' },
    { id: '45_64', label: '45-64', field: 'age_45_64_pct' },
    { id: '65_plus', label: '65+', field: 'age_65_plus_pct' }
  ],
  incomeRanges: [
    { id: 'under_50k', label: 'Under $50K', field: 'income_under_50k' },
    { id: '50_75k', label: '$50K-$75K', field: 'income_50_75k' },
    { id: '75_100k', label: '$75K-$100K', field: 'income_75_100k' },
    { id: '100k_plus', label: '$100K+', field: 'income_100k_plus' },
    { id: '150k_plus', label: '$150K+', field: 'income_150k_plus' }
  ],
  householdTypes: [
    { id: 'young', label: 'Young Households', field: 'households_young_pct' },
    { id: 'middle', label: 'Family/Middle-age', field: 'households_middle_pct' },
    { id: 'senior', label: 'Senior Households', field: 'households_senior_pct' }
  ]
};

export const NLP_MAPPINGS = [
  {
    keywords: ['crypto', 'bitcoin', 'blockchain', 'web3', 'nft', 'defi'],
    name: 'Crypto Enthusiasts',
    description: 'Mapped to: 25-44, $100K+, urban, tech-oriented',
    criteria: [
      { field: 'age_25_44_pct', weight: 40, min: 25, target: 40 },
      { field: 'income_100k_plus', weight: 35, min: 25, target: 45 },
      { field: 'households_young_pct', weight: 25, min: 20, target: 35 }
    ]
  },
  {
    keywords: ['luxury', 'premium', 'high-end', 'designer', 'upscale', 'affluent'],
    name: 'Luxury Shoppers',
    description: 'Mapped to: $150K+, 45-64, established households',
    criteria: [
      { field: 'income_150k_plus', weight: 45, min: 20, target: 40 },
      { field: 'income_100k_plus', weight: 30, min: 35, target: 55 },
      { field: 'age_45_64_pct', weight: 15, min: 22, target: 34 },
      { field: 'households_middle_pct', weight: 10, min: 30, target: 50 }
    ]
  },
  {
    keywords: ['fitness', 'gym', 'workout', 'exercise', 'crossfit', 'yoga', 'athletic'],
    name: 'Fitness Enthusiasts',
    description: 'Mapped to: 25-44, $75K+, active lifestyle',
    criteria: [
      { field: 'age_25_44_pct', weight: 40, min: 25, target: 38 },
      { field: 'income_75_100k', weight: 25, min: 18, target: 28 },
      { field: 'income_100k_plus', weight: 20, min: 20, target: 35 },
      { field: 'households_young_pct', weight: 15, min: 15, target: 28 }
    ]
  },
  {
    keywords: ['gamer', 'gaming', 'esports', 'twitch', 'console', 'pc gaming', 'video game'],
    name: 'Gamers',
    description: 'Mapped to: Under 25 + 25-44, moderate income, young households',
    criteria: [
      { field: 'age_25_44_pct', weight: 35, min: 25, target: 40 },
      { field: 'age_under_25_pct', weight: 30, min: 18, target: 30 },
      { field: 'households_young_pct', weight: 20, min: 18, target: 32 },
      { field: 'income_50_75k', weight: 15, min: 18, target: 28 }
    ]
  },
  {
    keywords: ['pet', 'dog', 'cat', 'puppy', 'kitten', 'pet owner', 'animal'],
    name: 'Pet Owners',
    description: 'Mapped to: 25-64, moderate-high income, family/middle-age households',
    criteria: [
      { field: 'households_middle_pct', weight: 35, min: 38, target: 52 },
      { field: 'age_25_44_pct', weight: 25, min: 22, target: 35 },
      { field: 'age_45_64_pct', weight: 20, min: 22, target: 32 },
      { field: 'income_75_100k', weight: 20, min: 16, target: 26 }
    ]
  },
  {
    keywords: ['foodie', 'restaurant', 'chef', 'cooking', 'culinary', 'gourmet', 'dining'],
    name: 'Foodies & Dining',
    description: 'Mapped to: 25-44, $75K+, urban, young households',
    criteria: [
      { field: 'age_25_44_pct', weight: 35, min: 25, target: 38 },
      { field: 'income_100k_plus', weight: 30, min: 22, target: 38 },
      { field: 'income_75_100k', weight: 20, min: 16, target: 26 },
      { field: 'households_young_pct', weight: 15, min: 15, target: 28 }
    ]
  },
  {
    keywords: ['travel', 'vacation', 'adventure', 'backpack', 'tourist', 'cruise', 'flight'],
    name: 'Travelers',
    description: 'Mapped to: 25-64, $100K+, diverse households',
    criteria: [
      { field: 'income_100k_plus', weight: 35, min: 25, target: 42 },
      { field: 'age_25_44_pct', weight: 25, min: 22, target: 35 },
      { field: 'age_45_64_pct', weight: 20, min: 20, target: 32 },
      { field: 'income_150k_plus', weight: 20, min: 12, target: 25 }
    ]
  },
  {
    keywords: ['eco', 'sustainable', 'green', 'environment', 'organic', 'climate', 'renewable'],
    name: 'Eco & Sustainability',
    description: 'Mapped to: 25-44, $100K+, urban, educated proxy',
    criteria: [
      { field: 'age_25_44_pct', weight: 30, min: 25, target: 38 },
      { field: 'income_100k_plus', weight: 30, min: 25, target: 42 },
      { field: 'income_150k_plus', weight: 25, min: 12, target: 25 },
      { field: 'households_young_pct', weight: 15, min: 15, target: 28 }
    ]
  },
  {
    keywords: ['diy', 'home improvement', 'renovation', 'handyman', 'hardware', 'garden', 'landscaping'],
    name: 'DIY & Home Improvement',
    description: 'Mapped to: 35-64, $75K+, family/middle-age, suburban homeowners',
    criteria: [
      { field: 'age_45_64_pct', weight: 30, min: 24, target: 34 },
      { field: 'households_middle_pct', weight: 30, min: 40, target: 55 },
      { field: 'income_75_100k', weight: 20, min: 18, target: 28 },
      { field: 'income_100k_plus', weight: 20, min: 18, target: 32 }
    ]
  },
  {
    keywords: ['fashion', 'style', 'clothing', 'apparel', 'trendy', 'outfit', 'wardrobe'],
    name: 'Fashion Forward',
    description: 'Mapped to: 25-44, $75K+, urban, young households',
    criteria: [
      { field: 'age_25_44_pct', weight: 40, min: 25, target: 40 },
      { field: 'income_100k_plus', weight: 25, min: 22, target: 38 },
      { field: 'households_young_pct', weight: 20, min: 18, target: 30 },
      { field: 'income_75_100k', weight: 15, min: 16, target: 26 }
    ]
  },
  {
    keywords: ['new car', 'car buyer', 'auto buyer', 'vehicle purchase', 'car shopping', 'dealer'],
    name: 'New Car Buyers',
    description: 'Mapped to: 35-64, $75K+, family/middle-age, suburban',
    criteria: [
      { field: 'age_45_64_pct', weight: 30, min: 24, target: 34 },
      { field: 'income_100k_plus', weight: 30, min: 22, target: 38 },
      { field: 'households_middle_pct', weight: 25, min: 38, target: 52 },
      { field: 'income_75_100k', weight: 15, min: 16, target: 26 }
    ]
  },
  {
    keywords: ['streaming', 'netflix', 'hulu', 'disney', 'binge', 'cord-cut', 'cord cut', 'ott'],
    name: 'Streaming Addicts',
    description: 'Mapped to: Under 44, moderate income, young/urban households',
    criteria: [
      { field: 'age_25_44_pct', weight: 35, min: 25, target: 40 },
      { field: 'age_under_25_pct', weight: 25, min: 15, target: 28 },
      { field: 'households_young_pct', weight: 25, min: 18, target: 32 },
      { field: 'income_50_75k', weight: 15, min: 18, target: 28 }
    ]
  },
  {
    keywords: ['parent', 'toddler', 'baby', 'infant', 'preschool', 'daycare', 'newborn'],
    name: 'Parents with Toddlers',
    description: 'Mapped to: 25-44, moderate income, family formation stage',
    criteria: [
      { field: 'age_25_44_pct', weight: 45, min: 28, target: 42 },
      { field: 'households_young_pct', weight: 25, min: 18, target: 32 },
      { field: 'income_50_75k', weight: 15, min: 18, target: 28 },
      { field: 'income_75_100k', weight: 15, min: 12, target: 22 }
    ]
  },
  {
    keywords: ['retiree', 'retired', 'retirement', 'senior', 'pension', 'social security', 'aarp'],
    name: 'Retirees',
    description: 'Mapped to: 65+, senior households, moderate-high income',
    criteria: [
      { field: 'age_65_plus_pct', weight: 45, min: 20, target: 35 },
      { field: 'households_senior_pct', weight: 30, min: 25, target: 40 },
      { field: 'income_75_100k', weight: 15, min: 15, target: 25 },
      { field: 'income_100k_plus', weight: 10, min: 15, target: 28 }
    ]
  },
  {
    keywords: ['college', 'university', 'student', 'campus', 'dorm', 'tuition', 'college-bound'],
    name: 'College-Bound',
    description: 'Mapped to: Under 25, lower income, young household concentrations',
    criteria: [
      { field: 'age_under_25_pct', weight: 45, min: 20, target: 35 },
      { field: 'income_under_50k', weight: 25, min: 30, target: 45 },
      { field: 'households_young_pct', weight: 30, min: 20, target: 35 }
    ]
  },
  {
    keywords: ['freelance', 'gig', 'self-employed', 'contractor', 'remote work', 'digital nomad', 'solopreneur'],
    name: 'Freelancers & Gig Workers',
    description: 'Mapped to: 25-44, moderate income, urban, young households',
    criteria: [
      { field: 'age_25_44_pct', weight: 40, min: 28, target: 42 },
      { field: 'income_50_75k', weight: 25, min: 20, target: 30 },
      { field: 'households_young_pct', weight: 20, min: 18, target: 30 },
      { field: 'income_75_100k', weight: 15, min: 14, target: 24 }
    ]
  },
  {
    keywords: ['sports betting', 'gambling', 'wager', 'sportsbook', 'bingo', 'online bingo', 'tombola'],
    name: 'Sports Bettors',
    description: 'Mapped to: 25-44, moderate-high income, male-skewing',
    criteria: [
      { field: 'age_25_44_pct', weight: 40, min: 25, target: 40 },
      { field: 'income_75_100k', weight: 25, min: 16, target: 26 },
      { field: 'income_100k_plus', weight: 20, min: 20, target: 35 },
      { field: 'households_young_pct', weight: 15, min: 15, target: 28 }
    ]
  },
  {
    keywords: ['health', 'wellness', 'nutrition', 'supplement', 'vitamin', 'clean eating', 'keto', 'vegan'],
    name: 'Health-Conscious',
    description: 'Mapped to: 25-54, $75K+, active lifestyle, higher education',
    criteria: [
      { field: 'age_25_44_pct', weight: 35, min: 22, target: 35 },
      { field: 'income_100k_plus', weight: 30, min: 25, target: 40 },
      { field: 'age_45_64_pct', weight: 20, min: 20, target: 30 },
      { field: 'income_75_100k', weight: 15, min: 18, target: 28 }
    ]
  }
];

/**
 * Match a natural language description to the best NLP mapping
 * Uses keyword matching (frontend demo - no LLM)
 */
export function matchNLPDescription(text) {
  if (!text || text.trim().length === 0) return null;

  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  let bestMatch = null;
  let bestScore = 0;

  for (const mapping of NLP_MAPPINGS) {
    let score = 0;
    for (const keyword of mapping.keywords) {
      // Check for multi-word keywords as substring
      if (keyword.includes(' ')) {
        if (lower.includes(keyword)) score += 2;
      } else {
        if (words.includes(keyword) || lower.includes(keyword)) score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = mapping;
    }
  }

  return bestScore > 0 ? { ...bestMatch, matchScore: bestScore } : null;
}

/**
 * Process uploaded CSV data into a custom audience definition
 */
export function processCSVData(csvText) {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) {
    return { error: 'CSV must have at least a header row and one data row' };
  }

  // Parse header
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());

  // Auto-detect ZIP and metric columns
  const zipColIdx = header.findIndex(h =>
    /^(zip|zip_?code|zip3|postal|zipcode|postcode|postcode_district)$/i.test(h)
  );
  const metricColIdx = header.findIndex(h =>
    /^(sales|conversions|revenue|count|metric|value|amount|quantity)$/i.test(h)
  );

  // Fallback: assume first column is ZIP, second is metric
  const zipCol = zipColIdx >= 0 ? zipColIdx : 0;
  const metricCol = metricColIdx >= 0 ? metricColIdx : 1;

  // Parse data rows
  const rawData = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim());
    if (cols.length <= Math.max(zipCol, metricCol)) continue;

    const zipRaw = cols[zipCol].trim().replace(/['"]/g, '');
    const metric = parseFloat(cols[metricCol]);

    if (zipRaw && !isNaN(metric)) {
      let zip3;
      // Detect UK-style alphanumeric postcodes (e.g. "AB10", "SW1A 1AA", "M1")
      const ukMatch = zipRaw.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)/i);
      if (ukMatch) {
        zip3 = ukMatch[1].toUpperCase();
      } else {
        // US numeric ZIP — strip non-digits and normalize to 3 digits
        const digits = zipRaw.replace(/[^0-9]/g, '');
        zip3 = digits.length >= 3 ? digits.substring(0, 3) : digits.padStart(3, '0');
      }
      rawData.push({ zip3, metric });
    }
  }

  if (rawData.length === 0) {
    return { error: 'No valid data rows found. Check CSV format.' };
  }

  // Aggregate metrics per 3-digit ZIP
  const zipAgg = {};
  for (const row of rawData) {
    zipAgg[row.zip3] = (zipAgg[row.zip3] || 0) + row.metric;
  }

  // Normalize to 0-100 affinity scores
  const entries = Object.entries(zipAgg);
  const maxMetric = Math.max(...entries.map(([, v]) => v));
  const minMetric = Math.min(...entries.map(([, v]) => v));
  const range = maxMetric - minMetric || 1;

  const affinityMap = {};
  for (const [zip3, metric] of entries) {
    affinityMap[zip3] = Math.round(((metric - minMetric) / range) * 100);
  }

  // Find top regions
  const topRegions = entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([zip3]) => zip3);

  return {
    affinityMap,
    zipCount: entries.length,
    topRegions,
    totalRows: rawData.length,
    isCSVBased: true
  };
}

/**
 * Build audience criteria from demographic builder selections
 */
export function buildDemographicCriteria(selectedAge, selectedIncome, selectedHousehold, ageWeight, incomeWeight) {
  const criteria = [];
  const dims = DEMOGRAPHIC_DIMENSIONS;

  // Distribute age weight among selected age ranges
  const selectedAges = dims.ageRanges.filter(a => selectedAge.includes(a.id));
  if (selectedAges.length > 0) {
    const perAge = Math.round(ageWeight / selectedAges.length);
    for (const age of selectedAges) {
      criteria.push({ field: age.field, weight: perAge, min: 18, target: 32 });
    }
  }

  // Distribute income weight among selected income ranges
  const selectedIncomes = dims.incomeRanges.filter(i => selectedIncome.includes(i.id));
  if (selectedIncomes.length > 0) {
    const perIncome = Math.round(incomeWeight / selectedIncomes.length);
    for (const inc of selectedIncomes) {
      criteria.push({ field: inc.field, weight: perIncome, min: 15, target: 30 });
    }
  }

  // Household weight is remainder
  const householdWeight = Math.max(0, 100 - ageWeight - incomeWeight);
  const selectedHH = dims.householdTypes.filter(h => selectedHousehold.includes(h.id));
  if (selectedHH.length > 0) {
    const perHH = Math.round(householdWeight / selectedHH.length);
    for (const hh of selectedHH) {
      criteria.push({ field: hh.field, weight: perHH, min: 20, target: 35 });
    }
  }

  return criteria;
}

// 3-digit ZIP region labels for preview
const ZIP3_REGION_LABELS = {
  '100': 'New York',
  '900': 'Los Angeles',
  '606': 'Chicago',
  '770': 'Houston',
  '852': 'Phoenix',
  '191': 'Philadelphia',
  '782': 'San Antonio',
  '922': 'San Diego',
  '752': 'Dallas',
  '951': 'Riverside',
  '331': 'Miami',
  '303': 'Atlanta',
  '021': 'Boston',
  '941': 'San Francisco',
  '481': 'Detroit',
  '981': 'Seattle',
  '802': 'Denver',
  '372': 'Nashville',
  '206': 'Washington DC',
  '378': 'Memphis'
};

export function getZIPRegionLabel(zip3) {
  return ZIP3_REGION_LABELS[zip3] || `Region ${zip3}`;
}
