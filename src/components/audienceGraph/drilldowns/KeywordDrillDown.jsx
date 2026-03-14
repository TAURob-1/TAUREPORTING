import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { gatherKeywords } from '../../../lib/audienceGraph/computeBlueprint.js';
import { generateKeywords } from '../../../services/keywordGenerator.js';
import { getAggregatedPlatformTargeting } from '../../../data/audienceGraph/platformTargeting.js';

const CLUSTER_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#0ea5e9', '#14b8a6', '#f97316', '#84cc16',
];

const SORT_KEYS = ['term', 'volume', 'cpc', 'competition'];

export default function KeywordDrillDown({ selectedAttributes, blueprint }) {
  const { results: staticGroups, missingAttributes } = useMemo(
    () => gatherKeywords(selectedAttributes),
    [selectedAttributes],
  );

  const [aiGroups, setAiGroups] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    if (!missingAttributes || missingAttributes.length === 0) {
      setAiGroups([]);
      setAiError(null);
      return;
    }

    let cancelled = false;
    setAiLoading(true);
    setAiError(null);

    generateKeywords(missingAttributes)
      .then((groups) => {
        if (!cancelled) setAiGroups(groups);
      })
      .catch((err) => {
        if (!cancelled) setAiError(err.message);
      })
      .finally(() => {
        if (!cancelled) setAiLoading(false);
      });

    return () => { cancelled = true; };
  }, [missingAttributes]);

  const keywordGroups = useMemo(
    () => [...staticGroups, ...aiGroups],
    [staticGroups, aiGroups],
  );

  const [sortKey, setSortKey] = useState('volume');
  const [sortAsc, setSortAsc] = useState(false);

  /* Flatten all clusters for table / chart */
  const allClusters = useMemo(() => {
    const out = [];
    keywordGroups.forEach((kg) => {
      kg.clusters.forEach((cl) => {
        cl.keywords.forEach((kw) => {
          out.push({ ...kw, group: cl.group, attrLabel: kg.label });
        });
      });
    });
    return out;
  }, [keywordGroups]);

  /* Cluster summary for the grid */
  const clusterSummary = useMemo(() => {
    const map = {};
    keywordGroups.forEach((kg) => {
      kg.clusters.forEach((cl) => {
        const key = cl.group;
        if (!map[key]) map[key] = { group: cl.group, totalVolume: 0, keywords: 0, avgCpc: 0, cpcSum: 0, attrLabels: new Set() };
        cl.keywords.forEach((kw) => {
          map[key].totalVolume += kw.volume;
          map[key].cpcSum += kw.cpc;
          map[key].keywords += 1;
        });
        map[key].attrLabels.add(kg.label);
      });
    });
    return Object.values(map)
      .map((c) => ({ ...c, avgCpc: c.keywords > 0 ? +(c.cpcSum / c.keywords).toFixed(2) : 0, attrLabels: [...c.attrLabels] }))
      .sort((a, b) => b.totalVolume - a.totalVolume);
  }, [keywordGroups]);

  /* Sorted table rows */
  const sortedKeywords = useMemo(() => {
    const sorted = [...allClusters];
    sorted.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string') return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortAsc ? av - bv : bv - av;
    });
    return sorted;
  }, [allClusters, sortKey, sortAsc]);

  /* Bubble chart data */
  const bubbleData = useMemo(() => {
    const colorMap = {};
    let ci = 0;
    return allClusters.map((kw) => {
      if (!colorMap[kw.group]) colorMap[kw.group] = CLUSTER_COLORS[ci++ % CLUSTER_COLORS.length];
      return { ...kw, color: colorMap[kw.group] };
    });
  }, [allClusters]);

  /* Platform targeting data */
  const platformTargeting = useMemo(
    () => getAggregatedPlatformTargeting(selectedAttributes),
    [selectedAttributes],
  );

  const handleSort = useCallback((key) => {
    if (key === sortKey) { setSortAsc((p) => !p); } else { setSortKey(key); setSortAsc(false); }
  }, [sortKey]);

  /* CSV export */
  const exportCsv = useCallback(() => {
    const header = 'Group,Term,Volume,CPC (GBP),Competition\n';
    const rows = allClusters.map((kw) =>
      `"${kw.group}","${kw.term}",${kw.volume},${kw.cpc},${kw.competition}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyword-drilldown.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [allClusters]);

  if (keywordGroups.length === 0 && !aiLoading) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-slate-400">
        {aiError
          ? 'Could not generate keywords. Try adding behavioral or interest attributes.'
          : 'Select audience attributes to see keyword cluster data.'}
      </div>
    );
  }

  const maxVolume = clusterSummary.length ? clusterSummary[0].totalVolume : 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Search / Keyword Drill-Down</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {allClusters.length} keywords across {clusterSummary.length} clusters from {keywordGroups.length} attribute{keywordGroups.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <button
          onClick={exportCsv}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* AI generation status */}
      {aiLoading && (
        <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg text-sm text-indigo-700 dark:text-indigo-300">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          Generating keywords for {missingAttributes.map((a) => a.label).join(', ')}...
        </div>
      )}
      {aiError && !aiLoading && keywordGroups.length > 0 && (
        <div className="px-4 py-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300">
          Could not generate keywords for some attributes. Showing available static data.
        </div>
      )}

      {/* Cluster Grid */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">Keyword Clusters</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {clusterSummary.map((cl, i) => {
            const pct = Math.max(20, Math.round((cl.totalVolume / maxVolume) * 100));
            return (
              <div
                key={cl.group}
                className="relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-10 rounded-xl"
                  style={{ background: CLUSTER_COLORS[i % CLUSTER_COLORS.length], width: `${pct}%` }}
                />
                <div className="relative">
                  <h4 className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">{cl.group}</h4>
                  <div className="text-xl font-bold text-gray-900 dark:text-white mt-1">{cl.totalVolume.toLocaleString()}</div>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">
                    {cl.keywords} keywords &middot; avg CPC {cl.avgCpc} GBP
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Activation */}
      {platformTargeting.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">Platform Activation</h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">How each platform can target these audience attributes.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {platformTargeting.map((plat) => {
              const nativeCount = plat.entries.filter((e) => e.ease === 'native').length;
              const total = plat.entries.length;
              return (
                <div
                  key={plat.platformKey}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{plat.label}</h4>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      {nativeCount}/{total} native
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {plat.entries.map((entry, i) => (
                      <li key={i} className="text-xs">
                        <div className="flex items-start gap-1.5">
                          <span className={`mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ${
                            entry.ease === 'native' ? 'bg-green-500' : entry.ease === 'custom' ? 'bg-amber-500' : 'bg-gray-400'
                          }`} />
                          <div>
                            <span className="font-medium text-gray-800 dark:text-slate-200">{entry.segment}</span>
                            <p className="text-gray-500 dark:text-slate-400 mt-0.5">{entry.notes}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Sortable Keyword Table */}
      <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800">
                {SORT_KEYS.map((k) => (
                  <th
                    key={k}
                    onClick={() => handleSort(k)}
                    className="px-4 py-2.5 text-left font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-white select-none"
                  >
                    {k === 'cpc' ? 'CPC (GBP)' : k.charAt(0).toUpperCase() + k.slice(1)}
                    {sortKey === k && <span className="ml-1">{sortAsc ? '▲' : '▼'}</span>}
                  </th>
                ))}
                <th className="px-4 py-2.5 text-left font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">Group</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {sortedKeywords.slice(0, 50).map((kw, i) => (
                <tr key={`${kw.term}-${i}`} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-2 text-gray-800 dark:text-slate-200 font-medium">{kw.term}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-slate-300 tabular-nums">{kw.volume.toLocaleString()}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-slate-300 tabular-nums">{kw.cpc.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.round(kw.competition * 100)}%`,
                            background: kw.competition > 0.8 ? '#ef4444' : kw.competition > 0.5 ? '#f59e0b' : '#10b981',
                          }}
                        />
                      </div>
                      <span className="text-gray-500 dark:text-slate-500">{(kw.competition * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-gray-500 dark:text-slate-400">{kw.group}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedKeywords.length > 50 && (
          <div className="px-4 py-2 text-xs text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-800">
            Showing 50 of {sortedKeywords.length} keywords. Export CSV for full list.
          </div>
        )}
      </section>

      {/* Volume vs CPC Bubble Chart */}
      <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-4">Volume vs CPC</h3>
        <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">Bubble size = search volume. Colour = keyword cluster.</p>
        <ResponsiveContainer width="100%" height={360}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis
              dataKey="cpc" name="CPC" unit=" GBP" type="number"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              label={{ value: 'CPC (GBP)', position: 'insideBottom', offset: -5, style: { fontSize: 11, fill: '#94a3b8' } }}
            />
            <YAxis
              dataKey="volume" name="Volume" type="number"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              label={{ value: 'Monthly Volume', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#94a3b8' } }}
            />
            <ZAxis dataKey="volume" range={[40, 400]} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
              formatter={(value, name) => {
                if (name === 'CPC') return [`${value} GBP`, 'CPC'];
                if (name === 'Volume') return [value.toLocaleString(), 'Monthly Volume'];
                return [value, name];
              }}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.term || ''}
            />
            <Scatter name="Keywords" data={bubbleData}>
              {bubbleData.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
