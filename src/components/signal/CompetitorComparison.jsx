import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#1d4ed8', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

function formatVisits(v) {
  const n = Number(v || 0);
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return `${n}`;
}

export default function CompetitorComparison({ signal, advertiserName }) {
  const marketShareData = useMemo(() => {
    if (!signal?.traffic?.marketShare) return [];
    return signal.traffic.marketShare.map((row) => ({
      name: row.isAdvertiser ? advertiserName : row.name,
      visits: row.visits,
      share: row.share,
      isAdvertiser: row.isAdvertiser,
    }));
  }, [signal, advertiserName]);

  const engagementData = useMemo(() => {
    if (!signal?.traffic?.marketShare) return [];
    return signal.traffic.marketShare
      .map((row) => ({
        name: row.isAdvertiser ? advertiserName : row.name,
        visits: Math.round(row.visits / 1000),
        pages: Number((row.pagesPerVisit || 0).toFixed(1)),
        bounce: Number(((row.bounceRate || 0) * 100).toFixed(1)),
        isAdvertiser: row.isAdvertiser,
      }))
      .sort((a, b) => b.visits - a.visits);
  }, [signal, advertiserName]);

  if (!signal) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Competitive Market Share</h3>
        <p className="text-xs text-gray-500 mb-4">Traffic share comparison — {advertiserName} vs competitors</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <Cell
                      key={entry.name}
                      fill={entry.isAdvertiser ? '#1d4ed8' : COLORS[(index + 1) % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${formatVisits(v)} visits`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {marketShareData.map((row, i) => (
              <div
                key={row.name}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  row.isAdvertiser
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: row.isAdvertiser ? '#1d4ed8' : COLORS[(i + 1) % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-gray-900">{row.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{formatVisits(row.visits)}</div>
                  <div className="text-xs text-gray-500">{row.share}% share</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Engagement Comparison</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value, key) =>
                  key === 'visits' ? [`${value}K`, 'Monthly Visits'] : [value, key]
                }
              />
              <Bar dataKey="visits" fill="#0ea5e9" name="Visits (K)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b">
                <th className="text-left py-2">Competitor</th>
                <th className="text-right py-2">Monthly Visits</th>
                <th className="text-right py-2">Pages/Visit</th>
                <th className="text-right py-2">Bounce Rate</th>
              </tr>
            </thead>
            <tbody>
              {engagementData.map((row) => (
                <tr
                  key={row.name}
                  className={`border-b border-gray-50 ${row.isAdvertiser ? 'bg-blue-50 font-semibold' : ''}`}
                >
                  <td className="py-2 text-gray-900">{row.name}</td>
                  <td className="py-2 text-right text-gray-700">{row.visits}K</td>
                  <td className="py-2 text-right text-gray-700">{row.pages}</td>
                  <td className="py-2 text-right text-gray-700">{row.bounce}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
