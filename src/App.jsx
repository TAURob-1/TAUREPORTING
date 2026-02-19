import React, { useMemo, useState } from 'react';
import CampaignPlanning from './components/CampaignPlanning';
import CampaignResults from './components/CampaignResults';
import AudienceTargeting from './components/AudienceTargeting';
import SignalIntelligence from './components/SignalIntelligence';
import StrategicAdvisor from './components/StrategicAdvisor';
import MediaReach from './components/MediaReach';
import { usePlatform } from './context/PlatformContext.jsx';
import { ADVERTISER_OPTIONS, COUNTRY_OPTIONS, PLATFORM_BRAND } from './config/platformConfig';
import { getRegulations } from './data/marketData';

const PAGES = [
  { key: 'advisor', label: 'Planner', fullLabel: 'AI Planner' },
  { key: 'targeting', label: 'Audience', fullLabel: 'Audience Targeting' },
  { key: 'planning', label: 'Planning', fullLabel: 'Campaign Planning' },
  { key: 'results', label: 'Results', fullLabel: 'Campaign Results' },
  { key: 'media', label: 'Media', fullLabel: 'Media Reach' },
  { key: 'signal', label: 'Intelligence', fullLabel: 'Signal Intelligence' },
];

function App() {
  const [currentPage, setCurrentPage] = useState('advisor');
  const {
    countryCode,
    setCountryCode,
    countryConfig,
    advertiserId,
    setAdvertiserId,
    advertiser,
  } = usePlatform();
  const regulations = useMemo(() => getRegulations(countryCode, advertiser), [countryCode, advertiser]);

  const statusLabel = useMemo(() => {
    if (currentPage === 'advisor') return 'AI Planning';
    if (currentPage === 'targeting') return 'Audience Setup';
    if (currentPage === 'planning') return 'Pre-Campaign';
    if (currentPage === 'results') return 'Live Campaign';
    if (currentPage === 'media') return 'Media Reach';
    if (currentPage === 'signal') return 'Intelligence';
    return 'AI Planning';
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-gray-200 dark:border-slate-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex space-x-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
            {PAGES.map((page) => (
              <button
                key={page.key}
                onClick={() => setCurrentPage(page.key)}
                className={`px-3 md:px-5 py-2 md:py-2.5 rounded-md text-xs md:text-sm font-medium transition-all ${
                  currentPage === page.key
                    ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-100 dark:ring-slate-700'
                    : 'text-gray-500 dark:text-slate-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <span className="hidden md:inline">{page.fullLabel}</span>
                <span className="md:hidden">{page.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm flex items-center justify-center p-1.5">
                  <img
                    src="/TAU_Logo.png"
                    alt="TAU logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-base font-bold text-gray-900 dark:text-white">{PLATFORM_BRAND.name}</div>
                  <div className="text-[11px] text-gray-500 dark:text-slate-400">
                    {advertiser.name} • {countryConfig.shortLabel}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <label className="text-xs text-gray-500 dark:text-slate-300 font-medium">Country</label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
                >
                  {COUNTRY_OPTIONS.map((country) => (
                    <option key={country.id} value={country.id}>{country.label}</option>
                  ))}
                </select>
                <label className="text-xs text-gray-500 dark:text-slate-300 font-medium ml-2">Client</label>
                <select
                  value={advertiserId}
                  onChange={(e) => setAdvertiserId(e.target.value)}
                  className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
                >
                  {ADVERTISER_OPTIONS.map((entry) => (
                    <option key={entry.id} value={entry.id}>{entry.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                Platforms: {countryConfig.platforms.join(', ')}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                Regulation: {regulations.title}
              </span>
            </div>
          </div>
        </div>
        <div key={`${currentPage}-${countryCode}-${advertiserId}`} className="animate-fadeIn">
          {currentPage === 'targeting' ? (
            <AudienceTargeting />
          ) : currentPage === 'planning' ? (
            <CampaignPlanning />
          ) : currentPage === 'results' ? (
            <CampaignResults />
          ) : currentPage === 'media' ? (
            <MediaReach />
          ) : currentPage === 'signal' ? (
            <SignalIntelligence />
          ) : (
            <StrategicAdvisor />
          )}
        </div>
      </div>

      <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="text-[11px] text-gray-400 dark:text-slate-400">
            Powered by <span className="font-semibold text-gray-500 dark:text-slate-300">TAU Signal Architecture</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${
                currentPage === 'targeting' ? 'bg-blue-500' :
                currentPage === 'planning' ? 'bg-purple-500' :
                currentPage === 'results' ? 'bg-green-500' :
                currentPage === 'media' ? 'bg-cyan-500' :
                currentPage === 'signal' ? 'bg-orange-500' : 'bg-indigo-500'
              }`} />
              <div className="text-[11px] font-medium text-gray-400 dark:text-slate-400">{statusLabel}</div>
            </div>
            <div className="text-[10px] text-gray-300 dark:text-slate-600">{PLATFORM_BRAND.product} v2.0</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
