export const ADVERTISER_OPTIONS = [
  { id: 'demo', name: 'Demo Advertiser' },
  { id: 'flutter', name: 'Flutter' },
  { id: 'experian', name: 'Experian' },
];

const advertiserFromEnv = import.meta.env.VITE_ADVERTISER_NAME
  ? {
      id: (import.meta.env.VITE_ADVERTISER_ID || import.meta.env.VITE_ADVERTISER_NAME)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-'),
      name: import.meta.env.VITE_ADVERTISER_NAME,
    }
  : null;

if (advertiserFromEnv && !ADVERTISER_OPTIONS.find((a) => a.id === advertiserFromEnv.id)) {
  ADVERTISER_OPTIONS.unshift(advertiserFromEnv);
}

export const COUNTRY_CONFIG = {
  US: {
    code: 'US',
    label: 'United States',
    shortLabel: 'US',
    currencyCode: 'USD',
    currencySymbol: '$',
    geoUnit: 'ZIP',
    geoUnitPlural: 'ZIPs',
    planningGeoJson: '/data/us-zip3-simplified.json',
    planningMapCenter: [39.8283, -98.5795],
    planningMapZoom: 4,
    regulations: 'CCPA/State Privacy',
    platforms: ['Linear TV', 'CTV', 'YouTube', 'Facebook Video', 'TikTok', 'Meta'],
  },
  UK: {
    code: 'UK',
    label: 'United Kingdom',
    shortLabel: 'UK',
    currencyCode: 'GBP',
    currencySymbol: '£',
    geoUnit: 'Postcode',
    geoUnitPlural: 'Postcodes',
    planningGeoJson: '/data/uk/uk-postcodes-simplified.json',
    planningMapCenter: [54.5, -3],
    planningMapZoom: 6,
    regulations: 'UK GDPR',
    platforms: ['Linear TV (ITV/C4/Sky)', 'CTV (ITVX/C4 Streaming/YouTube CTV)'],
  },
};

export const COUNTRY_OPTIONS = Object.values(COUNTRY_CONFIG).map((country) => ({
  id: country.code,
  label: `${country.shortLabel} (${country.label})`,
}));

export const PLATFORM_BRAND = {
  name: 'TAU Reporting',
  product: 'TAU Reporting Platform',
};
