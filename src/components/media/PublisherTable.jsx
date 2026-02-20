import React from 'react';

export default function PublisherTable({ rows = [], signalMediaSummary }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 bg-slate-50 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-slate-800">TV & CTV Publishers</h2>
        <span className="text-xs text-slate-500">
          Signal feeds: TV {signalMediaSummary.channels} • CTV {signalMediaSummary.ctv} • Radio {signalMediaSummary.radio}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-gray-200">
              <th className="py-3 px-5">Publisher</th>
              <th className="py-3 px-4">Reach</th>
              <th className="py-3 px-4">Key Shows/Content</th>
              <th className="py-3 px-4">Audience Profile</th>
              <th className="py-3 px-4">Programming Insight</th>
              <th className="py-3 px-5">Best For</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.publisher} className={`border-b border-gray-100 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                <td className="py-3 px-5 font-semibold text-slate-900">{row.publisher}</td>
                <td className="py-3 px-4 text-slate-700">{row.reach}</td>
                <td className="py-3 px-4 text-slate-700">{row.keyContent}</td>
                <td className="py-3 px-4 text-slate-700">{row.audienceProfile}</td>
                <td className="py-3 px-4 text-slate-700">{row.programmingInsight}</td>
                <td className="py-3 px-5 text-slate-700">{row.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
