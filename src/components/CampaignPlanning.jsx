import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getZipDemographic, estimateZipReach } from '../data/zipDemographics';
import { getUkPostcodeDemographic, estimateUkPostcodeReach } from '../data/ukPostcodeDemographics';
import { getChannelInventory, formatImpressions, calculateBudget } from '../data/countryChannelInventory';
import BudgetAllocator from './BudgetAllocator';
import ReachFrequency from './ReachFrequency';
import ScenarioComparison from './ScenarioComparison';
import { getProviderPlanning } from '../data/countryPlanning';
import { usePlatform } from '../context/PlatformContext.jsx';

// Component to handle map bounds setting
function SetMapBounds({ geoJsonData, center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (geoJsonData && geoJsonData.features.length > 0) {
      map.setView(center, zoom);
    }
  }, [geoJsonData, map, center, zoom]);

  return null;
}

function getGeoCode(feature, countryCode) {
  if (countryCode === 'US') {
    return feature?.properties?.['3dig_zip'];
  }
  return feature?.properties?.postcode || feature?.properties?.region_id || feature?.properties?.name;
}

const CampaignPlanning = () => {
  const { advertiser, countryCode, countryConfig, campaignConfig, planningState, setPlanningState } = usePlatform();
  const [selectedZIPs, setSelectedZIPs] = useState(new Set());
  const [hoveredZIP, setHoveredZIP] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [selectedChannels, setSelectedChannels] = useState(new Set());
  const [budgetMetrics, setBudgetMetrics] = useState(null);
  const [channelsExpanded, setChannelsExpanded] = useState(false);
  const [exportCopied, setExportCopied] = useState(false);
  const providerPlanning = useMemo(() => getProviderPlanning(countryCode), [countryCode]);
  const channelInventory = useMemo(() => getChannelInventory(countryCode), [countryCode]);

  const exportPlanJSON = () => {
    if (!budgetMetrics) return;
    const plan = {
      planName: `${advertiser.name} ${countryConfig.shortLabel} CTV Campaign`,
      exportDate: new Date().toISOString().split('T')[0],
      advertiser: advertiser.name,
      country: countryCode,
      budget: {
        total: budgetMetrics.totalBudget,
        allocations: budgetMetrics.allocations || {},
        blendedCPM: budgetMetrics.blendedCPM,
      },
      reach: {
        deduplicated: budgetMetrics.reach,
        avgFrequency: budgetMetrics.frequency,
        grps: budgetMetrics.grps,
      },
      providers: (budgetMetrics.enabledProviders || []).map(pid => {
        const p = providerPlanning[pid];
        return { id: pid, name: p?.name || pid, budget: budgetMetrics.allocations?.[pid] || 0 };
      }),
      geographicTargeting: {
        selectedZIPs: Array.from(selectedZIPs).sort(),
        geoUnit: countryConfig.geoUnit,
        totalGeoReach: totalReach,
      },
    };
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${advertiser.slug}-campaign-plan-${countryCode.toLowerCase()}-${plan.exportDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copySummary = () => {
    if (!budgetMetrics) return;
    const lines = [
      `=== ${advertiser.name} CTV Campaign Plan ===`,
      `Date: ${new Date().toISOString().split('T')[0]}`,
      `Country: ${countryConfig.label}`,
      '',
      `Budget: ${countryConfig.currencySymbol}${budgetMetrics.totalBudget.toLocaleString()}`,
      `Blended CPM: ${countryConfig.currencySymbol}${budgetMetrics.blendedCPM.toFixed(2)}`,
      `GRPs: ${budgetMetrics.grps}`,
      `Deduped Reach: ${formatHH(budgetMetrics.reach)} households`,
      `Avg Frequency: ${budgetMetrics.frequency}x`,
      `Active Providers: ${budgetMetrics.enabledProviders?.length || 0}`,
      `Geographic Markets: ${selectedZIPs.size} ${countryConfig.geoUnitPlural}`,
      totalReach > 0 ? `Geo Market Reach: ${formatHH(totalReach)} households` : '',
    ].filter(Boolean).join('\n');
    navigator.clipboard.writeText(lines).then(() => {
      setExportCopied(true);
      setTimeout(() => setExportCopied(false), 2000);
    });
  };

  useEffect(() => {
    // Load the GeoJSON data
    setGeoJsonData(null);
    setSelectedZIPs(new Set());
    fetch(countryConfig.planningGeoJson)
      .then(response => response.json())
      .then(data => {
        setGeoJsonData(data);
      })
      .catch(error => {
        console.error(`Error loading ${countryConfig.geoUnit} data:`, error);
      });
  }, [countryConfig]);

  const toggleZIP = (zipCode) => {
    const newSelected = new Set(selectedZIPs);
    if (newSelected.has(zipCode)) {
      newSelected.delete(zipCode);
    } else {
      newSelected.add(zipCode);
    }
    setSelectedZIPs(newSelected);
  };

  const toggleChannel = (channelName) => {
    const newSelected = new Set(selectedChannels);
    if (newSelected.has(channelName)) {
      newSelected.delete(channelName);
    } else {
      newSelected.add(channelName);
    }
    setSelectedChannels(newSelected);
  };

  const getFeatureStyle = (feature) => {
    const zipCode = getGeoCode(feature, countryCode);
    const isSelected = selectedZIPs.has(zipCode);
    const isHovered = hoveredZIP === zipCode;

    return {
      fillColor: isSelected ? '#3b82f6' : '#e5e7eb',
      weight: isHovered ? 2 : 1,
      opacity: 1,
      color: isHovered ? '#1e40af' : '#9ca3af',
      fillOpacity: isSelected ? 0.7 : 0.3
    };
  };

  const onEachFeature = (feature, layer) => {
    const zipCode = getGeoCode(feature, countryCode);

    layer.on({
      mouseover: (e) => {
        setHoveredZIP(zipCode);
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#1e40af'
        });
      },
      mouseout: (e) => {
        setHoveredZIP(null);
        const layer = e.target;
        layer.setStyle(getFeatureStyle(feature));
      },
      click: (e) => {
        toggleZIP(zipCode);
      }
    });

    const demographic = countryCode === 'US' ? getZipDemographic(zipCode) : getUkPostcodeDemographic(zipCode);
    const tooltipExtra = countryCode === 'UK' ? `<br/><span style="font-size: 10px; color: #888;">${demographic.region}</span>` : '';
    layer.bindTooltip(
      `<div style="text-align: center;">
        <strong>${countryConfig.geoUnit} ${zipCode}</strong><br/>
        <span style="font-size: 11px; color: #666;">${demographic.segment}</span>${tooltipExtra}
      </div>`,
      {
        permanent: false,
        direction: 'top',
        className: 'custom-tooltip'
      }
    );
  };

  // Calculate summary stats
  const totalReach = Array.from(selectedZIPs).reduce((sum, zip) => {
    if (countryCode === 'US') return sum + estimateZipReach(zip);
    return sum + estimateUkPostcodeReach(zip);
  }, 0);

  const selectedChannelList = [
    ...channelInventory.ctv.filter(ch => selectedChannels.has(ch.name)),
    ...channelInventory.traditional.filter(ch => selectedChannels.has(ch.name))
  ];

  const totalImpressions = selectedChannelList.reduce((sum, ch) => sum + ch.impressions, 0);
  const estimatedBudget = calculateBudget(selectedChannelList);

  useEffect(() => {
    setPlanningState({
      totalBudget: budgetMetrics?.totalBudget || 0,
      allocations: budgetMetrics?.allocations || {},
      selectedMarkets: selectedZIPs.size,
      selectedChannels: Array.from(selectedChannels),
      reach: budgetMetrics?.reach || 0,
      frequency: budgetMetrics?.frequency || 0,
      grps: budgetMetrics?.grps || 0,
      totalGeoReach: totalReach,
      estimatedBudget,
      totalImpressions,
    });
  }, [budgetMetrics, selectedZIPs, selectedChannels, totalReach, estimatedBudget, totalImpressions, setPlanningState]);

  // Helper to format households
  const formatHH = (n) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Campaign Planning</h1>
          <p className="text-sm text-gray-600 mt-1">
            Allocate budget, optimize reach, and select target markets
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {campaignConfig.campaignName}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-50 text-gray-700 border border-gray-200">
              {campaignConfig.startDate} to {campaignConfig.endDate}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              Primary Audience: {campaignConfig.primaryAudience || 'Not set yet'}
            </span>
            {!!planningState.campaignBudget && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                AI Budget: {countryConfig.currencySymbol}{planningState.campaignBudget.toLocaleString()}
              </span>
            )}
            {!!planningState.mediaMixRecommendations && Object.keys(planningState.mediaMixRecommendations).length > 0 && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                AI Mix: {Object.entries(planningState.mediaMixRecommendations).map(([channel, pct]) => `${channel.replace(/_/g, ' ')} ${pct}%`).join(' • ')}
              </span>
            )}
          </div>
        </div>

        {/* Budget Allocator — full width */}
        <div className="mb-6">
          <BudgetAllocator onMetricsChange={setBudgetMetrics} />
        </div>

        {/* Reach & Frequency — full width */}
        <div className="mb-6">
          <ReachFrequency metrics={budgetMetrics} />
        </div>

        {/* Scenario Comparison */}
        <div className="mb-6">
          <ScenarioComparison budgetMetrics={budgetMetrics} />
        </div>

        {/* Export Buttons */}
        {budgetMetrics && budgetMetrics.totalBudget > 0 && (
          <div className="mb-6 flex gap-3">
            <button
              onClick={exportPlanJSON}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Plan (JSON)
            </button>
            <button
              onClick={copySummary}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                exportCopied
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {exportCopied ? 'Copied!' : 'Copy Summary'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Map and Selection */}
          <div className="lg:col-span-2 space-y-6">

            {/* Interactive ZIP Selector */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Geographic Targeting</h2>
                <div className="text-sm text-gray-600">
                  {selectedZIPs.size} {countryConfig.geoUnit}{selectedZIPs.size !== 1 ? 's' : ''} selected
                </div>
              </div>

              {/* Map */}
              <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '500px', position: 'relative' }}>
                {!geoJsonData ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🗺️</div>
                      <div className="text-gray-600">Loading {countryConfig.geoUnit} map...</div>
                    </div>
                  </div>
                ) : (
                  <MapContainer
                    center={countryConfig.planningMapCenter}
                    zoom={countryConfig.planningMapZoom}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <GeoJSON
                      data={geoJsonData}
                      style={getFeatureStyle}
                      onEachFeature={onEachFeature}
                    />
                    <SetMapBounds
                      geoJsonData={geoJsonData}
                      center={countryConfig.planningMapCenter}
                      zoom={countryConfig.planningMapZoom}
                    />
                  </MapContainer>
                )}
              </div>

              <div className="mt-4 text-xs text-gray-500 text-center">
                Click {countryConfig.geoUnit} regions to add/remove from campaign • Blue = Selected
              </div>
            </div>

            {/* Selected ZIP Demographics */}
            {selectedZIPs.size > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Selected Markets Demographics
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                  {Array.from(selectedZIPs).sort().map(zipCode => {
                    const demographic = countryCode === 'US'
                      ? getZipDemographic(zipCode)
                      : getUkPostcodeDemographic(zipCode);
                    const reach = countryCode === 'US'
                      ? estimateZipReach(zipCode)
                      : estimateUkPostcodeReach(zipCode);

                    return (
                      <div
                        key={zipCode}
                        className="border border-gray-200 rounded-lg p-3 hover:border-blue-400 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-blue-900">{countryConfig.geoUnit} {zipCode}</div>
                          <button
                            onClick={() => toggleZIP(zipCode)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="text-xs text-gray-700 space-y-1">
                          <div><strong>Segment:</strong> {demographic.segment}</div>
                          <div><strong>Income:</strong> {demographic.income}</div>
                          {countryCode === 'US' ? (
                            <div><strong>Auto Own:</strong> {demographic.autoOwnership}</div>
                          ) : (
                            <>
                              <div><strong>Region:</strong> {demographic.region}</div>
                              <div><strong>Setting:</strong> {demographic.urbanRural}</div>
                            </>
                          )}
                          <div className="text-blue-600 font-medium">
                            ~{(reach / 1000).toFixed(1)}K CTV reach
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Summary and Channels */}
          <div className="space-y-6">

            {/* Enhanced Campaign Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Campaign Summary</h3>

              <div className="space-y-3">
                {/* Budget */}
                {budgetMetrics && budgetMetrics.totalBudget > 0 && (
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600">Budget</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {countryConfig.currencySymbol}{budgetMetrics.totalBudget >= 1000000
                        ? `${(budgetMetrics.totalBudget / 1000000).toFixed(1)}M`
                        : `${(budgetMetrics.totalBudget / 1000).toFixed(0)}K`}
                    </div>
                    <div className="text-xs text-gray-500">Total campaign spend</div>
                  </div>
                )}

                {/* Blended CPM */}
                {budgetMetrics && budgetMetrics.blendedCPM > 0 && (
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600">Blended CPM</div>
                    <div className="text-2xl font-bold text-green-900">
                      {countryConfig.currencySymbol}{budgetMetrics.blendedCPM.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Weighted avg cost per 1K</div>
                  </div>
                )}

                {/* Deduplicated Reach */}
                {budgetMetrics && budgetMetrics.reach > 0 && (
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600">Est. Deduplicated Reach</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {formatHH(budgetMetrics.reach)}
                    </div>
                    <div className="text-xs text-gray-500">Households (deduped)</div>
                  </div>
                )}

                {/* GRPs */}
                {budgetMetrics && budgetMetrics.grps > 0 && (
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600">Estimated GRPs</div>
                    <div className="text-2xl font-bold text-violet-900">
                      {budgetMetrics.grps}
                    </div>
                    <div className="text-xs text-gray-500">Gross rating points</div>
                  </div>
                )}

                {/* Average Frequency */}
                {budgetMetrics && budgetMetrics.frequency > 0 && (
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600">Est. Average Frequency</div>
                    <div className="text-2xl font-bold text-indigo-900">
                      {budgetMetrics.frequency}x
                    </div>
                    <div className="text-xs text-gray-500">Per household</div>
                  </div>
                )}

                {/* Geographic Markets */}
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-600">Geographic Markets</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedZIPs.size}</div>
                  <div className="text-xs text-gray-500">
                    {selectedZIPs.size > 0
                      ? `${selectedZIPs.size} ${countryConfig.geoUnit}${selectedZIPs.size !== 1 ? 's' : ''} selected`
                      : `No ${countryConfig.geoUnitPlural} selected`}
                  </div>
                </div>

                {/* Geo Reach */}
                {totalReach > 0 && (
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600">Geo Market Reach</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {(totalReach / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-gray-500">Households in selected {countryConfig.geoUnitPlural}</div>
                  </div>
                )}

                {/* Flight Duration placeholder */}
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-600">Flight Duration</div>
                  <div className="text-lg font-semibold text-amber-700">Set dates</div>
                  <div className="text-xs text-gray-500">Campaign schedule TBD</div>
                </div>

              </div>
            </div>

            {/* Collapsible Channel Inventory */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <button
                onClick={() => setChannelsExpanded(!channelsExpanded)}
                className="w-full flex items-center justify-between"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Provider Inventory
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {selectedChannels.size} selected
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${channelsExpanded ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {channelsExpanded && (
                <div className="mt-4 space-y-4">
                  {/* CTV Platforms */}
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">CTV Platforms</div>
                    <div className="space-y-2">
                      {channelInventory.ctv.map(channel => {
                        const isSelected = selectedChannels.has(channel.name);

                        return (
                          <div
                            key={channel.name}
                            onClick={() => toggleChannel(channel.name)}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                                  style={{ backgroundColor: channel.color }}
                                >
                                  {channel.icon}
                                </div>
                                <div>
                                  <div className="font-semibold text-sm text-gray-900">
                                    {channel.name}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    ~{formatImpressions(channel.impressions)} impressions
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-500">{countryConfig.currencySymbol}{channel.cpm} CPM</div>
                                <div className="text-xs text-gray-400">{channel.reach}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Traditional TV */}
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Traditional TV</div>
                    <div className="space-y-2">
                      {channelInventory.traditional.map(channel => {
                        const isSelected = selectedChannels.has(channel.name);

                        return (
                          <div
                            key={channel.name}
                            onClick={() => toggleChannel(channel.name)}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                                  style={{ backgroundColor: channel.color }}
                                >
                                  {channel.icon}
                                </div>
                                <div>
                                  <div className="font-semibold text-sm text-gray-900">
                                    {channel.name}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    ~{formatImpressions(channel.impressions)} impressions
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-500">{countryConfig.currencySymbol}{channel.cpm} CPM</div>
                                <div className="text-xs text-gray-400">{channel.reach}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPlanning;
