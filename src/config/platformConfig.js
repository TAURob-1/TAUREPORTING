export const ADVERTISER_OPTIONS = [
  { id: 'demo', name: 'Demo Advertiser', vertical: 'general' },
  { id: 'flutter', name: 'Flutter', vertical: 'gambling' },
  { id: 'experian', name: 'Experian', vertical: 'data services' },
];

const advertiserFromEnv = import.meta.env.VITE_ADVERTISER_NAME
  ? {
      id: (import.meta.env.VITE_ADVERTISER_ID || import.meta.env.VITE_ADVERTISER_NAME)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-'),
      name: import.meta.env.VITE_ADVERTISER_NAME,
      vertical: 'general',
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
    regulations: 'FTC/FCC + State Privacy',
    platforms: ['Linear TV', 'CTV', 'Digital'],
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
    regulations: 'UK GDPR + CAP/BCAP',
    platforms: ['Linear TV', 'CTV', 'Digital'],
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
