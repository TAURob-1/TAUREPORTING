import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePlatform } from '../context/PlatformContext.jsx';
import { getAdvisorContext } from '../data/signalIntegration';

const API_URL = import.meta.env.VITE_CHAT_API || 'http://localhost:3002';

const PLANNING_LAYERS = [
  'Strategic Comms Planning',
  'Comms Channel Planning',
  'Channel Planning',
  'Audience and Data Planning',
  'Measurement Planning',
  'Message and Creative Planning',
  'Flighting and Phasing',
  'Martech and Ops Planning',
  'AI and Simulation Layer',
  'Continuous Optimisation',
];

function buildSuggestedQuestions(advertiserName, countryCode) {
  return [
    `For ${advertiserName} in ${countryCode}, which 3 planning layers should we complete first and why?`,
    `Build a strategic channel mix for ${advertiserName} using current Signal competitive data.`,
    `Recommend a 90-day ${countryCode} plan with budget split, KPI targets, and test design.`,
    `What are the biggest competitor vulnerabilities we can exploit this quarter?`,
    `Create a measurement plan with holdout design and decision thresholds for optimization.`,
  ];
}

function renderCurrency(countryCode) {
  return countryCode === 'UK' ? '£' : '$';
}

function buildDemoResponse(question, context) {
  const { advertiser, countryCode, planningState, advisorContext } = context;
  const snapshot = advisorContext.competitiveSnapshot;
  const budget = planningState.totalBudget || 500000;
  const currency = renderCurrency(countryCode);

  const selectedLayers = [
    '1. Strategic Comms Planning',
    '3. Channel Planning',
    '5. Measurement Planning',
  ];

  return `## Strategic Planning Response: ${advertiser.name}

### Recommended Layer Sequence
${selectedLayers.map((layer) => `- ${layer}`).join('\n')}

### Competitive Context Snapshot
- **Advertiser share in Signal cohort:** ${snapshot.advertiserShare}%
- **Monthly visits (latest):** ${snapshot.monthlyVisits.toLocaleString()}
- **SEO gap count:** ${snapshot.seoGapCount.toLocaleString()}
- **AI visibility score:** ${snapshot.aiVisibilityScore}%
- **Top competitors:** ${snapshot.topCompetitors.map((c) => `${c.name} (${c.share}%)`).join(', ')}

### 90-Day Strategic Recommendation
- **Budget frame:** ${currency}${budget.toLocaleString()} across high-attention video + high-intent capture.
- **Channel mix (starting point):** 45% CTV, 25% Linear TV, 20% Search, 10% Social/retargeting.
- **Primary KPI stack:** incremental reach, qualified traffic, conversion rate, and iROAS.
- **Measurement design:** geo holdout with pre-period baseline; target 95% confidence and decision thresholds every 2 weeks.

### Context-Aware Priorities
${advisorContext.planningPriorities.map((priority) => `- ${priority}`).join('\n')}

### Next Input Needed (minimum required)
Please confirm:
1. Budget guardrails and non-negotiable channels
2. Primary conversion KPI and target
3. Whether you want implementation blueprint details now or after strategy sign-off

_Question received:_ ${question}`;
}

function MarkdownLite({ text }) {
  const lines = text.split('\n');
  const elements = [];
  let tableRows = [];
  let inTable = false;

  const processInline = (line) => line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (line.includes('---')) continue;
      const cells = line.split('|').filter((c) => c.trim()).map((c) => c.trim());
      tableRows.push(cells);
      inTable = true;
      continue;
    } else if (inTable) {
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-3">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {tableRows[0]?.map((cell, j) => (
                  <th key={j} className="border border-gray-200 px-2 py-1.5 text-left font-semibold text-gray-700">{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, j) => (
                    <td key={j} className="border border-gray-200 px-2 py-1" dangerouslySetInnerHTML={{ __html: processInline(cell) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }

    if (line.startsWith('### ')) {
      elements.push(<h4 key={i} className="text-sm font-bold text-gray-800 mt-4 mb-1">{line.slice(4)}</h4>);
    } else if (line.startsWith('## ')) {
      elements.push(<h3 key={i} className="text-base font-bold text-gray-900 mt-4 mb-2">{line.slice(3)}</h3>);
    } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const content = line.trim().slice(2);
      elements.push(
        <div key={i} className="flex gap-2 my-0.5">
          <span className="text-blue-500 mt-0.5 shrink-0">•</span>
          <span className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: processInline(content) }} />
        </div>
      );
    } else if (/^\d+\.\s/.test(line.trim())) {
      const num = line.trim().match(/^(\d+)\./)[1];
      const content = line.trim().replace(/^\d+\.\s/, '');
      elements.push(
        <div key={i} className="flex gap-2 my-0.5">
          <span className="text-blue-600 font-semibold text-sm shrink-0 w-5 text-right">{num}.</span>
          <span className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: processInline(content) }} />
        </div>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(<p key={i} className="text-sm text-gray-700 my-0.5" dangerouslySetInnerHTML={{ __html: processInline(line) }} />);
    }
  }

  if (tableRows.length > 0) {
    elements.push(
      <div key="table-end" className="overflow-x-auto my-3">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {tableRows[0]?.map((cell, j) => (
                <th key={j} className="border border-gray-200 px-2 py-1.5 text-left font-semibold text-gray-700">{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.slice(1).map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, j) => (
                  <td key={j} className="border border-gray-200 px-2 py-1" dangerouslySetInnerHTML={{ __html: processInline(cell) }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <div>{elements}</div>;
}

const StrategicAdvisor = () => {
  const { advertiser, advertiserId, countryCode, planningState } = usePlatform();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const advisorContext = useMemo(
    () => getAdvisorContext(advertiserId, countryCode),
    [advertiserId, countryCode]
  );

  const suggestedQuestions = useMemo(
    () => buildSuggestedQuestions(advertiser.name, countryCode),
    [advertiser.name, countryCode]
  );

  useEffect(() => {
    fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(3000) })
      .then((r) => r.json())
      .then((data) => setApiStatus(data))
      .catch(() => setApiStatus({ status: 'demo' }));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    const contextEnvelope = {
      countryCode,
      advertiser: {
        id: advertiserId,
        name: advertiser.name,
        vertical: advertiser.vertical,
      },
      planningState,
      advisorContext,
      planningLayers: PLANNING_LAYERS,
      operatingMode: 'strategic_planner',
      responseStyle: 'minimum-input layered planning with budget rationale and KPI clarity',
    };

    const isDemo = apiStatus?.status !== 'healthy';

    if (isDemo) {
      await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 900));
      const response = buildDemoResponse(text.trim(), {
        advertiser,
        countryCode,
        planningState,
        advisorContext,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
      inputRef.current?.focus();
      return;
    }

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages,
          company: advertiser.slug,
          context: contextEnvelope,
          system_mode: 'tau_strategic_planner_v2',
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setError(err.message);
      const fallback = buildDemoResponse(text.trim(), {
        advertiser,
        countryCode,
        planningState,
        advisorContext,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: fallback }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const isOnline = apiStatus?.status === 'healthy';
  const isDemo = apiStatus?.status === 'demo';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-700 to-blue-700 rounded-lg shadow-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Syd.AI Strategic Planner</h1>
              <p className="text-indigo-100 mt-1 text-sm">
                {advertiser.name} • {countryCode} • Signal-informed media planning advisor
              </p>
              <p className="text-xs text-indigo-200 mt-2">
                Layered planning model: {PLANNING_LAYERS.length} modules with minimum-input workflow.
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-sm font-medium">{isOnline ? 'Live' : 'Demo Mode'}</span>
              </div>
              {isDemo && <div className="text-xs text-indigo-200 mt-1">Strategic local simulation enabled</div>}
              {apiStatus?.context_chars > 0 && (
                <div className="text-xs text-indigo-200 mt-1">{(apiStatus.context_chars / 1000).toFixed(0)}K chars loaded</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Strategic Planning Assistant</h3>
                <p className="text-sm text-gray-500 max-w-md mb-6">
                  Ask for layered planning, budget rationale, channel strategy, and measurement design tied to live country and Signal context.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      disabled={loading}
                      className="text-left px-3 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg px-4 py-3 ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-50 border border-gray-200'}`}>
                    {msg.role === 'user' ? <p className="text-sm">{msg.content}</p> : <MarkdownLite text={msg.content} />}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-gray-400">Building strategic recommendation...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask for strategic media planning recommendations..."
                disabled={loading}
                rows={1}
                className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                style={{ minHeight: '42px', maxHeight: '120px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {loading ? '...' : 'Send'}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-gray-400">Enter to send</span>
              {error && <span className="text-[10px] text-amber-600">API fallback used: {error}</span>}
              {messages.length > 0 && (
                <button onClick={() => { setMessages([]); setError(null); }} className="text-[10px] text-gray-400 hover:text-gray-600">
                  Clear conversation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicAdvisor;
