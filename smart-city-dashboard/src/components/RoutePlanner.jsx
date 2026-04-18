import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  Divider,
  Autocomplete,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { indiaCities } from '../data/indiaData';
import { calculateRoute, calculateTrafficFreeRoute, getTrafficLevel } from '../services/routeService';

const RoutePlanner = ({ stateCenter, onRouteCalculated }) => {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [routes, setRoutes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeRoute, setActiveRoute] = useState('fastest');

  const cityOptions = Object.entries(indiaCities).map(([name, data]) => ({
    name,
    ...data,
  }));

  const handlePlanRoute = async () => {
    if (!startPoint || !endPoint) return;

    setLoading(true);

    try {
      // Calculate both routes in parallel
      const [normalRoute, trafficFreeRoute] = await Promise.all([
        calculateRoute(startPoint.lat, startPoint.lng, endPoint.lat, endPoint.lng, false),
        calculateTrafficFreeRoute(startPoint.lat, startPoint.lng, endPoint.lat, endPoint.lng),
      ]);

      const routeData = {
        normal: normalRoute,
        trafficFree: trafficFreeRoute,
        startPoint: { lat: startPoint.lat, lng: startPoint.lng, name: startPoint.name },
        endPoint: { lat: endPoint.lat, lng: endPoint.lng, name: endPoint.name },
      };

      setRoutes(routeData);
      setActiveRoute(
        normalRoute.duration < trafficFreeRoute.duration ? 'fastest' : 'trafficFree'
      );

      // Send route data to parent for map display
      if (onRouteCalculated) {
        onRouteCalculated(routeData);
      }
    } catch (error) {
      console.error('Route calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedRoute = routes?.[activeRoute === 'fastest' ? 'normal' : 'trafficFree'];
  const trafficInfo = selectedRoute
    ? getTrafficLevel(selectedRoute.duration, parseFloat(selectedRoute.distance))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          background: 'linear-gradient(135deg, #00d4ff20, #5352ed20)',
          border: '2px solid #00d4ff40',
          mb: 3,
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <DirectionsCarIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <div>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                🗺️ Smart Route Planner
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Find the fastest route with real-time traffic avoidance
              </Typography>
            </div>
          </Box>

          {/* Input Fields */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Autocomplete
              fullWidth
              options={cityOptions}
              getOptionLabel={(option) => option.name}
              value={startPoint}
              onChange={(event, newValue) => setStartPoint(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Starting Point"
                  size="small"
                  placeholder="Select city"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <MyLocationIcon sx={{ mr: 1, color: 'primary.main' }} />,
                  }}
                />
              )}
            />
            <Autocomplete
              fullWidth
              options={cityOptions}
              getOptionLabel={(option) => option.name}
              value={endPoint}
              onChange={(event, newValue) => setEndPoint(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Destination"
                  size="small"
                  placeholder="Select city"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'secondary.main' }} />,
                  }}
                />
              )}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handlePlanRoute}
            disabled={loading || !startPoint || !endPoint}
            sx={{
              mb: 2,
              py: 1.5,
              background: 'linear-gradient(135deg, #00d4ff, #5352ed)',
              fontWeight: 700,
            }}
          >
            {loading ? '⏳ Calculating Routes...' : '🚀 Find Best Routes'}
          </Button>

          {/* Route Results */}
          <AnimatePresence>
            {routes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Divider sx={{ my: 2 }} />

                {/* Route Comparison */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                  {/* Normal Route */}
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      p: 2,
                      bgcolor: activeRoute === 'fastest' ? 'primary.main' : 'background.paper',
                      border: '2px solid',
                      borderColor: activeRoute === 'fastest' ? 'primary.main' : 'grey.300',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      color: activeRoute === 'fastest' ? 'white' : 'text.primary',
                    }}
                    onClick={() => setActiveRoute('fastest')}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      🔴 Via Traffic
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                      {routes.normal.duration} min
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {routes.normal.distance} km
                    </Typography>
                    <Chip
                      label={getTrafficLevel(routes.normal.duration, parseFloat(routes.normal.distance)).level}
                      size="small"
                      sx={{
                        mt: 1,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                      }}
                    />
                  </Box>

                  {/* Traffic-Free Route */}
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      p: 2,
                      bgcolor: activeRoute === 'trafficFree' ? 'success.main' : 'background.paper',
                      border: '2px solid',
                      borderColor: activeRoute === 'trafficFree' ? 'success.main' : 'grey.300',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      color: activeRoute === 'trafficFree' ? 'white' : 'text.primary',
                    }}
                    onClick={() => setActiveRoute('trafficFree')}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      🟢 Traffic-Free
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                      {routes.trafficFree.duration} min
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {routes.trafficFree.distance} km
                    </Typography>
                    <Chip
                      label={
                        routes.trafficFree.duration < routes.normal.duration
                          ? '⚡ FASTER'
                          : '🛣️ LESS TRAFFIC'
                      }
                      size="small"
                      sx={{
                        mt: 1,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                      }}
                    />
                  </Box>
                </Box>

                {/* Route Summary */}
                {selectedRoute && trafficInfo && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                      🧭 Route: {routes.startPoint.name} → {routes.endPoint.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                      <Chip
                        label={`${trafficInfo.icon} Traffic: ${trafficInfo.level}`}
                        sx={{ bgcolor: `${trafficInfo.color}20`, color: trafficInfo.color, fontWeight: 600 }}
                      />
                      <Chip
                        label={`⏱️ ${selectedRoute.duration} minutes`}
                        sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}
                      />
                      <Chip
                        label={`📍 ${selectedRoute.distance} km`}
                        sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 600 }}
                      />
                    </Box>

                    {/* Turn-by-turn directions */}
                    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: '12px' }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
                        📋 Directions
                      </Typography>
                      {selectedRoute.steps.slice(0, 5).map((step, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            gap: 2,
                            mb: 1.5,
                            p: 1.5,
                            bgcolor: 'background.default',
                            borderRadius: '8px',
                          }}
                        >
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '14px',
                              flexShrink: 0,
                            }}
                          >
                            {index + 1}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {step.instruction}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {step.distance} km • {step.duration} min
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RoutePlanner;
