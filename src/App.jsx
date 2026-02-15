import React, { useState } from 'react';
import CampaignPlanning from './components/CampaignPlanning';
import CampaignResults from './components/CampaignResults';
import AudienceTargeting from './components/AudienceTargeting';
import SignalIntelligence from './components/SignalIntelligence';
import StrategicAdvisor from './components/StrategicAdvisor';

const PAGES = [
  { key: 'targeting', label: 'Audience', icon: '1', fullLabel: 'Audience Targeting' },
  { key: 'planning', label: 'Planning', icon: '2', fullLabel: 'Campaign Planning' },
  { key: 'results', label: 'Results', icon: '3', fullLabel: 'Campaign Results' },
  { key: 'signal', label: 'Intelligence', icon: '4', fullLabel: 'Signal Intelligence' },
  { key: 'advisor', label: 'Syd.AI', icon: '🤖', fullLabel: 'Syd.AI Advisor' },
];

function App() {
  const [currentPage, setCurrentPage] = useState('targeting');

  const currentIdx = PAGES.findIndex(p => p.key === currentPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 leading-tight">CarShield</div>
                <div className="text-[10px] text-gray-400 font-medium tracking-wider uppercase leading-tight">CTV Attribution Platform</div>
              </div>
            </div>

            {/* Page Tabs with progress indicator */}
            <div className="flex items-center gap-3">
              {/* Progress dots */}
              <div className="hidden md:flex items-center gap-1 mr-2">
                {PAGES.map((page, i) => (
                  <React.Fragment key={page.key}>
                    <div
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i <= currentIdx ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                    {i < PAGES.length - 1 && (
                      <div className={`w-4 h-0.5 transition-colors ${
                        i < currentIdx ? 'bg-blue-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {PAGES.map((page, i) => (
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
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content with transition */}
      <div className="pb-16">
        <div key={currentPage} className="animate-fadeIn">
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

      {/* Footer */}
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
              }`}></div>
              <div className="text-[11px] font-medium text-gray-400">
                {currentPage === 'targeting' ? 'Audience Setup' :
                 currentPage === 'planning' ? 'Pre-Campaign' :
                 currentPage === 'results' ? 'Live Campaign' :
                 currentPage === 'signal' ? 'Intelligence' : 'Syd.AI'}
              </div>
            </div>
            <div className="text-[10px] text-gray-300">Demo v2.0</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
