import React, { createContext, useContext, useMemo, useState } from 'react';
import { ADVERTISER_OPTIONS, COUNTRY_CONFIG } from '../config/platformConfig';

const PlatformContext = createContext(null);

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function PlatformProvider({ children }) {
  const [countryCode, setCountryCode] = useState('US');
  const [advertiserId, setAdvertiserId] = useState(ADVERTISER_OPTIONS[0]?.id || 'demo');

  const countryConfig = COUNTRY_CONFIG[countryCode] || COUNTRY_CONFIG.US;
  const advertiser = ADVERTISER_OPTIONS.find((entry) => entry.id === advertiserId) || ADVERTISER_OPTIONS[0];

  const value = useMemo(() => ({
    countryCode,
    setCountryCode,
    countryConfig,
    advertiserId,
    setAdvertiserId,
    advertiser: {
      ...advertiser,
      slug: slugify(advertiser?.name || 'advertiser'),
    },
  }), [countryCode, countryConfig, advertiserId, advertiser]);

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within PlatformProvider');
  }
  return context;
}
