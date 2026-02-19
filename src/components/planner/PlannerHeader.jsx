import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { usePlanner } from '../../context/PlannerContext';
import { PLANNING_LAYERS } from '../../config/plannerConfig';

export default function PlannerHeader() {
  const { advertiser, countryConfig } = usePlatform();
  const { state } = usePlanner();
  const [showLayerInfo, setShowLayerInfo] = useState(false);

  const completedLayers = PLANNING_LAYERS.filter(
    (layer) => state.layerProgress?.[layer.id] === 'complete' || state.layerProgress?.[layer.id] === true
  ).length;

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Media Planning Agent</h2>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Planning for {advertiser.name} • {countryConfig.shortLabel}
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">Layers</div>
            <div className="flex items-center justify-end gap-1">
              {PLANNING_LAYERS.map((layer) => {
                const isComplete = state.layerProgress?.[layer.id] === 'complete' || state.layerProgress?.[layer.id] === true;
                return (
                  <button
                    type="button"
                    key={layer.id}
                    title={`Layer ${layer.id}: ${layer.label}`}
                    onClick={() => setShowLayerInfo(true)}
                    className={`w-3 h-3 rounded-full border transition-all ${
                      isComplete
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-gray-200 dark:bg-slate-700 border-gray-300 dark:border-slate-600'
                    }`}
                  />
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setShowLayerInfo(true)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
            >
              {completedLayers} / 7 complete
            </button>
          </div>
        </div>
      </div>

      {showLayerInfo && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg w-full max-w-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Planning Layers</h3>
              <button
                type="button"
                onClick={() => setShowLayerInfo(false)}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-700 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {PLANNING_LAYERS.map((layer) => {
                const isComplete = state.layerProgress?.[layer.id] === 'complete' || state.layerProgress?.[layer.id] === true;
                return (
                  <div key={layer.id} className="border border-gray-200 dark:border-slate-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Layer {layer.id}: {layer.label}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          isComplete
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {isComplete ? 'Complete' : 'Not complete'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{layer.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
