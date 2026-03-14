import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { ATTRIBUTE_CLASSES } from '../../../data/audienceGraph/scores.js';

const PLATFORMS = [
  {
    key: 'meta_lal',
    label: 'Meta Lookalike',
    description: 'Facebook & Instagram lookalike audiences built from custom audience seeds.',
    color: '#1877f2',
    strengthFactors: { PURCH: 1.3, BEHAV: 1.2, PSYCH: 1.1, MEDIA: 1.0 },
    seedReqs: ['Customer email list (min 1,000 records)', 'Website Custom Audience (pixel-based)', 'App activity events'],
    expansionRanges: ['1% (highest similarity)', '1–3% (balanced)', '3–5% (maximum reach)'],
    overlapRisk: { base: 0.25, classRisk: { DEMO: 0.1, GEO: 0.08 } },
  },
  {
    key: 'google_similar',
    label: 'Google Similar Audiences',
    description: 'ML-driven expansion from Google Ads remarketing and customer match lists.',
    color: '#4285f4',
    strengthFactors: { PURCH: 1.2, BEHAV: 1.1, CONTEXT: 1.0, MEDIA: 1.0 },
    seedReqs: ['Customer Match list (hashed emails)', 'Google Analytics audience segments', 'YouTube channel subscriber data'],
    expansionRanges: ['Narrow (top 2.5% similarity)', 'Balanced (top 5%)', 'Broad (top 10%)'],
    overlapRisk: { base: 0.20, classRisk: { DEMO: 0.08, GEO: 0.06 } },
  },
  {
    key: 'dv360_lal',
    label: 'DV360 Audience Expansion',
    description: 'Programmatic lookalike modelling using DV360\'s identity graph and bidstream data.',
    color: '#0f9d58',
    strengthFactors: { BEHAV: 1.3, MEDIA: 1.2, PURCH: 1.0, PSYCH: 0.9 },
    seedReqs: ['First-party segment upload (min 5,000 cookies)', 'Floodlight conversion data', 'Publisher-shared audience lists'],
    expansionRanges: ['Conservative (1x seed size)', 'Moderate (3x seed size)', 'Aggressive (5x+ seed size)'],
    overlapRisk: { base: 0.30, classRisk: { DEMO: 0.12, GEO: 0.10 } },
  },
  {
    key: 'tiktok_lal',
    label: 'TikTok Lookalike',
    description: 'TikTok Ads Manager lookalike built from pixel events or customer file uploads.',
    color: '#010101',
    strengthFactors: { BEHAV: 1.4, MEDIA: 1.3, DEMO: 1.0, PSYCH: 0.8 },
    seedReqs: ['Pixel event audience (min 1,000 events)', 'Customer file upload (email/phone)', 'App event audiences'],
    expansionRanges: ['Narrow (1–2%)', 'Balanced (2–5%)', 'Broad (5–10%)'],
    overlapRisk: { base: 0.22, classRisk: { DEMO: 0.15, GEO: 0.05 } },
  },
  {
    key: 'pinterest_actalike',
    label: 'Pinterest Actalike',
    description: 'Pinterest actalike audiences targeting users who behave like your existing converters.',
    color: '#e60023',
    strengthFactors: { PURCH: 1.3, PSYCH: 1.2, BEHAV: 1.0, CONTEXT: 0.9 },
    seedReqs: ['Customer list (min 100 records)', 'Website visitor audience (tag-based)', 'Engagement audience (pin interactions)'],
    expansionRanges: ['1% (closest match)', '1–5% (balanced)', '5–10% (broad reach)'],
    overlapRisk: { base: 0.18, classRisk: { DEMO: 0.06, GEO: 0.04 } },
  },
];

function computePlatformScore(selectedAttributes, strengthFactors) {
  if (selectedAttributes.length === 0) return 0;

  let totalWeight = 0;
  let count = 0;

  for (const { classKey, attrKey } of selectedAttributes) {
    const cls = ATTRIBUTE_CLASSES[classKey];
    const attr = cls?.attributes[attrKey];
    if (!attr) continue;

    const lalScore = attr.scores?.M_LAL;
    const P = lalScore?.P ?? cls.defaults?.M_LAL?.P ?? 0;
    const S = lalScore?.S ?? cls.defaults?.M_LAL?.S ?? 0;
    const boost = strengthFactors[classKey] || 0.8;

    totalWeight += (P * S) * boost;
    count++;
  }

  if (count === 0) return 0;
  return Math.min(100, Math.round((totalWeight / count) * 3.5));
}

function computeOverlapRisk(selectedAttributes, overlapConfig) {
  let risk = overlapConfig.base;
  const classCount = {};
  selectedAttributes.forEach((a) => { classCount[a.classKey] = (classCount[a.classKey] || 0) + 1; });

  // Broad demographic/geo targeting increases overlap risk
  for (const [cls, riskAdd] of Object.entries(overlapConfig.classRisk)) {
    if (classCount[cls]) risk += riskAdd * classCount[cls];
  }

  // More attributes = more specificity = lower overlap risk
  if (selectedAttributes.length >= 5) risk *= 0.8;
  if (selectedAttributes.length >= 8) risk *= 0.7;

  return Math.min(0.95, Math.max(0.05, risk));
}

const RISK_LABEL = (r) => {
  if (r >= 0.6) return { text: 'High', color: '#ef4444' };
  if (r >= 0.35) return { text: 'Medium', color: '#f59e0b' };
  return { text: 'Low', color: '#10b981' };
};

export default function LookalikeDrillDown({ selectedAttributes, blueprint }) {
  const platformData = useMemo(() => {
    return PLATFORMS.map((p) => {
      const score = computePlatformScore(selectedAttributes, p.strengthFactors);
      const overlapRisk = computeOverlapRisk(selectedAttributes, p.overlapRisk);
      return { ...p, score, overlapRisk };
    }).sort((a, b) => b.score - a.score);
  }, [selectedAttributes]);

  const barData = platformData.map((p) => ({
    name: p.label,
    score: p.score,
    color: p.color,
  }));

  if (selectedAttributes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-slate-400">
        Select audience attributes to see lookalike modelling analysis.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Lookalike / Modelling Drill-Down</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Platform suitability and overlap risk assessment for {selectedAttributes.length} attribute{selectedAttributes.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {/* Platform Suitability Ranking Bars */}
      <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-4">Platform Suitability Ranking</h3>
        <ResponsiveContainer width="100%" height={barData.length * 52 + 20}>
          <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
              formatter={(v) => [`${v}/100`, 'Suitability']}
            />
            <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={24}>
              {barData.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Overlap Risk Assessment */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">Overlap Risk Assessment</h3>
        <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
          Estimated risk that lookalike audiences will overlap with existing targeting or each other.
          Broad demographic selections increase overlap risk.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platformData.map((p) => {
            const riskInfo = RISK_LABEL(p.overlapRisk);
            const riskPct = Math.round(p.overlapRisk * 100);
            return (
              <div key={p.key} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-slate-200">{p.label}</h4>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-2xl font-bold" style={{ color: riskInfo.color }}>{riskPct}%</span>
                    <span className="text-xs ml-1.5 font-medium" style={{ color: riskInfo.color }}>{riskInfo.text} Risk</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-800 dark:text-slate-200">{p.score}</span>
                    <span className="text-xs text-gray-400 ml-0.5">/100</span>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">suitability</p>
                  </div>
                </div>

                <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${riskPct}%`, background: riskInfo.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Requirements Summary */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">Platform Requirements Summary</h3>
        <div className="space-y-4">
          {platformData.map((p) => (
            <div key={p.key} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-slate-200">{p.label}</h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{p.description}</p>
                  </div>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold text-white shrink-0"
                  style={{ background: p.score >= 60 ? '#10b981' : p.score >= 40 ? '#f59e0b' : '#94a3b8' }}
                >
                  {p.score}/100
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Seed Requirements */}
                <div>
                  <p className="text-[10px] font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-1.5">Seed Data Requirements</p>
                  <ul className="space-y-1">
                    {p.seedReqs.map((req) => (
                      <li key={req} className="text-xs text-gray-600 dark:text-slate-400 flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Expansion Ranges */}
                <div>
                  <p className="text-[10px] font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-1.5">Expansion Ranges</p>
                  <ul className="space-y-1">
                    {p.expansionRanges.map((range, i) => (
                      <li key={range} className="text-xs text-gray-600 dark:text-slate-400 flex items-start gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
                          style={{ background: i === 0 ? '#10b981' : i === 1 ? '#f59e0b' : '#94a3b8' }}
                        />
                        {range}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
