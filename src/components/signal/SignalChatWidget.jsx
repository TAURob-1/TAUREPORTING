import React, { useState, useRef, useEffect } from 'react';
import { sendPlannerMessage } from '../../services/plannerChat';

const SIGNAL_SYSTEM_PROMPT = `You are a competitive intelligence analyst for Tombola, working within the TAU Reporting platform. Use the Signal data provided to answer questions about market position, competitor strategies, traffic trends, SEO gaps, AI visibility, and growth opportunities. Be specific and cite data points. Keep responses concise and actionable.`;

const STRATEGIC_BRIEF_GLOB = import.meta.glob(
  '/signal-data/tombola-co-uk/strategic_brief/*.txt',
  { query: '?raw', import: 'default', eager: false }
);

export default function SignalChatWidget({ signal, advertiserName, countryCode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [strategicBrief, setStrategicBrief] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const keys = Object.keys(STRATEGIC_BRIEF_GLOB).sort();
    if (keys.length === 0) return;
    Promise.all(keys.map((k) => STRATEGIC_BRIEF_GLOB[k]()))
      .then((texts) => setStrategicBrief(texts.join('\n\n---\n\n')))
      .catch(() => {});
  }, []);

  const buildSignalContext = () => {
    if (!signal) return 'Signal data not loaded yet.';

    const parts = [];
    parts.push(`Advertiser: ${advertiserName}`);
    parts.push(`Market Share: ${signal.summary?.marketShare}%`);
    parts.push(`Monthly Visits: ${signal.summary?.monthlyVisits?.toLocaleString()}`);
    parts.push(`SEO Gap Count: ${signal.summary?.seoGapCount}`);
    parts.push(`AI Visibility: ${signal.summary?.aiVisibilityScore}%`);

    if (signal.traffic?.marketShare) {
      parts.push('\nCompetitor Traffic:');
      signal.traffic.marketShare.forEach((row) => {
        const name = row.isAdvertiser ? advertiserName : row.name;
        parts.push(`- ${name}: ${row.visits?.toLocaleString()} visits (${row.share}% share)`);
      });
    }

    if (signal.insights?.length) {
      parts.push('\nKey Insights:');
      signal.insights.forEach((insight) => parts.push(`- ${insight}`));
    }

    if (signal.seoSummary?.opportunities?.length) {
      parts.push('\nTop SEO Opportunities:');
      signal.seoSummary.opportunities.slice(0, 5).forEach((row) => {
        parts.push(`- "${row.keyword}" (${row.volume?.toLocaleString()} searches) — gap vs ${row.competitor}`);
      });
    }

    if (strategicBrief) {
      // Include first 3000 chars of strategic brief for context
      parts.push('\nStrategic Brief (summary):');
      parts.push(strategicBrief.slice(0, 3000));
    }

    return parts.join('\n');
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const context = {
        systemPrompt: SIGNAL_SYSTEM_PROMPT,
        advertiser: { name: advertiserName },
        country: { shortLabel: countryCode },
        signalContext: buildSignalContext(),
        layerProgress: {},
        mediaPlan: {},
        campaignConfig: {},
        planningState: {},
      };

      const response = await sendPlannerMessage(text, context);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 px-4 py-3 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-all text-sm font-medium z-50 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Ask about competitive data
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[480px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-orange-600 rounded-t-xl">
        <h3 className="text-sm font-semibold text-white">Signal Intelligence Chat</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-orange-100 hover:text-white text-lg leading-none"
        >
          &times;
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-xs mt-8">
            <p className="mb-2">Ask questions about competitive intelligence</p>
            <div className="space-y-1">
              <button onClick={() => setInput("How does Tombola compare to Gala Bingo?")} className="block w-full text-left px-2 py-1 rounded text-orange-600 hover:bg-orange-50 text-xs">
                "How does Tombola compare to Gala Bingo?"
              </button>
              <button onClick={() => setInput("What are our biggest SEO gaps?")} className="block w-full text-left px-2 py-1 rounded text-orange-600 hover:bg-orange-50 text-xs">
                "What are our biggest SEO gaps?"
              </button>
              <button onClick={() => setInput("What growth opportunities exist?")} className="block w-full text-left px-2 py-1 rounded text-orange-600 hover:bg-orange-50 text-xs">
                "What growth opportunities exist?"
              </button>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-sm ${
              msg.role === 'user'
                ? 'bg-orange-50 text-orange-900 ml-8'
                : 'bg-gray-50 text-gray-800 mr-4'
            } rounded-lg px-3 py-2`}
          >
            <div className="whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="text-xs text-gray-400 animate-pulse px-3">Thinking...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about competitive data..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
