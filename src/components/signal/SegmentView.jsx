import React, { useEffect, useState } from 'react';

const ARCADE_BRIEF_GLOB = import.meta.glob(
  '/signal-data/tombola-co-uk/arcade_brief/arcade_brief.txt',
  { query: '?raw', import: 'default', eager: false }
);

function extractSection(text, heading) {
  const regex = new RegExp(`(?:^|\\n)#+\\s*${heading}[^\\n]*\\n([\\s\\S]*?)(?=\\n#+\\s|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

export default function SegmentView({ signal, advertiserName }) {
  const [arcadeBrief, setArcadeBrief] = useState(null);

  useEffect(() => {
    const key = Object.keys(ARCADE_BRIEF_GLOB)[0];
    if (key) {
      ARCADE_BRIEF_GLOB[key]().then((text) => setArcadeBrief(text)).catch(() => {});
    }
  }, []);

  const bingoMetrics = signal
    ? {
        visits: signal.summary?.monthlyVisits || 0,
        share: signal.summary?.marketShare || 0,
        seoGaps: signal.summary?.seoGapCount || 0,
        aiScore: signal.summary?.aiVisibilityScore || 0,
      }
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
                  <div className="text-lg font-bold text-blue-900">
                    {bingoMetrics.visits >= 1000000
                      ? `${(bingoMetrics.visits / 1000000).toFixed(1)}M`
                      : `${(bingoMetrics.visits / 1000).toFixed(0)}K`}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-md p-3 text-center">
                  <div className="text-xs text-blue-600 font-medium">Market Share</div>
                  <div className="text-lg font-bold text-blue-900">{bingoMetrics.share}%</div>
                </div>
                <div className="bg-blue-50 rounded-md p-3 text-center">
                  <div className="text-xs text-blue-600 font-medium">SEO Gaps</div>
                  <div className="text-lg font-bold text-blue-900">{bingoMetrics.seoGaps}</div>
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
            <h3 className="text-base font-bold text-purple-900">Arcade (tombola-arcade)</h3>
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
                <div className="text-sm font-bold text-purple-900">Fun-first</div>
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

      {/* Arcade Brief Highlights */}
      {arcadeBrief && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-base font-bold text-gray-900 mb-3">Arcade Brief Highlights</h3>
          <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto bg-gray-50 rounded-md p-4 border border-gray-100">
            {arcadeBrief.slice(0, 2000)}
            {arcadeBrief.length > 2000 && '...'}
          </div>
        </div>
      )}
    </div>
  );
}
