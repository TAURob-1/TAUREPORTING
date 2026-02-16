import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

const USAMapWithAudience = ({ recommendations, selectedAudience }) => {
  const { countryCode, countryConfig } = usePlatform();
  const [selectedZIP, setSelectedZIP] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [hoveredZIP, setHoveredZIP] = useState(null);

  useEffect(() => {
    setGeoJsonData(null);
    setHoveredZIP(null);
    setSelectedZIP(null);

    fetch(countryConfig.planningGeoJson)
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data);
      })
      .catch((error) => {
        console.error(`Error loading ${countryConfig.geoUnit} map data:`, error);
      });
  }, [countryConfig]);

  const getZIPInfo = (zipCode) => {
    if (countryCode !== 'US' || !recommendations) {
      return { type: 'none', score: 0 };
    }

    const exposed = recommendations.exposed.find((z) => z.zip3 === zipCode);
    if (exposed) {
      return { type: 'exposed', score: exposed.score, data: exposed };
    }

    const holdout = recommendations.holdout.find((z) => z.zip3 === zipCode);
    if (holdout) {
      return { type: 'holdout', score: holdout.score, data: holdout };
    }

    const notRecommended = recommendations.notRecommended.find((z) => z.zip3 === zipCode);
    if (notRecommended) {
      return { type: 'not-recommended', score: notRecommended.score, data: notRecommended };
    }

    return { type: 'none', score: 0 };
  };

  const getFeatureStyle = (feature) => {
    const zipCode = getGeoCode(feature, countryCode);
    const zipInfo = getZIPInfo(zipCode);
    const isHovered = hoveredZIP === zipCode;
    const isSelected = selectedZIP?.zipCode === zipCode;

    if (countryCode === 'UK') {
      return {
        fillColor: isSelected ? '#2563eb' : '#e5e7eb',
        fillOpacity: isSelected ? 0.7 : isHovered ? 0.5 : 0.35,
        weight: isSelected ? 2 : isHovered ? 1.5 : 0.8,
        opacity: 1,
        color: isSelected ? '#1e40af' : '#9ca3af',
      };
    }

    let fillColor;
    let fillOpacity;

    switch (zipInfo.type) {
      case 'exposed': {
        const greenIntensity = Math.min(zipInfo.score / 100, 1);
        fillColor = `rgb(${Math.round(16 * (1 - greenIntensity) + 34 * greenIntensity)}, ${Math.round(185 * (1 - greenIntensity) + 197 * greenIntensity)}, ${Math.round(129 * (1 - greenIntensity) + 94 * greenIntensity)})`;
        fillOpacity = 0.7;
        break;
      }
      case 'holdout': {
        const yellowIntensity = Math.min(zipInfo.score / 100, 1);
        fillColor = `rgb(${Math.round(251 * yellowIntensity + 200 * (1 - yellowIntensity))}, ${Math.round(191 * yellowIntensity + 150 * (1 - yellowIntensity))}, ${Math.round(36 * yellowIntensity + 20 * (1 - yellowIntensity))})`;
        fillOpacity = 0.6;
        break;
      }
      case 'not-recommended':
        fillColor = '#d1d5db';
        fillOpacity = 0.4;
        break;
      default:
        fillColor = '#f3f4f6';
        fillOpacity = 0.3;
        break;
    }

    return {
      fillColor,
      fillOpacity: isSelected ? 0.9 : isHovered ? fillOpacity + 0.2 : fillOpacity,
      weight: isSelected ? 3 : isHovered ? 2 : 1,
      opacity: 1,
      color: isSelected ? '#1e40af' : isHovered ? '#374151' : '#ffffff',
    };
  };

  const onEachFeature = (feature, layer) => {
    const zipCode = getGeoCode(feature, countryCode);
    const zipInfo = getZIPInfo(zipCode);

    layer.on({
      mouseover: (e) => {
        setHoveredZIP(zipCode);
        e.target.setStyle({ weight: 2, color: '#374151', fillOpacity: 0.85 });
      },
      mouseout: (e) => {
        setHoveredZIP(null);
        if (selectedZIP?.zipCode !== zipCode) {
          e.target.setStyle(getFeatureStyle(feature));
        }
      },
      click: () => {
        setSelectedZIP({ zipCode, ...zipInfo });
      },
    });

    const tooltipContent = countryCode === 'UK'
      ? `<div style="text-align: center;"><strong>${countryConfig.geoUnit} ${zipCode}</strong></div>`
      : zipInfo.type !== 'none'
        ? `<div style="text-align: center;"><strong>ZIP ${zipCode}</strong><br/><span style="font-size: 11px; color: #666;">Score: ${zipInfo.score}</span></div>`
        : `<div style="text-align: center;"><strong>ZIP ${zipCode}</strong><br/><span style="font-size: 11px; color: #999;">No data</span></div>`;

    layer.bindTooltip(tooltipContent, {
      permanent: false,
      direction: 'top',
      className: 'custom-tooltip',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Geographic Targeting Map
          {selectedAudience && countryCode === 'US' && (
            <span className="ml-2 text-sm font-normal text-gray-500">{selectedAudience.name}</span>
          )}
        </h2>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '500px', position: 'relative' }}>
        {!geoJsonData ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="text-2xl mb-2">🗺️</div>
              <div className="text-gray-600">Loading {countryConfig.geoUnit} map...</div>
            </div>
          </div>
        ) : countryCode === 'US' && !recommendations ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Select an Audience</div>
              <div className="text-sm text-gray-600">
                Choose a target audience segment above to see<br />
                recommended ZIP code targeting
              </div>
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

      {countryCode === 'UK' && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          UK audience recommendations are pending UK demographic model ingest.
        </div>
      )}
    </div>
  );
};

export default USAMapWithAudience;
