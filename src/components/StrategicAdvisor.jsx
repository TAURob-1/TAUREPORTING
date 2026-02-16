import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePlatform } from '../context/PlatformContext.jsx';

const API_URL = import.meta.env.VITE_CHAT_API || 'http://localhost:3002';

const SUGGESTED_QUESTIONS = [
  "Build me 3 audience personas for {{advertiser}}'s CTV campaign",
  "Which CTV providers should we prioritize and why?",
  "Recommend a $500K CTV budget allocation across providers",
  "What are {{advertiser}}'s biggest competitive vulnerabilities?",
  "Design a geo holdout test for measuring CTV incrementality",
  "What does the customer sentiment data tell us about messaging?",
];

// Demo responses for when API is offline
const DEMO_RESPONSES = {
  "Build me 3 audience personas for {{advertiser}}'s CTV campaign": `## {{advertiser}} CTV Audience Personas

### Persona 1: The Cautious Commuter
- **Demographics:** 35-54, suburban, household income $55K-$85K
- **Vehicle:** Owns 1-2 vehicles, 3-7 years old, 50K-100K miles
- **Media Habits:** Heavy streaming (3+ hrs/day), Roku/Hulu primary, watches during evening primetime
- **Motivation:** Anxiety about unexpected repair costs, budget-conscious, researches before buying
- **CTV Targeting:** Hulu, Tubi, Pluto TV during 7-10pm ET

### Persona 2: The Family Protector
- **Demographics:** 30-45, married with children, household income $75K-$120K
- **Vehicle:** Owns 2+ vehicles including SUV/minivan, used for family transport
- **Media Habits:** YouTube TV, Disney+, Peacock; watches sports and family content
- **Motivation:** Peace of mind, protecting family transportation, avoiding dealership upsells
- **CTV Targeting:** YouTube, Disney+, ESPN+ during weekend afternoons and weekday evenings

### Persona 3: The Savvy Senior
- **Demographics:** 55-70, empty nester, household income $45K-$75K
- **Vehicle:** Owns 1 vehicle, 5-10+ years old, fixed income considerations
- **Media Habits:** Samsung TV+, LG Channels, Paramount+; heavy daytime viewing
- **Motivation:** Stretching retirement dollars, avoiding large unexpected expenses
- **CTV Targeting:** Samsung TV+, Paramount+, cable alternatives during daytime and early evening`,

  "Which CTV providers should we prioritize and why?": `## CTV Provider Prioritization for {{advertiser}}

### Tier 1: Must-Have (60% of budget)
| Provider | Why | Budget Share |
| YouTube CTV | Largest reach (120M HH), strong auto-intender targeting, competitive CPM at $28 | 25% |
| Roku | 80M active accounts, excellent frequency control, strong in {{advertiser}}'s core demo | 20% |
| Hulu | Premium environment, 48M subscribers, high completion rates for :30s spots | 15% |

### Tier 2: Strategic (30% of budget)
| Provider | Why | Budget Share |
| Samsung TV+ | Free ad-supported, reaches cord-cutters, strong in 45-65 demo | 10% |
| Tubi | Massive free tier reach, very competitive CPMs ($12-15), high frequency potential | 10% |
| Amazon Fire TV | Purchase intent data, closed-loop attribution potential | 10% |

### Tier 3: Incremental Reach (10% of budget)
- **Peacock, Pluto TV, Paramount+** for incremental unduplicated reach

### Key Recommendation
Start with YouTube + Roku + Hulu as your foundation. These three alone can reach **65%+ of CTV households** with strong frequency management. Add Tier 2 providers to push reach beyond 75% while maintaining $22-28 blended CPM.`,

  "Recommend a $500K CTV budget allocation across providers": `## $500K CTV Budget Allocation

### Optimized Allocation (Reach-Maximized)

| Provider | Budget | % | Est. Reach | Avg Freq |
| YouTube CTV | $125,000 | 25% | 8.2M HH | 3.2x |
| Roku | $100,000 | 20% | 6.5M HH | 2.8x |
| Hulu | $75,000 | 15% | 4.1M HH | 3.5x |
| Samsung TV+ | $50,000 | 10% | 3.8M HH | 2.1x |
| Tubi | $50,000 | 10% | 4.2M HH | 2.4x |
| Amazon Fire TV | $50,000 | 10% | 3.1M HH | 2.6x |
| Peacock | $25,000 | 5% | 1.8M HH | 2.2x |
| Paramount+ | $25,000 | 5% | 1.5M HH | 2.4x |

### Projected Results
- **Deduplicated Reach:** ~18.5M households (14.1% of US TV HH)
- **Average Frequency:** 3.2x across all providers
- **Blended CPM:** $24.80
- **Cost Per Reach Point:** $35,500

### Why This Allocation Works
The heavy weighting toward YouTube and Roku ensures broad reach at efficient CPMs. Hulu provides premium brand-safe inventory. The long tail of smaller platforms adds **incremental unduplicated reach** that drives the overall number higher without overpaying for frequency on any single platform.`,

  "What are {{advertiser}}'s biggest competitive vulnerabilities?": `## {{advertiser}} Competitive Vulnerability Analysis

### Critical: AI Visibility Gap
- **{{advertiser}} AI visibility: 0%** vs Endurance at 12% and Carchex at 8%
- Competitors are being recommended by ChatGPT, Perplexity, and Gemini
- Estimated lost opportunity: **$340K/month** in equivalent traffic value
- **Action:** Immediate AI content optimization strategy needed

### High: SEO Concentration Risk
- 88.4% market share but only **34 keywords in top 10** out of 29,840 tracked
- **236 high-volume keyword gaps** where competitors rank and {{advertiser}} doesn't
- "Vehicle service contract" (8,900 monthly searches) — **not ranking at all**
- Competitors are quietly gaining ground on long-tail warranty keywords

### Medium: Channel Diversification
- Heavy reliance on paid search (43% of estimated $150K spend)
- CTV represents a **strategic diversification opportunity**
- Video spend at only 15% — significant room for CTV expansion
- Social media following strong (219K) but engagement optimization needed

### Low but Emerging: Brand Sentiment
- Warranty industry carries negative consumer perception
- Competitors investing in trust-building content marketing
- {{advertiser}}'s brand recognition is an asset but needs reinforcement through CTV storytelling`,

  "Design a geo holdout test for measuring CTV incrementality": `## CTV Incrementality Test Design

### Test Structure
- **Test Type:** Geographic holdout (matched market)
- **Duration:** 4-6 weeks (recommend 30 days minimum for statistical power)
- **KPI:** Incremental website visits, quote requests, policy activations

### Market Selection
**Exposed Markets (70% of budget, ~350 ZIP3 regions):**
- Top-scoring ZIPs from audience targeting model (affinity score 50+)
- Diverse geographic representation across 8+ DMAs
- Mix of high-density urban and suburban markets

**Holdout Markets (30% of test ZIPs, ~150 ZIP3 regions):**
- Demographically matched to exposed group
- Similar baseline conversion rates
- Geographic diversity matching exposed group
- **No CTV ad exposure during test period**

### Measurement Framework
| Metric | Method | Target |
| Incremental Lift | Exposed vs Holdout comparison | +12-18% |
| Statistical Confidence | Two-tailed t-test | 95% (p < 0.05) |
| iROAS | Incremental revenue / CTV spend | > $2.50 |
| Power | Minimum detectable effect | 80%+ |

### Key Principles
1. **Randomization:** ZIP assignment based on scoring model, not cherry-picking
2. **Holdout purity:** Zero CTV impressions in holdout markets
3. **Baseline period:** 2 weeks pre-test measurement for normalization
4. **Cross-device:** Track household-level behavior, not just device`,

  "What does the customer sentiment data tell us about messaging?": `## Customer Sentiment Analysis for CTV Messaging

### Key Sentiment Themes

**Positive Drivers (leverage in CTV creative):**
- **Peace of mind** — 67% of positive mentions cite worry-free ownership
- **Cost savings** — "saved me $4,000 on transmission repair" type stories resonate
- **Easy claims process** — customers who've used the service are strongest advocates
- **Brand trust** — {{advertiser}}'s market leadership drives confidence

**Negative Concerns (address in CTV creative):**
- **"Is this a scam?"** — 34% of neutral/negative sentiment relates to industry skepticism
- **Coverage confusion** — customers unsure what's actually covered
- **Price transparency** — desire for clear pricing before committing
- **Deductible concerns** — hidden costs worry potential buyers

### CTV Messaging Recommendations

### Creative Strategy A: "Real Stories"
Feature real customer testimonials with specific repair cost savings. Address skepticism head-on with transparency.

### Creative Strategy B: "What If?"
Scenario-based ads showing the cost of unexpected repairs vs. {{advertiser}} coverage. Target the anxiety of aging vehicles.

### Creative Strategy C: "Protection Made Simple"
Focus on ease and clarity — show the simple process from quote to claim. Counter complexity concerns.

### Frequency Recommendation
- **3-4x per household** over 30 days for brand messaging
- Rotate 2-3 creatives to avoid fatigue
- Heavier weight in first 2 weeks for awareness, lighter in weeks 3-4`
};

function MarkdownLite({ text }) {
  const lines = text.split('\n');
  const elements = [];
  let tableRows = [];
  let inTable = false;

  const processInline = (line) => {
    return line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (line.includes('---')) continue;
      const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
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
    } else if (line.startsWith('# ')) {
      elements.push(<h2 key={i} className="text-lg font-bold text-gray-900 mt-4 mb-2">{line.slice(2)}</h2>);
    }
    else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const indent = line.search(/\S/);
      const content = line.trim().slice(2);
      elements.push(
        <div key={i} className="flex gap-2 my-0.5" style={{ paddingLeft: `${Math.max(0, indent / 2) * 8}px` }}>
          <span className="text-blue-500 mt-0.5 shrink-0">•</span>
          <span className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: processInline(content) }} />
        </div>
      );
    }
    else if (/^\d+\.\s/.test(line.trim())) {
      const num = line.trim().match(/^(\d+)\./)[1];
      const content = line.trim().replace(/^\d+\.\s/, '');
      elements.push(
        <div key={i} className="flex gap-2 my-0.5">
          <span className="text-blue-600 font-semibold text-sm shrink-0 w-5 text-right">{num}.</span>
          <span className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: processInline(content) }} />
        </div>
      );
    }
    else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    }
    else {
      elements.push(
        <p key={i} className="text-sm text-gray-700 my-0.5" dangerouslySetInnerHTML={{ __html: processInline(line) }} />
      );
    }
  }

  // Flush remaining table
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
  const { advertiser } = usePlatform();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const brandify = (text) => text.replaceAll('{{advertiser}}', advertiser.name);
  const suggestedQuestions = useMemo(
    () => SUGGESTED_QUESTIONS.map((q) => brandify(q)),
    [advertiser.name, advertiser.slug]
  );
  const demoResponses = useMemo(
    () => Object.fromEntries(
      Object.entries(DEMO_RESPONSES).map(([question, answer]) => [brandify(question), brandify(answer)])
    ),
    [advertiser.name, advertiser.slug]
  );

  // Check API health on mount
  useEffect(() => {
    fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(3000) })
      .then(r => r.json())
      .then(data => setApiStatus(data))
      .catch(() => setApiStatus({ status: 'demo' }));
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    const isDemo = apiStatus?.status !== 'healthy';

    if (isDemo) {
      // Demo mode: use canned responses or a generic one
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      const demoResponse = demoResponses[text.trim()] ||
        brandify(`## Analysis: ${text.trim().slice(0, 60)}\n\nBased on {{advertiser}}'s Signal Intelligence data:\n\n- **Market Position:** {{advertiser}} holds 88.4% market share with 452K monthly visits\n- **CTV Opportunity:** Geographic holdout testing shows +16.2% incremental lift at $2.94 iROAS\n- **Key Insight:** AI visibility represents a $340K/month untapped channel\n\nThis analysis would be enriched with live intelligence data when the API is connected. The demo showcases the advisor's analytical framework and presentation format.\n\n*To enable live AI responses, start the chat API server on port 3002.*`);

      setMessages(prev => [...prev, { role: 'assistant', content: demoResponse }]);
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
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setError(err.message);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: brandify(`Connection to live API failed. Switching to demo mode for this response.\n\nBased on {{advertiser}}'s cached intelligence data, I can still provide strategic analysis. Try one of the suggested questions for a detailed demo response.`),
      }]);
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

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg shadow-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Syd.AI</h1>
              <p className="text-indigo-100 mt-1 text-sm">
                {advertiser.name}'s Strategic CTV Advisor • Powered by TAU Signal
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-sm font-medium">{isOnline ? 'Live' : 'Demo Mode'}</span>
              </div>
              {isDemo && (
                <div className="text-xs text-indigo-200 mt-1">
                  Pre-loaded intelligence responses
                </div>
              )}
              {apiStatus?.context_chars > 0 && (
                <div className="text-xs text-indigo-200 mt-1">
                  {(apiStatus.context_chars / 1000).toFixed(0)}K chars loaded
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Meet Syd.AI</h3>
                <p className="text-sm text-gray-500 max-w-md mb-6">
                  Your strategic CTV advisor. Ask about campaign strategy, audience targeting, 
                  competitive positioning, budget allocation, or measurement methodology.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
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
                  <div className={`max-w-[85%] rounded-lg px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-50 border border-gray-200'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="text-sm">{msg.content}</p>
                    ) : (
                      <MarkdownLite text={msg.content} />
                    )}
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
                    <span className="text-xs text-gray-400">Analyzing intelligence data...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about CTV strategy, audiences, competitors..."
                disabled={loading}
                rows={1}
                className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                style={{ minHeight: '42px', maxHeight: '120px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
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
              {messages.length > 0 && (
                <button
                  onClick={() => { setMessages([]); setError(null); }}
                  className="text-[10px] text-gray-400 hover:text-gray-600"
                >
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
