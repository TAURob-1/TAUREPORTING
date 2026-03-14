import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell, Legend,
} from 'recharts';
import { getWeightedAffinities } from '../../../lib/audienceGraph/computeBlueprint.js';
import { CHANNEL_PLATFORMS } from '../../../data/audienceGraph/channelAffinity.js';

const TYPE_COLORS = { CTV: '#10b981', BVOD: '#6366f1', Linear: '#f59e0b' };

export default function ChannelDrillDown({ selectedAttributes, blueprint }) {
  const affinities = useMemo(
    () => getWeightedAffinities(selectedAttributes),
    [selectedAttributes],
  );

  /* ---------- derived data ---------- */
  const barData = affinities.map((a) => ({
    name: a.label,
    affinity: a.affinity,
    fill: a.color || '#6366f1',
  }));

  const typeGroups = useMemo(() => {
    const groups = { CTV: [], BVOD: [], Linear: [] };
    affinities.forEach((a) => {
      if (groups[a.type]) groups[a.type].push(a);
    });
    return groups;
  }, [affinities]);

  const linearAvg = useMemo(() => {
    const g = typeGroups.Linear;
    return g.length ? Math.round(g.reduce((s, p) => s + p.affinity, 0) / g.length) : 0;
  }, [typeGroups]);

  const digitalAvg = useMemo(() => {
    const g = [...(typeGroups.CTV || []), ...(typeGroups.BVOD || [])];
    return g.length ? Math.round(g.reduce((s, p) => s + p.affinity, 0) / g.length) : 0;
  }, [typeGroups]);

  const scatterData = affinities.map((a) => ({
    name: a.label,
    cpm: a.cpm,
    affinity: a.affinity,
    reach: a.reach,
    type: a.type,
    color: TYPE_COLORS[a.type] || '#6366f1',
  }));

  const ownerGroups = useMemo(() => {
    const map = {};
    affinities.forEach((a) => {
      if (!map[a.owner]) map[a.owner] = { owner: a.owner, platforms: [], avgAffinity: 0, totalReach: 0 };
      map[a.owner].platforms.push(a);
      map[a.owner].totalReach += a.reach;
    });
    Object.values(map).forEach((g) => {
      g.avgAffinity = Math.round(g.platforms.reduce((s, p) => s + p.affinity, 0) / g.platforms.length);
    });
    return Object.values(map).sort((a, b) => b.avgAffinity - a.avgAffinity);
  }, [affinities]);

  if (affinities.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-slate-400">
        Select audience attributes to see channel affinity data.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Channel Selection Drill-Down</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Platform affinity scores weighted across {selectedAttributes.length} selected attribute{selectedAttributes.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {/* Platform Affinity Ranking */}
      <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-4">Platform Affinity Ranking</h3>
        <ResponsiveContainer width="100%" height={barData.length * 48 + 20}>
          <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
              formatter={(v) => [`${v}/100`, 'Affinity']}
            />
            <Bar dataKey="affinity" radius={[0, 6, 6, 0]} barSize={22}>
              {barData.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Linear TV vs CTV/BVOD Comparison */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">Linear TV</h3>
          <div className="text-3xl font-bold text-amber-500">{linearAvg}<span className="text-sm font-normal text-gray-400 ml-1">/ 100</span></div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">Avg affinity across {typeGroups.Linear.length} linear platform{typeGroups.Linear.length !== 1 ? 's' : ''}</p>
          <ul className="mt-3 space-y-1">
            {typeGroups.Linear.map((p) => (
              <li key={p.platformKey} className="flex justify-between text-xs text-gray-600 dark:text-slate-400">
                <span>{p.label}</span>
                <span className="font-medium text-gray-800 dark:text-slate-200">{p.affinity}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">CTV / BVOD</h3>
          <div className="text-3xl font-bold text-emerald-500">{digitalAvg}<span className="text-sm font-normal text-gray-400 ml-1">/ 100</span></div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
            Avg affinity across {(typeGroups.CTV?.length || 0) + (typeGroups.BVOD?.length || 0)} digital platform{(typeGroups.CTV?.length || 0) + (typeGroups.BVOD?.length || 0) !== 1 ? 's' : ''}
          </p>
          <ul className="mt-3 space-y-1">
            {[...(typeGroups.CTV || []), ...(typeGroups.BVOD || [])].map((p) => (
              <li key={p.platformKey} className="flex justify-between text-xs text-gray-600 dark:text-slate-400">
                <span>{p.label} <span className="text-[10px] px-1 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-500">{p.type}</span></span>
                <span className="font-medium text-gray-800 dark:text-slate-200">{p.affinity}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CPM Efficiency Scatter */}
      <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-4">CPM Efficiency vs Affinity</h3>
        <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">Bubble size = UK adult reach (millions). Top-left = high affinity at low CPM.</p>
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis dataKey="cpm" name="CPM" unit=" GBP" type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'CPM (GBP)', position: 'insideBottom', offset: -5, style: { fontSize: 11, fill: '#94a3b8' } }} />
            <YAxis dataKey="affinity" name="Affinity" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'Affinity', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#94a3b8' } }} />
            <ZAxis dataKey="reach" range={[80, 400]} name="Reach" unit="m" />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
              formatter={(value, name) => {
                if (name === 'CPM') return [`${value} GBP`, 'CPM'];
                if (name === 'Affinity') return [`${value}/100`, 'Affinity'];
                if (name === 'Reach') return [`${value}m`, 'UK Reach'];
                return [value, name];
              }}
            />
            <Legend />
            <Scatter name="Platforms" data={scatterData}>
              {scatterData.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <span key={type} className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />
              {type}
            </span>
          ))}
        </div>
      </section>

      {/* Media Owner Aggregation */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">Media Owner Aggregation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ownerGroups.map((g) => (
            <div key={g.owner} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-slate-200">{g.owner}</h4>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-2xl font-bold text-indigo-500">{g.avgAffinity}</span>
                <span className="text-xs text-gray-400">avg affinity</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{g.totalReach.toFixed(1)}m combined UK reach</p>
              <div className="mt-3 space-y-1">
                {g.platforms.map((p) => (
                  <div key={p.platformKey} className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-slate-400">{p.label}</span>
                    <span className="text-gray-800 dark:text-slate-200 font-medium">{p.affinity} / {p.cpm} GBP</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
