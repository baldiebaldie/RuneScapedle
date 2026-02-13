import { useState } from 'react';
import { MapContainer, TileLayer, Rectangle, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  mapRegions,
  getSpecialLocationsByCategory,
  getTemperatureColor,
  getCategoryDisplayName,
  TEMPERATURE,
  REGION_CATEGORIES
} from '../../data/mapRegions';
import './OSRSMap.css';

// OSRS map bounds for regions (in Leaflet coordinates for CRS.Simple)
// Format: [[south, west], [north, east]] or [[minLat, minLng], [maxLat, maxLng]]
// Coordinates calibrated to overworld-only tileset
// Smaller/specific regions listed first so they take click priority over larger ones
const regionBounds = {
  // Small specific regions first
  tutorial_island: [[-55, 100], [-50, 107]],
  weiss: [[-16, 87], [-10, 94]],

  // Kourend sub-regions (northwest of main continent)
  lovakengj: [[-23, 14], [-15, 27]],
  arceuus: [[-23, 27], [-15, 42]],
  shayzien: [[-33, 18], [-23, 30]],
  hosidius: [[-35, 28], [-24, 40]],
  piscarilius: [[-25, 38], [-18, 48]],

  // Small mainland regions
  port_sarim: [[-50, 92], [-45, 100]],
  draynor: [[-50, 96], [-41, 103]],
  al_kharid: [[-50, 109], [-42, 116]],
  lumbridge: [[-50, 103], [-42, 109]],

  // Main cities
  falador: [[-45, 88], [-36, 96]],
  varrock: [[-42, 98], [-32, 112]],

  // Western areas
  camelot: [[-40, 68], [-32, 90]],
  ardougne: [[-48, 68], [-40, 82]],
  yanille: [[-57, 66], [-48, 80]],
  tirannwn: [[-55, 50], [-34, 68]],

  // Northern areas
  troll_country: [[-32, 84], [-24, 92]],
  fremennik: [[-30, 58], [-14, 78]],

  // Southern areas
  ape_atoll: [[-73, 82], [-66, 94]],
  karamja: [[-64, 80], [-48, 96]],

  // Large regions last (lowest click priority)
  morytania: [[-50, 114], [-30, 135]],
  desert: [[-75, 100], [-50, 120]],
  wilderness: [[-32, 90], [-8, 118]]
};

// Custom click handler component
function MapClickHandler({ onRegionClick, disabled, guessHistory }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;

      // DEBUG: Log click coordinates to help fine-tune region bounds
      // Remove this console.log once regions are verified
      console.log(`[DEBUG] Map click: lat=${lat.toFixed(4)}, lng=${lng.toFixed(4)}`);

      if (disabled) return;

      // Check which region was clicked
      for (const [regionId, bounds] of Object.entries(regionBounds)) {
        const [[minLat, minLng], [maxLat, maxLng]] = bounds;
        if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
          console.log(`[DEBUG] Matched region: ${regionId}`);
          // Check if already guessed
          if (!guessHistory.some(g => g.regionId === regionId)) {
            onRegionClick(regionId);
          }
          return;
        }
      }
      console.log('[DEBUG] No region matched at this location');
    }
  });
  return null;
}

function OSRSMap({ onRegionSelect, guessHistory, disabled }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const specialCategories = getSpecialLocationsByCategory();

  // Get the temperature status for a region based on guess history
  const getRegionStatus = (regionId) => {
    const guess = guessHistory.find(g => g.regionId === regionId);
    if (!guess) return null;
    return guess.temperature;
  };

  const handleRegionClick = (regionId) => {
    if (disabled) return;
    if (guessHistory.some(g => g.regionId === regionId)) return;
    onRegionSelect(regionId);
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const getLastGuessCategoryMatch = () => {
    if (guessHistory.length === 0) return null;
    const lastGuess = guessHistory[guessHistory.length - 1];
    return lastGuess.categoryMatch ? lastGuess.category : null;
  };

  const highlightedCategory = getLastGuessCategoryMatch();

  // Get rectangle style based on status
  const getRegionStyle = (regionId) => {
    const status = getRegionStatus(regionId);
    const isHovered = hoveredRegion === regionId;

    const baseStyle = {
      weight: 2,
      fillOpacity: 0.15,
      opacity: 0.5
    };

    if (status === TEMPERATURE.CORRECT) {
      return { ...baseStyle, color: '#4caf50', fillColor: '#4caf50', fillOpacity: 0.5, weight: 3 };
    }
    if (status === TEMPERATURE.HOT) {
      return { ...baseStyle, color: '#ff5722', fillColor: '#ff5722', fillOpacity: 0.4 };
    }
    if (status === TEMPERATURE.WARM) {
      return { ...baseStyle, color: '#ff9800', fillColor: '#ff9800', fillOpacity: 0.4 };
    }
    if (status === TEMPERATURE.COLD) {
      return { ...baseStyle, color: '#2196f3', fillColor: '#2196f3', fillOpacity: 0.4 };
    }
    if (status === TEMPERATURE.FROZEN) {
      return { ...baseStyle, color: '#9c27b0', fillColor: '#9c27b0', fillOpacity: 0.4 };
    }
    if (isHovered) {
      return { ...baseStyle, color: '#4caf50', fillColor: '#4caf50', fillOpacity: 0.25 };
    }
    // Default: nearly invisible until hovered
    return { ...baseStyle, color: 'transparent', fillColor: 'transparent', fillOpacity: 0 };
  };

  // Overworld-only OSRS map tiles
  const tileUrl = 'https://raw.githubusercontent.com/davsan56/OSRSGuesser/main/public/osrsmap/{z}/{x}/{y}.png';

  // Map bounds (prevents panning too far)
  const mapBounds = L.latLngBounds(
    L.latLng(-102, 0),
    L.latLng(0, 144)
  );

  return (
    <div className="osrs-map-wrapper">
      {/* Interactive Leaflet Map */}
      <div className="osrs-map-section">
        <div className="osrs-map-container">
          <MapContainer
            center={[-51, 72]}
            zoom={5}
            minZoom={3}
            maxZoom={7}
            crs={L.CRS.Simple}
            maxBounds={mapBounds}
            maxBoundsViscosity={1.0}
            style={{ height: '100%', width: '100%', background: '#0e0e0e' }}
            zoomControl={true}
            attributionControl={false}
          >
            <TileLayer
              url={tileUrl}
              minZoom={3}
              maxZoom={7}
              noWrap={true}
              bounds={mapBounds}
            />

            <MapClickHandler
              onRegionClick={handleRegionClick}
              disabled={disabled}
              guessHistory={guessHistory}
            />

            {/* Render clickable region rectangles */}
            {Object.entries(regionBounds).map(([regionId, bounds]) => {
              const region = mapRegions[regionId];
              if (!region) return null;

              const status = getRegionStatus(regionId);
              const isGuessed = status !== null;

              return (
                <Rectangle
                  key={regionId}
                  bounds={bounds}
                  pathOptions={getRegionStyle(regionId)}
                  eventHandlers={{
                    click: () => !disabled && !isGuessed && handleRegionClick(regionId),
                    mouseover: () => setHoveredRegion(regionId),
                    mouseout: () => setHoveredRegion(null)
                  }}
                >
                  {(hoveredRegion === regionId || isGuessed) && (
                    <Popup closeButton={false} autoClose={false}>
                      <span className="region-popup">{region.name}</span>
                    </Popup>
                  )}
                </Rectangle>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* Special Locations Side Panel */}
      <div className="special-locations-panel">
        <h4>Special Locations</h4>

        {Object.entries(specialCategories).map(([category, locations]) => {
          if (locations.length === 0) return null;

          const isExpanded = expandedCategory === category;
          const categoryKey = category.toUpperCase();
          const isHighlighted = highlightedCategory === REGION_CATEGORIES[categoryKey];

          return (
            <div
              key={category}
              className={`special-category ${isHighlighted ? 'highlighted' : ''}`}
            >
              <button
                className="category-header"
                onClick={() => toggleCategory(category)}
              >
                <span>{getCategoryDisplayName(REGION_CATEGORIES[categoryKey])}</span>
                <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
              </button>

              {isExpanded && (
                <div className="category-locations">
                  {locations.map(loc => {
                    const status = getRegionStatus(loc.id);
                    const isGuessed = status !== null;
                    const isCorrect = status === TEMPERATURE.CORRECT;

                    return (
                      <button
                        key={loc.id}
                        className={`special-location-btn ${isGuessed ? `guessed ${status}` : ''} ${isCorrect ? 'correct' : ''} ${disabled ? 'disabled' : ''}`}
                        style={{
                          backgroundColor: isGuessed ? getTemperatureColor(status) : undefined
                        }}
                        onClick={() => handleRegionClick(loc.id)}
                        disabled={disabled || isGuessed}
                      >
                        {loc.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Guess History */}
      {guessHistory.length > 0 && (
        <div className="guess-history">
          <h4>Your Guesses:</h4>
          {guessHistory.map((guess, idx) => (
            <div
              key={idx}
              className={`guess-row ${guess.temperature}`}
              style={{ borderLeftColor: getTemperatureColor(guess.temperature) }}
            >
              <span className="guess-region">{guess.regionName}</span>
              <span
                className="guess-temp"
                style={{ color: getTemperatureColor(guess.temperature) }}
              >
                {guess.message}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Temperature Legend */}
      <div className="temperature-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: getTemperatureColor(TEMPERATURE.HOT) }}></span>
          <span>Hot (Very close!)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: getTemperatureColor(TEMPERATURE.WARM) }}></span>
          <span>Warm (Right category)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: getTemperatureColor(TEMPERATURE.COLD) }}></span>
          <span>Cold (Wrong category)</span>
        </div>
      </div>
    </div>
  );
}

export default OSRSMap;
