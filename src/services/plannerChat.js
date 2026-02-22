// TAU-Reporting Planner Chat Service
// Uses Anthropic API directly for AI planning conversations

export async function sendPlannerMessage(message, plannerContext) {

  const envelope = buildContextEnvelope(message, plannerContext);
  console.log('[Planner] Sending to Anthropic API');
  console.log('[Planner] Context preview:', envelope.messages[0].content.substring(0, 300));

  try {
    // Use local proxy server to avoid CORS issues
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: envelope.messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || 'No response text';

    console.log('[Planner] Got response from Anthropic API, length:', text.length);
    return text;

  } catch (error) {
    console.error('[Planner] API error:', error);
    throw new Error(`Failed to get AI response: ${error.message}`);
  }
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
  } = plannerContext;

  // Build rich context prefix
  let contextPrefix = `[Platform Context]
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
${systemPrompt}

---

`;

  // If document content is provided, include it in the message
  let fullMessage = message;
  if (documentContent) {
    // The message already contains the document content from the template,
    // so we just pass it through
    fullMessage = message;
  }

  return {
    messages: [
      {
        role: 'user',
        content: contextPrefix + 'User message: ' + fullMessage
      }
    ]
  };
}
