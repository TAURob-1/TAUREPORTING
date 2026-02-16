import React, { useMemo, useState } from 'react';
import CampaignPlanning from './components/CampaignPlanning';
import CampaignResults from './components/CampaignResults';
import AudienceTargeting from './components/AudienceTargeting';
import SignalIntelligence from './components/SignalIntelligence';
import StrategicAdvisor from './components/StrategicAdvisor';
import { usePlatform } from './context/PlatformContext.jsx';
import { ADVERTISER_OPTIONS, COUNTRY_OPTIONS, PLATFORM_BRAND } from './config/platformConfig';

const PAGES = [
  { key: 'targeting', label: 'Audience', fullLabel: 'Audience Targeting' },
  { key: 'planning', label: 'Planning', fullLabel: 'Campaign Planning' },
  { key: 'results', label: 'Results', fullLabel: 'Campaign Results' },
  { key: 'signal', label: 'Intelligence', fullLabel: 'Signal Intelligence' },
  { key: 'advisor', label: 'AI', fullLabel: 'AI Advisor' },
];

function App() {
  const [currentPage, setCurrentPage] = useState('targeting');
  const {
    countryCode,
    setCountryCode,
    countryConfig,
    advertiserId,
    setAdvertiserId,
    advertiser,
  } = usePlatform();

  const currentIdx = PAGES.findIndex((p) => p.key === currentPage);
  const statusLabel = useMemo(() => {
    if (currentPage === 'targeting') return 'Audience Setup';
    if (currentPage === 'planning') return 'Pre-Campaign';
    if (currentPage === 'results') return 'Live Campaign';
    if (currentPage === 'signal') return 'Intelligence';
    return 'AI Advisor';
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 leading-tight">{PLATFORM_BRAND.name}</div>
                <div className="text-[10px] text-gray-400 font-medium tracking-wider uppercase leading-tight">
                  {advertiser.name} • {countryConfig.shortLabel}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <label className="text-xs text-gray-500 font-medium">Country</label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-sm bg-white text-gray-700"
              >
                {COUNTRY_OPTIONS.map((country) => (
                  <option key={country.id} value={country.id}>{country.label}</option>
                ))}
              </select>

              <label className="text-xs text-gray-500 font-medium ml-2">Client</label>
              <select
                value={advertiserId}
                onChange={(e) => setAdvertiserId(e.target.value)}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-sm bg-white text-gray-700"
              >
                {ADVERTISER_OPTIONS.map((entry) => (
                  <option key={entry.id} value={entry.id}>{entry.name}</option>
                ))}
              </select>

              <button
                type="button"
                className="ml-1 p-2 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                title="Settings"
                aria-label="Settings"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.757.426 1.757 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.757-2.924 1.757-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.757-.426-1.757-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {PAGES.map((page) => (
                <button
                  key={page.key}
                  onClick={() => setCurrentPage(page.key)}
                  className={`px-3 md:px-5 py-2 md:py-2.5 rounded-md text-xs md:text-sm font-medium transition-all ${
                    currentPage === page.key
                      ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-100'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden md:inline">{page.fullLabel}</span>
                  <span className="md:hidden">{page.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="font-medium">Platforms:</span>
              <span>{countryConfig.platforms.join(', ')}</span>
              <span className="text-gray-300">|</span>
              <span>Regulation: {countryConfig.regulations}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pb-16">
        <div key={`${currentPage}-${countryCode}-${advertiserId}`} className="animate-fadeIn">
          {currentPage === 'targeting' ? (
            <AudienceTargeting />
          ) : currentPage === 'planning' ? (
            <CampaignPlanning />
          ) : currentPage === 'results' ? (
            <CampaignResults />
          ) : currentPage === 'signal' ? (
            <SignalIntelligence />
          ) : (
            <StrategicAdvisor />
          )}
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-white py-3">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="text-[11px] text-gray-400">
            Powered by <span className="font-semibold text-gray-500">TAU Signal Architecture</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${
                currentPage === 'targeting' ? 'bg-blue-500' :
                currentPage === 'planning' ? 'bg-purple-500' :
                currentPage === 'results' ? 'bg-green-500' :
                currentPage === 'signal' ? 'bg-orange-500' : 'bg-indigo-500'
              }`} />
              <div className="text-[11px] font-medium text-gray-400">{statusLabel}</div>
            </div>
            <div className="text-[10px] text-gray-300">{PLATFORM_BRAND.product} v2.0</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
