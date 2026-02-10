import { useState, useId } from 'react';
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
// These coordinates are scaled to match the tile system
const regionBounds = {
  tutorial_island: [[-80, 47], [-75, 53]],
  lumbridge: [[-79, 50], [-72, 58]],
  draynor: [[-78, 45], [-73, 50]],
  varrock: [[-72, 50], [-64, 62]],
  falador: [[-75, 42], [-68, 50]],
  port_sarim: [[-80, 43], [-75, 48]],
  karamja: [[-90, 40], [-78, 52]],
  al_kharid: [[-80, 52], [-72, 60]],
  desert: [[-100, 48], [-80, 68]],
  wilderness: [[-64, 44], [-40, 68]],
  ardougne: [[-78, 30], [-70, 42]],
  yanille: [[-82, 32], [-78, 38]],
  camelot: [[-74, 36], [-68, 46]],
  morytania: [[-78, 58], [-64, 78]],
  fremennik: [[-68, 30], [-58, 46]],
  tirannwn: [[-86, 18], [-70, 32]],
  troll_country: [[-68, 40], [-60, 50]],
  ape_atoll: [[-96, 36], [-90, 44]],
  hosidius: [[-74, 100], [-66, 114]],
  arceuus: [[-66, 96], [-58, 108]],
  lovakengj: [[-66, 88], [-56, 98]],
  shayzien: [[-74, 88], [-66, 100]],
  piscarilius: [[-66, 106], [-58, 116]],
  weiss: [[-50, 44], [-44, 52]]
};

// Custom click handler component
function MapClickHandler({ onRegionClick, disabled, guessHistory }) {
  useMapEvents({
    click: (e) => {
      if (disabled) return;

      const { lat, lng } = e.latlng;

      // Check which region was clicked
      for (const [regionId, bounds] of Object.entries(regionBounds)) {
        const [[minLat, minLng], [maxLat, maxLng]] = bounds;
        if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
          // Check if already guessed
          if (!guessHistory.some(g => g.regionId === regionId)) {
            onRegionClick(regionId);
          }
          return;
        }
      }
    }
  });
  return null;
}

function OSRSMap({ onRegionSelect, guessHistory, disabled }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const mapId = useId();

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

  // Explv's OSRS map tiles from GitHub
  const tileUrl = 'https://raw.githubusercontent.com/Explv/osrs_map_tiles/master/0/{z}/{x}/{y}.png';

  // Map bounds (prevents panning too far)
  const mapBounds = L.latLngBounds(
    L.latLng(-200, -50),
    L.latLng(50, 200)
  );

  return (
    <div className="osrs-map-wrapper">
      {/* Interactive Leaflet Map */}
      <div className="osrs-map-section">
        <div className="osrs-map-container">
          <MapContainer
            key={mapId}
            center={[-70, 55]}
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
              tms={true}
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
