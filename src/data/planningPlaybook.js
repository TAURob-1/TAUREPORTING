export const STRATEGIC_PLANNING_LAYERS = [
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

export const CHANNEL_IMPLEMENTATION_BLUEPRINT = [
  'Buying Route',
  'Campaign Table',
  'Ad Group / Ad Set Detail',
  'Creative Specs',
  'Landing Page Guidance',
  'Automation & AI Toggles',
  'QA & Diagnostic Targets',
  'QA & Launch Checklist',
  'Ramp & Pacing Plan',
];

export function buildPlanningProtocol(countryCode = 'US', planningState = {}) {
  const totalBudget = planningState.totalBudget || 0;
  const selectedChannels = planningState.selectedChannels || [];

  return {
    layers: STRATEGIC_PLANNING_LAYERS,
    coreBehaviours: [
      'Start by selecting planning layer(s) to complete.',
      'Ask only minimum required inputs per layer.',
      'Present 2-4 viable routes when options exist.',
      'Persist decisions and assumptions in plan state.',
    ],
    budgetingRules: [
      'Break budget by channel in percent and currency.',
      'Include rationale and guardrails for each allocation.',
      'Include KPI and decision threshold per channel.',
    ],
    channelLayerExtension: {
      split: ['3.A Strategic Channel Plan', '3.B Implementation Blueprint'],
      implementationBlueprintFields: CHANNEL_IMPLEMENTATION_BLUEPRINT,
      platformSpecificLogic: [
        'Search: Standard vs Performance Max tradeoffs',
        'Paid Social: Advantage+ vs manual structure',
        'Programmatic: DSP and PMP route decisions',
      ],
    },
    currentState: {
      countryCode,
      totalBudget,
      selectedChannels,
      selectedMarkets: planningState.selectedMarkets || 0,
      reach: planningState.reach || 0,
      frequency: planningState.frequency || 0,
    },
  };
}
