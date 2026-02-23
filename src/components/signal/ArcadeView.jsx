import React, { useEffect, useState } from 'react';

const STRATEGIC_GLOB = import.meta.glob(
  '/signal-data/tombola-co-uk/strategic_brief/tombolaarcade_co_uk_strategic_brief_part*.txt',
  { query: '?raw', import: 'default', eager: false }
);

function parseMetric(text, label) {
  const re = new RegExp(label + ':\\s*(.+)', 'i');
  const m = text.match(re);
  return m ? m[1].trim() : null;
}

function parseSection(text, heading) {
  const re = new RegExp('##\\s+' + heading + '\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)', 'i');
  const m = text.match(re);
  return m ? m[1].trim() : null;
}

function parseBlocks(sectionText) {
  if (!sectionText) return [];
  const blocks = [];
  const lines = sectionText.split('\n');
  let current = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === '---') continue;
    if (/^[A-Z_]+:$/.test(trimmed)) {
      if (current) blocks.push(current);
      current = { id: trimmed.replace(':', ''), fields: {} };
    } else if (current && trimmed.includes(': ')) {
      const idx = trimmed.indexOf(': ');
      current.fields[trimmed.slice(0, idx)] = trimmed.slice(idx + 2);
    }
  }
  if (current) blocks.push(current);
  return blocks;
}

export default function ArcadeView() {
  const [parts, setParts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const keys = Object.keys(STRATEGIC_GLOB).sort();
    if (keys.length === 0) {
      setLoading(false);
      return;
    }
    Promise.all(keys.map((k) => STRATEGIC_GLOB[k]()))
      .then((texts) => {
        const map = {};
        texts.forEach((t, i) => { map[i + 1] = t; });
        setParts(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500 p-4">Loading Arcade intelligence...</div>;
  }

  if (!parts[1]) {
    return <div className="text-sm text-gray-500 p-4">Arcade strategic brief data not available.</div>;
  }

  // Parse Part 1: Executive Summary
  const situation = parseSection(parts[1], 'THE SITUATION');
  const verdict = parseSection(parts[1], 'VERDICT');
  const oneThing = parseSection(parts[1], 'THE ONE THING THAT MATTERS MOST');
  const trafficBlocks = parseBlocks(parseSection(parts[1], 'COMPETITIVE POSITION: TRAFFIC'));
  const aiBlocks = parseBlocks(parseSection(parts[1], 'COMPETITIVE POSITION: AI VISIBILITY'));
  const seoBlocks = parseBlocks(parseSection(parts[1], 'COMPETITIVE POSITION: SEO KEYWORDS'));
  const priorities = parseBlocks(parseSection(parts[1], 'TOP THREE STRATEGIC PRIORITIES'));
  const personas = parseBlocks(parseSection(parts[1], 'CUSTOMER PERSONAS'));
  const appealBlocks = parseBlocks(parseSection(parts[1], 'COMPETITOR APPEAL ANALYSIS'));

  // Parse Part 2: Traffic
  const trafficSources = parseBlocks(parseSection(parts[2] || '', 'TRAFFIC SOURCE BREAKDOWN: TOMBOLAARCADE CO UK'));
  const marketShareBlocks = parseBlocks(parseSection(parts[2] || '', 'SHARE OF MARKET: TRAFFIC'));

  // Parse Part 3: SEO
  const seoOverview = parseSection(parts[3] || '', 'SEO OVERVIEW');
  const keywordOps = parseBlocks(parseSection(parts[3] || '', 'HIGH-VALUE KEYWORD OPPORTUNITIES'));
  const seoRecs = parseBlocks(parseSection(parts[3] || '', 'SEO RECOMMENDATIONS'));

  // Parse Part 4: AI & SWOT
  const aiOverview = parseBlocks(parseSection(parts[4] || '', 'AI VISIBILITY ASSESSMENT'));
  const roadmap = parseBlocks(parseSection(parts[4] || '', 'NINETY DAY AI VISIBILITY ROADMAP'));
  const swotSection = parseSection(parts[4] || '', 'SWOT SUMMARY');
  const swotBlocks = parseBlocks(swotSection);
  const immediateActions = parseBlocks(parseSection(parts[4] || '', 'IMMEDIATE ACTIONS: NEXT THIRTY DAYS'));
  const mediumActions = parseBlocks(parseSection(parts[4] || '', 'MEDIUM TERM ACTIONS: THIRTY TO NINETY DAYS'));

  const strengths = swotBlocks.filter(b => b.id.startsWith('STRENGTH'));
  const weaknesses = swotBlocks.filter(b => b.id.startsWith('WEAKNESS'));
  const opportunities = swotBlocks.filter(b => b.id.startsWith('OPPORTUNITY'));
  const threats = swotBlocks.filter(b => b.id.startsWith('THREAT'));

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold">Tombolaarcade.co.uk — Strategic Intelligence</h2>
        <p className="text-purple-200 text-sm mt-1">Casino/slots product — 4-part Signal analysis</p>
        {situation && <p className="text-purple-100 text-sm mt-3">{situation}</p>}
      </div>

      {/* Verdict + One Thing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {verdict && (
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-5">
            <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide mb-2">Verdict</h3>
            <p className="text-sm text-gray-800">{verdict}</p>
          </div>
        )}
        {oneThing && (
          <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-5">
            <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide mb-2">The One Thing That Matters Most</h3>
            <p className="text-sm text-gray-800">{oneThing}</p>
          </div>
        )}
      </div>

      {/* Traffic Rankings */}
      {trafficBlocks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-base font-bold text-gray-900 mb-4">Competitive Position: Traffic</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-600 font-medium">Company</th>
                  <th className="text-right py-2 px-3 text-gray-600 font-medium">Monthly Visits</th>
                  <th className="text-center py-2 px-3 text-gray-600 font-medium">Rank</th>
                  <th className="text-left py-2 px-3 text-gray-600 font-medium">Gap</th>
                </tr>
              </thead>
              <tbody>
                {trafficBlocks.map((b) => {
                  const isArcade = (b.fields.Company || '').toLowerCase().includes('tombolaarcade');
                  return (
                    <tr key={b.id} className={`border-b border-gray-50 ${isArcade ? 'bg-purple-50 font-semibold' : ''}`}>
                      <td className="py-2 px-3">{b.fields.Company}</td>
                      <td className="py-2 px-3 text-right">{b.fields['Monthly visits'] || '—'}</td>
                      <td className="py-2 px-3 text-center">{b.fields.Rank || '—'}</td>
                      <td className="py-2 px-3 text-xs text-gray-500">{b.fields['Gap versus Tombolaarcade Co Uk'] || b.fields.Assessment || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Market Share + Traffic Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {marketShareBlocks.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-900 mb-3">Market Share (Traffic)</h3>
            <div className="space-y-2">
              {marketShareBlocks.map((b) => {
                const share = parseFloat(b.fields['Traffic share']) || 0;
                const isArcade = (b.fields.Company || '').toLowerCase().includes('tombolaarcade');
                return (
                  <div key={b.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={isArcade ? 'font-semibold text-purple-900' : 'text-gray-700'}>{b.fields.Company}</span>
                      <span className={isArcade ? 'font-bold text-purple-900' : 'font-medium text-gray-900'}>{b.fields['Traffic share']}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`h-2 rounded-full ${isArcade ? 'bg-purple-600' : 'bg-gray-400'}`} style={{ width: `${Math.min(share, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {trafficSources.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-900 mb-3">Arcade Traffic Sources</h3>
            <div className="space-y-2">
              {trafficSources.map((b) => {
                const share = parseFloat(b.fields['Traffic share']) || 0;
                return (
                  <div key={b.id} className="flex items-center justify-between text-sm py-1">
                    <span className="text-gray-700">{b.fields.Channel}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full bg-purple-500" style={{ width: `${Math.min(share * 2, 100)}%` }} />
                      </div>
                      <span className="font-medium text-gray-900 w-16 text-right">{b.fields['Traffic share']}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {trafficSources.some(b => b.fields.Assessment) && (
              <div className="mt-3 space-y-1">
                {trafficSources.filter(b => b.fields.Assessment).map(b => (
                  <div key={b.id + '-note'} className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
                    {b.fields.Channel}: {b.fields.Assessment}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SEO Overview */}
      {keywordOps.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-base font-bold text-gray-900 mb-3">Top SEO Keyword Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {keywordOps.slice(0, 10).map((b) => (
              <div key={b.id} className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2 text-sm">
                <div>
                  <span className="font-medium text-gray-900">{b.fields.Term}</span>
                  <span className="text-xs text-gray-500 ml-2">pos {b.fields['Current position']}</span>
                </div>
                <div className="text-right">
                  <span className="text-purple-700 font-semibold">{b.fields['Monthly search volume']}</span>
                  <span className="text-xs text-gray-400 ml-1">/mo</span>
                </div>
              </div>
            ))}
          </div>
          {seoRecs.length > 0 && (
            <div className="mt-4 space-y-2">
              {seoRecs.map(b => (
                <div key={b.id} className={`text-sm px-3 py-2 rounded ${b.fields.Priority === 'URGENT' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
                  <span className="font-semibold">{b.fields.Priority}:</span> {b.fields.Action}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Visibility + Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-base font-bold text-gray-900 mb-3">AI Visibility</h3>
          {aiOverview.length > 0 && (
            <div className="space-y-2">
              {aiOverview.map(b => (
                <div key={b.id} className="text-sm">
                  <div className="font-medium text-gray-900">{b.fields.Company}</div>
                  <div className="text-purple-700">Score: {b.fields['Overall AI visibility score'] || b.fields['Overall score'] || '0%'}</div>
                  {b.fields['AI citation rate'] && <div className="text-xs text-gray-500">Citation rate: {b.fields['AI citation rate']}</div>}
                </div>
              ))}
            </div>
          )}
          {aiBlocks.length > 0 && (
            <div className="mt-3 space-y-1">
              {aiBlocks.filter(b => b.fields['AI visibility score']).map(b => (
                <div key={b.id} className="flex justify-between text-sm py-1 border-b border-gray-50">
                  <span className="text-gray-700">{b.fields.Company}</span>
                  <span className="font-medium">{b.fields['AI visibility score']}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {roadmap.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-900 mb-3">90-Day AI Visibility Roadmap</h3>
            <div className="space-y-3">
              {roadmap.filter(b => b.fields.Name).map(b => (
                <div key={b.id} className="border-l-3 border-purple-400 pl-3">
                  <div className="text-sm font-semibold text-gray-900">{b.fields.Name}</div>
                  <div className="text-xs text-gray-500">{b.fields.Timeframe}</div>
                  <div className="text-sm text-gray-700 mt-1">{b.fields.Actions}</div>
                  <div className="text-xs text-purple-600 mt-1">{b.fields['Expected impact']}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SWOT */}
      {swotBlocks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-base font-bold text-gray-900 mb-4">SWOT Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-sm font-bold text-green-800 mb-2">Strengths</h4>
              {strengths.map(b => (
                <div key={b.id} className="text-sm text-green-900 mb-1">- {b.fields.Detail}</div>
              ))}
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="text-sm font-bold text-red-800 mb-2">Weaknesses</h4>
              {weaknesses.map(b => (
                <div key={b.id} className="text-sm text-red-900 mb-1">- {b.fields.Detail}</div>
              ))}
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-bold text-blue-800 mb-2">Opportunities</h4>
              {opportunities.map(b => (
                <div key={b.id} className="text-sm text-blue-900 mb-1">- {b.fields.Detail}</div>
              ))}
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <h4 className="text-sm font-bold text-amber-800 mb-2">Threats</h4>
              {threats.map(b => (
                <div key={b.id} className="text-sm text-amber-900 mb-1">- {b.fields.Detail}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Strategic Priorities */}
      {priorities.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-base font-bold text-gray-900 mb-3">Top Strategic Priorities</h3>
          <div className="space-y-2">
            {priorities.map((b, i) => (
              <div key={b.id} className="flex gap-3 items-start bg-purple-50 rounded-md p-3">
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                <div className="text-sm text-gray-800">{b.fields.Detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Immediate Actions */}
      {immediateActions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-base font-bold text-gray-900 mb-3">Immediate Actions (Next 30 Days)</h3>
          <div className="space-y-2">
            {immediateActions.map(b => (
              <div key={b.id} className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2 text-sm">
                <span className="text-gray-800">{b.fields.Task}</span>
                <div className="flex gap-3 text-xs">
                  <span className="text-gray-500">{b.fields.Effort}</span>
                  <span className={`font-medium ${b.fields.Impact === 'High' ? 'text-red-600' : 'text-amber-600'}`}>{b.fields.Impact} impact</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Personas */}
      {personas.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-base font-bold text-gray-900 mb-3">Customer Personas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {personas.map(b => (
              <div key={b.id} className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-sm font-bold text-purple-900">{b.fields.Name}</div>
                <div className="text-xs text-gray-600 mt-1">{b.fields.Description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
