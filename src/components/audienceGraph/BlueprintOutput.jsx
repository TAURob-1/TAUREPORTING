import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getMechanismRecommendation, buildAtlasLink } from '../../lib/audienceGraph/computeBlueprint.js';

export default function BlueprintOutput({ ranked, selectedAttributes, onDrillDown }) {
  if (!ranked || ranked.length === 0) return null;

  const maxPct = ranked[0]?.pct || 1;
  const atlasLink = buildAtlasLink(selectedAttributes);
  const pieData = ranked.filter((r) => r.pct >= 1).map((r) => ({
    name: r.short,
    value: Math.round(r.pct * 10) / 10,
    color: r.color,
  }));

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300">Mechanism Blueprint</h3>

      {/* Horizontal bars */}
      <div className="space-y-1.5">
        {ranked.map((r) => (
          <div key={r.key} className="flex items-center gap-2">
            <span className="w-20 text-xs text-gray-600 dark:text-slate-400 text-right truncate">{r.short}</span>
            <div className="flex-1 h-5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(r.pct / maxPct) * 100}%`, backgroundColor: r.color }}
              />
            </div>
            <span className="w-12 text-xs font-semibold text-gray-700 dark:text-slate-300 text-right">
              {r.pct.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      {/* Donut chart */}
      <div className="flex justify-center">
        <div className="w-48 h-48">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mechanism cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {ranked.map((r) => {
          const rec = getMechanismRecommendation(r.key, r.pct);
          return (
            <div
              key={r.key}
              className="border border-gray-200 dark:border-slate-700 rounded-lg p-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span>{r.icon}</span>
                  <span className="text-sm font-semibold" style={{ color: r.color }}>{r.short}</span>
                </div>
                <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{r.pct.toFixed(1)}%</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400 mb-2">{rec}</p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onDrillDown?.(r.key)}
                  className="px-2 py-1 text-[10px] rounded bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  Drill Down
                </button>
                {r.key === 'M_GEO' && atlasLink && (
                  <a
                    href={atlasLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 text-[10px] rounded bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                  >
                    Atlas Map
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
