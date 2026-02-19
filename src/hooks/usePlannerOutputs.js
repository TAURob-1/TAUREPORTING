import { usePlanner } from '../context/PlannerContext';

export function usePlannerOutputs() {
  const { state } = usePlanner();

  const flightingData = state.flightingOutput || [];
  const personasData = state.personasOutput || [];

  return {
    flightingData,
    personasData,
    hasFlighting: flightingData.length > 0,
    hasPersonas: personasData.length > 0,
    layerProgress: state.layerProgress || {},
    mediaPlan: state.mediaPlan || { markdown: '', lastUpdated: null },
  };
}

