import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { usePlanner } from '../../../context/PlannerContext';
import { usePlatform } from '../../../context/PlatformContext';
import { sendPlannerMessage } from '../../../services/plannerChat';
import { getSystemPromptForMode } from '../../../context/PlannerContext';
import { getSelectedSignalContext } from '../../../data/signalIntegration';
import { parseAIResponse } from '../../../utils/plannerResponseParser';
import { getProviderPlanning } from '../../../data/countryPlanning';
import { buildCampaignInheritance, mapMediaMixToProviderBudgets } from '../../../lib/campaign/smartDefaults';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function normalizeBudgetKey(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
}

const CHAT_MODES = [
  { id: '7-stage', label: '7-Stage Planning', icon: '\u{1F4CB}', description: 'Structured 7-layer media planning process' },
  { id: 'free', label: 'Free Questions', icon: '\u{1F4AC}', description: 'Flexible planning questions \u2014 audiences, channels, budgets, strategy' },
  { id: 'analyse', label: 'Analyse Brief/Plan', icon: '\u{1F50D}', description: 'Upload and analyse briefs or media plans' },
  { id: 'strategic', label: 'Strategic Questions', icon: '\u{1F3AF}', description: 'Competitive strategy, market position & agency accountability' },
];

export default function ChatTab() {
  const { state, addChatMessage, updateMediaPlan, updateLayerProgress, addFlightingData, addPersonasData, resetToDefaults } = usePlanner();
  const {
    advertiser,
    countryCode,
    countryConfig,
    campaignConfig,
    audienceStrategy,
    planningState,
    setPlanningState,
    addAdvertiser,
    resetPlanningSession,
  } = usePlatform();
  const [activeMode, setActiveMode] = useState('7-stage');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [documentContent, setDocumentContent] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef(null);

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

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let text = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n\n';
      }
      
      return text.trim();
    } catch (error) {
      console.error('[ChatTab] PDF parsing error:', error);
      throw new Error('Could not extract text from document, please try a different file');
    }
  };

  const extractTextFromTxt = async (file) => {
    return await file.text();
  };

  const extractTextFromCSV = async (file) => {
    const text = await file.text();
    return text; // Simple pass-through, AI can parse CSV format
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large, please use a smaller document (max 10MB)');
      setTimeout(() => setError(null), 5000);
      return;
    }

    // Validate file type
    const validTypes = ['.pdf', '.txt', '.docx', '.csv'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    if (!validTypes.includes(fileExt)) {
      setError('Please upload PDF, DOCX, TXT, or CSV files');
      setTimeout(() => setError(null), 5000);
      return;
    }

    setIsProcessingFile(true);
    setError(null);

    try {
      let extractedText = '';
      
      if (fileExt === '.pdf') {
        extractedText = await extractTextFromPDF(file);
      } else if (fileExt === '.txt') {
        extractedText = await extractTextFromTxt(file);
      } else if (fileExt === '.csv') {
        extractedText = await extractTextFromCSV(file);
      } else if (fileExt === '.docx') {
        // For now, show an error for DOCX - can be implemented later
        throw new Error('DOCX support coming soon. Please use PDF, TXT, or CSV for now.');
      }

      // Truncate if too long (limit to ~50k characters to stay within token limits)
      if (extractedText.length > 50000) {
        extractedText = extractedText.substring(0, 50000) + '\n\n[Document truncated due to length...]';
      }

      const wordCount = extractedText.split(/\s+/).length;
      
      setUploadedFile({
        name: file.name,
        size: file.size,
        wordCount,
        type: fileExt
      });
      setDocumentContent(extractedText);
      setNotification(`✅ ${fileExt === '.csv' ? 'Media plan' : 'Document'} loaded - ${wordCount.toLocaleString()} words processed`);
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      setError(err.message || 'Failed to process document');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsProcessingFile(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveDocument = () => {
    setUploadedFile(null);
    setDocumentContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    setError(null);
    setNotification(null);

    const messageText = input.trim();
    const hasDocument = !!documentContent;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
      hasDocument,
      documentName: uploadedFile?.name
    };

    addChatMessage(userMessage);
    setInput('');
    setIsLoading(true);

    // Show document-specific loading message
    if (hasDocument) {
      setNotification('🤔 Analyzing brief... (this may take 30-60 seconds)');
    }

    try {
      const plannerContext = {
        systemPrompt: getSystemPromptForMode(activeMode),
        advertiser,
        country: countryConfig,
        signalContext: getSelectedSignalContext(state.selectedDataSources, state.signalData),
        layerProgress: state.layerProgress,
        mediaPlan: state.mediaPlan,
        campaignConfig,
        planningState,
        documentContent: hasDocument ? documentContent : null,
        chatHistory: state.chatHistory,
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

      if (hasDocument && uploadedFile) {
        updates.push(`✅ Brief analyzed - ${uploadedFile.wordCount.toLocaleString()} words processed`);
      }

      if (updates.length > 0) {
        setNotification(updates.join(' • '));
      } else {
        setNotification('No structured planner content detected. Ask for layered plan, flighting, or personas format.');
      }

      setTimeout(() => {
        setNotification(null);
      }, 8000);
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

      {/* Mode Toggle */}
      <div className="space-y-1">
        <div className="flex flex-wrap gap-2 items-center">
          {CHAT_MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                activeMode === mode.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {mode.icon} {mode.label}
            </button>
          ))}
          {state.chatHistory.length > 0 && (
            <button
              onClick={() => {
                resetToDefaults();
                resetPlanningSession();
                setUploadedFile(null);
                setDocumentContent(null);
                setError(null);
                setNotification(null);
              }}
              className="ml-auto px-3 py-1.5 text-sm rounded-md font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              + New Chat
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400 pl-1">
          {CHAT_MODES.find(m => m.id === activeMode)?.description}
        </p>
      </div>

      {/* Document Upload Badge */}
      {uploadedFile && (
        <div className={`${
          uploadedFile.type === '.csv' 
            ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' 
            : 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
        } rounded-lg p-3 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{uploadedFile.type === '.csv' ? '📊' : '📄'}</span>
            <div>
              <p className={`text-sm font-medium ${
                uploadedFile.type === '.csv'
                  ? 'text-orange-900 dark:text-orange-100'
                  : 'text-purple-900 dark:text-purple-100'
              }`}>
                {uploadedFile.type === '.csv' ? 'Media Plan' : 'Document'} attached: {uploadedFile.name}
              </p>
              <p className={`text-xs ${
                uploadedFile.type === '.csv'
                  ? 'text-orange-700 dark:text-orange-300'
                  : 'text-purple-700 dark:text-purple-300'
              }`}>
                {uploadedFile.wordCount.toLocaleString()} words • {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveDocument}
            className={`px-2 py-1 text-xs ${
              uploadedFile.type === '.csv'
                ? 'text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100'
                : 'text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100'
            } transition-colors`}
          >
            ✕ Remove
          </button>
        </div>
      )}

      {notification && (
        <div className="bg-green-50 border border-green-200 rounded p-2 text-sm text-green-700">
          {notification}
        </div>
      )}

      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-3 text-sm text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {isProcessingFile && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300">
          📄 Processing document...
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
        {state.chatHistory.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-slate-400 py-8">
            {activeMode === '7-stage' && (
              <>
                <p className="text-lg mb-2">{'\u{1F44B}'} Welcome to AI Media Planning</p>
                <p className="text-sm">Ask me to help with any of the 7 planning layers:</p>
                <p className="text-xs mt-2 text-gray-400 dark:text-slate-500">
                  Strategic Comms {'\u2022'} Comms Channel {'\u2022'} Channel {'\u2022'} Audience {'\u2022'} Measurement {'\u2022'} Message/Creative {'\u2022'} Flighting
                </p>
              </>
            )}
            {activeMode === 'free' && (
              <>
                <p className="text-lg mb-2">{'\u{1F4AC}'} Free Planning Questions</p>
                <p className="text-sm">Ask any planning question {'\u2014'} audiences, channels, budgets, strategy</p>
              </>
            )}
            {activeMode === 'analyse' && (
              <>
                <p className="text-lg mb-2">{'\u{1F50D}'} Analyse Brief/Plan</p>
                <p className="text-sm">Upload a brief or media plan to get started</p>
              </>
            )}
            {activeMode === 'strategic' && (
              <>
                <p className="text-lg mb-2">{'\u{1F3AF}'} Strategic Questions</p>
                <p className="text-sm">Ask about competitive strategy, market position, or agency accountability</p>
              </>
            )}
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
                  {msg.hasDocument && (
                    <p className="text-xs opacity-70 mb-2 flex items-center gap-1">
                      📎 {msg.documentName}
                    </p>
                  )}
                  {msg.role === 'assistant' ? (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:mt-3 prose-headings:mb-1 prose-table:text-xs prose-td:px-2 prose-td:py-1 prose-th:px-2 prose-th:py-1">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                  <p className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    {activeMode === '7-stage' && '\u{1F914} Thinking with 7-layer planning framework...'}
                    {activeMode === 'free' && '\u{1F914} Thinking...'}
                    {activeMode === 'analyse' && '\u{1F914} Analyzing document...'}
                    {activeMode === 'strategic' && '\u{1F914} Analyzing competitive landscape...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.txt,.docx,.csv"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || isProcessingFile}
          className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Upload document"
        >
          📎
        </button>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && !event.shiftKey && handleSend()}
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
