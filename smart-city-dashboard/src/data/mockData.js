// Mock Data Generator for Smart City Dashboard

export const generateTrafficData = () => {
  const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
  return hours.map(hour => ({
    time: hour,
    vehicles: Math.floor(Math.random() * 5000) + 2000,
    congestion: Math.floor(Math.random() * 100),
    avgSpeed: Math.floor(Math.random() * 40) + 20
  }));
};

export const generatePollutionData = () => {
  const pollutants = ['PM2.5', 'PM10', 'CO2', 'NO2', 'O3'];
  return pollutants.map(pollutant => ({
    name: pollutant,
    value: Math.floor(Math.random() * 150) + 20,
    status: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Moderate' : 'Good'
  }));
};

export const generateEnergyData = () => {
  const sources = ['Solar', 'Wind', 'Grid', 'Battery'];
  return sources.map(source => ({
    name: source,
    consumption: Math.floor(Math.random() * 1000) + 500,
    percentage: Math.floor(Math.random() * 100)
  }));
};

export const generateEvents = () => {
  const eventTypes = ['Concert', 'Sports', 'Festival', 'Conference', 'Exhibition'];
  const locations = [
    { name: 'City Center', lat: 40.7128, lng: -74.0060 },
    { name: 'Sports Arena', lat: 40.7580, lng: -73.9855 },
    { name: 'Convention Hall', lat: 40.7484, lng: -73.9857 },
    { name: 'Park Avenue', lat: 40.7614, lng: -73.9776 },
    { name: 'Tech Hub', lat: 40.7061, lng: -74.0087 }
  ];
  
  return eventTypes.map((type, index) => ({
    id: index + 1,
    type,
    location: locations[index],
    attendees: Math.floor(Math.random() * 5000) + 500,
    startTime: `${Math.floor(Math.random() * 12) + 8}:00`,
    status: Math.random() > 0.5 ? 'Ongoing' : 'Upcoming'
  }));
};

export const generateAlerts = () => {
  const alertTypes = [
    { type: 'Traffic Jam', severity: 'high', message: 'Major congestion on Highway 7' },
    { type: 'Air Quality', severity: 'medium', message: 'PM2.5 levels exceeding safe limits' },
    { type: 'Power Outage', severity: 'high', message: 'Scheduled maintenance in Zone 3' },
    { type: 'Weather', severity: 'low', message: 'Heavy rain expected in 2 hours' },
    { type: 'Event', severity: 'low', message: 'Large gathering at City Center' }
  ];
  
  return alertTypes.map((alert, index) => ({
    id: index + 1,
    ...alert,
    timestamp: new Date(Date.now() - index * 300000).toISOString()
  }));
};

export const generateKPIMetrics = () => ({
  totalPopulation: '2.4M',
  activeVehicles: Math.floor(Math.random() * 50000) + 100000,
  airQualityIndex: Math.floor(Math.random() * 150) + 30,
  energyConsumption: `${Math.floor(Math.random() * 500) + 800} MW`,
  wasteCollected: `${Math.floor(Math.random() * 50) + 100} tons`,
  publicTransportUsage: `${Math.floor(Math.random() * 40) + 60}%`,
  emergencyResponse: `${Math.floor(Math.random() * 3) + 5} min`,
  networkCoverage: `${Math.floor(Math.random() * 5) + 95}%`
});

export const generateMapMarkers = (state) => {
  const markers = [];
  const baseLat = state.center[0];
  const baseLng = state.center[1];
  
  // Traffic markers for major cities in the state
  state.cities.forEach((city, index) => {
    markers.push({
      id: `traffic-${index}`,
      type: 'traffic',
      lat: baseLat + (Math.random() - 0.5) * 0.5,
      lng: baseLng + (Math.random() - 0.5) * 0.5,
      severity: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
      value: Math.floor(Math.random() * 100),
      cityName: city,
    });
  });
  
  // Pollution monitoring stations
  for (let i = 0; i < 8; i++) {
    markers.push({
      id: `pollution-${i}`,
      type: 'pollution',
      lat: baseLat + (Math.random() - 0.5) * 0.4,
      lng: baseLng + (Math.random() - 0.5) * 0.4,
      aqi: Math.floor(Math.random() * 200) + 30,
      status: Math.random() > 0.6 ? 'Unhealthy' : Math.random() > 0.3 ? 'Moderate' : 'Good',
    });
  }
  
  // Event locations
  for (let i = 0; i < 5; i++) {
    markers.push({
      id: `event-${i}`,
      type: 'event',
      lat: baseLat + (Math.random() - 0.5) * 0.3,
      lng: baseLng + (Math.random() - 0.5) * 0.3,
      eventName: `${state.capital} Event ${i + 1}`,
      attendees: Math.floor(Math.random() * 3000) + 500,
    });
  }
  
  return markers;
};

// Live data simulator
export const simulateLiveData = (callback) => {
  const interval = setInterval(() => {
    callback({
      timestamp: new Date().toISOString(),
      traffic: generateTrafficData(),
      pollution: generatePollutionData(),
      energy: generateEnergyData(),
      kpi: generateKPIMetrics(),
      alerts: generateAlerts()
    });
  }, 3000);
  
  return () => clearInterval(interval);
};
