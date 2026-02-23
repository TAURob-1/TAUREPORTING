import React, { useEffect, useMemo, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import MetricCard from './MetricCard';
import MediaReachTable from './MediaReachTable';
import CompetitorComparison from './signal/CompetitorComparison';
import SegmentView from './signal/SegmentView';
import ArcadeView from './signal/ArcadeView';
import SignalChatWidget from './signal/SignalChatWidget';
import { usePlatform } from '../context/PlatformContext.jsx';
import { getSignalDataset } from '../data/signalIntegration';
import { getCountryMarketContext, getMediaReachTable } from '../data/marketData';

function num(value) {
  return Number(value || 0);
}

function formatVisits(value) {
  const v = num(value);
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return `${v}`;
}

const SIGNAL_TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'competitors', label: 'Competitors' },
  { key: 'arcade', label: 'Arcade Intelligence' },
  { key: 'segments', label: 'Bingo vs Arcade' },
];

function SignalIntelligence() {
  const { advertiser, advertiserId, countryCode } = usePlatform();
  const [signal, setSignal] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const marketContext = getCountryMarketContext(countryCode);
  const mediaReachTable = getMediaReachTable(countryCode);

  const isTombola = advertiserId === 'tombola';

  useEffect(() => {
    let active = true;
    setLoadError(null);
    setSignal(null);

    getSignalDataset(advertiserId, countryCode, advertiser)
      .then((dataset) => {
        if (active) setSignal(dataset);
      })
      .catch((error) => {
        if (active) setLoadError(error?.message || 'Unable to load Signal dataset');
      });

    return () => {
      active = false;
    };
  }, [advertiser, advertiserId, countryCode]);

  const marketShareData = useMemo(() => {
    if (!signal) return [];
    return signal.traffic.marketShare.map((row) => ({
      name: row.isAdvertiser ? advertiser.name : row.name,
      visits: row.visits,
      share: row.share,
      isAdvertiser: row.isAdvertiser,
    }));
  }, [advertiser.name, signal]);

  const competitorBars = useMemo(() => {
    if (!signal) return [];
    return signal.traffic.marketShare
      .map((row) => ({
        name: row.isAdvertiser ? advertiser.name : row.name,
        visits: Math.round(row.visits / 1000),
        pages: Number((row.pagesPerVisit || 0).toFixed(1)),
        bounce: Number(((row.bounceRate || 0) * 100).toFixed(1)),
        advertiser: row.isAdvertiser,
      }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 6);
  }, [advertiser.name, signal]);

  const palette = ['#1d4ed8', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  const seoOpportunities = signal?.seoSummary?.opportunities || [];

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">
          Signal dataset failed to load for {advertiser.name}: {loadError}
        </div>
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
          Loading Signal intelligence dataset...
        </div>
      </div>
    );
  }

  const visibleTabs = isTombola ? SIGNAL_TABS : SIGNAL_TABS.filter((t) => t.key !== 'segments' && t.key !== 'arcade');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Signal Intelligence</h1>
              <p className="text-blue-100 mt-2 text-sm">
                Competitive landscape for {advertiser.name} ({countryCode}) powered by Signal source snapshots.
              </p>
              <p className="text-xs text-blue-200 mt-2">
                Source: /home/r2/Signal/companies/{signal.source.slug} ({signal.source.updatedAt})
              </p>
            </div>
            <div className="text-right text-xs text-blue-100">
              <div className="uppercase tracking-wider">Planning Focus</div>
              <div className="font-semibold mt-1">{marketContext.primaryVideoFocus.join(' * ')}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-100'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricCard
            title="Advertiser Share"
            value={`${signal.summary.marketShare}%`}
            subtext="Traffic share in Signal cohort"
            positive={signal.summary.marketShare >= 15}
          />
          <MetricCard
            title="Monthly Visits"
            value={formatVisits(signal.summary.monthlyVisits)}
            subtext={`${signal.traffic.currentMonth.changePct >= 0 ? '+' : ''}${signal.traffic.currentMonth.changePct}% vs prior month`}
            positive={signal.traffic.currentMonth.changePct >= 0}
          />
          <MetricCard
            title="SEO Gap Count"
            value={signal.summary.seoGapCount.toLocaleString()}
            subtext="High-volume competitor opportunities"
            positive={false}
          />
          <MetricCard
            title="AI Visibility"
            value={`${signal.summary.aiVisibilityScore}%`}
            subtext="Relative AI citation index"
            positive={signal.summary.aiVisibilityScore >= 50}
          />
          <MetricCard
            title="Market Size"
            value={formatVisits(marketContext.population)}
            subtext={`${marketContext.households.toLocaleString()} households`}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Competitive Share of Visits</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketShareData}
                        cx="50%"
                        cy="50%"
                        outerRadius={105}
                        innerRadius={50}
                        dataKey="visits"
                        label={({ name, share }) => `${name}: ${share}%`}
                        labelLine={false}
                      >
                        {marketShareData.map((entry, index) => (
                          <Cell key={entry.name} fill={entry.isAdvertiser ? '#1d4ed8' : palette[index % palette.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `${formatVisits(v)} visits`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Traffic Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={signal.traffic.trend} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} stroke="#e2e8f0" />
                      <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}K`} />
                      <Tooltip formatter={(v) => `${formatVisits(v)} visits`} />
                      <Line type="monotone" dataKey="visits" stroke="#1d4ed8" strokeWidth={3} dot={{ fill: '#1d4ed8', r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Top Competitor Quality Metrics</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={competitorBars} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value, key) => (key === 'visits' ? [`${value}K`, 'Visits'] : [value, key])} />
                      <Bar dataKey="visits" fill="#0ea5e9" name="Visits (K)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-xs text-gray-500">Quality columns include bounce rate, pages per visit, and time-on-site in source snapshot.</div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">SEO Opportunity Gaps</h3>
                <div className="space-y-2">
                  {seoOpportunities.slice(0, 8).map((row) => (
                    <div key={`${row.keyword}-${row.competitor}`} className="p-3 bg-slate-50 rounded-md border border-slate-100">
                      <div className="text-sm font-semibold text-gray-900">{row.keyword}</div>
                      <div className="text-xs text-gray-600 mt-1">Competitor: {row.competitor}</div>
                      <div className="text-xs text-blue-700 mt-1">
                        {row.volume ? `${row.volume.toLocaleString()} monthly searches` : 'Category-critical keyword gap'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">AI Visibility Ranking</h3>
                <div className="space-y-2">
                  {signal.aiVisibility.rankings.slice(0, 5).map((row) => (
                    <div key={row.name} className="flex items-center justify-between bg-slate-50 rounded-md px-3 py-2">
                      <div className="text-sm font-medium text-gray-900">#{row.rank} {row.name}</div>
                      <div className="text-sm font-bold text-blue-700">{row.score}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Market Notes</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {signal.insights.map((insight) => (
                    <div key={insight} className="flex gap-2">
                      <span className="text-blue-600">*</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  Demographic source: {marketContext.demographicsSource}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'competitors' && (
          <CompetitorComparison signal={signal} advertiserName={advertiser.name} />
        )}

        {activeTab === 'arcade' && isTombola && (
          <ArcadeView />
        )}

        {activeTab === 'segments' && isTombola && (
          <SegmentView signal={signal} advertiserName={advertiser.name} />
        )}

        <MediaReachTable
          title={mediaReachTable.title}
          subtitle={mediaReachTable.subtitle}
          rows={mediaReachTable.rows}
        />
      </div>

      <SignalChatWidget
        signal={signal}
        advertiserName={advertiser.name}
        countryCode={countryCode}
      />
    </div>
  );
}

export default SignalIntelligence;
