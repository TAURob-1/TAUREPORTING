import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CTVProviders = ({ providers }) => {
  const [showAll, setShowAll] = useState(false);

  const TOP_COUNT = 8;
  const topProviders = providers.slice(0, TOP_COUNT);
  const otherProviders = providers.slice(TOP_COUNT);
  const displayProviders = showAll ? providers : topProviders;

  // Horizontal bar chart data
  const barData = providers.map(p => ({
    name: p.name.length > 14 ? p.name.slice(0, 12) + '…' : p.name,
    fullName: p.name,
    share: p.share,
    color: p.color
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Media Provider Mix</h2>
        <span className="text-xs text-gray-400 font-medium">{providers.length} providers</span>
      </div>

      {/* Compact Provider List */}
      <div className="space-y-2 mb-6">
        {displayProviders.map((provider) => (
          <div key={provider.name} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
              style={{ backgroundColor: provider.color }}
            >
              {provider.initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 truncate">{provider.name}</span>
                <span className="text-xs text-green-600 ml-2 flex-shrink-0">{provider.lift}</span>
              </div>
              {/* Share bar */}
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${(provider.share / providers[0].share) * 100}%`, backgroundColor: provider.color }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{provider.share}%</span>
              </div>
            </div>
          </div>
        ))}

        {/* Show more / less */}
        {otherProviders.length > 0 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-medium py-2 border border-dashed border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            {showAll
              ? `Show top ${TOP_COUNT} only`
              : `+ ${otherProviders.length} more providers (${otherProviders.reduce((s, p) => s + p.share, 0)}% share)`
            }
          </button>
        )}
      </div>

      {/* Horizontal Bar Chart */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-medium text-gray-600">Impression Share Distribution</div>
          <div className="text-[10px] text-gray-400">% of total impressions</div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
            <XAxis
              type="number"
              domain={[0, 'auto']}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 10, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 10, fill: '#374151' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Impression Share']}
              labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            />
            <Bar dataKey="share" radius={[0, 4, 4, 0]}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CTVProviders;
