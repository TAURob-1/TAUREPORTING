import React, { useMemo } from 'react';
import { ATTRIBUTE_CLASSES } from '../../../data/audienceGraph/scores.js';

const READINESS_TIERS = [
  { min: 75, label: 'Excellent', color: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-300 dark:border-emerald-700' },
  { min: 50, label: 'Good', color: '#6366f1', bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-300 dark:border-indigo-700' },
  { min: 30, label: 'Moderate', color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-300 dark:border-amber-700' },
  { min: 0, label: 'Low', color: '#94a3b8', bg: 'bg-gray-50 dark:bg-slate-800/50', border: 'border-gray-300 dark:border-slate-700' },
];

const ACTIVATION_CHANNELS = [
  {
    key: 'email',
    label: 'Email Marketing',
    description: 'Personalised email campaigns based on CRM segments. Best for high-frequency, data-rich audiences.',
    minScore: 35,
    classBoost: { PURCH: 15, PSYCH: 10, BEHAV: 10 },
    requirements: ['Email opt-in data', 'Segment tags', 'Purchase history'],
  },
  {
    key: 'sms',
    label: 'SMS / MMS',
    description: 'Short-form direct messaging for time-sensitive offers and transactional triggers.',
    minScore: 45,
    classBoost: { PURCH: 20, CONTEXT: 15, BEHAV: 10 },
    requirements: ['Mobile number opt-in', 'Consent records', 'Frequency caps'],
  },
  {
    key: 'app_push',
    label: 'App Push Notifications',
    description: 'In-app and push notifications for engaged mobile users. High immediacy, low cost.',
    minScore: 50,
    classBoost: { MEDIA: 20, BEHAV: 15, DEMO: 5 },
    requirements: ['App install base', 'Push notification opt-in', 'Event tracking'],
  },
  {
    key: 'direct_mail',
    label: 'Direct Mail',
    description: 'Physical mail for high-value audiences. Strong for geo-targeted, premium segments.',
    minScore: 30,
    classBoost: { GEO: 20, SOCIO: 15, DEMO: 10 },
    requirements: ['Postal address data', 'Address verification', 'Print fulfilment partner'],
  },
  {
    key: 'loyalty',
    label: 'Loyalty Programme',
    description: 'Points, rewards, and tiered benefits. Drives repeat purchase and data enrichment.',
    minScore: 40,
    classBoost: { PURCH: 20, BEHAV: 15, PSYCH: 10 },
    requirements: ['Transaction history', 'Loyalty programme platform', 'Reward catalogue'],
  },
  {
    key: 'retargeting',
    label: 'CRM Retargeting',
    description: 'Upload CRM lists to ad platforms (Meta, Google) for matched audience retargeting.',
    minScore: 35,
    classBoost: { MEDIA: 15, PURCH: 15, BEHAV: 10 },
    requirements: ['Hashed email/phone lists', 'Platform match rates >40%', 'Consent for ad use'],
  },
];

const CRM_SCORECARD_DIMS = [
  { key: 'data_richness', label: 'Data Richness', description: 'Depth of first-party data signals', classBoost: { PURCH: 20, BEHAV: 15, SOCIO: 10 } },
  { key: 'consent_likelihood', label: 'Consent Likelihood', description: 'Propensity for opt-in and data sharing', classBoost: { PSYCH: 15, DEMO: 10, MEDIA: 10 } },
  { key: 'activation_readiness', label: 'Activation Readiness', description: 'Ease of deploying CRM-based campaigns', classBoost: { MEDIA: 15, BEHAV: 15, PURCH: 10 } },
  { key: 'ltv_potential', label: 'LTV Potential', description: 'Lifetime value indicator from purchase signals', classBoost: { PURCH: 25, SOCIO: 15, PSYCH: 10 } },
];

function computeCrmScore(selectedAttributes) {
  if (selectedAttributes.length === 0) return 0;

  let totalWeight = 0;
  let count = 0;

  for (const { classKey, attrKey } of selectedAttributes) {
    const cls = ATTRIBUTE_CLASSES[classKey];
    const attr = cls?.attributes[attrKey];
    if (!attr) continue;

    const crmScore = attr.scores?.M_CRM;
    const P = crmScore?.P ?? cls.defaults?.M_CRM?.P ?? 0;
    const S = crmScore?.S ?? cls.defaults?.M_CRM?.S ?? 0;

    totalWeight += P * S;
    count++;
  }

  if (count === 0) return 0;
  return Math.min(100, Math.round((totalWeight / count) * 4));
}

function computeDimensionScore(selectedAttributes, classBoost) {
  const base = computeCrmScore(selectedAttributes);

  let boost = 0;
  const classCount = {};
  selectedAttributes.forEach((a) => { classCount[a.classKey] = (classCount[a.classKey] || 0) + 1; });

  for (const [cls, points] of Object.entries(classBoost)) {
    if (classCount[cls]) boost += points * Math.min(classCount[cls], 2);
  }

  return Math.min(100, Math.round(base * 0.6 + boost * 0.4));
}

function getTier(score) {
  return READINESS_TIERS.find((t) => score >= t.min) || READINESS_TIERS[READINESS_TIERS.length - 1];
}

export default function CRMDrillDown({ selectedAttributes, blueprint }) {
  const crmScore = useMemo(() => computeCrmScore(selectedAttributes), [selectedAttributes]);
  const tier = getTier(crmScore);

  const scorecardDims = useMemo(() => {
    return CRM_SCORECARD_DIMS.map((dim) => ({
      ...dim,
      score: computeDimensionScore(selectedAttributes, dim.classBoost),
    }));
  }, [selectedAttributes]);

  const channels = useMemo(() => {
    return ACTIVATION_CHANNELS.map((ch) => {
      const channelScore = computeDimensionScore(selectedAttributes, ch.classBoost);
      const recommended = channelScore >= ch.minScore;
      return { ...ch, channelScore, recommended };
    }).sort((a, b) => b.channelScore - a.channelScore);
  }, [selectedAttributes]);

  if (selectedAttributes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-slate-400">
        Select audience attributes to see CRM readiness analysis.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">CRM / First-Party Data Drill-Down</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          CRM readiness and activation channel recommendations for {selectedAttributes.length} attribute{selectedAttributes.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {/* Overall CRM Readiness Scorecard */}
      <section className={`rounded-xl p-6 border ${tier.bg} ${tier.border}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300">CRM Readiness Scorecard</h3>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-bold text-white"
            style={{ background: tier.color }}
          >
            {tier.label}
          </span>
        </div>

        {/* Overall score */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" className="dark:stroke-slate-700" />
              <circle
                cx="50" cy="50" r="42" fill="none" strokeWidth="8" strokeLinecap="round"
                stroke={tier.color}
                strokeDasharray={`${crmScore * 2.64} 264`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{crmScore}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-slate-300">
              Overall CRM readiness score based on first-party data signal strength across selected attributes.
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
              Score reflects M_CRM Precision x Scale weighted across your audience profile.
            </p>
          </div>
        </div>

        {/* Dimension breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {scorecardDims.map((dim) => {
            const dimTier = getTier(dim.score);
            return (
              <div key={dim.key} className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">{dim.label}</span>
                  <span className="text-sm font-bold" style={{ color: dimTier.color }}>{dim.score}</span>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 mb-2">{dim.description}</p>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${dim.score}%`, background: dimTier.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Activation Channel Recommendations */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">Activation Channel Recommendations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((ch) => {
            const chTier = getTier(ch.channelScore);
            return (
              <div
                key={ch.key}
                className={`rounded-xl p-5 border ${
                  ch.recommended
                    ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-700'
                    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-slate-200">{ch.label}</h4>
                  {ch.recommended && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-semibold">RECOMMENDED</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">{ch.description}</p>

                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500 dark:text-slate-400">Suitability</span>
                  <span className="font-bold" style={{ color: chTier.color }}>{ch.channelScore}/100</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full" style={{ width: `${ch.channelScore}%`, background: chTier.color }} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-1">Requirements</p>
                  <ul className="space-y-0.5">
                    {ch.requirements.map((req) => (
                      <li key={req} className="text-[10px] text-gray-400 dark:text-slate-500 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-slate-500 inline-block" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
