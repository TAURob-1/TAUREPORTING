import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

  // Build O(1) lookup maps from recommendation arrays
  const exposedMap = useMemo(() => {
    if (!recommendations) return new Map();
    return new Map(recommendations.exposed.map((z) => [z.zip3, z]));
  }, [recommendations]);

  const holdoutMap = useMemo(() => {
    if (!recommendations) return new Map();
    return new Map(recommendations.holdout.map((z) => [z.zip3, z]));
  }, [recommendations]);

  const notRecommendedMap = useMemo(() => {
    if (!recommendations) return new Map();
    return new Map(recommendations.notRecommended.map((z) => [z.zip3, z]));
  }, [recommendations]);

  const getZIPInfo = (zipCode) => {
    if (!recommendations) {
      return { type: 'none', score: 0 };
    }

    const exposed = exposedMap.get(zipCode);
    if (exposed) {
      return { type: 'exposed', score: exposed.score, data: exposed };
    }

    const holdout = holdoutMap.get(zipCode);
    if (holdout) {
      return { type: 'holdout', score: holdout.score, data: holdout };
    }

    const notRecommended = notRecommendedMap.get(zipCode);
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

    const ukDemo = countryCode === 'UK' ? getUkPostcodeDemographic(zipCode) : null;
    let tooltipContent;
    if (zipInfo.type === 'exposed') {
      const extra = ukDemo ? `<br/><span style="font-size: 10px; color: #888;">${ukDemo.region}</span>` : '';
      tooltipContent = `<div style="text-align: center;"><strong>${countryConfig.geoUnit} ${zipCode}</strong><br/><span style="font-size: 11px; color: #16a34a; font-weight: 600;">In target group: ${zipInfo.score}% affinity</span>${extra}</div>`;
    } else if (zipInfo.type === 'holdout') {
      const extra = ukDemo ? `<br/><span style="font-size: 10px; color: #888;">${ukDemo.region}</span>` : '';
      tooltipContent = `<div style="text-align: center;"><strong>${countryConfig.geoUnit} ${zipCode}</strong><br/><span style="font-size: 11px; color: #d97706; font-weight: 600;">Holdout: ${zipInfo.score}% affinity</span>${extra}</div>`;
    } else if (zipInfo.type === 'not-recommended') {
      const extra = ukDemo ? `<br/><span style="font-size: 10px; color: #888;">${ukDemo.region}</span>` : '';
      tooltipContent = `<div style="text-align: center;"><strong>${countryConfig.geoUnit} ${zipCode}</strong><br/><span style="font-size: 11px; color: #9ca3af;">Audience match: ${zipInfo.score}%</span>${extra}</div>`;
    } else if (ukDemo) {
      tooltipContent = `<div style="text-align: center;"><strong>${countryConfig.geoUnit} ${zipCode}</strong><br/><span style="font-size: 11px; color: #666;">${ukDemo.segment}</span><br/><span style="font-size: 10px; color: #888;">${ukDemo.region}</span></div>`;
    } else {
      tooltipContent = `<div style="text-align: center;"><strong>${countryConfig.geoUnit} ${zipCode}</strong><br/><span style="font-size: 11px; color: #999;">No data</span></div>`;
    }

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
          {selectedAudience && (
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
        ) : !recommendations ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Select an Audience</div>
              <div className="text-sm text-gray-600">
                Choose a target audience segment above to see<br />
                recommended {countryConfig.geoUnit.toLowerCase()} targeting
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

    </div>
  );
};

export default USAMapWithAudience;
