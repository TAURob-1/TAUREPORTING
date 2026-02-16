import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BUDGET_PRESETS,
  getProviderPlanning,
  calcProviderReach,
  calcCombinedMetrics,
  autoOptimize,
} from '../data/countryPlanning';
import { getChannelInventory, getChannelProviderMap } from '../data/countryChannelInventory';
import { usePlatform } from '../context/PlatformContext.jsx';

function formatBudget(n, currencySymbol) {
  if (n >= 1000000) return `${currencySymbol}${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${currencySymbol}${(n / 1000).toFixed(0)}K`;
  return `${currencySymbol}${n}`;
}

function formatHouseholds(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

const BudgetAllocator = ({ onMetricsChange }) => {
  const { countryCode, countryConfig } = usePlatform();
  const [totalBudget, setTotalBudget] = useState(500000);
  const [budgetInput, setBudgetInput] = useState('500,000');
  const [mode, setMode] = useState('auto');
  const [enabledProviders, setEnabledProviders] = useState(new Set());
  const [allocations, setAllocations] = useState({});

  const providerPlanning = useMemo(() => getProviderPlanning(countryCode), [countryCode]);
  const providers = useMemo(() => {
    const inventory = getChannelInventory(countryCode);
    const channelMap = getChannelProviderMap(countryCode);

    return [...inventory.ctv, ...inventory.traditional]
      .filter((channel) => channelMap[channel.name])
      .map((channel) => {
        const providerId = channelMap[channel.name];
        return { ...channel, providerId, planning: providerPlanning[providerId] };
      });
  }, [countryCode, providerPlanning]);

  useEffect(() => {
    setEnabledProviders(new Set(providers.map((provider) => provider.providerId)));
    setAllocations({});
  }, [countryCode, providers]);

  const enabledIds = useMemo(() => Array.from(enabledProviders), [enabledProviders]);

  useEffect(() => {
    if (enabledIds.length === 0) {
      setAllocations({});
      return;
    }

    if (mode === 'auto') {
      setAllocations(autoOptimize(totalBudget, enabledIds, countryCode));
    } else if (mode === 'equal') {
      const perProvider = Math.floor(totalBudget / enabledIds.length);
      const remainder = totalBudget - perProvider * enabledIds.length;
      const result = {};
      enabledIds.forEach((id, i) => {
        result[id] = perProvider + (i === 0 ? remainder : 0);
      });
      setAllocations(result);
    }
  }, [totalBudget, mode, enabledIds, countryCode]);

  const metrics = useMemo(() => calcCombinedMetrics(allocations, countryCode), [allocations, countryCode]);

  useEffect(() => {
    if (onMetricsChange) {
      onMetricsChange({
        totalBudget,
        allocations,
        ...metrics,
        enabledProviders: enabledIds,
        countryCode,
      });
    }
  }, [metrics, totalBudget, allocations, enabledIds, countryCode, onMetricsChange]);

  const toggleProvider = useCallback((providerId) => {
    setEnabledProviders((prev) => {
      const next = new Set(prev);
      if (next.has(providerId)) {
        next.delete(providerId);
      } else {
        next.add(providerId);
      }
      return next;
    });
  }, []);

  const handleBudgetInputChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(raw, 10) || 0;
    setBudgetInput(num.toLocaleString());
    setTotalBudget(num);
  };

  const handlePreset = (value) => {
    setTotalBudget(value);
    setBudgetInput(value.toLocaleString());
  };

  const handleSliderChange = (providerId, value) => {
    setAllocations((prev) => ({ ...prev, [providerId]: Math.round(value) }));
  };

  const totalAllocated = useMemo(
    () => Object.values(allocations).reduce((sum, value) => sum + value, 0),
    [allocations]
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700 text-sm font-bold">
          {countryConfig.currencySymbol}
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Budget Allocation</h2>
      </div>

      {metrics.reach > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
          <span className="text-xs font-medium text-gray-500">Quick Stats:</span>
          <span className="px-2 py-1 bg-white rounded text-xs font-semibold text-blue-800 border border-blue-100">
            Reach: {formatHouseholds(metrics.reach)} HH
          </span>
          <span className="px-2 py-1 bg-white rounded text-xs font-semibold text-indigo-800 border border-indigo-100">
            Freq: {metrics.frequency}x
          </span>
          <span className="px-2 py-1 bg-white rounded text-xs font-semibold text-violet-800 border border-violet-100">
            GRPs: {metrics.grps}
          </span>
          <span className="px-2 py-1 bg-white rounded text-xs font-semibold text-green-800 border border-green-100">
            CPM: {countryConfig.currencySymbol}{metrics.blendedCPM.toFixed(2)}
          </span>
          <span className="px-2 py-1 bg-white rounded text-xs font-semibold text-gray-700 border border-gray-200">
            {enabledIds.length} providers
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Total Budget</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{countryConfig.currencySymbol}</span>
            <input
              type="text"
              value={budgetInput}
              onChange={handleBudgetInputChange}
              className="pl-6 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold w-36 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          {BUDGET_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePreset(preset.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                totalBudget === preset.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {formatBudget(preset.value, countryConfig.currencySymbol)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {[
          { key: 'auto', label: 'Auto-Optimize' },
          { key: 'equal', label: 'Equal Split' },
          { key: 'custom', label: 'Custom' },
        ].map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m.key
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium px-2 pb-1 border-b border-gray-100">
          <div className="col-span-1" />
          <div className="col-span-3">Provider</div>
          <div className="col-span-4">Allocation</div>
          <div className="col-span-2 text-right">Budget</div>
          <div className="col-span-2 text-right">Est. Reach</div>
        </div>

        {providers.map((provider) => {
          const enabled = enabledProviders.has(provider.providerId);
          const budget = allocations[provider.providerId] || 0;
          const pct = totalBudget > 0 ? (budget / totalBudget) * 100 : 0;
          const reach = enabled ? calcProviderReach(provider.providerId, budget, countryCode) : 0;

          return (
            <div
              key={provider.providerId}
              className={`grid grid-cols-12 gap-2 items-center px-2 py-2 rounded-lg transition-colors ${
                enabled ? 'bg-white' : 'bg-gray-50 opacity-50'
              }`}
            >
              <div className="col-span-1 flex items-center">
                <button
                  onClick={() => toggleProvider(provider.providerId)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    enabled
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-transparent hover:border-gray-400'
                  }`}
                >
                  {enabled && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="col-span-3 flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ backgroundColor: provider.color }}
                >
                  {provider.icon}
                </div>
                <span
                  className="text-sm font-medium text-gray-900 truncate"
                  title={`${provider.name} — CPM: ${countryConfig.currencySymbol}${provider.planning?.avgCPM || provider.cpm} | Reach: ${provider.reach || `${formatHouseholds(provider.planning?.totalHouseholds || 0)} HH`}`}
                >
                  {provider.name}
                </span>
              </div>

              <div className="col-span-4">
                {enabled ? (
                  <div className="relative h-6 flex items-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(pct, 100)}%`,
                            backgroundColor: provider.color,
                            opacity: 0.75,
                          }}
                        />
                      </div>
                    </div>
                    {mode === 'custom' && (
                      <input
                        type="range"
                        min={0}
                        max={totalBudget}
                        step={1000}
                        value={budget}
                        onChange={(e) => handleSliderChange(provider.providerId, Number(e.target.value))}
                        className="absolute inset-0 w-full h-6 opacity-0 cursor-pointer"
                      />
                    )}
                    <span className="absolute right-1 text-[10px] font-semibold text-gray-600">{pct.toFixed(0)}%</span>
                  </div>
                ) : (
                  <div className="h-3 bg-gray-100 rounded-full" />
                )}
              </div>

              <div className="col-span-2 text-right text-sm font-semibold text-gray-900">
                {enabled ? formatBudget(budget, countryConfig.currencySymbol) : '—'}
              </div>

              <div className="col-span-2 text-right text-sm text-blue-700 font-medium">
                {enabled && reach > 0 ? `${formatHouseholds(reach)} HH` : '—'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-12 gap-2 items-center px-2">
          <div className="col-span-1" />
          <div className="col-span-3 text-sm font-bold text-gray-900">Totals</div>
          <div className="col-span-4">
            <div className="flex items-center gap-3">
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${Math.min((totalAllocated / totalBudget) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600 w-10 text-right">
                {totalBudget > 0 ? Math.round((totalAllocated / totalBudget) * 100) : 0}%
              </span>
            </div>
          </div>
          <div className="col-span-2 text-right text-sm font-bold text-gray-900">
            {formatBudget(totalAllocated, countryConfig.currencySymbol)}
          </div>
          <div className="col-span-2 text-right text-sm font-bold text-blue-700">{formatHouseholds(metrics.reach)} HH</div>
        </div>

        <div className="flex flex-wrap gap-3 mt-3 px-2">
          <div className="px-3 py-1.5 bg-blue-50 rounded-full text-xs font-medium text-blue-800">
            Deduped Reach: {formatHouseholds(metrics.reach)} HH
          </div>
          <div className="px-3 py-1.5 bg-indigo-50 rounded-full text-xs font-medium text-indigo-800">
            Avg Freq: {metrics.frequency}x
          </div>
          <div className="px-3 py-1.5 bg-violet-50 rounded-full text-xs font-medium text-violet-800">
            GRPs: {metrics.grps}
          </div>
          <div className="px-3 py-1.5 bg-green-50 rounded-full text-xs font-medium text-green-800">
            Blended CPM: {countryConfig.currencySymbol}{metrics.blendedCPM.toFixed(2)}
          </div>
          <div className="px-3 py-1.5 bg-amber-50 rounded-full text-xs font-medium text-amber-800">
            {enabledIds.length} provider{enabledIds.length !== 1 ? 's' : ''} active
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAllocator;
