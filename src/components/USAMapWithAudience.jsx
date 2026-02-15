import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Component to handle map bounds setting
function SetMapBounds({ geoJsonData }) {
  const map = useMap();
  
  useEffect(() => {
    if (geoJsonData && geoJsonData.features.length > 0) {
      map.setView([39.8283, -98.5795], 4);
    }
  }, [geoJsonData, map]);
  
  return null;
}

const USAMapWithAudience = ({ recommendations, selectedAudience }) => {
  const [selectedZIP, setSelectedZIP] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [hoveredZIP, setHoveredZIP] = useState(null);

  useEffect(() => {
    fetch('/data/us-zip3-simplified.json')
      .then(response => response.json())
      .then(data => {
        setGeoJsonData(data);
      })
      .catch(error => {
        console.error('Error loading ZIP code data:', error);
      });
  }, []);

  // Get ZIP classification and score
  const getZIPInfo = (zipCode) => {
    if (!recommendations) {
      return { type: 'none', score: 0 };
    }

    const exposed = recommendations.exposed.find(z => z.zip3 === zipCode);
    if (exposed) {
      return { type: 'exposed', score: exposed.score, data: exposed };
    }

    const holdout = recommendations.holdout.find(z => z.zip3 === zipCode);
    if (holdout) {
      return { type: 'holdout', score: holdout.score, data: holdout };
    }

    const notRecommended = recommendations.notRecommended.find(z => z.zip3 === zipCode);
    if (notRecommended) {
      return { type: 'not-recommended', score: notRecommended.score, data: notRecommended };
    }

    return { type: 'none', score: 0 };
  };

  const getFeatureStyle = (feature) => {
    const zipCode = feature.properties['3dig_zip'];
    const zipInfo = getZIPInfo(zipCode);
    const isHovered = hoveredZIP === zipCode;
    const isSelected = selectedZIP?.zipCode === zipCode;
    
    let fillColor, fillOpacity;
    
    switch (zipInfo.type) {
      case 'exposed':
        // Green gradient based on score
        const greenIntensity = Math.min(zipInfo.score / 100, 1);
        fillColor = `rgb(${Math.round(16 * (1-greenIntensity) + 34 * greenIntensity)}, ${Math.round(185 * (1-greenIntensity) + 197 * greenIntensity)}, ${Math.round(129 * (1-greenIntensity) + 94 * greenIntensity)})`;
        fillOpacity = 0.7;
        break;
      case 'holdout':
        // Yellow/amber based on score
        const yellowIntensity = Math.min(zipInfo.score / 100, 1);
        fillColor = `rgb(${Math.round(251 * yellowIntensity + 200 * (1-yellowIntensity))}, ${Math.round(191 * yellowIntensity + 150 * (1-yellowIntensity))}, ${Math.round(36 * yellowIntensity + 20 * (1-yellowIntensity))})`;
        fillOpacity = 0.6;
        break;
      case 'not-recommended':
        fillColor = '#d1d5db';
        fillOpacity = 0.4;
        break;
      default:
        fillColor = '#f3f4f6';
        fillOpacity = 0.3;
    }
    
    return {
      fillColor,
      fillOpacity: isSelected ? 0.9 : isHovered ? fillOpacity + 0.2 : fillOpacity,
      weight: isSelected ? 3 : isHovered ? 2 : 1,
      opacity: 1,
      color: isSelected ? '#1e40af' : isHovered ? '#374151' : '#ffffff'
    };
  };

  const onEachFeature = (feature, layer) => {
    const zipCode = feature.properties['3dig_zip'];
    const zipInfo = getZIPInfo(zipCode);
    
    layer.on({
      mouseover: (e) => {
        setHoveredZIP(zipCode);
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#374151',
          fillOpacity: 0.9
        });
      },
      mouseout: (e) => {
        setHoveredZIP(null);
        const layer = e.target;
        if (selectedZIP?.zipCode !== zipCode) {
          layer.setStyle(getFeatureStyle(feature));
        }
      },
      click: (e) => {
        setSelectedZIP({
          zipCode,
          ...zipInfo
        });
      }
    });

    // Tooltip on hover
    const tooltipContent = zipInfo.type !== 'none' 
      ? `<div style="text-align: center;">
          <strong>ZIP ${zipCode}</strong><br/>
          <span style="font-size: 11px; color: #666;">Score: ${zipInfo.score}</span><br/>
          <span style="font-size: 10px; color: #888;">${zipInfo.type === 'exposed' ? 'Recommended Exposed' : zipInfo.type === 'holdout' ? 'Recommended Holdout' : 'Not Recommended'}</span>
        </div>`
      : `<div style="text-align: center;">
          <strong>ZIP ${zipCode}</strong><br/>
          <span style="font-size: 11px; color: #999;">No data</span>
        </div>`;
    
    layer.bindTooltip(tooltipContent, {
      permanent: false,
      direction: 'top',
      className: 'custom-tooltip'
    });
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'exposed': return 'Recommended Exposed';
      case 'holdout': return 'Recommended Holdout';
      case 'not-recommended': return 'Not Recommended';
      default: return 'No Recommendation';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'exposed': return '#10b981';
      case 'holdout': return '#fbbf24';
      case 'not-recommended': return '#9ca3af';
      default: return '#e5e7eb';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Geographic Targeting Map
          {selectedAudience && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              {selectedAudience.name}
            </span>
          )}
        </h2>
        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#10b981', opacity: 0.8 }}></div>
            <span className="text-xs text-gray-500">Exposed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#fbbf24', opacity: 0.7 }}></div>
            <span className="text-xs text-gray-500">Holdout</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#d1d5db', opacity: 0.5 }}></div>
            <span className="text-xs text-gray-500">Not Recommended</span>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '500px', position: 'relative' }}>
        {!geoJsonData ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="text-2xl mb-2">🗺️</div>
              <div className="text-gray-600">Loading ZIP code map...</div>
            </div>
          </div>
        ) : !recommendations ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Select an Audience</div>
              <div className="text-sm text-gray-600">
                Choose a target audience segment above to see<br/>
                recommended ZIP code targeting
              </div>
            </div>
          </div>
        ) : (
          <MapContainer
            center={[39.8283, -98.5795]}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <GeoJSON
              data={geoJsonData}
              style={getFeatureStyle}
              onEachFeature={onEachFeature}
              key={recommendations ? 'with-recommendations' : 'no-recommendations'}
            />
            <SetMapBounds geoJsonData={geoJsonData} />
          </MapContainer>
        )}
      </div>

      {/* Hover Info */}
      {hoveredZIP && !selectedZIP && recommendations && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">
            Hover over ZIP region: <strong>{hoveredZIP}</strong>
            <span className="ml-2">• Click to see details</span>
          </div>
        </div>
      )}

      {/* ZIP Details */}
      {selectedZIP && selectedZIP.type !== 'none' && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 animate-fadeIn">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getTypeColor(selectedZIP.type), opacity: 0.8 }}
                ></div>
                <div className="text-sm font-semibold text-blue-900">
                  ZIP Code Region: {selectedZIP.zipCode}
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  selectedZIP.type === 'exposed' ? 'bg-green-100 text-green-800' :
                  selectedZIP.type === 'holdout' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getTypeLabel(selectedZIP.type)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-gray-600 mb-1">Audience Fit Score</div>
                  <div className="text-2xl font-bold text-blue-600">{selectedZIP.score}</div>
                  <div className="text-gray-500">out of 100</div>
                </div>
                
                {selectedZIP.data?.demographics && (
                  <>
                    <div>
                      <div className="text-gray-600 mb-1">Population</div>
                      <div className="text-2xl font-bold text-gray-700">
                        {(selectedZIP.data.demographics.population / 1000).toFixed(0)}K
                      </div>
                      <div className="text-gray-500">residents</div>
                    </div>
                    
                    <div>
                      <div className="text-gray-600 mb-1">Households</div>
                      <div className="text-2xl font-bold text-gray-700">
                        {(selectedZIP.data.demographics.households / 1000).toFixed(0)}K
                      </div>
                      <div className="text-gray-500">households</div>
                    </div>
                  </>
                )}
              </div>

              {/* Demographics breakdown */}
              {selectedZIP.data?.demographics && selectedAudience && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="text-xs font-medium text-gray-700 mb-2">Key Demographics:</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    {selectedAudience.criteria.slice(0, 4).map((criterion, idx) => {
                      const value = selectedZIP.data.demographics[criterion.field] || 0;
                      const label = criterion.field.replace(/_/g, ' ').replace('pct', '%');
                      
                      return (
                        <div key={idx} className="bg-white rounded p-2">
                          <div className="text-gray-600 mb-1 capitalize">{label}</div>
                          <div className="font-bold text-gray-900">{value}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setSelectedZIP(null)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        {recommendations 
          ? 'Click any ZIP region to see demographic details and audience fit score'
          : 'Interactive map showing 3-digit ZIP code regions • Select an audience to see recommendations'
        }
      </div>
    </div>
  );
};

export default USAMapWithAudience;
