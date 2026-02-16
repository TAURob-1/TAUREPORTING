import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceDot,
} from 'recharts';
import {
  generateReachCurve,
  generateFrequencyDistribution,
  getMarketUniverse,
} from '../data/countryPlanning';
import { usePlatform } from '../context/PlatformContext.jsx';

function formatHouseholds(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

function formatBudgetAxis(n, currencySymbol) {
  if (n >= 1000000) return `${currencySymbol}${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${currencySymbol}${(n / 1000).toFixed(0)}K`;
  return `${currencySymbol}${n}`;
}

const ReachFrequency = ({ metrics }) => {
  const { countryCode, countryConfig } = usePlatform();
  const universe = getMarketUniverse(countryCode);

  const {
    totalBudget = 0,
    reach = 0,
    frequency = 0,
    blendedCPM = 0,
    grps = 0,
    enabledProviders = [],
  } = metrics || {};

  const curveData = useMemo(() => {
    if (enabledProviders.length === 0 || totalBudget === 0) return [];
    const maxBudgetForCurve = Math.max(totalBudget * 1.5, 200000);
    return generateReachCurve(enabledProviders, maxBudgetForCurve, 25, countryCode);
  }, [enabledProviders, totalBudget, countryCode]);

  const currentPoint = useMemo(() => {
    if (curveData.length === 0) return null;
    return { budget: totalBudget, reach };
  }, [curveData, totalBudget, reach]);

  const freqDist = useMemo(() => generateFrequencyDistribution(frequency), [frequency]);
  const maxFreqPct = Math.max(...freqDist.map((d) => d.pct), 1);

  const reachPct = universe > 0 ? (reach / universe) * 100 : 0;
  const costPerReachPoint = reachPct > 0 ? totalBudget / reachPct : 0;

  const hasData = enabledProviders.length > 0 && totalBudget > 0;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { budget, reach: pReach } = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs">
        <div className="text-gray-600">Budget: <span className="font-semibold text-gray-900">{formatBudgetAxis(budget, countryConfig.currencySymbol)}</span></div>
        <div className="text-gray-600">Reach: <span className="font-semibold text-blue-700">{formatHouseholds(pReach)} HH</span></div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-bold">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Reach, Frequency & GRP Estimate</h2>
      </div>

      {!hasData ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-sm">Set a budget and enable providers to see media metrics</div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="text-xs text-gray-500 mb-2 font-medium">Reach Curve — Budget vs. Deduplicated Households</div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={curveData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="budget" tickFormatter={(v) => formatBudgetAxis(v, countryConfig.currencySymbol)} tick={{ fill: '#6b7280', fontSize: 11 }} stroke="#d1d5db" />
                <YAxis tickFormatter={(v) => formatHouseholds(v)} tick={{ fill: '#6b7280', fontSize: 11 }} stroke="#d1d5db" width={60} domain={[0, 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="reach" stroke="#3b82f6" strokeWidth={3} fill="url(#reachGradient)" dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} isAnimationActive={false} />
                {currentPoint && (
                  <ReferenceDot x={currentPoint.budget} y={currentPoint.reach} r={8} fill="#3b82f6" stroke="#fff" strokeWidth={3} />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xs text-blue-600 font-medium">Deduped Reach</div>
              <div className="text-xl font-bold text-blue-900">{formatHouseholds(reach)}</div>
              <div className="text-[10px] text-blue-500">Households</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3 text-center">
              <div className="text-xs text-indigo-600 font-medium">Avg Frequency</div>
              <div className="text-xl font-bold text-indigo-900">{frequency}x</div>
              <div className="text-[10px] text-indigo-500">per household</div>
            </div>
            <div className="bg-violet-50 rounded-lg p-3 text-center">
              <div className="text-xs text-violet-600 font-medium">GRPs</div>
              <div className="text-xl font-bold text-violet-900">{grps}</div>
              <div className="text-[10px] text-violet-500">gross rating points</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-xs text-green-600 font-medium">Blended CPM</div>
              <div className="text-xl font-bold text-green-900">{countryConfig.currencySymbol}{blendedCPM.toFixed(2)}</div>
              <div className="text-[10px] text-green-500">cost per 1K</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-xs text-purple-600 font-medium">Cost / Reach Pt</div>
              <div className="text-xl font-bold text-purple-900">
                {countryConfig.currencySymbol}{costPerReachPoint >= 1000 ? `${(costPerReachPoint / 1000).toFixed(1)}K` : Math.round(costPerReachPoint)}
              </div>
              <div className="text-[10px] text-purple-500">per 1% of {countryConfig.shortLabel} HH</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-3 font-medium">Frequency Distribution</div>
            <div className="space-y-2">
              {freqDist.map((bucket) => {
                const isNotReached = bucket.label === 'Not reached';
                return (
                  <div key={bucket.label} className="flex items-center gap-3">
                    <div className={`w-24 text-xs font-medium ${isNotReached ? 'text-gray-400' : 'text-gray-700'}`}>
                      {bucket.label === 'Not reached' ? bucket.label : `${bucket.label} exposure`}
                    </div>
                    <div className="flex-1 h-5 bg-gray-50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isNotReached ? 'bg-gray-300' : 'bg-blue-500'}`}
                        style={{ width: `${(bucket.pct / maxFreqPct) * 100}%`, opacity: isNotReached ? 0.5 : 0.7 + (bucket.pct / maxFreqPct) * 0.3 }}
                      />
                    </div>
                    <div className={`w-10 text-right text-xs font-semibold ${isNotReached ? 'text-gray-400' : 'text-gray-700'}`}>
                      {bucket.pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReachFrequency;
