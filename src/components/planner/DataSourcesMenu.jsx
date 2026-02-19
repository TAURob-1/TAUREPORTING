import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { DATA_SOURCE_TYPES } from '../../config/plannerConfig';

export default function DataSourcesMenu({ onClose }) {
  const { state, toggleDataSource } = usePlanner();
  const { signalData, signalLoading } = state;

  return (
    <div className="relative">
      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow-lg z-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Signal Data Sources</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200">
              ✕
            </button>
          </div>

          {signalLoading ? (
            <p className="text-xs text-gray-500 dark:text-slate-400">Loading Signal data...</p>
          ) : (
            <>
              <p className="text-xs text-gray-600 dark:text-slate-400 mb-4">
                Select which Signal intelligence data to include in planning context:
              </p>

              <div className="space-y-2">
                {DATA_SOURCE_TYPES.map((source) => {
                  const isAvailable = signalData?.available?.[source.key] ?? false;
                  const isSelected = state.selectedDataSources.includes(source.key);
                  const isDisabled = !isAvailable && !isSelected;
                  return (
                    <label
                      key={source.key}
                      className={`flex items-center gap-3 p-2 rounded ${
                        !isDisabled
                          ? 'hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => !isDisabled && toggleDataSource(source.key)}
                        disabled={isDisabled}
                        className="w-4 h-4 text-blue-600 rounded disabled:opacity-50"
                      />
                      <span className="text-lg">{source.icon}</span>
                      <div className="flex-1">
                        <span className="text-sm text-gray-900 dark:text-white">{source.label}</span>
                        {isAvailable ? (
                          <span className="ml-2 text-xs text-green-600">Available</span>
                        ) : (
                          <span className="ml-2 text-xs text-gray-400">Not available</span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
