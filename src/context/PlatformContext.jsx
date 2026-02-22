import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ADVERTISER_OPTIONS, COUNTRY_CONFIG } from '../config/platformConfig';
import { segmentAudience } from '../lib/campaign/smartDefaults';
import { useAuth } from './AuthContext';

const PlatformContext = createContext(null);
const ADVERTISERS_STORAGE_KEY = 'tau_advertisers';

function slugify(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getCurrentMonthCampaignName() {
  const month = new Date().getMonth() + 1;
  return `Campaign_${month}`;
}

function getDefaultCampaignConfig() {
  const now = new Date();
  const startDate = now.toISOString().slice(0, 10);
  const end = new Date(now);
  end.setDate(end.getDate() + 30);
  const endDate = end.toISOString().slice(0, 10);

  return {
    campaignName: getCurrentMonthCampaignName(),
    startDate,
    endDate,
    primaryAudience: '',
  };
}

function getDefaultPlanningState() {
  return {
    totalBudget: 0,
    allocations: {},
    selectedMarkets: 0,
    selectedChannels: [],
    reach: 0,
    frequency: 0,
    grps: 0,
    totalGeoReach: 0,
    estimatedBudget: 0,
    totalImpressions: 0,
    campaignBudget: 0,
    mediaBudgets: {},
    mediaMixRecommendations: {},
  };
}

function readStoredAdvertisers() {
  try {
    const raw = localStorage.getItem(ADVERTISERS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => entry?.id && entry?.name);
  } catch (error) {
    console.error('Failed to read advertisers from localStorage:', error);
    return [];
  }
}

function normalizePrimaryAudience(value) {
  const input = String(value || '').trim();
  if (!input) return '';

  const rangeMatch = input.match(/(\d{1,2})\s*-\s*(\d{1,2})/);
  if (rangeMatch) {
    const min = Math.max(18, Number.parseInt(rangeMatch[1], 10) || 18);
    const max = Number.parseInt(rangeMatch[2], 10) || min;
    return input.replace(rangeMatch[0], `${min}-${Math.max(max, min)}`);
  }

  const plusMatch = input.match(/(\d{1,2})\s*\+/);
  if (plusMatch) {
    const min = Math.max(18, Number.parseInt(plusMatch[1], 10) || 18);
    return input.replace(plusMatch[0], `${min}+`);
  }

  return input;
}

export function PlatformProvider({ children }) {
  const { user } = useAuth();
  const isTombolaOnly = user?.access === 'tombola-only';

  const [countryCode, setCountryCode] = useState(() => isTombolaOnly ? 'UK' : 'US');
  const [customAdvertisers, setCustomAdvertisers] = useState([]);
  const [advertiserId, setAdvertiserId] = useState(() => isTombolaOnly ? 'tombola' : (ADVERTISER_OPTIONS[0]?.id || 'demo'));
  const [campaignConfig, setCampaignConfig] = useState(getDefaultCampaignConfig);
  const [planningState, setPlanningStateRaw] = useState(getDefaultPlanningState);
  const [customSecondary, setCustomSecondary] = useState('');

  const advertisers = useMemo(() => {
    const merged = [...ADVERTISER_OPTIONS];
    customAdvertisers.forEach((entry) => {
      if (!merged.find((item) => item.id === entry.id)) {
        merged.push(entry);
      }
    });
    if (isTombolaOnly) {
      return merged.filter((entry) => entry.id === 'tombola');
    }
    return merged;
  }, [customAdvertisers, isTombolaOnly]);

  const countryConfig = COUNTRY_CONFIG[countryCode] || COUNTRY_CONFIG.US;
  const advertiser = advertisers.find((entry) => entry.id === advertiserId) || advertisers[0] || ADVERTISER_OPTIONS[0];
  const campaignStorageKey = `tau_campaign_${advertiserId}_${countryCode}`;
  const audienceStrategy = useMemo(
    () => {
      if (!campaignConfig.primaryAudience) {
        return {
          inputAudience: '',
          primaryAudience: '',
          secondaryAudience: customSecondary.trim() || null,
          sizeEstimate: null,
          category: null,
          isNiche: false,
          reasoning: '',
          source: null,
          matchedLabel: null,
        };
      }
      const strategy = segmentAudience(campaignConfig.primaryAudience, countryCode);
      if (customSecondary.trim()) {
        strategy.customSecondary = customSecondary.trim();
        if (!strategy.secondaryAudience) {
          strategy.secondaryAudience = customSecondary.trim();
        }
      }
      return strategy;
    },
    [campaignConfig.primaryAudience, countryCode, customSecondary]
  );

  useEffect(() => {
    setCustomAdvertisers(readStoredAdvertisers());
  }, []);

  useEffect(() => {
    if (!advertisers.length) return;
    if (!advertisers.find((entry) => entry.id === advertiserId)) {
      setAdvertiserId(advertisers[0].id);
    }
  }, [advertisers, advertiserId]);

  useEffect(() => {
    const defaults = getDefaultCampaignConfig();
    const defaultPlanning = getDefaultPlanningState();

    try {
      const raw = localStorage.getItem(campaignStorageKey);
      if (!raw) {
        setCampaignConfig(defaults);
        setPlanningStateRaw(defaultPlanning);
        return;
      }

      const parsed = JSON.parse(raw);
      setCampaignConfig({
        ...defaults,
        ...(parsed.campaignConfig || {}),
        primaryAudience: normalizePrimaryAudience(parsed?.campaignConfig?.primaryAudience || defaults.primaryAudience),
      });
      setPlanningStateRaw({
        ...defaultPlanning,
        ...(parsed.planningState || {}),
      });
    } catch (error) {
      console.error('Failed to load campaign state:', error);
      setCampaignConfig(defaults);
      setPlanningStateRaw(defaultPlanning);
    }
  }, [campaignStorageKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const payload = { campaignConfig, planningState };
      localStorage.setItem(campaignStorageKey, JSON.stringify(payload));
    }, 250);

    return () => clearTimeout(timer);
  }, [campaignStorageKey, campaignConfig, planningState]);

  useEffect(() => {
    localStorage.setItem(ADVERTISERS_STORAGE_KEY, JSON.stringify(customAdvertisers));
  }, [customAdvertisers]);

  // Auto-set UK country when switching to Tombola advertiser
  useEffect(() => {
    if (advertiserId === 'tombola') {
      setCountryCode('UK');
    }
  }, [advertiserId]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === ADVERTISERS_STORAGE_KEY) {
        setCustomAdvertisers(readStoredAdvertisers());
        return;
      }

      if (event.key === campaignStorageKey && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (parsed?.campaignConfig) {
            setCampaignConfig((prev) => ({
              ...prev,
              ...parsed.campaignConfig,
              primaryAudience: normalizePrimaryAudience(parsed.campaignConfig.primaryAudience || prev.primaryAudience),
            }));
          }
          if (parsed?.planningState) {
            setPlanningStateRaw((prev) => ({
              ...prev,
              ...parsed.planningState,
            }));
          }
        } catch (error) {
          console.error('Failed to sync storage update:', error);
        }
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [campaignStorageKey]);

  const updateCampaignConfig = useCallback((updates) => {
    setCampaignConfig((prev) => {
      const nextUpdates = typeof updates === 'function' ? updates(prev) : updates;
      return {
        ...prev,
        ...nextUpdates,
        primaryAudience: normalizePrimaryAudience((nextUpdates && nextUpdates.primaryAudience) ?? prev.primaryAudience),
      };
    });
  }, []);

  const setPlanningState = useCallback((updates) => {
    setPlanningStateRaw((prev) => {
      const nextUpdates = typeof updates === 'function' ? updates(prev) : updates;
      return { ...prev, ...nextUpdates };
    });
  }, []);

  const resetPlanningSession = useCallback(() => {
    setCampaignConfig(getDefaultCampaignConfig());
    setPlanningStateRaw(getDefaultPlanningState());
    setCustomSecondary('');
  }, []);

  const addAdvertiser = useCallback((name) => {
    const trimmed = String(name || '').trim();
    if (!trimmed) return null;

    const idBase = slugify(trimmed) || 'advertiser';
    const allAdvertisers = [...ADVERTISER_OPTIONS, ...customAdvertisers];
    let nextId = idBase;
    let suffix = 2;
    while (allAdvertisers.find((entry) => entry.id === nextId)) {
      nextId = `${idBase}-${suffix}`;
      suffix += 1;
    }

    const newAdvertiser = {
      id: nextId,
      name: trimmed,
      vertical: 'general',
    };

    setCustomAdvertisers((prev) => [...prev, newAdvertiser]);
    setAdvertiserId(newAdvertiser.id);
    return newAdvertiser;
  }, [customAdvertisers]);

  const value = useMemo(() => ({
    countryCode,
    setCountryCode,
    countryConfig,
    advertisers,
    advertiserId,
    setAdvertiserId,
    addAdvertiser,
    campaignStorageKey,
    campaignConfig,
    updateCampaignConfig,
    planningState,
    setPlanningState,
    audienceStrategy,
    customSecondary,
    setCustomSecondary,
    resetPlanningSession,
    advertiser: {
      ...advertiser,
      slug: slugify(advertiser?.name || 'advertiser'),
    },
  }), [
    countryCode,
    countryConfig,
    advertisers,
    advertiserId,
    addAdvertiser,
    campaignStorageKey,
    campaignConfig,
    updateCampaignConfig,
    planningState,
    setPlanningState,
    audienceStrategy,
    customSecondary,
    resetPlanningSession,
    advertiser,
  ]);

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within PlatformProvider');
  }
  return context;
}
