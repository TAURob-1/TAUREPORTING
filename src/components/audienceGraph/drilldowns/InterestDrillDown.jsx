import React, { useMemo } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import { ATTRIBUTE_CLASSES } from '../../../data/audienceGraph/scores.js';

/**
 * Six interest dimensions derived from attribute class representation.
 * Each dimension is scored 0–100 based on how many attributes from that class are selected
 * and the average M_INT weight from those attributes.
 */
const INTEREST_DIMENSIONS = [
  { key: 'behavioral', label: 'Behavioral', classKeys: ['BEHAV'] },
  { key: 'psychographic', label: 'Psychographic', classKeys: ['PSYCH'] },
  { key: 'purchase', label: 'Purchase Intent', classKeys: ['PURCH'] },
  { key: 'demographic', label: 'Demographic', classKeys: ['DEMO'] },
  { key: 'contextual', label: 'Contextual', classKeys: ['CONTEXT'] },
  { key: 'media', label: 'Media Consumption', classKeys: ['MEDIA'] },
];

const PROGRAMMATIC_SEGMENTS = {
  DV360: {
    label: 'Google DV360',
    color: '#4285f4',
    segments: [
      { name: 'In-Market Audiences', description: 'Users actively researching or comparing products', minScore: 40 },
      { name: 'Affinity Audiences', description: 'Users with a strong interest in relevant topics', minScore: 30 },
      { name: 'Custom Intent', description: 'Keyword and URL-based targeting for purchase intent', minScore: 50 },
      { name: 'Life Events', description: 'Major life event targeting (moving, graduating, etc.)', minScore: 25 },
    ],
  },
  Meta: {
    label: 'Meta (Facebook/Instagram)',
    color: '#1877f2',
    segments: [
      { name: 'Detailed Targeting — Interests', description: 'Interest-based segments from user activity', minScore: 30 },
      { name: 'Detailed Targeting — Behaviors', description: 'Purchase behaviour and device usage', minScore: 40 },
      { name: 'Engagement Custom Audiences', description: 'Users who interacted with brand content', minScore: 35 },
      { name: 'Advantage+ Audience', description: 'AI-driven broad targeting with interest signals', minScore: 20 },
    ],
  },
  TikTok: {
    label: 'TikTok Ads',
    color: '#010101',
    segments: [
      { name: 'Interest Targeting', description: 'Video consumption interest categories', minScore: 35 },
      { name: 'Behavioral Targeting', description: 'Video interaction and creator follow behaviour', minScore: 40 },
      { name: 'Hashtag Targeting', description: 'Users engaging with specific hashtag topics', minScore: 30 },
      { name: 'Smart Targeting', description: 'ML-optimised interest discovery', minScore: 20 },
    ],
  },
};

function computeDimensionScore(selectedAttributes, classKeys) {
  const relevant = selectedAttributes.filter((a) => classKeys.includes(a.classKey));
  if (relevant.length === 0) return 0;

  let totalWeight = 0;
  let count = 0;

  for (const { classKey, attrKey } of relevant) {
    const cls = ATTRIBUTE_CLASSES[classKey];
    const attr = cls?.attributes[attrKey];
    if (!attr) continue;

    const intScore = attr.scores?.M_INT;
    if (intScore) {
      totalWeight += intScore.P * intScore.S;
    } else if (cls.defaults?.M_INT) {
      totalWeight += cls.defaults.M_INT.P * cls.defaults.M_INT.S;
    }
    count++;
  }

  if (count === 0) return 0;
  // Normalize: max P*S = 25, scale to 0–100
  return Math.min(100, Math.round((totalWeight / count) * 4));
}

export default function InterestDrillDown({ selectedAttributes, blueprint }) {
  const radarData = useMemo(() => {
    return INTEREST_DIMENSIONS.map((dim) => ({
      dimension: dim.label,
      score: computeDimensionScore(selectedAttributes, dim.classKeys),
      fullMark: 100,
    }));
  }, [selectedAttributes]);

  const overallScore = useMemo(
    () => radarData.length ? Math.round(radarData.reduce((s, d) => s + d.score, 0) / radarData.length) : 0,
    [radarData],
  );

  const platformSuggestions = useMemo(() => {
    return Object.entries(PROGRAMMATIC_SEGMENTS).map(([platform, config]) => {
      const recommended = config.segments.filter((seg) => overallScore >= seg.minScore);
      return { platform, ...config, recommended };
    });
  }, [overallScore]);

  if (selectedAttributes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-slate-400">
        Select audience attributes to see interest dimension analysis.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Interest / Behavioral Drill-Down</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Interest profile across 6 dimensions based on {selectedAttributes.length} attribute{selectedAttributes.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {/* Radar Chart */}
      <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300">Interest Dimension Radar</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold">
            Composite Score: {overallScore}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={360}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="#334155" strokeOpacity={0.3} />
            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
              formatter={(v) => [`${v}/100`, 'Score']}
            />
            <Radar
              name="Interest Profile"
              dataKey="score"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>

        {/* Dimension breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {radarData.map((d) => (
            <div key={d.dimension} className="flex items-center gap-3">
              <div className="w-full">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-slate-400">{d.dimension}</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-200">{d.score}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${d.score}%`, background: d.score >= 60 ? '#6366f1' : d.score >= 30 ? '#f59e0b' : '#94a3b8' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Programmatic Segment Suggestions */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">Programmatic Segment Suggestions</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {platformSuggestions.map(({ platform, label, color, recommended, segments }) => (
            <div key={platform} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                <h4 className="text-sm font-semibold text-gray-800 dark:text-slate-200">{label}</h4>
              </div>
              <div className="space-y-2.5">
                {segments.map((seg) => {
                  const isRecommended = recommended.includes(seg);
                  return (
                    <div
                      key={seg.name}
                      className={`p-2.5 rounded-lg border text-xs ${
                        isRecommended
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                          : 'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${isRecommended ? 'text-emerald-800 dark:text-emerald-300' : 'text-gray-500 dark:text-slate-500'}`}>
                          {seg.name}
                        </span>
                        {isRecommended && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-semibold">REC</span>
                        )}
                      </div>
                      <p className="text-gray-500 dark:text-slate-400 mt-0.5">{seg.description}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-gray-400 dark:text-slate-500">
                {recommended.length} of {segments.length} segments recommended
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
