import React from 'react';

export default function RecommendationsPanel({ audienceName, recommendations }) {
  return (
    <section className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-emerald-200 bg-emerald-50">
        <h2 className="text-base font-bold text-emerald-900">Recommendations for Primary Audience</h2>
        <p className="text-sm text-emerald-800 mt-1">Primary audience: {audienceName}</p>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Recommended Publishers/Platforms</div>
          <ol className="list-decimal list-inside space-y-1 text-slate-800">
            {recommendations.recommendedPlatforms.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Content Recommendations</div>
          <ul className="list-disc list-inside space-y-1 text-slate-800">
            {recommendations.contentFocus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Avoid</div>
          <ul className="list-disc list-inside space-y-1 text-slate-800">
            {recommendations.avoid.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Estimated Combined Reach</div>
          <div className="text-lg font-bold text-slate-900">{recommendations.estimatedCombinedReach}</div>
        </div>
      </div>
    </section>
  );
}
