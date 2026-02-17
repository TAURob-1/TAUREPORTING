import React, { useState, useEffect, useMemo } from 'react';
import AudienceSelector from './AudienceSelector';
import USAMapWithAudience from './USAMapWithAudience';
import CustomAudienceBuilder from './CustomAudienceBuilder';
import { generateRecommendations, scoreZIPsForAudience } from '../data/audienceDefinitions';
import { usePlatform } from '../context/PlatformContext.jsx';

const PRESETS = [
  { label: '60/40 Split', minScore: 40, exposedRatio: 0.6 },
  { label: '70/30', minScore: 50, exposedRatio: 0.7 },
  { label: '80/20', minScore: 60, exposedRatio: 0.8 },
];

const AudienceTargeting = () => {
  const { countryCode, countryConfig } = usePlatform();
  const [selectedAudience, setSelectedAudience] = useState(null);
  const [demographicsData, setDemographicsData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const maxZipsLimit = countryCode === 'UK' ? 1500 : 500;
  const [settings, setSettings] = useState({
    exposedRatio: 0.6,
    minScore: 50,
    maxZips: countryCode === 'UK' ? 1500 : 500
  });
  const [customAudiences, setCustomAudiences] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [isSegmentSelectorExpanded, setIsSegmentSelectorExpanded] = useState(true);

  // Load demographics data (country-appropriate)
  useEffect(() => {
    setLoading(true);
    setDemographicsData(null);
    setRecommendations(null);
    const url = countryCode === 'UK'
      ? '/data/uk/uk-postcode-demographics.json'
      : '/data/zip3-demographics.json';
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setDemographicsData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading demographics:', error);
        setLoading(false);
      });
    // Reset maxZips for the new country
    setSettings(prev => ({ ...prev, maxZips: countryCode === 'UK' ? 1500 : 500 }));
  }, [countryCode]);

  // Generate recommendations when audience changes
  useEffect(() => {
    if (selectedAudience && demographicsData) {
      const recs = generateRecommendations(demographicsData, selectedAudience, { ...settings, countryCode });
      setRecommendations(recs);
    } else {
      setRecommendations(null);
    }
  }, [selectedAudience, demographicsData, settings]);

  // Compute live slider stats from scored ZIPs
  const sliderStats = useMemo(() => {
    if (!selectedAudience || !demographicsData) return null;

    const scored = scoreZIPsForAudience(demographicsData, selectedAudience);
    const totalZips = scored.length;
    const qualified = scored.filter(z => z.score >= settings.minScore);
    const excluded = totalZips - qualified.length;
    const selectedCount = Math.min(qualified.length, settings.maxZips);
    const limited = qualified.slice(0, selectedCount);
    const holdoutCount = Math.round(selectedCount * (1 - settings.exposedRatio));
    const exposedCount = selectedCount - holdoutCount;

    const totalHouseholds = limited.reduce((sum, z) => sum + (z.demographics?.households || 0), 0);
    const avgAffinity = limited.length > 0
      ? Math.round(limited.reduce((sum, z) => sum + z.score, 0) / limited.length)
      : 0;

    return {
      selectedCount,
      holdoutCount: holdoutCount,
      excludedCount: excluded,
      totalZips,
      estimatedReach: totalHouseholds,
      avgAffinity,
      selectedPct: totalZips > 0 ? Math.round((selectedCount / totalZips) * 100) : 0,
      exposedCount
    };
  }, [selectedAudience, demographicsData, settings]);

  const handleAudienceChange = (audience) => {
    setSelectedAudience(audience);
    if (audience) {
      setIsSegmentSelectorExpanded(false);
    }
  };

  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset) => {
    setSettings(prev => ({
      ...prev,
      minScore: preset.minScore,
      exposedRatio: preset.exposedRatio
    }));
  };

  const handleCreateCustomAudience = (audience) => {
    setCustomAudiences(prev => [...prev, audience]);
    setSelectedAudience(audience);
    setShowBuilder(false);
  };

  const handleRemoveCustomAudience = (audienceId) => {
    setCustomAudiences(prev => prev.filter(a => a.id !== audienceId));
    if (selectedAudience?.id === audienceId) {
      setSelectedAudience(null);
      setIsSegmentSelectorExpanded(true);
    }
  };

  // Slider gradient position (map 20-85 range to 0-100%)
  const sliderPct = ((settings.minScore - 20) / (85 - 20)) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">&#x1F504;</div>
          <div className="text-lg font-semibold text-gray-700">Loading demographic data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Intelligent Audience Targeting</h1>
        <p className="text-blue-100">
          Select your target audience and get AI-powered {countryConfig.geoUnit} recommendations for exposed and holdout groups
        </p>
      </div>

      {/* Audience Selector */}
      <AudienceSelector
        selectedAudience={selectedAudience}
        onAudienceChange={handleAudienceChange}
        recommendations={recommendations}
        customAudiences={customAudiences}
        onOpenBuilder={() => setShowBuilder(true)}
        onRemoveCustomAudience={handleRemoveCustomAudience}
        isExpanded={isSegmentSelectorExpanded}
        onToggleExpanded={setIsSegmentSelectorExpanded}
      />

      {/* Custom Audience Builder Modal */}
      {showBuilder && (
        <CustomAudienceBuilder
          onCreateAudience={handleCreateCustomAudience}
          onClose={() => setShowBuilder(false)}
          demographicsData={demographicsData}
        />
      )}

      {/* Affinity Slider - Targeting Precision */}
      {selectedAudience && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
            Targeting Precision
          </h3>

          {/* Main Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-emerald-600">&larr; Reach</span>
              <span className="text-sm text-gray-500">Min Affinity: <strong className="text-gray-900">{settings.minScore}</strong></span>
              <span className="text-sm font-semibold text-blue-600">Precision &rarr;</span>
            </div>

            {/* Custom styled slider */}
            <div className="relative px-1">
              {/* Track background with gradient */}
              <div className="absolute top-1/2 left-0 right-0 h-3 -translate-y-1/2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${sliderPct}%, #f59e0b ${sliderPct}%, #f59e0b ${Math.min(sliderPct + 15, 100)}%, #d1d5db ${Math.min(sliderPct + 15, 100)}%, #d1d5db 100%)`
                  }}
                />
              </div>
              <input
                type="range"
                min="20"
                max="85"
                step="1"
                value={settings.minScore}
                onChange={(e) => handleSettingsChange('minScore', parseInt(e.target.value))}
                className="relative w-full h-8 appearance-none bg-transparent cursor-pointer z-10"
                style={{
                  WebkitAppearance: 'none',
                }}
              />
              <style>{`
                input[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  height: 28px;
                  width: 28px;
                  border-radius: 50%;
                  background: white;
                  border: 3px solid #3b82f6;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                  cursor: pointer;
                  margin-top: -2px;
                }
                input[type="range"]::-moz-range-thumb {
                  height: 28px;
                  width: 28px;
                  border-radius: 50%;
                  background: white;
                  border: 3px solid #3b82f6;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                  cursor: pointer;
                }
                input[type="range"]::-webkit-slider-runnable-track {
                  height: 4px;
                  background: transparent;
                }
                input[type="range"]::-moz-range-track {
                  height: 4px;
                  background: transparent;
                }
              `}</style>
            </div>
          </div>

          {/* Live Counters */}
          {sliderStats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200 text-center">
                <div className="text-xs text-emerald-700 font-medium mb-1">Selected {countryConfig.geoUnitPlural}</div>
                <div className="text-xl font-bold text-emerald-600">
                  {sliderStats.selectedCount}
                </div>
                <div className="text-xs text-emerald-600">{sliderStats.selectedPct}%</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 text-center">
                <div className="text-xs text-amber-700 font-medium mb-1">Holdout</div>
                <div className="text-xl font-bold text-amber-600">
                  {sliderStats.holdoutCount}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                <div className="text-xs text-gray-600 font-medium mb-1">Excluded</div>
                <div className="text-xl font-bold text-gray-500">
                  {sliderStats.excludedCount}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-center">
                <div className="text-xs text-blue-700 font-medium mb-1">Est. Reach</div>
                <div className="text-xl font-bold text-blue-600">
                  {sliderStats.estimatedReach >= 1000000
                    ? `${(sliderStats.estimatedReach / 1000000).toFixed(1)}M`
                    : `${(sliderStats.estimatedReach / 1000).toFixed(0)}K`} HH
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 text-center">
                <div className="text-xs text-purple-700 font-medium mb-1">Avg Affinity</div>
                <div className="text-xl font-bold text-purple-600">
                  {sliderStats.avgAffinity}%
                </div>
              </div>
            </div>
          )}

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-gray-500 font-medium">Quick presets:</span>
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  settings.minScore === preset.minScore && settings.exposedRatio === preset.exposedRatio
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Secondary Controls */}
          <details className="group">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2">
              <span>Exposed/Holdout Ratio & Max {countryConfig.geoUnitPlural}</span>
              <span className="text-xs group-open:hidden">(click to expand)</span>
            </summary>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exposed Ratio
                  <span className="ml-2 text-xs text-gray-500">
                    ({Math.round(settings.exposedRatio * 100)}% exposed / {Math.round((1 - settings.exposedRatio) * 100)}% holdout)
                  </span>
                </label>
                <input
                  type="range"
                  min="0.4"
                  max="0.8"
                  step="0.05"
                  value={settings.exposedRatio}
                  onChange={(e) => handleSettingsChange('exposedRatio', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>40%</span>
                  <span>60%</span>
                  <span>80%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max {countryConfig.geoUnit} Regions
                  <span className="ml-2 text-xs text-gray-500">
                    ({settings.maxZips})
                  </span>
                </label>
                <input
                  type="range"
                  min="50"
                  max={maxZipsLimit}
                  step="10"
                  value={settings.maxZips}
                  onChange={(e) => handleSettingsChange('maxZips', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>50</span>
                  <span>{Math.round(maxZipsLimit / 2)}</span>
                  <span>{maxZipsLimit}</span>
                </div>
              </div>
            </div>
          </details>
        </div>
      )}

      {/* Map */}
      <USAMapWithAudience
        recommendations={recommendations}
        selectedAudience={selectedAudience}
      />

      {/* Detailed Statistics */}
      {recommendations && selectedAudience && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detailed Campaign Statistics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-sm font-medium text-green-800 mb-2">Exposed Group</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{countryConfig.geoUnit} Regions:</span>
                  <span className="font-semibold text-gray-900">{recommendations.stats.exposedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Population:</span>
                  <span className="font-semibold text-gray-900">
                    {(recommendations.stats.exposedPopulation / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Score:</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(recommendations.stats.avgScoreExposed)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Score Range:</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(recommendations.stats.minScoreExposed)}-{Math.round(recommendations.stats.maxScoreExposed)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="text-sm font-medium text-yellow-800 mb-2">Holdout Group</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{countryConfig.geoUnit} Regions:</span>
                  <span className="font-semibold text-gray-900">{recommendations.stats.holdoutCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Population:</span>
                  <span className="font-semibold text-gray-900">
                    {(recommendations.stats.holdoutPopulation / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Score:</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(recommendations.stats.avgScoreHoldout)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Geographic Diversity:</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(recommendations.stats.geographicDiversityHoldout)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-sm font-medium text-blue-800 mb-2">Overall Campaign</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total {countryConfig.geoUnitPlural}:</span>
                  <span className="font-semibold text-gray-900">
                    {recommendations.stats.exposedCount + recommendations.stats.holdoutCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Population:</span>
                  <span className="font-semibold text-gray-900">
                    {(recommendations.stats.totalPopulation / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Qualified {countryConfig.geoUnitPlural}:</span>
                  <span className="font-semibold text-gray-900">{recommendations.stats.totalQualified}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Split Ratio:</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(recommendations.stats.exposedRatio * 100)}/{Math.round((1 - recommendations.stats.exposedRatio) * 100)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                const exportData = {
                  audience: selectedAudience.name,
                  settings,
                  exposed: recommendations.exposed.map(z => z.zip3),
                  holdout: recommendations.holdout.map(z => z.zip3),
                  stats: recommendations.stats
                };
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `audience-targeting-${selectedAudience.id}.json`;
                a.click();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Export Configuration
            </button>

            <button
              onClick={() => {
                const csv = [
                  [countryConfig.geoUnit, 'Type', 'Score', 'Population', 'Households'],
                  ...recommendations.exposed.map(z => [z.zip3, 'Exposed', z.score, z.demographics.population, z.demographics.households]),
                  ...recommendations.holdout.map(z => [z.zip3, 'Holdout', z.score, z.demographics.population, z.demographics.households])
                ].map(row => row.join(',')).join('\n');

                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${countryConfig.geoUnit.toLowerCase()}-targeting-${selectedAudience.id}.csv`;
                a.click();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Export {countryConfig.geoUnit} List (CSV)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudienceTargeting;
