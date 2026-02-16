import React from 'react';

function RegulationsPanel({ title, tone = 'medium', rules = [] }) {
  const toneClass = tone === 'high'
    ? 'bg-amber-50 border-amber-200'
    : 'bg-slate-50 border-slate-200';

  return (
    <div className={`rounded-lg border p-5 ${toneClass}`}>
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <div key={rule.title} className="bg-white/70 rounded-md border border-white px-3 py-2">
            <div className="text-sm font-semibold text-gray-900">{rule.title}</div>
            <div className="text-xs text-gray-700 mt-1">{rule.description}</div>
            <div className="text-[11px] text-gray-500 mt-1">Source: {rule.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RegulationsPanel;
