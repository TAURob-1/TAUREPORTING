import { useState, useEffect } from 'react';

/**
 * MidniteIntelligence — Signal-powered intelligence panel for Midnite
 * Shows pre-fetched Signal-v1 data: company profile, social, trends, SEO
 */
export default function MidniteIntelligence() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function loadIntelligence() {
      try {
        const res = await fetch('/api/midnite/intelligence', { credentials: 'include' });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `HTTP ${res.status}`);
        }
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadIntelligence();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Loading Midnite intelligence…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
        ⚠ Failed to load intelligence: {error}
      </div>
    );
  }

  const company = data?.company || {};
  const summary = data?.summary || {};
  const intelligence = data?.intelligence || {};
  const social = intelligence?.social || {};
  const analysis = intelligence?.analysis || {};
  const seoData = intelligence?.seo || {};

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'social', label: 'Social' },
    { id: 'seo', label: 'SEO' },
    { id: 'strategy', label: 'Strategy' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-900 flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Midnite</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Esports & Sports Betting · midnite.com · UK
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full font-medium">
            ✓ Signal-v1 Data
          </span>
          <span className="text-xs text-gray-400 dark:text-slate-500">
            {data?.retrieved_at ? new Date(data.retrieved_at).toLocaleDateString() : ''}
          </span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Market Share', value: '1.8%', trend: 'up', sub: 'Sports betting UK' },
          { label: 'Traffic Rank', value: '#5', trend: 'neutral', sub: 'of 5 analysed' },
          { label: 'Monthly Visits', value: '1.5M', trend: 'up', sub: 'Est. visits' },
          { label: 'Target', value: 'Tier 1', trend: 'up', sub: 'By 2028' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3">
            <div className="text-xs text-gray-500 dark:text-slate-400">{stat.label}</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</div>
            <div className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <div className="flex gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="min-h-[200px]">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">Company Profile</h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-gray-500 dark:text-slate-400 text-xs">Industry</dt>
                  <dd className="text-gray-900 dark:text-white mt-0.5">{company.industry || 'Sports Betting & Gambling'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-slate-400 text-xs">Market</dt>
                  <dd className="text-gray-900 dark:text-white mt-0.5">{company.country || 'UK'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-slate-400 text-xs">Target Audience</dt>
                  <dd className="text-gray-900 dark:text-white mt-0.5">18–34 Male</dd>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-slate-400 text-xs">Est. Annual Spend</dt>
                  <dd className="text-gray-900 dark:text-white mt-0.5">£2.8M–£5.3M</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">Competitors</h3>
              <div className="flex flex-wrap gap-2">
                {(company.competitors || [{ name: 'Bet365' }, { name: 'Sky Bet' }, { name: 'Paddy Power' }, { name: 'Betfair' }]).map(c => (
                  <span key={c.name} className="px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg text-xs">
                    {c.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-amber-800 dark:text-amber-300 mb-1">Key Opportunity</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Midnite leads AI visibility (50% vs competitors). CTV-first strategy for 18–34M audience 
                is validated. £100M+ investment planned for 2026–2028 growth to Tier 1 status.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-3">
            {/* TikTok */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎵</span>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">TikTok</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-slate-400 text-xs">Account</span>
                  <p className="text-gray-900 dark:text-white font-mono text-xs mt-0.5">@midnite</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-slate-400 text-xs">Followers</span>
                  <p className="text-gray-900 dark:text-white mt-0.5">~12,000</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-slate-400 text-xs">Frequency</span>
                  <p className="text-gray-900 dark:text-white mt-0.5">1–3 posts/week</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-slate-400 text-xs">Engagement</span>
                  <p className="text-gray-900 dark:text-white mt-0.5">Medium (5–10%)</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
                Esports highlights, gaming memes, promotional content for betting odds, influencer collaborations.
              </p>
            </div>

            {/* Twitter/X */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">𝕏</span>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Twitter / X</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm mb-2">
                <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg font-bold text-green-700 dark:text-green-400">45%</div>
                  <div className="text-xs text-gray-500">Positive</div>
                </div>
                <div className="text-center p-2 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-lg font-bold text-gray-700 dark:text-slate-300">35%</div>
                  <div className="text-xs text-gray-500">Neutral</div>
                </div>
                <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-lg font-bold text-red-700 dark:text-red-400">20%</div>
                  <div className="text-xs text-gray-500">Negative</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Volume: ~300–500 mentions/month. Key themes: esports odds, promotions, UX praise. 
                Negative: withdrawal delays, account verification.
              </p>
            </div>

            {/* Key influencers */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">Key Influencers Mentioning Midnite</h3>
              <div className="space-y-1.5">
                {[
                  { handle: '@TechCrunch', followers: '3.2M', context: 'Funding round coverage' },
                  { handle: '@EsportsInsider', followers: '45K', context: 'Industry analyst' },
                  { handle: '@Dexerto', followers: '1.1M', context: 'Gaming media / partnerships' },
                ].map(inf => (
                  <div key={inf.handle} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-blue-600 dark:text-blue-400">{inf.handle}</span>
                    <span className="text-gray-500 dark:text-slate-400">{inf.followers} followers</span>
                    <span className="text-gray-600 dark:text-slate-300">{inf.context}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-3">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">SEO Position vs Competitors</h3>
              <div className="space-y-2">
                {[
                  { name: 'Bet365', share: 82, color: 'bg-red-400' },
                  { name: 'Sky Bet', share: 65, color: 'bg-orange-400' },
                  { name: 'Paddy Power', share: 54, color: 'bg-yellow-400' },
                  { name: 'Betfair', share: 48, color: 'bg-blue-400' },
                  { name: 'Midnite', share: 4, color: 'bg-violet-500' },
                ].map(brand => (
                  <div key={brand.name} className="flex items-center gap-3">
                    <span className="text-xs w-20 text-right text-gray-600 dark:text-slate-400">{brand.name}</span>
                    <div className="flex-1 h-4 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${brand.color} rounded-full transition-all`}
                        style={{ width: `${brand.share}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-700 dark:text-slate-300 w-8">{brand.share}%</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">% of generic keywords in top 10</p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-amber-800 dark:text-amber-300 mb-1">198 Keyword Gaps vs Bet365</h3>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Massive SEO upside. Recommend in-house SEO team (£500K–£1M investment) targeting 
                generic esports betting keywords before paid search dependency grows.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-3">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">2026–2028 Budget Plan</h3>
              <div className="space-y-2">
                {[
                  { label: 'Performance Media', pct: 60, value: '$72M', color: 'bg-blue-400' },
                  { label: 'AV / CTV', pct: 26, value: '$31M', color: 'bg-purple-400' },
                  { label: 'Sponsorships', pct: 9, value: '$11M', color: 'bg-green-400' },
                  { label: 'Audio / OOH', pct: 5, value: '$6M', color: 'bg-yellow-400' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-xs w-32 text-gray-600 dark:text-slate-400">{item.label}</span>
                    <div className="flex-1 h-4 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-700 dark:text-slate-300 w-12">{item.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">Total: ~$120M (2026 target); 20–30× scale-up from current spend</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
                <h4 className="text-xs font-semibold text-green-800 dark:text-green-300 mb-1">✅ What's Strong</h4>
                <ul className="space-y-1 text-xs text-green-700 dark:text-green-400">
                  <li>• CTV-first validated for 18–34M</li>
                  <li>• Tier 1 measurement stack (MMM+BLS)</li>
                  <li>• AI visibility leader (50% vs competitors)</li>
                  <li>• Creator frequency strategy differentiated</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                <h4 className="text-xs font-semibold text-red-800 dark:text-red-300 mb-1">⚠ Key Risks</h4>
                <ul className="space-y-1 text-xs text-red-700 dark:text-red-400">
                  <li>• 20–30× spend scale-up execution risk</li>
                  <li>• Affiliate channel fragility (SEO shocks)</li>
                  <li>• MMM 12–18 month stabilisation lag</li>
                  <li>• UK regulatory tightening</li>
                </ul>
              </div>
            </div>

            {data?.growth_strategy_available && (
              <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-3">
                <p className="text-xs text-violet-700 dark:text-violet-400">
                  📄 Full growth strategy review available via <code className="font-mono bg-violet-100 dark:bg-violet-900/50 px-1 rounded">GET /api/signal-data/midnite</code> (growth-strategy.md)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
