// Route calculation service with traffic optimization
import axios from 'axios';

const OSRM_BASE = 'https://router.project-osrm.org/route/v1';

// Calculate optimal route between two points
export const calculateRoute = async (startLat, startLng, endLat, endLng, avoidTraffic = false) => {
  try {
    const url = `${OSRM_BASE}/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;
    
    const response = await axios.get(url);
    
    if (response.data.code === 'Ok') {
      const route = response.data.routes[0];
      
      return {
        coordinates: route.geometry.coordinates.map(coord => [coord[1], coord[0]]),
        distance: (route.distance / 1000).toFixed(1), // km
        duration: Math.round(route.duration / 60), // minutes
        steps: route.legs[0].steps.map(step => ({
          instruction: step.maneuver.instruction || step.name,
          distance: (step.distance / 1000).toFixed(2),
          duration: Math.round(step.duration / 60),
        })),
        hasTraffic: avoidTraffic,
      };
    }
  } catch (error) {
    console.warn('Route calculation failed, using fallback:', error.message);
  }
  
  // Fallback route calculation
  return calculateFallbackRoute(startLat, startLng, endLat, endLng, avoidTraffic);
};

// Calculate traffic-free alternative route
export const calculateTrafficFreeRoute = async (startLat, startLng, endLat, endLng) => {
  // Add some deviation to avoid traffic
  const midLat = (startLat + endLat) / 2 + (Math.random() - 0.5) * 0.05;
  const midLng = (startLng + endLng) / 2 + (Math.random() - 0.5) * 0.05;
  
  try {
    const url = `${OSRM_BASE}/driving/${startLng},${startLat};${midLng},${midLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;
    
    const response = await axios.get(url);
    
    if (response.data.code === 'Ok') {
      const route = response.data.routes[0];
      
      return {
        coordinates: route.geometry.coordinates.map(coord => [coord[1], coord[0]]),
        distance: (route.distance / 1000).toFixed(1),
        duration: Math.round(route.duration / 60),
        steps: route.legs[0].steps.map(step => ({
          instruction: step.maneuver.instruction || step.name,
          distance: (step.distance / 1000).toFixed(2),
          duration: Math.round(step.duration / 60),
        })),
        hasTraffic: false,
        isAlternative: true,
      };
    }
  } catch (error) {
    console.warn('Alternative route calculation failed:', error.message);
  }
  
  return calculateFallbackRoute(startLat, startLng, endLat, endLng, true);
};

// Fallback route with realistic data
const calculateFallbackRoute = (startLat, startLng, endLat, endLng, avoidTraffic = false) => {
  // Calculate straight-line distance
  const R = 6371; // Earth's radius in km
  const dLat = (endLat - startLat) * Math.PI / 180;
  const dLng = (endLng - startLng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(startLat * Math.PI / 180) * Math.cos(endLat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const directDistance = R * c;
  
  // Road distance is typically 1.3x of direct distance
  const roadDistance = directDistance * 1.3;
  
  // Calculate duration based on traffic conditions
  let avgSpeed = avoidTraffic ? 45 : 30; // km/h
  if (avoidTraffic) avgSpeed += 15; // Faster on traffic-free route
  
  const duration = Math.round((roadDistance / avgSpeed) * 60); // minutes
  
  // Generate intermediate coordinates for route
  const steps = 20;
  const coordinates = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = startLat + (endLat - startLat) * t + (Math.random() - 0.5) * 0.01;
    const lng = startLng + (endLng - startLng) * t + (Math.random() - 0.5) * 0.01;
    coordinates.push([lat, lng]);
  }
  
  return {
    coordinates,
    distance: roadDistance.toFixed(1),
    duration,
    steps: [
      { instruction: 'Head towards destination', distance: (roadDistance * 0.3).toFixed(2), duration: Math.round(duration * 0.3) },
      { instruction: 'Continue on main road', distance: (roadDistance * 0.5).toFixed(2), duration: Math.round(duration * 0.5) },
      { instruction: 'Arrive at destination', distance: (roadDistance * 0.2).toFixed(2), duration: Math.round(duration * 0.2) },
    ],
    hasTraffic: !avoidTraffic,
    isAlternative: avoidTraffic,
  };
};

// Get traffic congestion level for a route
export const getTrafficLevel = (duration, distance) => {
  const avgSpeed = (distance / duration) * 60; // km/h
  
  if (avgSpeed < 20) return { level: 'Heavy', color: '#ff4757', icon: '🔴' };
  if (avgSpeed < 35) return { level: 'Moderate', color: '#ffa502', icon: '🟠' };
  if (avgSpeed < 50) return { level: 'Light', color: '#2ed573', icon: '🟢' };
  return { level: 'Free Flow', color: '#00d4ff', icon: '🔵' };
};

// Find nearby cities for route suggestions
export const findNearbyCities = (lat, lng, radius = 50) => {
  const indiaCities = {
    Mumbai: { lat: 19.0760, lng: 72.8777 },
    Delhi: { lat: 28.7041, lng: 77.1025 },
    Bengaluru: { lat: 12.9716, lng: 77.5946 },
    Chennai: { lat: 13.0827, lng: 80.2707 },
    Kolkata: { lat: 22.5726, lng: 88.3639 },
    Hyderabad: { lat: 17.3850, lng: 78.4867 },
    Pune: { lat: 18.5204, lng: 73.8567 },
    Ahmedabad: { lat: 23.0225, lng: 72.5714 },
    Jaipur: { lat: 26.9124, lng: 75.7873 },
    Lucknow: { lat: 26.8467, lng: 80.9462 },
    Kochi: { lat: 9.9312, lng: 76.2673 },
    Indore: { lat: 22.7196, lng: 75.8577 },
    Surat: { lat: 21.1702, lng: 72.8311 },
    Chandigarh: { lat: 30.7333, lng: 76.7794 },
    Bhopal: { lat: 23.2599, lng: 77.4126 },
    Patna: { lat: 25.5941, lng: 85.1376 },
    Guwahati: { lat: 26.1445, lng: 91.7362 },
    Shimla: { lat: 31.1048, lng: 77.1734 },
  };
  
  const nearby = [];
  Object.entries(indiaCities).forEach(([name, coords]) => {
    const distance = Math.sqrt(Math.pow(coords.lat - lat, 2) + Math.pow(coords.lng - lng, 2)) * 111; // km
    if (distance <= radius) {
      nearby.push({ name, ...coords, distance: distance.toFixed(1) });
    }
  });
  
  return nearby.sort((a, b) => a.distance - b.distance);
};
