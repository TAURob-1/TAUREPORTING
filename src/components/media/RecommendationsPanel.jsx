import React, { useState, useMemo } from 'react';

const FOUR_SCREEN_EXTRAS = ['TikTok', 'YouTube', 'Instagram Reels', 'Snapchat'];

export default function RecommendationsPanel({ audienceName, recommendations, onSelectPlatforms }) {
  const [viewMode, setViewMode] = useState('4screen'); // 'tv' or '4screen'

  const displayPlatforms = useMemo(() => {
    if (viewMode === 'tv') {
      return recommendations.recommendedPlatforms.filter(
        (p) => !['TikTok', 'Instagram', 'Instagram Reels', 'Snapchat', 'Spotify'].includes(p)
      );
    }
    // 4-screen: include all recs + extras if not already present
    const platforms = [...recommendations.recommendedPlatforms];
    FOUR_SCREEN_EXTRAS.forEach((extra) => {
      if (!platforms.some((p) => p.toLowerCase() === extra.toLowerCase())) {
        platforms.push(extra);
      }
    });
    return platforms;
  }, [viewMode, recommendations.recommendedPlatforms]);

  return (
    <section className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-emerald-200 bg-emerald-50 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-base font-bold text-emerald-900">Recommendations for Primary Audience</h2>
          <p className="text-sm text-emerald-800 mt-1">Primary audience: {audienceName}</p>
        </div>
        <div className="flex items-center gap-1 bg-emerald-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('tv')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'tv'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-emerald-600 hover:text-emerald-800'
            }`}
          >
            TV Only
          </button>
          <button
            onClick={() => setViewMode('4screen')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === '4screen'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-emerald-600 hover:text-emerald-800'
            }`}
          >
            4-Screen (TV + Digital/Social Video)
          </button>
        </div>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Recommended Publishers/Platforms</div>
          <ol className="list-decimal list-inside space-y-1 text-slate-800">
            {displayPlatforms.map((item) => (
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
      {onSelectPlatforms && (
        <div className="px-5 pb-4">
          <button
            onClick={() => onSelectPlatforms(displayPlatforms)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            Select these platforms
          </button>
        </div>
      )}
    </section>
  );
}
