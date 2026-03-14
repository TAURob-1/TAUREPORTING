import React, { useMemo } from 'react';
import { ATTRIBUTE_CLASSES } from '../../../data/audienceGraph/scores.js';

/**
 * Six content environment categories scored from attribute M_CTX weights.
 */
const CONTENT_ENVIRONMENTS = [
  {
    key: 'news_current_affairs',
    label: 'News & Current Affairs',
    description: 'National and international news, politics, business reporting',
    icon: 'N',
    classWeights: { DEMO: 0.8, SOCIO: 0.9, GEO: 0.7, BEHAV: 0.4, PSYCH: 0.6, PURCH: 0.3, CONTEXT: 0.5, MEDIA: 0.6 },
    publishers: ['BBC News', 'Sky News', 'The Guardian', 'The Times', 'The Telegraph', 'Financial Times'],
  },
  {
    key: 'entertainment_lifestyle',
    label: 'Entertainment & Lifestyle',
    description: 'Celebrity, TV, film, music, fashion and lifestyle content',
    icon: 'E',
    classWeights: { DEMO: 0.7, SOCIO: 0.5, GEO: 0.5, BEHAV: 0.8, PSYCH: 0.7, PURCH: 0.9, CONTEXT: 0.8, MEDIA: 0.9 },
    publishers: ['Cosmopolitan', 'GQ', 'Vogue', 'BuzzFeed UK', 'Digital Spy', 'Metro'],
  },
  {
    key: 'sport',
    label: 'Sport',
    description: 'Football, rugby, cricket, Formula 1, Olympics coverage',
    icon: 'S',
    classWeights: { DEMO: 0.9, SOCIO: 0.4, GEO: 0.8, BEHAV: 1.0, PSYCH: 0.5, PURCH: 0.4, CONTEXT: 0.7, MEDIA: 0.7 },
    publishers: ['Sky Sports', 'BBC Sport', 'The Athletic', 'ESPN UK', 'talkSPORT', 'Eurosport'],
  },
  {
    key: 'technology',
    label: 'Technology & Science',
    description: 'Gadgets, software, AI, scientific research and innovation',
    icon: 'T',
    classWeights: { DEMO: 0.5, SOCIO: 0.7, GEO: 0.4, BEHAV: 1.0, PSYCH: 0.6, PURCH: 0.8, CONTEXT: 0.4, MEDIA: 0.8 },
    publishers: ['Wired UK', 'TechRadar', 'The Verge', 'Ars Technica', 'T3', 'Pocket-lint'],
  },
  {
    key: 'finance_business',
    label: 'Finance & Business',
    description: 'Personal finance, markets, investing, business strategy',
    icon: 'F',
    classWeights: { DEMO: 0.6, SOCIO: 1.0, GEO: 0.6, BEHAV: 0.5, PSYCH: 0.8, PURCH: 0.7, CONTEXT: 0.5, MEDIA: 0.5 },
    publishers: ['Financial Times', 'City A.M.', 'MoneyWeek', 'MoneySavingExpert', 'This is Money', 'Bloomberg UK'],
  },
  {
    key: 'home_family',
    label: 'Home & Family',
    description: 'Parenting, home improvement, gardening, food and recipes',
    icon: 'H',
    classWeights: { DEMO: 0.8, SOCIO: 0.7, GEO: 0.7, BEHAV: 0.9, PSYCH: 0.8, PURCH: 0.8, CONTEXT: 0.9, MEDIA: 0.5 },
    publishers: ['Good Housekeeping', 'BBC Good Food', 'Mumsnet', 'Ideal Home', 'Gardeners\' World', 'Real Homes'],
  },
];

function computeContextScore(selectedAttributes, classWeights) {
  if (selectedAttributes.length === 0) return 0;

  let totalWeight = 0;
  let count = 0;

  for (const { classKey, attrKey } of selectedAttributes) {
    const cls = ATTRIBUTE_CLASSES[classKey];
    const attr = cls?.attributes[attrKey];
    if (!attr) continue;

    const ctxScore = attr.scores?.M_CTX;
    const P = ctxScore?.P ?? cls.defaults?.M_CTX?.P ?? 0;
    const S = ctxScore?.S ?? cls.defaults?.M_CTX?.S ?? 0;
    const weight = classWeights[classKey] || 0.5;

    totalWeight += (P * S) * weight;
    count++;
  }

  if (count === 0) return 0;
  // Max possible: 25 * 1.0 = 25, scale to 0–100
  return Math.min(100, Math.round((totalWeight / count) * 4));
}

export default function ContextualDrillDown({ selectedAttributes, blueprint }) {
  const environmentScores = useMemo(() => {
    return CONTENT_ENVIRONMENTS.map((env) => ({
      ...env,
      score: computeContextScore(selectedAttributes, env.classWeights),
    })).sort((a, b) => b.score - a.score);
  }, [selectedAttributes]);

  const topEnvironments = environmentScores.filter((e) => e.score >= 40);
  const allPublishers = useMemo(() => {
    const map = {};
    environmentScores.forEach((env) => {
      env.publishers.forEach((pub) => {
        if (!map[pub]) map[pub] = { name: pub, score: 0, environments: [] };
        map[pub].score = Math.max(map[pub].score, env.score);
        map[pub].environments.push(env.label);
      });
    });
    return Object.values(map).sort((a, b) => b.score - a.score);
  }, [environmentScores]);

  if (selectedAttributes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-slate-400">
        Select audience attributes to see contextual environment analysis.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Contextual Drill-Down</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Content environment suitability and publisher recommendations based on contextual signal strength.
        </p>
      </div>

      {/* Content Environment Cards */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">Content Environment Match</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {environmentScores.map((env) => {
            const isTop = env.score >= 40;
            return (
              <div
                key={env.key}
                className={`rounded-xl p-5 border transition-shadow ${
                  isTop
                    ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-700 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      isTop ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
                    }`}>
                      {env.icon}
                    </span>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-slate-200">{env.label}</h4>
                  </div>
                  {isTop && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-semibold">MATCH</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">{env.description}</p>

                {/* Score bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-slate-400">Context Score</span>
                    <span className="font-semibold text-gray-800 dark:text-slate-200">{env.score}/100</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${env.score}%`,
                        background: env.score >= 60 ? '#10b981' : env.score >= 40 ? '#f59e0b' : '#94a3b8',
                      }}
                    />
                  </div>
                </div>

                {/* Publisher list */}
                <div>
                  <p className="text-[10px] font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-1">Key Publishers</p>
                  <div className="flex flex-wrap gap-1">
                    {env.publishers.map((pub) => (
                      <span
                        key={pub}
                        className="px-2 py-0.5 text-[10px] rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700"
                      >
                        {pub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Publisher Recommendations */}
      <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-4">Publisher Recommendations</h3>
        <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
          Ranked by highest context-match score across {topEnvironments.length} qualifying environment{topEnvironments.length !== 1 ? 's' : ''}.
        </p>
        <div className="space-y-2">
          {allPublishers.slice(0, 15).map((pub, i) => (
            <div key={pub.name} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 dark:text-slate-500 w-5 text-right tabular-nums">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800 dark:text-slate-200">{pub.name}</span>
                  <span className="text-xs font-semibold text-gray-600 dark:text-slate-300 tabular-nums">{pub.score}</span>
                </div>
                <div className="w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pub.score}%`,
                      background: pub.score >= 60 ? '#10b981' : pub.score >= 40 ? '#f59e0b' : '#94a3b8',
                    }}
                  />
                </div>
                <div className="flex gap-1 mt-1">
                  {pub.environments.map((env) => (
                    <span key={env} className="text-[9px] text-gray-400 dark:text-slate-500">{env}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
