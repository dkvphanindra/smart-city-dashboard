import { useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (type, color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 14px;
    ">${type === 'traffic' ? '🚗' : type === 'pollution' ? '🌫️' : '🎉'}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const CityMap = ({ markers, routeData }) => {
  const MapUpdater = () => {
    const map = useMap();
    
    useEffect(() => {
      if (routeData) {
        const selectedRoute = routeData.normal;
        if (selectedRoute && selectedRoute.coordinates) {
          map.fitBounds(selectedRoute.coordinates, { padding: [50, 50] });
        }
      }
    }, [routeData, map]);
    
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card
        sx={{
          background: 'linear-gradient(135deg, #00d4ff20, #00d4ff10)',
          border: '1px solid #00d4ff40',
          height: '100%',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  bgcolor: '#00d4ff20',
                  borderRadius: '12px',
                  p: 1,
                  mr: 2,
                }}
              >
                <Typography sx={{ fontSize: 24 }}>🗺️</Typography>
              </Box>
              <div>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Live City Map
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Real-time events, traffic & pollution zones
                </Typography>
              </div>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label="🚗 Traffic" color="error" size="small" />
              <Chip label="🌫️ Pollution" color="warning" size="small" />
              <Chip label="🎉 Events" color="primary" size="small" />
            </Box>
          </Box>

          <Box
            sx={{
              height: 500,
              borderRadius: '16px',
              overflow: 'hidden',
              border: '2px solid #00d4ff40',
            }}
          >
            <MapContainer
              center={[40.7128, -74.0060]}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapUpdater />

              {/* Display Routes on Map */}
              {routeData && (
                <>
                  {/* Normal Route (Red) */}
                  <Polyline
                    positions={routeData.normal.coordinates}
                    pathOptions={{
                      color: '#ff4757',
                      weight: 5,
                      opacity: 0.8,
                    }}
                  />
                  
                  {/* Traffic-Free Route (Green) */}
                  <Polyline
                    positions={routeData.trafficFree.coordinates}
                    pathOptions={{
                      color: '#2ed573',
                      weight: 5,
                      opacity: 0.8,
                      dashArray: '10, 10',
                    }}
                  />
                  
                  {/* Start Marker */}
                  <Marker
                    position={[routeData.startPoint.lat, routeData.startPoint.lng]}
                    icon={createCustomIcon('start', '#00d4ff')}
                  >
                    <Popup>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        🚀 Start: {routeData.startPoint.name}
                      </Typography>
                    </Popup>
                  </Marker>
                  
                  {/* End Marker */}
                  <Marker
                    position={[routeData.endPoint.lat, routeData.endPoint.lng]}
                    icon={createCustomIcon('end', '#ff6b6b')}
                  >
                    <Popup>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        📍 Destination: {routeData.endPoint.name}
                      </Typography>
                    </Popup>
                  </Marker>
                </>
              )}

              {markers.map((marker) => {
                const color =
                  marker.type === 'traffic'
                    ? marker.severity === 'high'
                      ? '#ff4757'
                      : marker.severity === 'medium'
                      ? '#ffa502'
                      : '#2ed573'
                    : marker.type === 'pollution'
                    ? marker.status === 'Unhealthy'
                      ? '#ff4757'
                      : marker.status === 'Moderate'
                      ? '#ffa502'
                      : '#2ed573'
                    : '#00d4ff';

                return (
                  <Marker
                    key={marker.id}
                    position={[marker.lat, marker.lng]}
                    icon={createCustomIcon(marker.type, color)}
                  >
                    <Popup>
                      <Box sx={{ p: 1, minWidth: 200 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                          {marker.type === 'traffic'
                            ? '🚗 Traffic Point'
                            : marker.type === 'pollution'
                            ? '🌫️ Pollution Monitor'
                            : '🎉 Event Location'}
                        </Typography>
                        {marker.type === 'traffic' && (
                          <>
                            <Typography variant="body2">City: {marker.cityName || 'N/A'}</Typography>
                            <Typography variant="body2">Severity: {marker.severity}</Typography>
                            <Typography variant="body2">Congestion: {marker.value}%</Typography>
                          </>
                        )}
                        {marker.type === 'pollution' && (
                          <>
                            <Typography variant="body2">AQI: {marker.aqi}</Typography>
                            <Typography variant="body2">Status: {marker.status}</Typography>
                          </>
                        )}
                        {marker.type === 'event' && (
                          <>
                            <Typography variant="body2">Event: {marker.eventName}</Typography>
                            <Typography variant="body2">Attendees: {marker.attendees}</Typography>
                          </>
                        )}
                      </Box>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CityMap;
