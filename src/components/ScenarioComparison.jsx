import React, { useState } from 'react';

function formatBudget(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function formatHouseholds(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

const METRICS = [
  { key: 'budget', label: 'Budget', format: (v) => formatBudget(v), bestMode: null },
  { key: 'reach', label: 'Deduped Reach', format: (v) => formatHouseholds(v), bestMode: 'max' },
  { key: 'frequency', label: 'Avg Frequency', format: (v) => `${v}x`, bestMode: null },
  { key: 'blendedCPM', label: 'Blended CPM', format: (v) => `$${v.toFixed(2)}`, bestMode: 'min' },
  { key: 'costPerReachPoint', label: 'Cost / Reach Pt', format: (v) => formatBudget(v), bestMode: 'min' },
  { key: 'activeProviders', label: 'Active Providers', format: (v) => v.toString(), bestMode: null },
];

const ScenarioComparison = ({ budgetMetrics, onRestoreScenario }) => {
  const [scenarios, setScenarios] = useState([]);

  const saveScenario = () => {
    if (!budgetMetrics || scenarios.length >= 3) return;

    const US_TV_HOUSEHOLDS = 131000000;
    const reachPct = US_TV_HOUSEHOLDS > 0 ? (budgetMetrics.reach / US_TV_HOUSEHOLDS) * 100 : 0;
    const costPerReachPoint = reachPct > 0 ? budgetMetrics.totalBudget / reachPct : 0;

    const scenario = {
      id: Date.now(),
      name: String.fromCharCode(65 + scenarios.length), // A, B, C
      savedAt: new Date().toLocaleTimeString(),
      budget: budgetMetrics.totalBudget,
      reach: budgetMetrics.reach,
      frequency: budgetMetrics.frequency,
      blendedCPM: budgetMetrics.blendedCPM,
      costPerReachPoint,
      activeProviders: budgetMetrics.enabledProviders?.length || 0,
      allocations: { ...budgetMetrics.allocations },
      enabledProviders: [...(budgetMetrics.enabledProviders || [])],
    };

    setScenarios(prev => [...prev, scenario]);
  };

  const removeScenario = (id) => {
    setScenarios(prev => {
      const filtered = prev.filter(s => s.id !== id);
      return filtered.map((s, i) => ({ ...s, name: String.fromCharCode(65 + i) }));
    });
  };

  const clearAll = () => setScenarios([]);

  const getBestForMetric = (metric) => {
    if (!metric.bestMode || scenarios.length < 2) return null;
    let bestIdx = 0;
    for (let i = 1; i < scenarios.length; i++) {
      const curr = scenarios[i][metric.key];
      const best = scenarios[bestIdx][metric.key];
      if (metric.bestMode === 'max' && curr > best) bestIdx = i;
      if (metric.bestMode === 'min' && curr < best) bestIdx = i;
    }
    return scenarios[bestIdx].id;
  };

  // Determine best value and best reach scenarios
  const bestValueId = scenarios.length >= 2
    ? scenarios.reduce((best, s) => s.blendedCPM < best.blendedCPM ? s : best, scenarios[0]).id
    : null;
  const bestReachId = scenarios.length >= 2
    ? scenarios.reduce((best, s) => s.reach > best.reach ? s : best, scenarios[0]).id
    : null;

  const canSave = budgetMetrics && budgetMetrics.totalBudget > 0 && budgetMetrics.reach > 0 && scenarios.length < 3;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 text-sm font-bold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Scenario Comparison</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={saveScenario}
            disabled={!canSave}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              canSave
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Save Current as Scenario {scenarios.length < 3 ? String.fromCharCode(65 + scenarios.length) : ''}
          </button>
          {scenarios.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {scenarios.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-3xl mb-2">
            <svg className="w-8 h-8 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <div className="text-sm">Save up to 3 scenarios to compare different budget configurations side-by-side</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-xs font-medium text-gray-500 w-36">Metric</th>
                {scenarios.map(s => (
                  <th key={s.id} className="text-center py-2 px-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                        {s.name}
                      </span>
                      <span className="text-xs text-gray-400">{s.savedAt}</span>
                      <button
                        onClick={() => removeScenario(s.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map(metric => {
                const bestId = getBestForMetric(metric);
                return (
                  <tr key={metric.key} className="border-b border-gray-50">
                    <td className="py-2.5 pr-4 text-xs font-medium text-gray-600">{metric.label}</td>
                    {scenarios.map(s => {
                      const isBest = bestId === s.id;
                      return (
                        <td key={s.id} className="text-center py-2.5 px-3">
                          <span className={`text-sm font-semibold ${isBest ? 'text-green-700' : 'text-gray-900'}`}>
                            {metric.format(s[metric.key])}
                          </span>
                          {isBest && (
                            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-100 text-green-600 text-[10px]">
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Best badges row */}
          {scenarios.length >= 2 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex">
                <div className="w-36 pr-4" />
                {scenarios.map(s => (
                  <div key={s.id} className="flex-1 text-center space-y-1">
                    {bestValueId === s.id && (
                      <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-semibold rounded-full border border-green-200">
                        Best value
                      </span>
                    )}
                    {bestReachId === s.id && (
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full border border-blue-200">
                        Best reach
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScenarioComparison;
