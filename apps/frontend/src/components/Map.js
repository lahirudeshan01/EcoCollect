import React, { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Sample waste collection points for Colombo area municipal councils (accurate coordinates)
export const defaultWasteCollectionPoints = [
  // Colombo Municipal Council area
  { id: 1, position: [6.9271, 79.8612], name: "Colombo Fort", status: "completed", municipalCouncil: "Colombo Municipal Council" },
  // Dehiwala-Mount Lavinia Municipal Council area  
  { id: 2, position: [6.8459, 79.8631], name: "Dehiwala Junction", status: "completed", municipalCouncil: "Dehiwala-Mount Lavinia Municipal Council" },
  // Sri Jayawardenapura Kotte Municipal Council area
  { id: 3, position: [6.8906, 79.9015], name: "Sri Jayawardenapura", status: "completed", municipalCouncil: "Sri Jayawardenapura Kotte Municipal Council" },
  // Kaduwela Municipal Council area
  { id: 4, position: [6.9333, 79.9833], name: "Kaduwela Town", status: "completed", municipalCouncil: "Kaduwela Municipal Council" },
];

// Dummy collection points (bins) distributed across roads in each municipal area
// All coordinates verified to be on land/roads, not in the sea
export const dummyCollectionBins = [
  // Colombo Municipal Council bins (Central Colombo area - inland roads)
  { id: 'bin-1', position: [6.9271, 79.8612], name: "Bin 1 - Fort", municipalCouncil: "Colombo Municipal Council" },
  { id: 'bin-2', position: [6.9311, 79.8678], name: "Bin 2 - Pettah", municipalCouncil: "Colombo Municipal Council" },
  { id: 'bin-3', position: [6.9331, 79.8734], name: "Bin 3 - Maradana", municipalCouncil: "Colombo Municipal Council" },
  { id: 'bin-4', position: [6.9251, 79.8595], name: "Bin 4 - Slave Island", municipalCouncil: "Colombo Municipal Council" },
  { id: 'bin-5', position: [6.9191, 79.8565], name: "Bin 5 - Kollupitiya", municipalCouncil: "Colombo Municipal Council" },
  { id: 'bin-6', position: [6.9145, 79.8545], name: "Bin 6 - Bambalapitiya", municipalCouncil: "Colombo Municipal Council" },
  { id: 'bin-7', position: [6.9089, 79.8535], name: "Bin 7 - Wellawatte", municipalCouncil: "Colombo Municipal Council" },
  { id: 'bin-8', position: [6.9421, 79.8623], name: "Bin 8 - Grandpass", municipalCouncil: "Colombo Municipal Council" },
  { id: 'bin-9', position: [6.9195, 79.8698], name: "Bin 9 - Borella", municipalCouncil: "Colombo Municipal Council" },
  { id: 'bin-10', position: [6.9125, 79.8751], name: "Bin 10 - Dematagoda", municipalCouncil: "Colombo Municipal Council" },

  // Dehiwala-Mount Lavinia Municipal Council bins (inland roads only)
  { id: 'bin-11', position: [6.8459, 79.8671], name: "Bin 11 - Dehiwala", municipalCouncil: "Dehiwala-Mount Lavinia Municipal Council" },
  { id: 'bin-12', position: [6.8389, 79.8651], name: "Bin 12 - Mount Lavinia", municipalCouncil: "Dehiwala-Mount Lavinia Municipal Council" },
  { id: 'bin-13', position: [6.8529, 79.8711], name: "Bin 13 - Dehiwala East", municipalCouncil: "Dehiwala-Mount Lavinia Municipal Council" },
  { id: 'bin-14', position: [6.8319, 79.8631], name: "Bin 14 - Ratmalana", municipalCouncil: "Dehiwala-Mount Lavinia Municipal Council" },
  { id: 'bin-15', position: [6.8559, 79.8691], name: "Bin 15 - Attidiya", municipalCouncil: "Dehiwala-Mount Lavinia Municipal Council" },
  { id: 'bin-16', position: [6.8429, 79.8731], name: "Bin 16 - Nedimala", municipalCouncil: "Dehiwala-Mount Lavinia Municipal Council" },

  // Sri Jayawardenapura Kotte Municipal Council bins
  { id: 'bin-17', position: [6.8906, 79.9015], name: "Bin 17 - Kotte", municipalCouncil: "Sri Jayawardenapura Kotte Municipal Council" },
  { id: 'bin-18', position: [6.8976, 79.9085], name: "Bin 18 - Ethul Kotte", municipalCouncil: "Sri Jayawardenapura Kotte Municipal Council" },
  { id: 'bin-19', position: [6.8836, 79.8945], name: "Bin 19 - Rajagiriya", municipalCouncil: "Sri Jayawardenapura Kotte Municipal Council" },
  { id: 'bin-20', position: [6.8766, 79.8875], name: "Bin 20 - Nawala", municipalCouncil: "Sri Jayawardenapura Kotte Municipal Council" },
  { id: 'bin-21', position: [6.8846, 79.9125], name: "Bin 21 - Madiwela", municipalCouncil: "Sri Jayawardenapura Kotte Municipal Council" },
  { id: 'bin-22', position: [6.9046, 79.9155], name: "Bin 22 - Battaramulla", municipalCouncil: "Sri Jayawardenapura Kotte Municipal Council" },
  { id: 'bin-23', position: [6.8706, 79.8995], name: "Bin 23 - Nugegoda", municipalCouncil: "Sri Jayawardenapura Kotte Municipal Council" },

  // Kaduwela Municipal Council bins
  { id: 'bin-24', position: [6.9333, 79.9833], name: "Bin 24 - Kaduwela Town", municipalCouncil: "Kaduwela Municipal Council" },
  { id: 'bin-25', position: [6.9263, 79.9763], name: "Bin 25 - Athurugiriya", municipalCouncil: "Kaduwela Municipal Council" },
  { id: 'bin-26', position: [6.9193, 79.9693], name: "Bin 26 - Malabe", municipalCouncil: "Kaduwela Municipal Council" },
  { id: 'bin-27', position: [6.9463, 79.9763], name: "Bin 27 - Welikada", municipalCouncil: "Kaduwela Municipal Council" },
  { id: 'bin-28', position: [6.9393, 79.9693], name: "Bin 28 - Hunupitiya", municipalCouncil: "Kaduwela Municipal Council" },
  { id: 'bin-29', position: [6.9123, 79.9823], name: "Bin 29 - Hokandara", municipalCouncil: "Kaduwela Municipal Council" },
];

// Component to handle map clicks
const MapClickHandler = ({ onMapClick, isRouteCreationMode }) => {
  useMapEvents({
    click: (e) => {
      if (isRouteCreationMode) {
        onMapClick([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
};

// Sample optimized route
const optimizedRoute = [
  [6.9271, 79.8612],
  [6.9311, 79.8678],
  [6.9331, 79.8734],
  [6.9251, 79.8556],
  [6.9191, 79.8523],
  [6.9271, 79.8612], // Return to start
];

const Map = ({ 
  selectedArea = "Colombo Municipal Council", 
  isRouteCreationMode = false, 
  selectedPoints = [], 
  onPointClick, 
  generatedRoute = null,
  showDefaultPoints = true,
  onRouteGenerated = null 
}) => {
  const [roadRoutes, setRoadRoutes] = useState([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  
  // Center the map on Colombo, Sri Lanka (you can adjust this based on your location)
  const center = [6.9271, 79.8612];

  const handleMapClick = useCallback((position) => {
    if (onPointClick) {
      const newPoint = {
        id: Date.now(),
        position,
        name: `Point ${selectedPoints.length + 1}`,
        status: 'selected'
      };
      onPointClick(newPoint);
    }
  }, [onPointClick, selectedPoints.length]);

  // Function to get route between two points using OpenRouteService
  const getRouteFromAPI = async (start, end) => {
    try {
      console.log('Getting route from', start, 'to', end); // Debug log
      
      // Using OpenRouteService API (free tier)
      const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car/geojson`, {
        method: 'POST',
        headers: {
          'Authorization': '5b3ce3597851110001cf6248a9e13c1b6f104b9b8b25fdf78b70135d', // Free API key
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coordinates: [[start[1], start[0]], [end[1], end[0]]], // Note: OpenRouteService uses [lng, lat]
          format: 'geojson'
        })
      });

      if (!response.ok) {
        console.error('Routing API response not ok:', response.status, response.statusText);
        throw new Error(`Routing API failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      if (data.features && data.features.length > 0) {
        // Convert coordinates back to [lat, lng] format for Leaflet
        const coordinates = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        console.log('Generated road coordinates:', coordinates.length, 'points'); // Debug log
        return coordinates;
      }
    } catch (error) {
      console.warn('Routing API failed, using straight line:', error);
      // Fallback to straight line if API fails
      return [start, end];
    }
    return [start, end];
  };

  // Function to generate road-based route for multiple points
  const generateRoadRoute = async (points) => {
    if (points.length < 2) return [];
    
    console.log('Starting road route generation for', points.length, 'points'); // Debug log
    setIsLoadingRoute(true);
    const routeSegments = [];
    
    try {
      // Get route between each consecutive pair of points
      for (let i = 0; i < points.length - 1; i++) {
        const start = points[i].position;
        const end = points[i + 1].position;
        
        console.log(`Getting segment ${i + 1}/${points.length - 1}: from`, start, 'to', end); // Debug log
        
        const segment = await getRouteFromAPI(start, end);
        
        // Add the segment, removing the first point if it's not the first segment
        // to avoid duplicating waypoints
        if (i === 0) {
          routeSegments.push(...segment);
        } else {
          routeSegments.push(...segment.slice(1));
        }
        
        // Small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      console.log('Road route generated with', routeSegments.length, 'total points'); // Debug log
    } catch (error) {
      console.error('Error generating road route:', error);
      // Fallback to straight lines between points
      return points.map(p => p.position);
    } finally {
      setIsLoadingRoute(false);
    }
    
    return routeSegments;
  };

  // Generate road route when points change (automatically)
  useEffect(() => {
    if (selectedPoints.length >= 2 && isRouteCreationMode) {
      // Find the municipal council point for the selected area
      const municipalPoint = defaultWasteCollectionPoints.find(
        point => point.municipalCouncil === selectedArea
      );
      
      if (municipalPoint) {
        // Create route starting and ending at municipal point
        const startEndPoint = { 
          id: 'municipal-start', 
          position: municipalPoint.position, 
          name: `${municipalPoint.name} (Depot)` 
        };
        
        // Create full route: depot -> collection points -> depot
        const fullRoutePoints = [startEndPoint, ...selectedPoints, startEndPoint];
        
        generateRoadRoute(fullRoutePoints).then(roadRoute => {
          setRoadRoutes([roadRoute]);
          if (onRouteGenerated) {
            onRouteGenerated(roadRoute);
          }
        });
      } else {
        // Fallback to original behavior
        generateRoadRoute(selectedPoints).then(roadRoute => {
          setRoadRoutes([roadRoute]);
          if (onRouteGenerated) {
            onRouteGenerated(roadRoute);
          }
        });
      }
    } else if (generatedRoute && selectedPoints.length >= 2 && !isRouteCreationMode) {
      // Show existing route when viewing
      generateRoadRoute(selectedPoints).then(roadRoute => {
        setRoadRoutes([roadRoute]);
        if (onRouteGenerated) {
          onRouteGenerated(roadRoute);
        }
      });
    } else {
      setRoadRoutes([]);
    }
  }, [selectedPoints, isRouteCreationMode, generatedRoute, onRouteGenerated, selectedArea]);

  const getMarkerColor = (status, municipalCouncil = null) => {
    // If in route creation mode, use original logic
    if (isRouteCreationMode) {
      switch (status) {
        case 'completed': return '#10B981';
        case 'selected': return '#3B82F6';
        default: return '#F59E0B';
      }
    }
    
    // For default points, check if this point matches the selected area
    if (municipalCouncil && selectedArea) {
      if (municipalCouncil === selectedArea) {
        return '#EF4444'; // Red for selected municipal council
      } else {
        return '#6B7280'; // Gray for non-selected municipal councils
      }
    }
    
    // Fallback to original logic
    switch (status) {
      case 'completed': return '#10B981';
      case 'selected': return '#3B82F6';
      default: return '#F59E0B';
    }
  };

  const createCustomIcon = (status, municipalCouncil = null) => {
    const color = getMarkerColor(status, municipalCouncil);
    const size = status === 'selected' ? 24 : 20;
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
    });
  };

  return (
    <div className="h-full rounded-lg overflow-hidden relative">
      {isRouteCreationMode && (() => {
        const municipalPoint = defaultWasteCollectionPoints.find(
          point => point.municipalCouncil === selectedArea
        );
        
        return (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md z-1000">
            <p className="text-sm font-medium">Click on map to add collection points</p>
            <p className="text-xs opacity-90">Route will start/end at {municipalPoint?.name || 'depot'}</p>
          </div>
        );
      })()}
      
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler 
          onMapClick={handleMapClick} 
          isRouteCreationMode={isRouteCreationMode} 
        />
        
        {/* Render default waste collection points */}
        {showDefaultPoints && defaultWasteCollectionPoints.map((point) => (
          <Marker
            key={point.id}
            position={point.position}
            icon={createCustomIcon(point.status, point.municipalCouncil)}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold">{point.name}</h3>
                <p className="text-xs text-gray-600 mb-1">{point.municipalCouncil}</p>
                <p className={`text-sm ${
                  point.municipalCouncil === selectedArea 
                    ? 'text-red-600 font-semibold' 
                    : 'text-gray-500'
                }`}>
                  {point.municipalCouncil === selectedArea ? 'Selected Area' : 'Available'}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render dummy collection bins as small dots */}
        {showDefaultPoints && !isRouteCreationMode && dummyCollectionBins
          .filter(bin => bin.municipalCouncil === selectedArea)
          .map((bin) => {
            const binIcon = L.divIcon({
              className: 'custom-bin-icon',
              html: `<div style="background-color: #10B981; width: 8px; height: 8px; border-radius: 50%; border: 1px solid white; box-shadow: 0 1px 2px rgba(0,0,0,0.3);"></div>`,
              iconSize: [8, 8],
              iconAnchor: [4, 4],
            });
            
            return (
              <Marker
                key={bin.id}
                position={bin.position}
                icon={binIcon}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold text-sm">🗑️ {bin.name}</h3>
                    <p className="text-xs text-gray-600">Collection Point</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Render depot marker when in route creation mode */}
        {isRouteCreationMode && (() => {
          const municipalPoint = defaultWasteCollectionPoints.find(
            point => point.municipalCouncil === selectedArea
          );
          
          if (municipalPoint) {
            const depotIcon = L.divIcon({
              className: 'custom-div-icon',
              html: `<div style="background-color: #059669; width: 28px; height: 28px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4); position: relative;">
                       <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 12px; font-weight: bold;">D</div>
                     </div>`,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            });
            
            return (
              <Marker
                key="depot-marker"
                position={municipalPoint.position}
                icon={depotIcon}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold text-green-700">🚛 Depot</h3>
                    <p className="text-sm font-medium">{municipalPoint.name}</p>
                    <p className="text-xs text-gray-600">Start & End Point</p>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })()}

        {/* Render selected points for route creation */}
        {selectedPoints.map((point, index) => (
          <Marker
            key={point.id}
            position={point.position}
            icon={createCustomIcon(point.status)}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold">{point.name}</h3>
                <p className="text-sm text-blue-600">
                  Order: {index + 1}
                </p>
                <button 
                  className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                  onClick={() => onPointClick && onPointClick(point, 'remove')}
                >
                  Remove
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render generated route using road routing */}
        {roadRoutes.map((route, index) => (
          <Polyline
            key={`road-route-${index}`}
            positions={route}
            pathOptions={{
              color: '#059669',
              weight: 5,
              opacity: 0.8,
            }}
          />
        ))}

        {/* Show loading indicator for route generation */}
        {isLoadingRoute && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-lg z-1000">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
              <span className="text-sm">Generating road route...</span>
            </div>
          </div>
        )}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md z-1000">
        <h4 className="text-sm font-semibold mb-2">Legend</h4>
        <div className="space-y-1">
          {showDefaultPoints && !isRouteCreationMode && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs">Selected Municipal Council</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-xs">Other Municipal Councils</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs">Collection Bins</span>
              </div>
            </>
          )}
          {showDefaultPoints && isRouteCreationMode && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs">Pending Collection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs">Completed</span>
              </div>
            </>
          )}
          {isRouteCreationMode && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">D</span>
                </div>
                <span className="text-xs">Depot (Start/End)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs">Collection Points</span>
              </div>
            </>
          )}
          {generatedRoute && roadRoutes.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-green-600"></div>
              <span className="text-xs">Road Route</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;