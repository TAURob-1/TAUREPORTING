import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { EXAMPLE_AUDIENCES } from '../../data/audienceGraph/scores.js';
import { computeBlueprint } from '../../lib/audienceGraph/computeBlueprint.js';
import AttributePicker from './AttributePicker.jsx';
import ScoringMatrix from './ScoringMatrix.jsx';
import BlueprintOutput from './BlueprintOutput.jsx';
import GraphVisualization from './GraphVisualization.jsx';
import DrillDownPanel from './DrillDownPanel.jsx';

export default function AudienceGraphPage() {
  const { audienceGraphState, setAudienceGraphState } = usePlatform();

  const [selectedAttributes, setSelectedAttributes] = useState(
    audienceGraphState?.selectedAttributes || []
  );
  const [scoreOverrides, setScoreOverrides] = useState(
    audienceGraphState?.scoreOverrides || {}
  );
  const [activeDrillDown, setActiveDrillDown] = useState(null);
  const [activeView, setActiveView] = useState('matrix'); // matrix | graph

  const blueprint = useMemo(
    () => computeBlueprint(selectedAttributes, scoreOverrides),
    [selectedAttributes, scoreOverrides]
  );

  // Sync to PlatformContext for chat awareness
  useEffect(() => {
    setAudienceGraphState?.({
      selectedAttributes,
      currentBlueprint: selectedAttributes.length > 0 ? blueprint : null,
      scoreOverrides,
    });
  }, [selectedAttributes, blueprint, scoreOverrides, setAudienceGraphState]);

  const handleToggleAttribute = useCallback((classKey, attrKey) => {
    setSelectedAttributes((prev) => {
      const exists = prev.some((a) => a.classKey === classKey && a.attrKey === attrKey);
      if (exists) {
        return prev.filter((a) => !(a.classKey === classKey && a.attrKey === attrKey));
      }
      return [...prev, { classKey, attrKey }];
    });
  }, []);

  const handleScoreEdit = useCallback((key, value) => {
    setScoreOverrides((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleLoadTemplate = useCallback((templateKey) => {
    const template = EXAMPLE_AUDIENCES[templateKey];
    if (!template) return;
    setSelectedAttributes(template.attributes);
    setScoreOverrides({});
    setActiveDrillDown(null);
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedAttributes([]);
    setScoreOverrides({});
    setActiveDrillDown(null);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-20 w-56 h-56 rounded-full bg-purple-400/20 blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white">Audience Graph</h1>
          <p className="mt-1 text-sm text-slate-200">
            Build targeting blueprints using P x S scoring across 8 mechanisms and ~50 audience attributes.
          </p>
        </div>
      </div>

      {/* Template selector + controls */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-gray-500 dark:text-slate-400 font-medium">Templates:</label>
        <select
          onChange={(e) => e.target.value && handleLoadTemplate(e.target.value)}
          defaultValue=""
          className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
        >
          <option value="">Select template...</option>
          {Object.entries(EXAMPLE_AUDIENCES).map(([key, tmpl]) => (
            <option key={key} value={key}>{tmpl.label}</option>
          ))}
        </select>

        {selectedAttributes.length > 0 && (
          <>
            <span className="text-xs text-gray-400 dark:text-slate-500">
              {selectedAttributes.length} attribute{selectedAttributes.length !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 text-xs rounded-md text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              Clear All
            </button>
          </>
        )}
      </div>

      {/* Selected attributes summary */}
      {selectedAttributes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedAttributes.map(({ classKey, attrKey }) => {
            const label = `${classKey}.${attrKey}`;
            return (
              <span
                key={label}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
              >
                {label}
                <button
                  onClick={() => handleToggleAttribute(classKey, attrKey)}
                  className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-200 ml-0.5"
                >x</button>
              </span>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Attribute Picker */}
        <div className="lg:col-span-1">
          <AttributePicker
            selectedAttributes={selectedAttributes}
            onToggle={handleToggleAttribute}
          />
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAttributes.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-slate-500">
              <p className="text-lg mb-2">Select audience attributes to generate a blueprint</p>
              <p className="text-sm">Or choose a template above to get started</p>
            </div>
          ) : (
            <>
              {/* View toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveView('matrix')}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                    activeView === 'matrix'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Scoring Matrix
                </button>
                <button
                  onClick={() => setActiveView('graph')}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                    activeView === 'graph'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Network Graph
                </button>
              </div>

              {/* Scoring Matrix or Graph */}
              {activeView === 'matrix' ? (
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                  <ScoringMatrix
                    rows={blueprint.rows}
                    mechTotals={blueprint.mechTotals}
                    onScoreEdit={handleScoreEdit}
                    scoreOverrides={scoreOverrides}
                  />
                </div>
              ) : (
                <GraphVisualization
                  rows={blueprint.rows}
                  ranked={blueprint.ranked}
                  selectedAttributes={selectedAttributes}
                />
              )}

              {/* Blueprint Output */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                <BlueprintOutput
                  ranked={blueprint.ranked}
                  selectedAttributes={selectedAttributes}
                  onDrillDown={setActiveDrillDown}
                />
              </div>

              {/* Drill-Down Panel */}
              <DrillDownPanel
                activeDrillDown={activeDrillDown}
                selectedAttributes={selectedAttributes}
                blueprint={blueprint}
                onClose={() => setActiveDrillDown(null)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
