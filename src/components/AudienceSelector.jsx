import React from 'react';
import { AUDIENCES } from '../data/audienceDefinitions';
import { usePlatform } from '../context/PlatformContext.jsx';

const AudienceSelector = ({
  selectedAudience,
  onAudienceChange,
  recommendations,
  customAudiences,
  onOpenBuilder,
  onRemoveCustomAudience,
  isExpanded,
  onToggleExpanded
}) => {
  const { countryConfig, countryCode } = usePlatform();
  
  // Filter audiences by country
  const audienceList = Object.values(AUDIENCES).filter(audience => {
    if (countryCode === 'UK') {
      return audience.ukSegment === true;
    } else {
      return !audience.ukSegment;
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Target Audience Selection
        </h2>
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
          {audienceList.length + (customAudiences?.length || 0)} audiences
        </span>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select your target audience segment:
        </label>

        {selectedAudience && !isExpanded && (
          <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-1">
                Selected Segment
              </div>
              <div className="text-sm font-semibold text-blue-900 truncate">
                <span className="mr-2">{selectedAudience.icon}</span>
                {selectedAudience.name}
                {selectedAudience.isCustom && (
                  <span className="ml-2 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-semibold rounded">Custom</span>
                )}
              </div>
            </div>
            <button
              onClick={() => onToggleExpanded(true)}
              className="shrink-0 px-3 py-1.5 rounded-md text-xs font-semibold border border-blue-300 bg-white text-blue-700 hover:bg-blue-100 transition-colors"
            >
              Change
            </button>
          </div>
        )}

        {(isExpanded || !selectedAudience) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {audienceList.map(audience => {
              const isSelected = selectedAudience?.id === audience.id;

              return (
                <button
                  key={audience.id}
                  onClick={() => onAudienceChange(audience)}
                  className={`p-3 md:p-4 rounded-lg border-2 text-left transition-all hover:shadow-md hover:-translate-y-0.5 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{audience.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm mb-1 ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {audience.name}
                      </div>
                      <div className={`text-xs leading-relaxed ${
                        isSelected ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {audience.description}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="text-blue-500 text-xl">&#x2713;</div>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Custom Audience Cards */}
            {customAudiences && customAudiences.map(audience => {
              const isSelected = selectedAudience?.id === audience.id;
              const criteriaCount = audience.isCSVBased ? 'CSV data' : `${audience.criteria.length} criteria`;

              return (
                <button
                  key={audience.id}
                  onClick={() => onAudienceChange(audience)}
                  className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md relative ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {/* Remove button */}
                  <div
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm cursor-pointer z-10 w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCustomAudience(audience.id);
                    }}
                  >
                    &times;
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{audience.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`font-semibold text-sm ${
                          isSelected ? 'text-indigo-900' : 'text-gray-900'
                        }`}>
                          {audience.name}
                        </div>
                        <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-semibold rounded">Custom</span>
                      </div>
                      <div className={`text-xs leading-relaxed ${
                        isSelected ? 'text-indigo-700' : 'text-gray-600'
                      }`}>
                        {criteriaCount} &middot; {audience.description}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="text-indigo-500 text-xl">&#x2713;</div>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Create Custom Audience Card */}
            <button
              onClick={onOpenBuilder}
              className="p-4 rounded-lg border-2 border-dashed border-gray-300 text-center transition-all hover:shadow-md hover:border-indigo-400 hover:bg-indigo-50 group"
            >
              <div className="flex flex-col items-center justify-center h-full gap-2 py-2">
                <div className="text-2xl text-gray-400 group-hover:text-indigo-500 transition-colors">&#x2795;</div>
                <div className="font-semibold text-sm text-gray-600 group-hover:text-indigo-700 transition-colors">
                  Create Custom Audience
                </div>
                <div className="text-xs text-gray-400 group-hover:text-indigo-500 transition-colors">
                  Upload data, describe, or build from demographics
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Recommendations Summary */}
      {selectedAudience && recommendations && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-lg">{selectedAudience.icon}</div>
            <div className="font-semibold text-blue-900">
              {selectedAudience.name} - Recommendation Summary
            </div>
            {selectedAudience.isCustom && (
              <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-semibold rounded">Custom</span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-600 mb-1">Exposed {countryConfig.geoUnitPlural}</div>
              <div className="text-xl font-bold text-green-600">
                {recommendations.stats.exposedCount}
              </div>
              <div className="text-xs text-gray-500">
                Avg Score: {Math.round(recommendations.stats.avgScoreExposed)}
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-600 mb-1">Holdout {countryConfig.geoUnitPlural}</div>
              <div className="text-xl font-bold text-yellow-600">
                {recommendations.stats.holdoutCount}
              </div>
              <div className="text-xs text-gray-500">
                Avg Score: {Math.round(recommendations.stats.avgScoreHoldout)}
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-600 mb-1">Total Population</div>
              <div className="text-xl font-bold text-blue-600">
                {(recommendations.stats.totalPopulation / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-500">
                Exposed: {(recommendations.stats.exposedPopulation / 1000000).toFixed(1)}M
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-600 mb-1">Split Ratio</div>
              <div className="text-xl font-bold text-purple-600">
                {Math.round(recommendations.stats.exposedRatio * 100)}%
              </div>
              <div className="text-xs text-gray-500">
                Exposed / Total
              </div>
            </div>
          </div>

          {/* Geographic Diversity */}
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="text-xs text-gray-700 font-medium mb-2">Geographic Diversity:</div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-600">Exposed:</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${recommendations.stats.geographicDiversityExposed}%` }}
                  ></div>
                </div>
                <div className="text-xs font-medium text-gray-700">
                  {Math.round(recommendations.stats.geographicDiversityExposed)}%
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-600">Holdout:</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: `${recommendations.stats.geographicDiversityHoldout}%` }}
                  ></div>
                </div>
                <div className="text-xs font-medium text-gray-700">
                  {Math.round(recommendations.stats.geographicDiversityHoldout)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      {!selectedAudience && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">
            <strong>How it works:</strong> Select an audience segment to automatically get {countryConfig.geoUnit.toLowerCase()} recommendations
            based on demographic fit. The system will suggest which {countryConfig.geoUnit.toLowerCase()} regions to target (exposed) vs use as
            holdout controls for measurement.
          </div>
        </div>
      )}
    </div>
  );
};

export default AudienceSelector;
