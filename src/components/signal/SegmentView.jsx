import React, { useEffect, useState } from 'react';

const ARCADE_BRIEF_GLOB = import.meta.glob(
  '/signal-data/tombola-co-uk/arcade_brief/arcade_brief.txt',
  { query: '?raw', import: 'default', eager: false }
);

const ARCADE_STRATEGIC_GLOB = import.meta.glob(
  '/signal-data/tombola-co-uk/strategic_brief/tombolaarcade_co_uk_strategic_brief_part*.txt',
  { query: '?raw', import: 'default', eager: false }
);

// Load bingo traffic and SEO data for comparison metrics
const BINGO_TRAFFIC_GLOB = import.meta.glob(
  '/signal-data/tombola-co-uk/data/traffic/traffic_main.json',
  { import: 'default' }
);

const BINGO_COMPARISON_GLOB = import.meta.glob(
  '/signal-data/tombola-co-uk/data/traffic/traffic_comparison.json',
  { import: 'default' }
);

const BINGO_SEO_GLOB = import.meta.glob(
  '/signal-data/tombola-co-uk/data/seo/keyword_gaps.json',
  { import: 'default' }
);

function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function formatVisits(v) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return String(v);
}

async function loadFirstGlob(globMap) {
  const key = Object.keys(globMap)[0];
  if (!key) return null;
  try { return await globMap[key](); } catch { return null; }
}

async function loadAllGlobText(globMap) {
  const keys = Object.keys(globMap).sort();
  if (keys.length === 0) return null;
  try {
    const texts = await Promise.all(keys.map((k) => globMap[k]()));
    return texts.join('\n\n---\n\n');
  } catch { return null; }
}

export default function SegmentView({ signal, advertiserName }) {
  const [arcadeBrief, setArcadeBrief] = useState(null);
  const [arcadeStrategic, setArcadeStrategic] = useState(null);
  const [bingoTraffic, setBingoTraffic] = useState(null);
  const [bingoComparison, setBingoComparison] = useState(null);
  const [bingoSeo, setBingoSeo] = useState(null);

  useEffect(() => {
    loadFirstGlob(ARCADE_BRIEF_GLOB).then(setArcadeBrief);
    loadAllGlobText(ARCADE_STRATEGIC_GLOB).then(setArcadeStrategic);
    loadFirstGlob(BINGO_TRAFFIC_GLOB).then(setBingoTraffic);
    loadFirstGlob(BINGO_COMPARISON_GLOB).then(setBingoComparison);
    loadFirstGlob(BINGO_SEO_GLOB).then(setBingoSeo);
  }, []);

  // Extract bingo metrics from real Signal traffic data
  const bingoMetrics = (() => {
    if (bingoTraffic) {
      const visits = num(bingoTraffic.engagement?.visits);
      // Market share from comparison table
      const compTable = bingoComparison?.traffic_comparison || [];
      const totalVisits = compTable.reduce((sum, r) => sum + num(r.visits), 0);
      const tombolaVisits = num(compTable.find(r => r.domain === 'tombola.co.uk')?.visits);
      const share = totalVisits > 0 ? Number(((tombolaVisits / totalVisits) * 100).toFixed(1)) : 0;
      // SEO gaps from keyword_gaps data
      const seoGaps = bingoSeo?.gaps
        ? Object.values(bingoSeo.gaps).reduce((sum, e) => sum + num(e?.opportunities?.count), 0)
        : 0;
      const aiScore = signal?.summary?.aiVisibilityScore || 0;
      return { visits, share, seoGaps, aiScore, rank: bingoTraffic.category_rank };
    }
    if (signal) {
      return {
        visits: signal.summary?.monthlyVisits || 0,
        share: signal.summary?.marketShare || 0,
        seoGaps: signal.summary?.seoGapCount || 0,
        aiScore: signal.summary?.aiVisibilityScore || 0,
      };
    }
    return null;
  })();

  // Extract key themes from strategic brief
  const strategicHighlights = arcadeStrategic
    ? arcadeStrategic.slice(0, 3000)
    : arcadeBrief
      ? arcadeBrief.slice(0, 2000)
      : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bingo Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-blue-200 overflow-hidden">
          <div className="bg-blue-50 px-5 py-3 border-b border-blue-200">
            <h3 className="text-base font-bold text-blue-900">Bingo (tombola.co.uk)</h3>
            <p className="text-xs text-blue-700 mt-1">Core bingo product — established audience</p>
          </div>
          <div className="p-5 space-y-3">
            {bingoMetrics && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-md p-3 text-center">
                  <div className="text-xs text-blue-600 font-medium">Monthly Visits</div>
                  <div className="text-lg font-bold text-blue-900">{formatVisits(bingoMetrics.visits)}</div>
                </div>
                <div className="bg-blue-50 rounded-md p-3 text-center">
                  <div className="text-xs text-blue-600 font-medium">Market Share</div>
                  <div className="text-lg font-bold text-blue-900">{bingoMetrics.share}%</div>
                </div>
                <div className="bg-blue-50 rounded-md p-3 text-center">
                  <div className="text-xs text-blue-600 font-medium">SEO Gaps</div>
                  <div className="text-lg font-bold text-blue-900">{bingoMetrics.seoGaps.toLocaleString()}</div>
                </div>
                <div className="bg-blue-50 rounded-md p-3 text-center">
                  <div className="text-xs text-blue-600 font-medium">AI Visibility</div>
                  <div className="text-lg font-bold text-blue-900">{bingoMetrics.aiScore}%</div>
                </div>
              </div>
            )}
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex gap-2"><span className="text-blue-500">*</span> Dominant UK bingo brand — #1 category rank</div>
              <div className="flex gap-2"><span className="text-blue-500">*</span> Core audience: Women 55-75, loyal, high engagement</div>
              <div className="flex gap-2"><span className="text-blue-500">*</span> 71.58% direct traffic indicates strong brand loyalty</div>
            </div>
          </div>
        </div>

        {/* Arcade Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 overflow-hidden">
          <div className="bg-purple-50 px-5 py-3 border-b border-purple-200">
            <h3 className="text-base font-bold text-purple-900">Arcade (tombolaarcade.co.uk)</h3>
            <p className="text-xs text-purple-700 mt-1">Casino/slots product — growth audience</p>
          </div>
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-50 rounded-md p-3 text-center">
                <div className="text-xs text-purple-600 font-medium">Target Demo</div>
                <div className="text-sm font-bold text-purple-900">Men 18-35</div>
              </div>
              <div className="bg-purple-50 rounded-md p-3 text-center">
                <div className="text-xs text-purple-600 font-medium">Growth Status</div>
                <div className="text-sm font-bold text-purple-900">Expansion</div>
              </div>
              <div className="bg-purple-50 rounded-md p-3 text-center">
                <div className="text-xs text-purple-600 font-medium">Existing Players</div>
                <div className="text-sm font-bold text-purple-900">175K</div>
              </div>
              <div className="bg-purple-50 rounded-md p-3 text-center">
                <div className="text-xs text-purple-600 font-medium">Positioning</div>
                <div className="text-sm font-bold text-purple-900">Fun-first casino</div>
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex gap-2"><span className="text-purple-500">*</span> New audience segment: Men 18-35 (different from bingo core)</div>
              <div className="flex gap-2"><span className="text-purple-500">*</span> Exclusive games — proprietary slots not available elsewhere</div>
              <div className="flex gap-2"><span className="text-purple-500">*</span> Reactivation CPA ~£10-20 vs cold acquisition £254</div>
            </div>
          </div>
        </div>
      </div>

      {/* Arcade Strategic Brief */}
      {strategicHighlights && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            Arcade Strategic Brief {arcadeStrategic ? '(4-part analysis)' : '(Summary)'}
          </h3>
          <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto bg-gray-50 rounded-md p-4 border border-gray-100">
            {strategicHighlights}
            {(arcadeStrategic || arcadeBrief || '').length > 3000 && '\n\n[Truncated — full brief available in Signal data]'}
          </div>
        </div>
      )}
    </div>
  );
}
