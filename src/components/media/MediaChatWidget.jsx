import React, { useState, useRef, useEffect } from 'react';
import { sendPlannerMessage } from '../../services/plannerChat';

const MEDIA_SYSTEM_PROMPT = `You are a UK media intelligence analyst working within TAU Reporting. Answer questions about media reach, platform performance, audience demographics, and BARB data. Use the provided platform data to give specific, data-backed answers. Keep responses concise and actionable.`;

export default function MediaChatWidget({ countryCode, audienceName, recommendations, platformData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const context = {
        systemPrompt: MEDIA_SYSTEM_PROMPT,
        advertiser: { name: 'Media Intelligence' },
        country: { shortLabel: countryCode },
        signalContext: `Current audience: ${audienceName}\nRecommended platforms: ${recommendations?.recommendedPlatforms?.join(', ') || 'N/A'}\nContent focus: ${recommendations?.contentFocus?.join(', ') || 'N/A'}\nEstimated reach: ${recommendations?.estimatedCombinedReach || 'N/A'}`,
        layerProgress: {},
        mediaPlan: {},
        campaignConfig: { primaryAudience: audienceName },
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
        className="fixed bottom-6 right-6 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all text-sm font-medium z-50 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Ask about media data
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[480px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-blue-600 rounded-t-xl">
        <h3 className="text-sm font-semibold text-white">Media Intelligence Chat</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-blue-100 hover:text-white text-lg leading-none"
        >
          &times;
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-xs mt-8">
            <p className="mb-2">Ask questions about media reach and platform performance</p>
            <div className="space-y-1">
              <button onClick={() => setInput('What reaches 19-36 best?')} className="block w-full text-left px-2 py-1 rounded text-blue-600 hover:bg-blue-50 text-xs">
                "What reaches 19-36 best?"
              </button>
              <button onClick={() => setInput('Compare TikTok vs YouTube reach')} className="block w-full text-left px-2 py-1 rounded text-blue-600 hover:bg-blue-50 text-xs">
                "Compare TikTok vs YouTube reach"
              </button>
              <button onClick={() => setInput('What BARB data is available?')} className="block w-full text-left px-2 py-1 rounded text-blue-600 hover:bg-blue-50 text-xs">
                "What BARB data is available?"
              </button>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-sm ${
              msg.role === 'user'
                ? 'bg-blue-50 text-blue-900 ml-8'
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
            placeholder="Ask about media data..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
