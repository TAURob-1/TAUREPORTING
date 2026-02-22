// TAU-Reporting Planner Chat Service
// Uses Anthropic API directly for AI planning conversations

export async function sendPlannerMessage(message, plannerContext) {

  const envelope = buildContextEnvelope(message, plannerContext);
  console.log('[Planner] Sending to Anthropic API');
  console.log('[Planner] Messages count:', envelope.messages.length);

  try {
    // Use local proxy server to avoid CORS issues
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 16000,
        system: envelope.system,
        messages: envelope.messages,
        tools: [{
          type: 'web_search_20250305',
          name: 'web_search',
          max_uses: 5
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = extractTextFromResponse(data);

    console.log('[Planner] Got response from Anthropic API, length:', text.length);
    return text;

  } catch (error) {
    console.error('[Planner] API error:', error);
    throw new Error(`Failed to get AI response: ${error.message}`);
  }
}

/**
 * Extract text from Anthropic response, handling both simple responses
 * and tool-use responses (web search results interspersed with text).
 */
function extractTextFromResponse(data) {
  const content = data.content;
  if (!Array.isArray(content) || content.length === 0) {
    return 'No response text';
  }

  const textParts = [];

  for (const block of content) {
    if (block.type === 'text' && block.text) {
      textParts.push(block.text);
    }
    // web_search_tool_result blocks contain the search results the model used —
    // we don't need to display these to the user, the model incorporates
    // the findings into its text blocks.
  }

  return textParts.join('\n\n') || 'No response text';
}

function buildContextEnvelope(message, plannerContext) {
  const {
    systemPrompt,
    advertiser,
    country,
    signalContext,
    layerProgress,
    mediaPlan,
    campaignConfig,
    planningState,
    documentContent,
    chatHistory,
  } = plannerContext;

  // Build system prompt with context as a top-level system parameter
  const systemContent = `[Platform Context]
Advertiser: ${advertiser?.name || 'Unknown'}
Country: ${country?.shortLabel || 'Unknown'}

[Signal Intelligence]
${signalContext || 'No Signal data selected'}

[Planning State]
Layers completed: ${Object.keys(layerProgress || {}).length} of 7
Media plan status: ${mediaPlan?.markdown ? `In progress (${mediaPlan.markdown.length} chars)` : 'Not started'}

[Campaign Configuration]
Campaign Name: ${campaignConfig?.campaignName || 'Unknown'}
Dates: ${campaignConfig?.startDate || 'Unknown'} to ${campaignConfig?.endDate || 'Unknown'}
Primary Audience: ${campaignConfig?.primaryAudience || 'Unknown'}
Campaign Budget: ${planningState?.campaignBudget ? `${country?.currencySymbol || '$'}${planningState.campaignBudget.toLocaleString()}` : 'Not set'}
Media Budgets: ${planningState?.mediaBudgets && Object.keys(planningState.mediaBudgets).length > 0
    ? JSON.stringify(planningState.mediaBudgets)
    : 'Not set'}

[System Instructions]
${systemPrompt}`;

  // Build messages array with conversation history (last 4 exchanges = 8 messages)
  const messages = [];
  const recentHistory = (chatHistory || []).slice(-8);

  for (const msg of recentHistory) {
    messages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    });
  }

  // Add the current user message
  let fullMessage = message;
  if (documentContent) {
    fullMessage = message;
  }
  messages.push({
    role: 'user',
    content: fullMessage,
  });

  return {
    system: systemContent,
    messages,
  };
}
