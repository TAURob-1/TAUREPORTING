const BASE_TEST_PERIOD = {
  start: 'Jan 6, 2026',
  end: 'Feb 5, 2026',
  status: 'Live',
};

const US_DASHBOARD = {
  testPeriod: BASE_TEST_PERIOD,
  metrics: {
    totalImpressions: { value: '19.3M', change: '+6% vs target', positive: true },
    uniqueReach: { value: '6.8M', subtext: 'Avg freq: 2.84x' },
    measuredLift: { value: '+16.2%', subtext: '95% confidence', positive: true },
    iROAS: { value: '$2.94', subtext: 'Above target ($2.50)', positive: true },
  },
  dmaRegions: [
    { id: 'HOU', name: 'Houston, TX', type: 'high', impressions: '1.8M', lift: '+21.3%', cx: 500, cy: 380 },
    { id: 'DFW', name: 'Dallas-Fort Worth, TX', type: 'high', impressions: '1.6M', lift: '+19.7%', cx: 480, cy: 340 },
    { id: 'PHX', name: 'Phoenix, AZ', type: 'high', impressions: '1.4M', lift: '+18.4%', cx: 200, cy: 320 },
    { id: 'ATL', name: 'Atlanta, GA', type: 'exposed', impressions: '1.5M', lift: '+17.2%', cx: 680, cy: 320 },
    { id: 'TB', name: 'Tampa-St. Pete, FL', type: 'exposed', impressions: '1.2M', lift: '+16.8%', cx: 740, cy: 400 },
    { id: 'ORL', name: 'Orlando, FL', type: 'holdout', impressions: '0', lift: '-0.8%', cx: 760, cy: 410 },
    { id: 'CLE', name: 'Cleveland, OH', type: 'exposed', impressions: '1.1M', lift: '+14.9%', cx: 700, cy: 210 },
    { id: 'DET', name: 'Detroit, MI', type: 'exposed', impressions: '1.3M', lift: '+12.3%', cx: 680, cy: 190 },
    { id: 'IND', name: 'Indianapolis, IN', type: 'exposed', impressions: '0.9M', lift: '+8.7%', cx: 640, cy: 240 },
    { id: 'CLT', name: 'Charlotte, NC', type: 'holdout', impressions: '0', lift: '+1.2%', cx: 720, cy: 320 },
    { id: 'SA', name: 'San Antonio, TX', type: 'exposed', impressions: '1.1M', lift: '+6.4%', cx: 470, cy: 390 },
    { id: 'JAX', name: 'Jacksonville, FL', type: 'holdout', impressions: '0', lift: '-1.4%', cx: 720, cy: 380 },
    { id: 'COL', name: 'Columbus, OH', type: 'exposed', impressions: '0.8M', lift: '+3.1%', cx: 710, cy: 230 },
  ],
  ctvProviders: [
    { name: 'YouTube (CTV)', impressions: '4.2M', share: 22, lift: '+19.8%', color: '#FF0000', initial: 'YT' },
    { name: 'Roku', impressions: '2.9M', share: 15, lift: '+17.2%', color: '#9333ea', initial: 'R' },
    { name: 'Hulu', impressions: '2.3M', share: 12, lift: '+16.4%', color: '#10b981', initial: 'H' },
    { name: 'Amazon Fire TV', impressions: '1.9M', share: 10, lift: '+14.1%', color: '#f97316', initial: 'AF' },
    { name: 'Disney+', impressions: '1.5M', share: 8, lift: '+18.6%', color: '#113CCF', initial: 'D+' },
    { name: 'Peacock', impressions: '1.4M', share: 7, lift: '+13.4%', color: '#0ea5e9', initial: 'Pk' },
    { name: 'TikTok (CTV)', impressions: '1.2M', share: 6, lift: '+21.7%', color: '#000000', initial: 'TT' },
    { name: 'Tubi', impressions: '1.0M', share: 5, lift: '+11.2%', color: '#0891b2', initial: 'Tu' },
    { name: 'Netflix', impressions: '1.0M', share: 5, lift: '+15.3%', color: '#E50914', initial: 'N' },
    { name: 'Paramount+', impressions: '0.8M', share: 4, lift: '+12.8%', color: '#4f46e5', initial: 'P+' },
    { name: 'Samsung TV+', impressions: '0.6M', share: 3, lift: '+8.9%', color: '#1428A0', initial: 'S+' },
    { name: 'Max (HBO)', impressions: '0.5M', share: 3, lift: '+14.7%', color: '#5822B4', initial: 'MX' },
  ],
  deliveryData: {
    labels: ['Jan 6', 'Jan 9', 'Jan 12', 'Jan 15', 'Jan 18', 'Jan 21', 'Jan 24', 'Jan 27', 'Jan 30', 'Feb 2', 'Feb 5'],
    exposed: [280, 420, 580, 640, 710, 590, 820, 760, 880, 720, 810],
    holdout: [190, 220, 240, 210, 250, 230, 270, 240, 280, 260, 250],
  },
  previousCampaign: {
    name: 'Summer Protection',
    period: 'Aug-Sep 2024',
    lift: '+18.7%',
    iROAS: '$2.95',
    testDesign: '60/40 Geo Split',
    keyLearning: 'CTV drove 3x higher lift in high-intent DMAs vs broad national buy',
  },
  statisticalConfidence: {
    exposedGroup: { n: 52, lift: '+16.2%', confidence: 95, interval: '+13.4% to +19.1%' },
    holdoutGroup: { n: 28, lift: '-0.3%', note: 'Natural baseline variation (expected)' },
    testResult: { significant: true, pValue: '0.012', power: '91%', effectSize: 'Moderate-Strong' },
  },
};

const UK_BASE = {
  testPeriod: {
    start: 'Jan 8, 2026',
    end: 'Feb 7, 2026',
    status: 'Live',
  },
  metrics: {
    totalImpressions: { value: '14.8M', change: '+9% vs target', positive: true },
    uniqueReach: { value: '4.9M', subtext: 'Avg freq: 3.02x' },
    measuredLift: { value: '+14.7%', subtext: '95% confidence', positive: true },
    iROAS: { value: '£2.68', subtext: 'Above target (£2.20)', positive: true },
  },
  ctvProviders: [
    { name: 'ITV Linear', impressions: '3.1M', share: 21, lift: '+15.6%', color: '#1D78C1', initial: 'ITV' },
    { name: 'Channel 4', impressions: '2.6M', share: 18, lift: '+14.8%', color: '#6A1B9A', initial: 'C4' },
    { name: 'Sky', impressions: '2.2M', share: 15, lift: '+13.3%', color: '#0072C9', initial: 'SKY' },
    { name: 'YouTube CTV', impressions: '2.1M', share: 14, lift: '+16.9%', color: '#FF0000', initial: 'YT' },
    { name: 'ITVX', impressions: '1.8M', share: 12, lift: '+17.4%', color: '#1D78C1', initial: 'IX' },
    { name: 'C4 Streaming', impressions: '1.3M', share: 9, lift: '+15.1%', color: '#7C3AED', initial: 'C4S' },
    { name: 'Sky Go / NOW', impressions: '0.9M', share: 6, lift: '+11.8%', color: '#0369A1', initial: 'NOW' },
    { name: 'Netflix Ads', impressions: '0.8M', share: 5, lift: '+10.9%', color: '#E50914', initial: 'N' },
  ],
  deliveryData: {
    labels: ['Jan 8', 'Jan 11', 'Jan 14', 'Jan 17', 'Jan 20', 'Jan 23', 'Jan 26', 'Jan 29', 'Feb 1', 'Feb 4', 'Feb 7'],
    exposed: [220, 350, 480, 520, 560, 590, 640, 700, 730, 690, 710],
    holdout: [150, 165, 170, 180, 175, 190, 205, 210, 215, 220, 218],
  },
  previousCampaign: {
    name: 'Tombola Winter Bingo Push',
    period: 'Sep-Oct 2025',
    lift: '+13.9%',
    iROAS: '£2.43',
    testDesign: 'Regional Holdout',
    keyLearning: 'ITVX + YouTube CTV delivered the strongest incremental reach for UK bingo-intender audiences',
  },
  statisticalConfidence: {
    exposedGroup: { n: 46, lift: '+14.7%', confidence: 95, interval: '+11.8% to +17.3%' },
    holdoutGroup: { n: 22, lift: '+0.6%', note: 'Normal baseline movement' },
    testResult: { significant: true, pValue: '0.018', power: '88%', effectSize: 'Moderate' },
  },
  dmaRegions: US_DASHBOARD.dmaRegions,
};

const UK_EXPERIAN_OVERRIDES = {
  metrics: {
    totalImpressions: { value: '13.2M', change: '+11% vs target', positive: true },
    uniqueReach: { value: '4.4M', subtext: 'Avg freq: 2.91x' },
    measuredLift: { value: '+12.9%', subtext: '95% confidence', positive: true },
    iROAS: { value: '£2.81', subtext: 'Above target (£2.40)', positive: true },
  },
  ctvProviders: [
    { name: 'YouTube CTV', impressions: '2.8M', share: 21, lift: '+15.9%', color: '#FF0000', initial: 'YT' },
    { name: 'ITVX', impressions: '2.1M', share: 16, lift: '+14.6%', color: '#1D78C1', initial: 'IX' },
    { name: 'Channel 4 Streaming', impressions: '1.7M', share: 13, lift: '+13.8%', color: '#6A1B9A', initial: 'C4S' },
    { name: 'ITV Linear', impressions: '1.6M', share: 12, lift: '+11.9%', color: '#1D78C1', initial: 'ITV' },
    { name: 'Sky', impressions: '1.4M', share: 11, lift: '+10.8%', color: '#0072C9', initial: 'SKY' },
    { name: 'Channel 4', impressions: '1.3M', share: 10, lift: '+11.6%', color: '#7C3AED', initial: 'C4' },
    { name: 'Netflix Ads', impressions: '1.2M', share: 9, lift: '+10.1%', color: '#E50914', initial: 'N' },
    { name: 'Amazon Prime Video', impressions: '1.1M', share: 8, lift: '+9.8%', color: '#0EA5E9', initial: 'PV' },
  ],
  previousCampaign: {
    name: 'UK Credibility & Demand Generation',
    period: 'Oct-Nov 2025',
    lift: '+12.1%',
    iROAS: '£2.77',
    testDesign: 'Geo Holdout + Regional Weighting',
    keyLearning: 'YouTube explainer formats and ITVX high-attention placements improved qualified lead quality',
  },
};

export function getDashboardData(countryCode = 'US', advertiserId = 'demo') {
  if (countryCode !== 'UK') return US_DASHBOARD;

  if (advertiserId === 'experian') {
    return {
      ...UK_BASE,
      ...UK_EXPERIAN_OVERRIDES,
      metrics: UK_EXPERIAN_OVERRIDES.metrics,
      ctvProviders: UK_EXPERIAN_OVERRIDES.ctvProviders,
      previousCampaign: UK_EXPERIAN_OVERRIDES.previousCampaign,
    };
  }

  return UK_BASE;
}

export const dashboardData = US_DASHBOARD;
