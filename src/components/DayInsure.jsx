import React, { useState, useMemo } from 'react';
import { usePlatform } from '../context/PlatformContext.jsx';

// Day Insure segment definitions with Rosetta Stone scores
const SEGMENTS = [
  {
    id: 'van_high_risk',
    name: 'Van High-Risk / Hard-to-Insure',
    shortName: 'Van High-Risk',
    color: '#dc2626',
    bgClass: 'bg-red-500',
    lightBg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    description: 'Drivers with convictions, non-UK residents, or other risk factors who cannot get standard insurance.',
    buyerProfile: 'Self (direct buyer)',
    budgetShare: 25,
    geoSignal: 'Urban, migrant-heavy, logistics areas',
    topMSOAs: ['E6 / E13 (East London)', 'LE2-LE5 (Leicester)', 'CV6 (Coventry)', 'B8 / B23 (Birmingham)', 'BB1 (Blackburn)'],
    keywords: ['temp van insurance', 'insurance with conviction', 'van insurance non uk resident', 'short term van insurance with points'],
    rosetta: { M_KEY: 20, M_GEO: 16, M_CRM: 15, M_CTX: 12, M_LAL: 12, M_CHAN: 9, M_INT: 9, M_TIME: 9 },
    conversionSignals: [
      { signal: 'Van product selected', weight: 3, indicator: 'positive' },
      { signal: 'Non-standard disclosure present', weight: 4, indicator: 'positive' },
      { signal: 'High-risk MSOA postcode', weight: 3, indicator: 'positive' },
      { signal: 'Comparison site referral', weight: 2, indicator: 'positive' },
      { signal: 'Claims history flag', weight: -3, indicator: 'negative' },
    ],
    channelSplit: { Google: 60, Meta: 15, Programmatic: 25 },
    msoaEfficiency: { demandShare: 14.2, baseShare: 8.6, lift: 1.65 },
  },
  {
    id: 'van_traders',
    name: 'Van Traders / Sporadic Cover',
    shortName: 'Van Traders',
    color: '#ea580c',
    bgClass: 'bg-orange-500',
    lightBg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-700 dark:text-orange-300',
    description: 'Self-employed tradespeople needing temporary van insurance for specific jobs.',
    buyerProfile: 'Self (direct buyer)',
    budgetShare: 35,
    geoSignal: 'Suburban industrial belts, trade towns',
    topMSOAs: ['DE7 (Derbyshire)', 'ME5 / ME8 (Medway)', 'SS8 / CM7 (Essex)', 'PO2 / PO9 (Portsmouth)', 'S71 (Barnsley)'],
    keywords: ['one day van insurance', 'temporary van insurance for work', 'courier van insurance', 'van insurance for one job'],
    rosetta: { M_KEY: 20, M_GEO: 16, M_INT: 16, M_CTX: 16, M_TIME: 16, M_CHAN: 12, M_CRM: 12, M_LAL: 12 },
    conversionSignals: [
      { signal: 'Van product selected', weight: 3, indicator: 'positive' },
      { signal: 'Short duration (1-7 days)', weight: 4, indicator: 'positive' },
      { signal: 'Weekday purchase', weight: 2, indicator: 'positive' },
      { signal: 'Repeat customer', weight: 5, indicator: 'positive' },
      { signal: 'Trade area MSOA', weight: 3, indicator: 'positive' },
    ],
    channelSplit: { Google: 45, Meta: 25, Programmatic: 30 },
    msoaEfficiency: { demandShare: 10.9, baseShare: 6.8, lift: 1.60 },
  },
  {
    id: 'student_parents',
    name: 'Students — Holiday Cover (Parent Buyer)',
    shortName: 'Student Parents',
    color: '#7c3aed',
    bgClass: 'bg-violet-500',
    lightBg: 'bg-violet-50 dark:bg-violet-900/20',
    border: 'border-violet-200 dark:border-violet-800',
    text: 'text-violet-700 dark:text-violet-300',
    description: 'Parents buying temporary insurance for university students home for holidays to drive the family car.',
    buyerProfile: 'Parent buys for student',
    budgetShare: 15,
    geoSignal: 'Affluent suburban family geographies',
    topMSOAs: ['CR2 (Croydon)', 'SK7 (Stockport)', 'AL5 (Harpenden)', 'SL6 (Maidenhead)', 'WD3 (Rickmansworth)'],
    keywords: ['student car insurance temporary', 'home from uni car insurance', 'borrow parents car insurance', 'holiday car insurance student'],
    rosetta: { M_TIME: 25, M_KEY: 20, M_GEO: 16, M_CTX: 16, M_CHAN: 16, M_CRM: 15, M_LAL: 16, M_INT: 9 },
    conversionSignals: [
      { signal: 'Car product (not van)', weight: 2, indicator: 'positive' },
      { signal: 'Buyer age 40-60', weight: 4, indicator: 'positive' },
      { signal: 'Named driver age 18-22', weight: 5, indicator: 'positive' },
      { signal: 'Holiday period timing', weight: 4, indicator: 'positive' },
      { signal: 'Affluent suburb MSOA', weight: 3, indicator: 'positive' },
    ],
    channelSplit: { Google: 35, Meta: 40, Programmatic: 25 },
    msoaEfficiency: { demandShare: 10.4, baseShare: 6.4, lift: 1.63 },
  },
  {
    id: 'new_driver_parents',
    name: 'New Drivers / Learners (Parent Buyer)',
    shortName: 'New Drivers',
    color: '#2563eb',
    bgClass: 'bg-blue-500',
    lightBg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    description: 'Parents buying temporary learner insurance for 17-year-olds learning to drive on the family car.',
    buyerProfile: 'Parent buys for learner',
    budgetShare: 25,
    geoSignal: 'Affluent suburban multi-car households',
    topMSOAs: ['RG4 / RG9 (Reading)', 'GU9 (Farnham)', 'WA4 (Warrington)', 'SL9 (Gerrards Cross)', 'AL5 (Harpenden)'],
    keywords: ['temporary learner insurance', 'learner insurance on parents car', 'young driver temporary insurance', 'provisional licence insurance'],
    rosetta: { M_KEY: 20, M_GEO: 16, M_CTX: 16, M_CHAN: 16, M_TIME: 16, M_CRM: 15, M_LAL: 16, M_INT: 12 },
    conversionSignals: [
      { signal: 'Car product (not van)', weight: 2, indicator: 'positive' },
      { signal: 'Buyer age 40-60', weight: 4, indicator: 'positive' },
      { signal: 'Named driver age 17', weight: 5, indicator: 'positive' },
      { signal: 'Provisional licence flag', weight: 5, indicator: 'positive' },
      { signal: 'Family suburb MSOA', weight: 3, indicator: 'positive' },
    ],
    channelSplit: { Google: 40, Meta: 35, Programmatic: 25 },
    msoaEfficiency: { demandShare: 10.8, baseShare: 6.6, lift: 1.64 },
  },
];

const MECHANISM_LABELS = {
  M_GEO: 'Geographic',
  M_CHAN: 'Channel',
  M_INT: 'Interest',
  M_CTX: 'Contextual',
  M_KEY: 'Search',
  M_CRM: 'CRM',
  M_LAL: 'Lookalike',
  M_TIME: 'Temporal',
};

const MECHANISM_COLORS = {
  M_GEO: '#2563eb',
  M_CHAN: '#7c3aed',
  M_INT: '#059669',
  M_CTX: '#ea580c',
  M_KEY: '#0891b2',
  M_CRM: '#be185d',
  M_LAL: '#4f46e5',
  M_TIME: '#ca8a04',
};

const FIRST_PARTY_DATA = [
  { field: 'Customer postcode', status: 'required', purpose: 'MSOA mapping for geo-targeting and value clustering', priority: 'critical' },
  { field: 'Product purchased', status: 'required', purpose: 'Segment classification (van/car, duration, cover type)', priority: 'critical' },
  { field: 'Gross revenue / margin', status: 'required', purpose: '80/20 value scoring and LTV modeling', priority: 'critical' },
  { field: 'Repeat purchase flag', status: 'required', purpose: 'Retention proxy and high-value identification', priority: 'critical' },
  { field: 'Quote source / channel', status: 'required', purpose: 'Channel attribution and CPA by segment', priority: 'high' },
  { field: 'Claims / cost proxy', status: 'desired', purpose: 'True profitability scoring (revenue minus claims)', priority: 'high' },
  { field: 'Named driver age', status: 'desired', purpose: 'Parent-buyer segment identification', priority: 'high' },
  { field: 'Buyer age', status: 'desired', purpose: 'Parent vs self-buyer classification', priority: 'medium' },
  { field: 'Quote start abandoned', status: 'desired', purpose: 'Retargeting and funnel optimization', priority: 'medium' },
  { field: 'Policy duration selected', status: 'available', purpose: 'Segment behavior profiling', priority: 'medium' },
];

function ScoreBar({ value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function ConversionScorer({ segment }) {
  const totalPositive = segment.conversionSignals
    .filter(s => s.indicator === 'positive')
    .reduce((sum, s) => sum + s.weight, 0);
  const totalNegative = Math.abs(
    segment.conversionSignals
      .filter(s => s.indicator === 'negative')
      .reduce((sum, s) => sum + s.weight, 0)
  );
  const netScore = totalPositive - totalNegative;
  const maxPossible = segment.conversionSignals.reduce((sum, s) => sum + Math.abs(s.weight), 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 dark:text-slate-400">Conversion Quality Score</span>
        <span className={`text-lg font-bold ${segment.text}`}>{netScore}/{maxPossible}</span>
      </div>
      {segment.conversionSignals.map((sig, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className={`w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-bold ${
            sig.indicator === 'positive' ? 'bg-emerald-500' : 'bg-red-500'
          }`}>
            {sig.indicator === 'positive' ? '+' : '-'}{Math.abs(sig.weight)}
          </span>
          <span className="text-gray-700 dark:text-slate-300">{sig.signal}</span>
        </div>
      ))}
    </div>
  );
}

function RosettaBreakdown({ rosetta, color }) {
  const max = Math.max(...Object.values(rosetta));
  const sorted = Object.entries(rosetta).sort((a, b) => b[1] - a[1]);
  const total = Object.values(rosetta).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-1.5">
      {sorted.map(([mech, score]) => {
        const pct = ((score / total) * 100).toFixed(0);
        return (
          <div key={mech} className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-500 dark:text-slate-400 w-12">{MECHANISM_LABELS[mech]?.slice(0, 7) || mech}</span>
            <div className="flex-1">
              <ScoreBar value={score} max={max} color={MECHANISM_COLORS[mech] || color} />
            </div>
            <span className="text-[10px] font-medium text-gray-600 dark:text-slate-300 w-8 text-right">{score}</span>
            <span className="text-[10px] text-gray-400 dark:text-slate-500 w-8 text-right">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

function SegmentCard({ segment, isExpanded, onToggle }) {
  return (
    <div className={`rounded-xl border ${segment.border} ${segment.lightBg} overflow-hidden transition-all`}>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${segment.bgClass}`} />
          <div>
            <div className={`text-sm font-semibold ${segment.text}`}>{segment.name}</div>
            <div className="text-[11px] text-gray-500 dark:text-slate-400">{segment.buyerProfile} &middot; {segment.budgetShare}% budget</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-gray-400 dark:text-slate-500">MSOA Efficiency</div>
            <div className={`text-sm font-bold ${segment.text}`}>{segment.msoaEfficiency.lift}x</div>
          </div>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-200/50 dark:border-slate-700/50 pt-4">
          <p className="text-xs text-gray-600 dark:text-slate-300">{segment.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rosetta Stone */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-slate-200 mb-2">Rosetta Stone (P x S)</h4>
              <RosettaBreakdown rosetta={segment.rosetta} color={segment.color} />
            </div>

            {/* Conversion Scorer */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-slate-200 mb-2">Conversion Value Signals</h4>
              <ConversionScorer segment={segment} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Channel Split */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-slate-200 mb-2">Channel Budget Split</h4>
              <div className="space-y-1.5">
                {Object.entries(segment.channelSplit).map(([ch, pct]) => (
                  <div key={ch} className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 dark:text-slate-400 w-20">{ch}</span>
                    <div className="flex-1">
                      <ScoreBar value={pct} max={100} color={segment.color} />
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 dark:text-slate-300 w-8 text-right">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-slate-200 mb-2">Priority Keywords</h4>
              <div className="space-y-1">
                {segment.keywords.map((kw, i) => (
                  <div key={i} className="text-[11px] text-gray-600 dark:text-slate-300 font-mono bg-white/50 dark:bg-slate-800/50 px-2 py-0.5 rounded">
                    {kw}
                  </div>
                ))}
              </div>
            </div>

            {/* Top MSOAs */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-slate-200 mb-2">Top MSOA Clusters</h4>
              <div className="space-y-1">
                {segment.topMSOAs.map((msoa, i) => (
                  <div key={i} className="text-[11px] text-gray-600 dark:text-slate-300">
                    <span className="font-medium">{i + 1}.</span> {msoa}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-[10px] text-gray-400 dark:text-slate-500">
                Top 500 MSOAs capture {segment.msoaEfficiency.demandShare}% of demand from {segment.msoaEfficiency.baseShare}% of base
              </div>
            </div>
          </div>

          {/* Geo signal */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-gray-400 dark:text-slate-500">Geo signal:</span>
            <span className="text-gray-600 dark:text-slate-300 font-medium">{segment.geoSignal}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DayInsure() {
  const { advertiser } = usePlatform();
  const [expandedSegment, setExpandedSegment] = useState('van_high_risk');
  const [activeTab, setActiveTab] = useState('segments');

  const tabs = [
    { key: 'segments', label: 'Segments & Scoring' },
    { key: 'value', label: '80/20 Value Model' },
    { key: 'data', label: '1st Party Data Map' },
  ];

  const totalRosetta = useMemo(() => {
    const totals = {};
    for (const seg of SEGMENTS) {
      for (const [mech, score] of Object.entries(seg.rosetta)) {
        totals[mech] = (totals[mech] || 0) + score * (seg.budgetShare / 100);
      }
    }
    return totals;
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-20 w-56 h-56 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-teal-400/10 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">DayInsure</h1>
            <span className="px-2 py-0.5 text-[10px] font-medium bg-emerald-500/30 text-emerald-200 rounded-full border border-emerald-500/30">
              {advertiser?.name || 'Day Insure'}
            </span>
          </div>
          <p className="text-sm text-slate-200 max-w-2xl">
            Conversion value scoring, segment analysis, and audience strategy for Day Insure's four priority customer segments. Score every conversion for profitability at point of sale.
          </p>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SEGMENTS.map((seg) => (
          <div key={seg.id} className={`rounded-lg border ${seg.border} ${seg.lightBg} p-3`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${seg.bgClass}`} />
              <span className="text-[11px] font-medium text-gray-700 dark:text-slate-200">{seg.shortName}</span>
            </div>
            <div className={`text-xl font-bold ${seg.text}`}>{seg.budgetShare}%</div>
            <div className="text-[10px] text-gray-400 dark:text-slate-500">budget allocation</div>
            <div className="mt-1 text-[10px] text-gray-500 dark:text-slate-400">
              {seg.msoaEfficiency.lift}x geo lift &middot; {Object.entries(seg.rosetta).sort((a,b) => b[1]-a[1])[0][1]} top mech
            </div>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'segments' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-slate-200">Customer Segments & Conversion Scoring</h2>
            <span className="text-[10px] text-gray-400 dark:text-slate-500">Click segment to expand Rosetta Stone + signals</span>
          </div>
          {SEGMENTS.map((seg) => (
            <SegmentCard
              key={seg.id}
              segment={seg}
              isExpanded={expandedSegment === seg.id}
              onToggle={() => setExpandedSegment(expandedSegment === seg.id ? null : seg.id)}
            />
          ))}

          {/* Weighted Rosetta summary */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">Weighted Rosetta Stone (Budget-Adjusted)</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">Combined mechanism scores weighted by each segment's budget allocation</p>
            <div className="space-y-2">
              {Object.entries(totalRosetta)
                .sort((a, b) => b[1] - a[1])
                .map(([mech, score]) => {
                  const max = Math.max(...Object.values(totalRosetta));
                  const total = Object.values(totalRosetta).reduce((s, v) => s + v, 0);
                  return (
                    <div key={mech} className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-600 dark:text-slate-300 w-24">{MECHANISM_LABELS[mech]}</span>
                      <div className="flex-1">
                        <ScoreBar value={score} max={max} color={MECHANISM_COLORS[mech]} />
                      </div>
                      <span className="text-xs font-mono text-gray-600 dark:text-slate-300 w-12 text-right">{score.toFixed(1)}</span>
                      <span className="text-[10px] text-gray-400 dark:text-slate-500 w-10 text-right">{((score / total) * 100).toFixed(0)}%</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'value' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-1">80/20 Customer Value Model</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">
              80% of Day Insure's revenue comes from 20% of customers. This model identifies and scores high-value customers at point of conversion.
            </p>

            {/* Value distribution visual */}
            <div className="mb-6">
              <div className="flex items-end gap-0.5 h-32 mb-2">
                {Array.from({ length: 20 }, (_, i) => {
                  const height = i < 4 ? 80 + (4 - i) * 5 : Math.max(8, 60 - (i - 4) * 3.5);
                  const isTop20 = i < 4;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-t transition-all ${
                        isTop20 ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-gray-200 dark:bg-slate-700'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>
              <div className="flex">
                <div className="w-1/5 text-center">
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Top 20%</div>
                  <div className="text-[10px] text-gray-500 dark:text-slate-400">80% of revenue</div>
                </div>
                <div className="w-4/5 text-center">
                  <div className="text-xs font-medium text-gray-500 dark:text-slate-400">Remaining 80%</div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500">20% of revenue</div>
                </div>
              </div>
            </div>

            {/* Value scoring formula */}
            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">Customer Value Score Formula</h3>
              <div className="font-mono text-sm text-teal-700 dark:text-teal-300 bg-white dark:bg-slate-900 rounded p-3 border border-gray-200 dark:border-slate-700">
                Value = Gross Margin - Claims Cost - Servicing Cost + Repeat Likelihood
              </div>
              <p className="mt-2 text-[11px] text-gray-500 dark:text-slate-400">
                Rank all customers by this score. The top 20% define your high-value segment. Map their postcodes to MSOAs to find concentration patterns.
              </p>
            </div>

            {/* Geo tiers */}
            <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">Geographic Value Tiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-3">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">Tier A: Protect & Grow</div>
                <div className="text-[11px] text-gray-600 dark:text-slate-300">
                  Existing high-value customer concentration + high modeled propensity. Maximum bid multipliers, full channel activation.
                </div>
              </div>
              <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3">
                <div className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">Tier B: Prospect & Test</div>
                <div className="text-[11px] text-gray-600 dark:text-slate-300">
                  No current customers but high modeled propensity. Test with controlled budget, measure conversion rate vs Tier A.
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-3">
                <div className="text-xs font-bold text-gray-600 dark:text-slate-300 mb-1">Tier C: Search Only</div>
                <div className="text-[11px] text-gray-600 dark:text-slate-300">
                  Low value, low propensity. Search-only coverage, no proactive spend. Capture only when intent is explicit.
                </div>
              </div>
            </div>

            {/* Holdout */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">10% MSOA Holdout Recommended</div>
              <div className="text-[11px] text-gray-600 dark:text-slate-300">
                Reserve 10% of high-propensity MSOAs as a holdout to prove geo-targeting lift before scaling. Compare conversion rates, CPAs, and LTV between targeted and holdout areas.
              </div>
            </div>
          </div>

          {/* Conversion scoring at point of sale */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-1">Point-of-Conversion Scoring</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
              Score every conversion in real time to determine segment, predicted value, and whether the acquisition is profitable.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-semibold text-gray-700 dark:text-slate-200 mb-2">Scoring Inputs (at conversion)</h3>
                <div className="space-y-1.5">
                  {[
                    { input: 'Product type', use: 'Van vs Car classification' },
                    { input: 'Cover duration', use: 'Short sporadic vs extended use' },
                    { input: 'Buyer postcode', use: 'MSOA tier + segment affinity' },
                    { input: 'Driver age', use: 'Learner/student/standard split' },
                    { input: 'Buyer vs driver', use: 'Parent-buyer identification' },
                    { input: 'Referral source', use: 'Channel quality weighting' },
                    { input: 'Day/time of purchase', use: 'Trader weekday vs parent weekend' },
                    { input: 'Disclosure flags', use: 'High-risk segment marker' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <span className="font-medium text-gray-700 dark:text-slate-200 w-28 shrink-0">{item.input}</span>
                      <span className="text-gray-500 dark:text-slate-400">{item.use}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-700 dark:text-slate-200 mb-2">Scoring Outputs</h3>
                <div className="space-y-2">
                  {[
                    { output: 'Segment assignment', desc: 'Which of 4 segments this conversion belongs to', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' },
                    { output: 'Value prediction', desc: 'Low / Medium / High LTV probability', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
                    { output: 'Repeat probability', desc: 'Likelihood of return purchase based on signals', color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' },
                    { output: 'Profitability flag', desc: 'Green/amber/red based on margin vs acquisition cost', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
                  ].map((item, i) => (
                    <div key={i} className={`rounded-lg p-2 ${item.color}`}>
                      <div className="text-xs font-semibold">{item.output}</div>
                      <div className="text-[10px] opacity-80">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-1">1st Party Data Integration Map</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
              What Day Insure data we need, what it enables, and integration priorities.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-left py-2 pr-4 font-semibold text-gray-700 dark:text-slate-200">Data Field</th>
                    <th className="text-left py-2 pr-4 font-semibold text-gray-700 dark:text-slate-200">Status</th>
                    <th className="text-left py-2 pr-4 font-semibold text-gray-700 dark:text-slate-200">Purpose</th>
                    <th className="text-left py-2 font-semibold text-gray-700 dark:text-slate-200">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {FIRST_PARTY_DATA.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-slate-800">
                      <td className="py-2 pr-4 font-medium text-gray-700 dark:text-slate-200">{item.field}</td>
                      <td className="py-2 pr-4">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          item.status === 'required' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                          item.status === 'desired' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                          'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-gray-500 dark:text-slate-400">{item.purpose}</td>
                      <td className="py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          item.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                          item.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                          'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Integration roadmap */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Integration Roadmap</h2>
            <div className="space-y-4">
              {[
                {
                  phase: 'Phase 1: Minimum Viable Data',
                  timeline: 'Week 1-2',
                  items: ['Customer postcode extract', 'Product type mapping', 'Gross revenue per policy'],
                  unlocks: 'MSOA mapping, segment classification, basic value scoring',
                  color: 'border-emerald-300 dark:border-emerald-700',
                },
                {
                  phase: 'Phase 2: Value Layer',
                  timeline: 'Week 3-4',
                  items: ['Claims / cost proxy', 'Repeat purchase flags', 'Quote source attribution'],
                  unlocks: 'True profitability scoring, 80/20 customer identification, channel ROI',
                  color: 'border-blue-300 dark:border-blue-700',
                },
                {
                  phase: 'Phase 3: Activation Layer',
                  timeline: 'Week 5-6',
                  items: ['Named driver age', 'Quote abandonment data', 'CRM email match rates'],
                  unlocks: 'Parent-buyer identification, retargeting audiences, lookalike seeding',
                  color: 'border-violet-300 dark:border-violet-700',
                },
              ].map((phase, i) => (
                <div key={i} className={`border-l-4 ${phase.color} pl-4`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">{phase.phase}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400">{phase.timeline}</span>
                  </div>
                  <div className="mb-1.5">
                    {phase.items.map((item, j) => (
                      <div key={j} className="text-xs text-gray-600 dark:text-slate-300 flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-slate-500" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-slate-400">
                    <span className="font-medium">Unlocks:</span> {phase.unlocks}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitive data gap */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-1">Competitive Position from Signal</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">Current intelligence from Signal data</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Monthly Visits', value: '307.7K', sub: '4th of 5', color: 'text-blue-600 dark:text-blue-400' },
                { label: 'AI Visibility', value: '31.5%', sub: 'Leading (competitors 0%)', color: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'Organic Share', value: '40.1%', sub: 'Primary channel', color: 'text-violet-600 dark:text-violet-400' },
                { label: 'Email Share', value: '0.05%', sub: 'Retention gap', color: 'text-red-600 dark:text-red-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
                  <div className="text-[10px] text-gray-500 dark:text-slate-400 mb-1">{stat.label}</div>
                  <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
