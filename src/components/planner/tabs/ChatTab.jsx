import React, { useState } from 'react';
import { usePlanner } from '../../../context/PlannerContext';
import { usePlatform } from '../../../context/PlatformContext';
import { sendPlannerMessage } from '../../../services/plannerChat';
import { getSelectedSignalContext } from '../../../data/signalIntegration';
import { parseAIResponse } from '../../../utils/plannerResponseParser';
import { getProviderPlanning } from '../../../data/countryPlanning';
import { buildCampaignInheritance, mapMediaMixToProviderBudgets } from '../../../lib/campaign/smartDefaults';

function normalizeBudgetKey(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
}

export default function ChatTab() {
  const { state, addChatMessage, updateMediaPlan, updateLayerProgress, addFlightingData, addPersonasData } = usePlanner();
  const {
    advertiser,
    countryCode,
    countryConfig,
    campaignConfig,
    audienceStrategy,
    planningState,
    setPlanningState,
    addAdvertiser,
  } = usePlatform();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const mapMediaBudgetsToProviders = (mediaBudgets) => {
    const entries = Object.entries(mediaBudgets || {});
    if (entries.length === 0) return {};

    const providerPlanning = getProviderPlanning(countryCode);
    const providerNameToId = Object.values(providerPlanning).reduce((acc, provider) => {
      acc[normalizeBudgetKey(provider.name)] = provider.id;
      acc[normalizeBudgetKey(provider.id)] = provider.id;
      return acc;
    }, {});

    return entries.reduce((acc, [channelKey, budget]) => {
      const normalized = normalizeBudgetKey(channelKey);
      const providerId = providerNameToId[normalized];
      if (providerId && budget > 0) {
        acc[providerId] = budget;
      }
      return acc;
    }, {});
  };

  const handleAddAdvertiser = () => {
    const name = window.prompt('Enter new advertiser name');
    if (!name) return;
    const created = addAdvertiser(name);
    if (!created) return;
    setNotification(`Advertiser created: ${created.name}`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    setError(null);
    setNotification(null);

    const messageText = input.trim();

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    addChatMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const plannerContext = {
        systemPrompt: state.systemPrompt,
        advertiser,
        country: countryConfig,
        signalContext: getSelectedSignalContext(state.selectedDataSources, state.signalData),
        layerProgress: state.layerProgress,
        mediaPlan: state.mediaPlan,
        campaignConfig,
        planningState,
      };

      const responseText = await sendPlannerMessage(messageText, plannerContext);

      addChatMessage({
        id: Date.now() + 1,
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString(),
      });

      const parsed = parseAIResponse(responseText);
      const updates = [];

      if (parsed.mediaPlanDetected) {
        updateMediaPlan(parsed.mediaPlanContent);
        updates.push('Media plan updated');
      }

      if (parsed.layersDetected.length > 0) {
        parsed.layersDetected.forEach((layer) => {
          updateLayerProgress(layer, 'complete');
        });
        updates.push(`Layers marked complete: ${parsed.layersDetected.join(', ')}`);
      }

      if (parsed.flightingDetected && parsed.flightingData.length > 0) {
        addFlightingData(parsed.flightingData);
        updates.push(`${parsed.flightingData.length} flight(s) saved`);
      }

      if (parsed.personasDetected && parsed.personasData.length > 0) {
        addPersonasData(parsed.personasData);
        updates.push(`${parsed.personasData.length} persona(s) saved`);
      }

      const providerBudgets = mapMediaBudgetsToProviders(parsed.mediaBudgets);
      const inheritance = buildCampaignInheritance({
        aiBudget: parsed.campaignBudget,
        aiMediaBudgets: parsed.mediaMix,
        fallbackBudget: planningState?.campaignBudget || 0,
      });
      const derivedProviderBudgets =
        Object.keys(providerBudgets).length > 0
          ? providerBudgets
          : mapMediaMixToProviderBudgets(inheritance.mediaMix, inheritance.campaignBudget, countryCode);

      if (parsed.campaignBudget || Object.keys(derivedProviderBudgets).length > 0 || parsed.mediaMixDetected) {
        setPlanningState((prev) => ({
          ...prev,
          campaignBudget: inheritance.campaignBudget || prev.campaignBudget || 0,
          mediaBudgets: Object.keys(derivedProviderBudgets).length > 0 ? derivedProviderBudgets : (prev.mediaBudgets || {}),
          mediaMixRecommendations: inheritance.mediaMix || prev.mediaMixRecommendations || {},
        }));

        if (parsed.campaignBudget) {
          updates.push(`Campaign budget synced: ${countryConfig.currencySymbol}${parsed.campaignBudget.toLocaleString()}`);
        }
        if (parsed.mediaMixDetected) {
          updates.push(`Media mix captured: ${Object.keys(parsed.mediaMix).length} channel(s)`);
        }
        if (Object.keys(derivedProviderBudgets).length > 0) {
          updates.push(`Media budgets synced: ${Object.keys(derivedProviderBudgets).length} provider(s)`);
        }
      }

      if (updates.length > 0) {
        setNotification(updates.join(' • '));
      } else {
        setNotification('No structured planner content detected. Ask for layered plan, flighting, or personas format.');
      }

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (err) {
      const errorMessage = err?.message || 'Failed to get response';
      console.error('[ChatTab] Gateway chat error:', err);
      setError(errorMessage);

      addChatMessage({
        id: Date.now() + 1,
        role: 'assistant',
        content: `⚠️ ${errorMessage}. Check that Clawdbot Gateway is running.\n\nChat integration fallback: try again after Gateway is available.`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-slate-400">
          Active advertiser: <span className="font-medium text-gray-800 dark:text-slate-200">{advertiser.name}</span>
        </div>
        <button
          type="button"
          onClick={handleAddAdvertiser}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-700 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          + New Advertiser
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm text-blue-900">
          <span className="font-semibold">Primary (Geo):</span> {audienceStrategy.primaryAudience}
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded p-2 text-sm text-indigo-900">
          <span className="font-semibold">Secondary:</span> {audienceStrategy.secondaryAudience || 'None'}
        </div>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded p-2 text-xs text-gray-700">
        {audienceStrategy.reasoning}
      </div>

      {notification && (
        <div className="bg-green-50 border border-green-200 rounded p-2 text-sm text-green-700">
          ✅ {notification}
        </div>
      )}

      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-3 text-sm text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
        {state.chatHistory.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-slate-400 py-8">
            <p className="text-lg mb-2">👋 Welcome to AI Media Planning</p>
            <p className="text-sm">Ask me to help with any of the 7 planning layers:</p>
            <p className="text-xs mt-2 text-gray-400 dark:text-slate-500">
              Strategic Comms • Comms Channel • Channel • Audience • Measurement • Message/Creative • Flighting
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {state.chatHistory.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    🤔 Thinking with 7-layer planning framework...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && handleSend()}
          placeholder="Ask about planning layers, channels, audiences..."
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
