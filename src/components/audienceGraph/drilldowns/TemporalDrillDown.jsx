import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, BarChart, Bar, Cell,
} from 'recharts';
import { getCompositeHourly, getCompositeDow } from '../../../lib/audienceGraph/computeBlueprint.js';
import { DAYPART_LABELS, DAY_OF_WEEK_LABELS } from '../../../data/audienceGraph/daypartProfiles.js';

const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

export default function TemporalDrillDown({ selectedAttributes, blueprint }) {
  const hourly = useMemo(() => getCompositeHourly(selectedAttributes), [selectedAttributes]);
  const dow = useMemo(() => getCompositeDow(selectedAttributes), [selectedAttributes]);

  /* Line chart data */
  const hourlyData = useMemo(
    () => hourly.map((v, i) => ({ hour: HOUR_LABELS[i], index: v, hourNum: i })),
    [hourly],
  );

  /* Daypart cards */
  const daypartCards = useMemo(() => {
    return Object.entries(DAYPART_LABELS).map(([key, dp]) => {
      const avgIndex = dp.hours.length
        ? Math.round(dp.hours.reduce((s, h) => s + hourly[h], 0) / dp.hours.length)
        : 100;
      return { key, ...dp, avgIndex };
    }).sort((a, b) => b.avgIndex - a.avgIndex);
  }, [hourly]);

  const peakDayparts = daypartCards.slice(0, 3);

  /* Day-of-week strip data */
  const dowData = useMemo(
    () => dow.map((v, i) => ({ day: DAY_OF_WEEK_LABELS[i], index: v })),
    [dow],
  );

  const dowMax = Math.max(...dow);
  const dowMin = Math.min(...dow);

  if (selectedAttributes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-slate-400">
        Select audience attributes to see temporal engagement data.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Temporal Drill-Down</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Composite engagement index across {selectedAttributes.length} attribute{selectedAttributes.length !== 1 ? 's' : ''}. 100 = average.
        </p>
      </div>

      {/* 24h Line Chart */}
      <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-4">Hourly Engagement Index</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyData} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={2} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} domain={['dataMin - 10', 'dataMax + 10']} />
            <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Avg (100)', position: 'right', style: { fontSize: 10, fill: '#94a3b8' } }} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
              formatter={(v) => [`${v}`, 'Engagement Index']}
            />
            <Line
              type="monotone" dataKey="index" stroke="#6366f1" strokeWidth={2.5}
              dot={{ r: 3, fill: '#6366f1', stroke: '#1e293b', strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: '#818cf8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Daypart Performance Cards */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">Daypart Performance</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {daypartCards.map((dp) => {
            const isPeak = peakDayparts.some((p) => p.key === dp.key);
            const delta = dp.avgIndex - 100;
            return (
              <div
                key={dp.key}
                className={`relative rounded-xl p-4 border transition-shadow ${
                  isPeak
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700'
                }`}
              >
                {isPeak && (
                  <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-600 text-white font-semibold">
                    PEAK
                  </span>
                )}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: dp.color }} />
                  <span className="text-xs font-medium text-gray-700 dark:text-slate-300">{dp.label}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{dp.avgIndex}</div>
                <div className={`text-xs font-medium mt-0.5 ${delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                  {delta > 0 ? '+' : ''}{delta} vs avg
                </div>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">
                  {dp.hours.map((h) => `${String(h).padStart(2, '0')}:00`).join(', ')}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Day-of-Week Strip */}
      <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-4">Day-of-Week Engagement</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dowData} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[Math.max(0, dowMin - 15), dowMax + 10]} />
            <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="4 4" />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
              formatter={(v) => [`${v}`, 'Index']}
            />
            <Bar dataKey="index" radius={[6, 6, 0, 0]} barSize={36}>
              {dowData.map((d, i) => (
                <Cell key={i} fill={d.index >= 100 ? '#6366f1' : '#94a3b8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
            Above average
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" />
            Below average
          </span>
        </div>
      </section>
    </div>
  );
}
