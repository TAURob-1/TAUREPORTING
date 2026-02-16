import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getZipType, getZipColor, getZipData } from '../data/zipMapping';
import { getUkPostcodeDemographic } from '../data/ukPostcodeDemographics';
import { usePlatform } from '../context/PlatformContext.jsx';

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

const USAMap = ({ dmaRegions }) => {
  const { countryCode, countryConfig } = usePlatform();
  const [selectedZIP, setSelectedZIP] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [hoveredZIP, setHoveredZIP] = useState(null);

  useEffect(() => {
    setSelectedZIP(null);
    setHoveredZIP(null);
    setGeoJsonData(null);

    fetch(countryConfig.planningGeoJson)
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data);
      })
      .catch((error) => {
        console.error(`Error loading ${countryConfig.geoUnit} data:`, error);
      });
  }, [countryConfig]);

  const getFeatureStyle = (feature) => {
    const zipCode = getGeoCode(feature, countryCode);
    const isHovered = hoveredZIP === zipCode;
    const isSelected = selectedZIP?.zipCode === zipCode;

    if (countryCode === 'UK') {
      return {
        fillColor: isSelected ? '#3b82f6' : '#e5e7eb',
        weight: isSelected ? 2 : isHovered ? 1.5 : 1,
        opacity: 1,
        color: isSelected ? '#1e40af' : '#9ca3af',
        fillOpacity: isSelected ? 0.7 : isHovered ? 0.5 : 0.35,
      };
    }

    const type = getZipType(zipCode);
    return {
      fillColor: getZipColor(type),
      weight: isSelected ? 3 : isHovered ? 2 : 1,
      opacity: 1,
      color: isSelected ? '#1e40af' : isHovered ? '#374151' : '#ffffff',
      fillOpacity: isSelected ? 0.9 : isHovered ? 0.8 : 0.6,
    };
  };

  const onEachFeature = (feature, layer) => {
    const zipCode = getGeoCode(feature, countryCode);
    const type = countryCode === 'US' ? getZipType(zipCode) : 'uk-region';
    const zipData = countryCode === 'US'
      ? getZipData(zipCode, type)
      : (() => {
          const demo = getUkPostcodeDemographic(zipCode);
          return {
            impressions: `~${(demo.households / 1000).toFixed(0)}K households`,
            lift: 'Awaiting campaign data',
            description: `${demo.region} — ${demo.segment}`,
          };
        })();

    layer.on({
      mouseover: (e) => {
        setHoveredZIP(zipCode);
        e.target.setStyle({ weight: 2, color: '#374151', fillOpacity: 0.8 });
      },
      mouseout: (e) => {
        setHoveredZIP(null);
        if (selectedZIP?.zipCode !== zipCode) {
          e.target.setStyle(getFeatureStyle(feature));
        }
      },
      click: () => {
        setSelectedZIP({ zipCode, type, ...zipData });
      },
    });

    const labelPrefix = countryCode === 'US' ? 'ZIP' : countryConfig.geoUnit;
    const typeLabel = countryCode === 'US'
      ? type.charAt(0).toUpperCase() + type.slice(1)
      : (() => { const d = getUkPostcodeDemographic(zipCode); return `${d.segment}<br/><span style="font-size: 10px; color: #888;">${d.region}</span>`; })();

    layer.bindTooltip(
      `<div style="text-align: center;"><strong>${labelPrefix} ${zipCode}</strong><br/><span style="font-size: 11px; color: #666;">${typeLabel}</span></div>`,
      { permanent: false, direction: 'top', className: 'custom-tooltip' }
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
      </div>

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
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <GeoJSON data={geoJsonData} style={getFeatureStyle} onEachFeature={onEachFeature} />
            <SetMapBounds geoJsonData={geoJsonData} center={countryConfig.planningMapCenter} zoom={countryConfig.planningMapZoom} />
          </MapContainer>
        )}
      </div>

      {selectedZIP && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg animate-fadeIn border border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(selectedZIP.type), opacity: 0.8 }} />
                <div className="text-sm font-semibold text-blue-900">
                  {countryConfig.geoUnit} Region: {selectedZIP.zipCode}
                </div>
              </div>
              <div className="text-xs text-blue-800 space-y-1">
                <div><strong>Status:</strong> {selectedZIP.type.charAt(0).toUpperCase() + selectedZIP.type.slice(1)}</div>
                <div><strong>Impressions:</strong> {selectedZIP.impressions}</div>
                <div><strong>Measured Lift:</strong> {selectedZIP.lift}</div>
                <div className="text-blue-700 italic mt-2">{selectedZIP.description}</div>
              </div>
            </div>
            <button onClick={() => setSelectedZIP(null)} className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4">✕</button>
          </div>
        </div>
      )}

      <div className="mt-3 text-[11px] text-gray-400 text-center">Click any region for details</div>
    </div>
  );
};

export default USAMap;
