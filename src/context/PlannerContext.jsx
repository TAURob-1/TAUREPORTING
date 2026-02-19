import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePlatform } from './PlatformContext';
import { getSignalAvailabilitySummary, loadSignalData } from '../services/signalDataLoader';

const PlannerContext = createContext(null);

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within PlannerProvider');
  }
  return context;
};

function getDefaultPlannerState() {
  return {
    layerProgress: {},
    mediaPlan: {
      markdown: '',
      lastUpdated: null,
    },
    flightingOutput: [],
    personasOutput: [],
    systemPrompt: getDefaultSystemPrompt(),
    selectedDataSources: ['traffic', 'insights'],
    signalData: null,
    signalLoading: false,
    signalSlug: null,
    chatHistory: [],
    decisions: [],
    logs: [],
  };
}

export const PlannerProvider = ({ children }) => {
  const { advertiserId, countryCode } = usePlatform();

  const storageKey = `tau_planner:${advertiserId}:${countryCode}`;

  const [state, setState] = useState(getDefaultPlannerState);

  useEffect(() => {
    const baseState = getDefaultPlannerState();
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const { signalData, signalLoading, signalSlug, ...persisted } = parsed;
        setState({ ...baseState, ...persisted });
        return;
      } catch (error) {
        console.error('Failed to load planner state:', error);
      }
    }

    setState(baseState);
  }, [storageKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const { signalData, signalLoading, signalSlug, ...persisted } = state;
      localStorage.setItem(storageKey, JSON.stringify(persisted));
    }, 500);

    return () => clearTimeout(timer);
  }, [state, storageKey]);

  useEffect(() => {
    let cancelled = false;

    async function runLoad() {
      if (!advertiserId) return;

      setState((prev) => ({
        ...prev,
        signalLoading: true,
        signalData: null,
        signalSlug: null,
      }));

      try {
        const signalData = await loadSignalData(advertiserId, countryCode);
        if (cancelled) return;

        setState((prev) => ({
          ...prev,
          signalData,
          signalLoading: false,
          signalSlug: signalData?.slug || null,
        }));

        console.log(
          '[PlannerContext] Loaded Signal data',
          advertiserId,
          countryCode,
          signalData?.slug,
          getSignalAvailabilitySummary(signalData)
        );
      } catch (error) {
        if (cancelled) return;
        console.error('[PlannerContext] Failed to load Signal data:', error);
        setState((prev) => ({
          ...prev,
          signalData: null,
          signalLoading: false,
          signalSlug: null,
        }));
      }
    }

    runLoad();
    return () => {
      cancelled = true;
    };
  }, [advertiserId, countryCode]);

  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const addChatMessage = (message) => {
    setState((prev) => ({
      ...prev,
      chatHistory: [...prev.chatHistory, message],
    }));
  };

  const updateMediaPlan = (markdown) => {
    setState((prev) => ({
      ...prev,
      mediaPlan: {
        markdown,
        lastUpdated: new Date().toISOString(),
      },
    }));
  };

  const updateLayerProgress = (layerNumber, status = 'complete') => {
    if (!Number.isInteger(layerNumber) || layerNumber < 1 || layerNumber > 7) return;

    setState((prev) => ({
      ...prev,
      layerProgress: {
        ...prev.layerProgress,
        [layerNumber]: status,
      },
    }));
  };

  const addFlightingData = (flights = []) => {
    if (!Array.isArray(flights) || flights.length === 0) return;

    setState((prev) => ({
      ...prev,
      flightingOutput: [...prev.flightingOutput, ...flights],
    }));
  };

  const addPersonasData = (personas = []) => {
    if (!Array.isArray(personas) || personas.length === 0) return;

    setState((prev) => ({
      ...prev,
      personasOutput: [...prev.personasOutput, ...personas],
    }));
  };

  const updateSystemPrompt = (prompt) => {
    setState((prev) => ({ ...prev, systemPrompt: prompt }));
  };

  const toggleDataSource = (sourceKey) => {
    setState((prev) => ({
      ...prev,
      selectedDataSources: prev.selectedDataSources.includes(sourceKey)
        ? prev.selectedDataSources.filter((key) => key !== sourceKey)
        : [...prev.selectedDataSources, sourceKey],
    }));
  };

  const resetToDefaults = () => {
    setState(getDefaultPlannerState());
    localStorage.removeItem(storageKey);
  };

  const clearPlannerState = () => {
    setState(getDefaultPlannerState());
    localStorage.removeItem(storageKey);
  };

  const value = {
    state,
    updateState,
    addChatMessage,
    updateMediaPlan,
    updateLayerProgress,
    addFlightingData,
    addPersonasData,
    clearPlannerState,
    updateSystemPrompt,
    toggleDataSource,
    resetToDefaults,
  };

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
};

function getDefaultSystemPrompt() {
  return `<role>
You are TAU Media Planning Agent inside TAU-Reporting. You are a strategic planner using TAU Signal intelligence and current platform context.
</role>

<planning_layers>
1. Strategic Comms Planning
2. Comms Channel Planning
3. Channel Planning
4. Audience and Data Planning
5. Measurement Planning
6. Message and Creative Planning
7. Flighting and Phasing
</planning_layers>

<core_behaviours>
- Start by asking which planning layer(s) to complete.
- Allow one or more layers in a run.
- Ask only minimum required inputs.
- When options exist, provide top 2-4 viable routes and ask for user choice.
- Persist decisions, assumptions, and outputs into planner state.
- Keep recommendations tied to provided TAU Signal context and planning constraints.
</core_behaviours>

<budget_rules>
- Break budgets by channel in percentage and absolute currency.
- Include rationale, KPI, and decision threshold per channel.
- Respect user guardrails and non-negotiables.
</budget_rules>

<layer_3_channel_extension>
- Split Layer 3 into 3.A Strategic Channel Plan and 3.B Implementation Blueprint.
- 3.B is mandatory unless user explicitly says "skip implementation".
- Include: Buying Route, Campaign Table, Ad Group/Ad Set, Creative Specs, Landing Page Guidance,
  Automation/AI Toggles, QA Targets, QA Checklist, Ramp/Pacing.
- Apply platform logic by channel (Search, Paid Social, Programmatic, TV/CTV where relevant).
</layer_3_channel_extension>

<output_rules>
- Use markdown.
- Use H2 per layer.
- Keep tables <= 6 columns where practical.
- Above each layer provide one short executive summary paragraph.
- Keep a separate personas document and structured flighting JSON.
</output_rules>

<data_context>
Use only supplied context fields:
- platform_context
- signal_context
- planner_state
- selected_data_sources
If data is missing, say what is missing and ask for the minimum additional input.
</data_context>`;
}
