import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3">
      <div className="text-xs font-semibold text-gray-700 mb-2">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{(entry.value / 1000).toFixed(0)}K</span>
        </div>
      ))}
    </div>
  );
};

const DeliveryChart = ({ deliveryData }) => {
  const data = deliveryData.labels.map((label, index) => ({
    date: label,
    exposed: deliveryData.exposed[index],
    holdout: deliveryData.holdout[index]
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Daily Delivery Performance</h2>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded-full bg-blue-500" />
            <span className="text-gray-600">Exposed DMAs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded-full bg-gray-400" style={{ opacity: 0.6 }} />
            <span className="text-gray-600">Holdout DMAs</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="exposedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02}/>
            </linearGradient>
            <linearGradient id="holdoutGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6b7280" stopOpacity={0.12}/>
              <stop offset="95%" stopColor="#6b7280" stopOpacity={0.02}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            stroke="#e5e7eb"
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            stroke="#e5e7eb"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="exposed"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="url(#exposedGradient)"
            name="Exposed DMAs"
            dot={false}
            activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="holdout"
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="6 3"
            fill="url(#holdoutGradient)"
            name="Holdout DMAs"
            dot={false}
            activeDot={{ r: 5, fill: '#9ca3af', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeliveryChart;
