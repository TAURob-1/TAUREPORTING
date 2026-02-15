import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getZipType, getZipColor, getZipData } from '../data/zipMapping';

// Component to handle map bounds setting
function SetMapBounds({ geoJsonData }) {
  const map = useMap();
  
  useEffect(() => {
    if (geoJsonData && geoJsonData.features.length > 0) {
      // Set bounds to continental US
      map.setView([39.8283, -98.5795], 4);
    }
  }, [geoJsonData, map]);
  
  return null;
}

const USAMap = ({ dmaRegions }) => {
  const [selectedZIP, setSelectedZIP] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [hoveredZIP, setHoveredZIP] = useState(null);

  useEffect(() => {
    // Load the GeoJSON data
    fetch('/data/us-zip3-simplified.json')
      .then(response => response.json())
      .then(data => {
        setGeoJsonData(data);
      })
      .catch(error => {
        console.error('Error loading ZIP code data:', error);
      });
  }, []);

  const getFeatureStyle = (feature) => {
    const zipCode = feature.properties['3dig_zip'];
    const type = getZipType(zipCode);
    const isHovered = hoveredZIP === zipCode;
    const isSelected = selectedZIP?.zipCode === zipCode;
    
    return {
      fillColor: getZipColor(type),
      weight: isSelected ? 3 : isHovered ? 2 : 1,
      opacity: 1,
      color: isSelected ? '#1e40af' : isHovered ? '#374151' : '#ffffff',
      fillOpacity: isSelected ? 0.9 : isHovered ? 0.8 : 0.6
    };
  };

  const onEachFeature = (feature, layer) => {
    const zipCode = feature.properties['3dig_zip'];
    const type = getZipType(zipCode);
    const zipData = getZipData(zipCode, type);
    
    layer.on({
      mouseover: (e) => {
        setHoveredZIP(zipCode);
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#374151',
          fillOpacity: 0.8
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
          type,
          ...zipData
        });
      }
    });

    // Tooltip on hover
    layer.bindTooltip(
      `<div style="text-align: center;">
        <strong>ZIP ${zipCode}</strong><br/>
        <span style="font-size: 11px; color: #666;">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
      </div>`,
      {
        permanent: false,
        direction: 'top',
        className: 'custom-tooltip'
      }
    );
  };

  const getColor = (type) => {
    switch (type) {
      case 'exposed': return '#3b82f6';
      case 'holdout': return '#6b7280';
      case 'high': return '#10b981';
      default: return '#9ca3af';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Geographic Test Design</h2>
        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#3b82f6', opacity: 0.8 }}></div>
            <span className="text-xs text-gray-500">Exposed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#6b7280', opacity: 0.5 }}></div>
            <span className="text-xs text-gray-500">Holdout</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#10b981', opacity: 0.8 }}></div>
            <span className="text-xs text-gray-500">High Performers</span>
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
            />
            <SetMapBounds geoJsonData={geoJsonData} />
          </MapContainer>
        )}
      </div>

      {/* Hover Info */}
      {hoveredZIP && !selectedZIP && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">
            Hover over ZIP region: <strong>{hoveredZIP}</strong>
            <span className="ml-2">• Click to see details</span>
          </div>
        </div>
      )}

      {/* ZIP Details */}
      {selectedZIP && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg animate-fadeIn border border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getColor(selectedZIP.type), opacity: 0.8 }}
                ></div>
                <div className="text-sm font-semibold text-blue-900">
                  ZIP Code Region: {selectedZIP.zipCode}
                </div>
              </div>
              <div className="text-xs text-blue-800 space-y-1">
                <div><strong>Status:</strong> {selectedZIP.type.charAt(0).toUpperCase() + selectedZIP.type.slice(1)}</div>
                <div><strong>Impressions:</strong> {selectedZIP.impressions}</div>
                <div><strong>Measured Lift:</strong> {selectedZIP.lift}</div>
                <div className="text-blue-700 italic mt-2">{selectedZIP.description}</div>
              </div>
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
      <div className="mt-3 text-[11px] text-gray-400 text-center">
        Click any region for details
      </div>
    </div>
  );
};

export default USAMap;
