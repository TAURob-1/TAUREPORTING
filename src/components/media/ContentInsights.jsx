import React from 'react';

export default function ContentInsights({ rows = [] }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 bg-slate-50">
        <h2 className="text-base font-bold text-slate-800">Content Category Insights</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-gray-200">
              <th className="py-3 px-5">Content Type</th>
              <th className="py-3 px-4">Main Platforms</th>
              <th className="py-3 px-4">Audience</th>
              <th className="py-3 px-5">Example Shows/Channels</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.contentType} className={`border-b border-gray-100 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                <td className="py-3 px-5 font-semibold text-slate-900">{row.contentType}</td>
                <td className="py-3 px-4 text-slate-700">{row.mainPlatforms}</td>
                <td className="py-3 px-4 text-slate-700">{row.audience}</td>
                <td className="py-3 px-5 text-slate-700">{row.examples}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
