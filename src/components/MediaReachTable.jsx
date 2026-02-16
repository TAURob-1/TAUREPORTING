import React from 'react';

function MediaReachTable({ title, subtitle, rows }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="py-2 pr-3">Platform</th>
              <th className="py-2 px-3">Channel</th>
              <th className="py-2 px-3">Reach</th>
              <th className="py-2 px-3">Key Demographics</th>
              <th className="py-2 pl-3">Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.platform}-${row.channel}`} className="border-b border-gray-100 last:border-0 align-top">
                <td className="py-3 pr-3 font-semibold text-gray-900 whitespace-nowrap">{row.platform}</td>
                <td className="py-3 px-3 text-gray-700 whitespace-nowrap">{row.channel}</td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-gray-900">{row.reach}</div>
                  <div className="text-xs text-gray-500">{row.reachPct}</div>
                </td>
                <td className="py-3 px-3 text-gray-700">{row.keyDemo}</td>
                <td className="py-3 pl-3 text-xs text-gray-500">{row.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MediaReachTable;
