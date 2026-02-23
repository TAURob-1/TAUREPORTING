import React, { useEffect, useState } from 'react';

// Bingo traffic data (tombola.co.uk)
const BINGO_TRAFFIC_GLOB = import.meta.glob(
  '/signal-data/tombola-co-uk/data/traffic/traffic_main.json',
  { import: 'default' }
);
const BINGO_COMPARISON_GLOB = import.meta.glob(
  '/signal-data/tombola-co-uk/data/traffic/traffic_comparison.json',
  { import: 'default' }
);

// Arcade strategic brief (contains traffic data for arcade)
const ARCADE_STRATEGIC_GLOB = import.meta.glob(
  '/signal-data/tombola-co-uk/strategic_brief/tombolaarcade_co_uk_strategic_brief_part*.txt',
  { query: '?raw', import: 'default', eager: false }
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

function parseValue(text, label) {
  const re = new RegExp(label + ':\\s*(.+)', 'i');
  const m = text.match(re);
  return m ? m[1].trim() : null;
}

export default function SegmentView({ signal }) {
  const [bingoTraffic, setBingoTraffic] = useState(null);
  const [bingoComparison, setBingoComparison] = useState(null);
  const [arcadeText, setArcadeText] = useState(null);

  useEffect(() => {
    loadFirstGlob(BINGO_TRAFFIC_GLOB).then(setBingoTraffic);
    loadFirstGlob(BINGO_COMPARISON_GLOB).then(setBingoComparison);
    // Load all arcade brief parts
    const keys = Object.keys(ARCADE_STRATEGIC_GLOB).sort();
    if (keys.length > 0) {
      Promise.all(keys.map(k => ARCADE_STRATEGIC_GLOB[k]()))
        .then(texts => setArcadeText(texts.join('\n')))
        .catch(() => {});
    }
  }, []);

  // === BINGO METRICS (from JSON signal data) ===
  const bingo = (() => {
    const visits = num(bingoTraffic?.engagement?.visits);
    const direct = bingoTraffic?.traffic_sources?.direct;
    const organic = bingoTraffic?.traffic_sources?.organic_search;
    const social = bingoTraffic?.traffic_sources?.social;
    const rank = bingoTraffic?.category_rank;
    // Market share from comparison
    const compTable = bingoComparison?.traffic_comparison || [];
    const totalVis = compTable.reduce((s, r) => s + num(r.visits), 0);
    const tomVis = num(compTable.find(r => r.domain === 'tombola.co.uk')?.visits);
    const share = totalVis > 0 ? ((tomVis / totalVis) * 100).toFixed(1) : 0;
    const aiScore = signal?.summary?.aiVisibilityScore || 0;
    return {
      visits: visits || signal?.summary?.monthlyVisits || 0,
      share: share || signal?.summary?.marketShare || 0,
      rank: rank || '#1',
      direct: direct ? (direct * 100).toFixed(1) : '71.6',
      organic: organic ? (organic * 100).toFixed(1) : '16.6',
      social: social ? (social * 100).toFixed(2) : '0.18',
      aiScore,
      audience: 'Women 55-75',
      positioning: 'Trusted bingo brand',
      category: 'Bingo',
    };
  })();

  // === ARCADE METRICS (from strategic brief text) ===
  const arcade = (() => {
    if (!arcadeText) {
      return {
        visits: '809.6K', share: '12.5', rank: '3/5',
        direct: '51.4', organic: '19.6', social: '0.08',
        aiScore: '12.5', audience: 'Men 18-35',
        positioning: 'Fun-first casino', category: 'Casino/Slots',
      };
    }
    return {
      visits: parseValue(arcadeText, 'Monthly visits') || '809.6K',
      share: parseValue(arcadeText, 'Traffic share')?.replace('%', '') || '12.5',
      rank: parseValue(arcadeText, 'Rank') || '3/5',
      direct: '51.4',
      organic: '19.6',
      social: '0.08',
      aiScore: '12.5',
      audience: 'Men 18-35',
      positioning: 'Fun-first casino',
      category: 'Casino/Slots',
    };
  })();

  // === COMPARISON ROWS ===
  const rows = [
    { label: 'Monthly Visits', bingo: formatVisits(bingo.visits), arcade: arcade.visits },
    { label: 'Market Share', bingo: `${bingo.share}%`, arcade: `${arcade.share}%` },
    { label: 'Category Rank', bingo: bingo.rank, arcade: arcade.rank },
    { label: 'Direct Traffic', bingo: `${bingo.direct}%`, arcade: `${arcade.direct}%` },
    { label: 'Organic Search', bingo: `${bingo.organic}%`, arcade: `${arcade.organic}%` },
    { label: 'Social Traffic', bingo: `${bingo.social}%`, arcade: `${arcade.social}%` },
    { label: 'AI Visibility', bingo: `${bingo.aiScore}%`, arcade: `${arcade.aiScore}%` },
    { label: 'Target Audience', bingo: bingo.audience, arcade: arcade.audience },
    { label: 'Category', bingo: bingo.category, arcade: arcade.category },
    { label: 'Positioning', bingo: bingo.positioning, arcade: arcade.positioning },
  ];

  // Arcade competitors from brief
  const arcadeCompetitors = [
    { name: 'Jackpotjoy', visits: '2.8M', share: '44.0%' },
    { name: 'Virgingames', visits: '2.7M', share: '41.5%' },
    { name: 'Tombolaarcade', visits: '809.6K', share: '12.5%', highlight: true },
    { name: 'Galaspins', visits: '73.8K', share: '1.1%' },
    { name: 'Foxygames', visits: '55.9K', share: '0.9%' },
  ];

  // Bingo competitors from signal comparison data
  const bingoCompetitors = (() => {
    const table = bingoComparison?.traffic_comparison || [];
    if (table.length === 0) return null;
    const totalVis = table.reduce((s, r) => s + num(r.visits), 0);
    return table
      .map(r => ({
        name: r.domain.replace('.com', '').replace('.co.uk', ''),
        visits: formatVisits(num(r.visits)),
        share: totalVis > 0 ? ((num(r.visits) / totalVis) * 100).toFixed(1) + '%' : '—',
        highlight: r.domain === 'tombola.co.uk',
      }))
      .sort((a, b) => (b.highlight ? -1 : 0));
  })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold">Bingo vs Arcade — Side-by-Side Comparison</h2>
        <p className="text-blue-200 text-sm mt-1">
          Two distinct products, audiences, and competitive sets from the same parent brand
        </p>
      </div>

      {/* Key Differences Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Audience</div>
          <div className="flex gap-2 items-center">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Bingo: Women 55-75</span>
            <span className="text-gray-400">vs</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">Arcade: Men 18-35</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Market Position</div>
          <div className="flex gap-2 items-center">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Bingo: #1 dominant</span>
            <span className="text-gray-400">vs</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">Arcade: #3 challenger</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Strategy</div>
          <div className="flex gap-2 items-center">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Bingo: Defend &amp; retain</span>
            <span className="text-gray-400">vs</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">Arcade: Grow &amp; acquire</span>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-5 text-gray-600 font-medium bg-gray-50">Metric</th>
              <th className="text-center py-3 px-5 font-medium bg-blue-50 text-blue-900">
                <div>Bingo</div>
                <div className="text-xs font-normal text-blue-600">tombola.co.uk</div>
              </th>
              <th className="text-center py-3 px-5 font-medium bg-purple-50 text-purple-900">
                <div>Arcade</div>
                <div className="text-xs font-normal text-purple-600">tombolaarcade.co.uk</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                <td className="py-2.5 px-5 text-gray-700 font-medium">{row.label}</td>
                <td className="py-2.5 px-5 text-center font-semibold text-blue-900">{row.bingo}</td>
                <td className="py-2.5 px-5 text-center font-semibold text-purple-900">{row.arcade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Competitive Sets Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bingo Competitive Set */}
        <div className="bg-white rounded-lg shadow-sm border border-blue-200 overflow-hidden">
          <div className="bg-blue-50 px-5 py-3 border-b border-blue-200">
            <h3 className="text-sm font-bold text-blue-900">Bingo Competitive Set</h3>
            <p className="text-xs text-blue-600">UK bingo market — tombola.co.uk vs competitors</p>
          </div>
          <div className="p-4">
            {bingoCompetitors ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-1.5 text-gray-500 text-xs">Domain</th>
                    <th className="text-right py-1.5 text-gray-500 text-xs">Visits</th>
                    <th className="text-right py-1.5 text-gray-500 text-xs">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {bingoCompetitors.map(c => (
                    <tr key={c.name} className={c.highlight ? 'bg-blue-50 font-semibold' : ''}>
                      <td className="py-1.5">{c.name}</td>
                      <td className="py-1.5 text-right">{c.visits}</td>
                      <td className="py-1.5 text-right">{c.share}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="space-y-1.5 text-sm text-gray-700">
                <div className="flex gap-2"><span className="text-blue-500">*</span> #1 UK bingo brand by traffic</div>
                <div className="flex gap-2"><span className="text-blue-500">*</span> Competitors: Mecca, Gala, Foxy, Buzz Bingo</div>
                <div className="flex gap-2"><span className="text-blue-500">*</span> 71.6% direct traffic — exceptional brand loyalty</div>
              </div>
            )}
          </div>
        </div>

        {/* Arcade Competitive Set */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 overflow-hidden">
          <div className="bg-purple-50 px-5 py-3 border-b border-purple-200">
            <h3 className="text-sm font-bold text-purple-900">Arcade Competitive Set</h3>
            <p className="text-xs text-purple-600">UK casino/slots market — tombolaarcade.co.uk vs competitors</p>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-1.5 text-gray-500 text-xs">Brand</th>
                  <th className="text-right py-1.5 text-gray-500 text-xs">Visits</th>
                  <th className="text-right py-1.5 text-gray-500 text-xs">Share</th>
                </tr>
              </thead>
              <tbody>
                {arcadeCompetitors.map(c => (
                  <tr key={c.name} className={c.highlight ? 'bg-purple-50 font-semibold' : ''}>
                    <td className="py-1.5">{c.name}</td>
                    <td className="py-1.5 text-right">{c.visits}</td>
                    <td className="py-1.5 text-right">{c.share}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Strategic Implications */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h3 className="text-base font-bold text-gray-900 mb-3">Strategic Implications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-bold text-blue-900 mb-2">Bingo (Defend &amp; Retain)</h4>
            <div className="space-y-1.5 text-sm text-blue-900">
              <div>- Dominant market position (#1) — protect share from Gala/Mecca</div>
              <div>- 71.6% direct traffic = strong owned channel for reactivation</div>
              <div>- Core loyalty audience (55-75 women) — high lifetime value</div>
              <div>- AI visibility {bingo.aiScore}% — early mover advantage to extend</div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="text-sm font-bold text-purple-900 mb-2">Arcade (Grow &amp; Acquire)</h4>
            <div className="space-y-1.5 text-sm text-purple-900">
              <div>- Challenger position (#3) — 3x traffic gap to Jackpotjoy</div>
              <div>- 51.4% direct traffic — lower brand pull than bingo</div>
              <div>- New demographic (18-35 men) — requires distinct creative/channels</div>
              <div>- Reactivation CPA ~£10-20 vs cold acquisition £254</div>
              <div>- Email only 0.03% of traffic — massive retention opportunity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
