import AOS from 'aos';
import 'aos/dist/aos.css';

import { useState, useEffect, useCallback } from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import {
  generateMapMarkers,
} from './data/mockData';
import { indiaStates } from './data/indiaData';
import {
  getAirQualityData,
  generateRealisticTraffic,
  generateRealisticEnergy,
  getCurrentHour,
} from './services/apiService';
import KPICards from './components/KPICards';
import TrafficChart from './components/TrafficChart';
import PollutionChart from './components/PollutionChart';
import EnergyChart from './components/EnergyChart';
import CityMap from './components/CityMap';
import AlertSystem from './components/AlertSystem';
import EventsList from './components/EventsList';
import StateSelector from './components/StateSelector';
import RoutePlanner from './components/RoutePlanner';
import LandingPage from './components/LandingPage';
import AuthPages from './components/AuthPages';
import { motion } from 'framer-motion';
import { getRealisticEvents } from './services/eventService';
import { getRealEvents, getRealAlerts } from './services/realTimeEventsService';

const Dashboard = () => {
  const { mode, toggleTheme } = useTheme();

  const [currentPage, setCurrentPage] = useState('landing'); // landing | login | register | dashboard
  const [user, setUser] = useState(null);
  const [selectedState, setSelectedState] = useState(indiaStates[0]); // Default: Maharashtra
  const [trafficData, setTrafficData] = useState([]);
  const [pollutionData, setPollutionData] = useState([]);
  const [energyData, setEnergyData] = useState([]);
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [kpiData, setKpiData] = useState({});
  const [mapMarkers, setMapMarkers] = useState([]);
  const [routeData, setRouteData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Init AOS + check if user is already logged in
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      offset: 60,
      debounceDelay: 50,
      throttleDelay: 99,
    });

    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setCurrentPage('dashboard');
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setCurrentPage('landing');
      }
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setRouteData(null);
    setCurrentPage('landing');
  };

  // Home button should refresh same dashboard (not go to landing)
  const handleGoHome = async () => {
    setRouteData(null); // clear route selection
    await loadStateData(selectedState); // refresh dashboard data
  };

  // Load real-time data for selected state
  const loadStateData = useCallback(async (state) => {
    setLoading(true);

    // Generate realistic traffic data for different times
    const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    const generatedTrafficData = hours.map((time, idx) => {
      const hour = idx * 4;
      const data = generateRealisticTraffic(state, hour);
      return { time, ...data };
    });
    setTrafficData(generatedTrafficData);

    // Get air quality data for capital city
    const aqiData = await getAirQualityData(state.capital);
    const generatedPollutionData = [
      { name: 'PM2.5', value: aqiData.pm25, status: aqiData.pm25 > 60 ? 'High' : aqiData.pm25 > 30 ? 'Moderate' : 'Good' },
      { name: 'PM10', value: aqiData.pm10, status: aqiData.pm10 > 100 ? 'High' : aqiData.pm10 > 50 ? 'Moderate' : 'Good' },
      { name: 'CO2', value: aqiData.co2, status: aqiData.co2 > 40 ? 'High' : aqiData.co2 > 25 ? 'Moderate' : 'Good' },
      { name: 'NO2', value: aqiData.no2, status: aqiData.no2 > 50 ? 'High' : aqiData.no2 > 30 ? 'Moderate' : 'Good' },
      { name: 'O3', value: aqiData.o3, status: aqiData.o3 > 45 ? 'High' : aqiData.o3 > 30 ? 'Moderate' : 'Good' },
    ];
    setPollutionData(generatedPollutionData);

    // Generate energy data
    const energyResult = generateRealisticEnergy(state);
    setEnergyData(energyResult.sources);

    // Default fallback events first
    setEvents(getRealisticEvents(state));

    // Update KPI metrics with state-specific data
    setKpiData({
      totalPopulation: state.population,
      activeVehicles: Math.floor(generatedTrafficData[generatedTrafficData.length - 1].vehicles * 2.5),
      airQualityIndex: aqiData.aqi,
      energyConsumption: `${energyResult.totalConsumption} MW`,
      wasteCollected: `${Math.floor(parseFloat(state.population) * 0.5)} tons`,
      publicTransportUsage: `${Math.floor(45 + Math.random() * 30)}%`,
      emergencyResponse: `${Math.floor(4 + Math.random() * 6)} min`,
      networkCoverage: `${Math.floor(85 + Math.random() * 14)}%`,
    });

    // Try real events first, fallback if needed
    try {
      const realEvents = await getRealEvents(state);
      setEvents(realEvents);
    } catch (error) {
      console.warn('Failed to fetch real events, using fallback:', error);
      setEvents(getRealisticEvents(state));
    }

    // Generate alerts
    try {
      const realAlerts = await getRealAlerts(state, aqiData, generatedTrafficData);
      setAlerts(realAlerts);
    } catch (error) {
      console.warn('Failed to fetch real alerts, using fallback:', error);
      const stateAlerts = generateAlertsForState(state, aqiData, generatedTrafficData);
      setAlerts(stateAlerts);
    }

    // Generate map markers
    setMapMarkers(generateMapMarkers(state));

    setLastUpdate(new Date());
    setLoading(false);
  }, []);

  // Silent data update (doesn't reset route or user interactions)
  const loadStateDataSilent = useCallback(async (state) => {
    const currentHour = getCurrentHour();

    const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    const generatedTrafficData = hours.map((time, idx) => {
      const hour = idx * 4;
      const data = generateRealisticTraffic(state, hour);
      return { time, ...data };
    });
    setTrafficData(generatedTrafficData);

    const aqiData = await getAirQualityData(state.capital);
    const generatedPollutionData = [
      { name: 'PM2.5', value: aqiData.pm25, status: aqiData.pm25 > 60 ? 'High' : aqiData.pm25 > 30 ? 'Moderate' : 'Good' },
      { name: 'PM10', value: aqiData.pm10, status: aqiData.pm10 > 100 ? 'High' : aqiData.pm10 > 50 ? 'Moderate' : 'Good' },
      { name: 'CO2', value: aqiData.co2, status: aqiData.co2 > 40 ? 'High' : aqiData.co2 > 25 ? 'Moderate' : 'Good' },
      { name: 'NO2', value: aqiData.no2, status: aqiData.no2 > 50 ? 'High' : aqiData.no2 > 30 ? 'Moderate' : 'Good' },
      { name: 'O3', value: aqiData.o3, status: aqiData.o3 > 45 ? 'High' : aqiData.o3 > 30 ? 'Moderate' : 'Good' },
    ];
    setPollutionData(generatedPollutionData);

    const energyResult = generateRealisticEnergy(state);
    setEnergyData(energyResult.sources);

    setKpiData({
      totalPopulation: state.population,
      activeVehicles: Math.floor(generatedTrafficData[generatedTrafficData.length - 1].vehicles * 2.5),
      airQualityIndex: aqiData.aqi,
      energyConsumption: `${energyResult.totalConsumption} MW`,
      wasteCollected: `${Math.floor(parseFloat(state.population) * 0.5)} tons`,
      publicTransportUsage: `${Math.floor(45 + Math.random() * 30)}%`,
      emergencyResponse: `${Math.floor(4 + Math.random() * 6)} min`,
      networkCoverage: `${Math.floor(85 + Math.random() * 14)}%`,
    });

    setLastUpdate(new Date());
    // routeData preserved intentionally
  }, []);

  const handleRouteCalculated = (newRouteData) => {
    setRouteData(newRouteData);
  };

  // Generate state-specific alerts
  const generateAlertsForState = (state, aqiData, generatedTrafficData) => {
    const generatedAlerts = [];
    const currentTime = new Date();

    if (aqiData.aqi > 150) {
      generatedAlerts.push({
        id: 1,
        type: 'Air Quality',
        severity: 'high',
        message: `AQI at ${aqiData.aqi} in ${state.capital} - Unhealthy levels detected`,
        timestamp: new Date(currentTime - 300000).toISOString(),
      });
    }

    const currentTraffic = generatedTrafficData[generatedTrafficData.length - 1];
    if (currentTraffic.congestion > 80) {
      generatedAlerts.push({
        id: 2,
        type: 'Traffic Jam',
        severity: 'high',
        message: `Heavy congestion (${currentTraffic.congestion}%) in ${state.capital} metro area`,
        timestamp: new Date(currentTime - 600000).toISOString(),
      });
    }

    generatedAlerts.push(
      {
        id: 3,
        type: 'Weather',
        severity: 'low',
        message: `Clear skies expected in ${state.name} for next 6 hours`,
        timestamp: new Date(currentTime - 900000).toISOString(),
      },
      {
        id: 4,
        type: 'Power',
        severity: 'medium',
        message: `Scheduled maintenance in ${state.cities[1] || state.capital} tomorrow 2-4 AM`,
        timestamp: new Date(currentTime - 1200000).toISOString(),
      },
      {
        id: 5,
        type: 'Event',
        severity: 'low',
        message: `Cultural festival happening in ${state.capital} this weekend`,
        timestamp: new Date(currentTime - 1500000).toISOString(),
      }
    );

    return generatedAlerts;
  };

  // Initial load and state change
  useEffect(() => {
    if (user && currentPage === 'dashboard') {
      loadStateData(selectedState);
    }
  }, [selectedState, loadStateData, user, currentPage]);

  // Auto-refresh every 5 minutes (silent update)
  useEffect(() => {
    if (!user || currentPage !== 'dashboard') return;

    const interval = setInterval(() => {
      loadStateDataSilent(selectedState);
    }, 300000);

    return () => clearInterval(interval);
  }, [selectedState, user, currentPage, loadStateDataSilent]);

  // Protect dashboard if no user
  useEffect(() => {
    if (currentPage === 'dashboard' && !user) {
      setCurrentPage('landing');
    }
  }, [currentPage, user]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Landing Page */}
      {currentPage === 'landing' && (
        <LandingPage
          onGetStarted={(page) => {
            // Prevent direct dashboard access without login
            if (page === 'dashboard') {
              setCurrentPage('login');
            } else {
              setCurrentPage(page);
            }
          }}
        />
      )}

      {/* Login/Register */}
      {(currentPage === 'login' || currentPage === 'register') && (
        <AuthPages
          onAuthSuccess={handleAuthSuccess}
          onBack={() => setCurrentPage('landing')}
        />
      )}

      {/* Dashboard only if logged in */}
      {currentPage === 'dashboard' && user && (
        <>
          <AppBar
            position="sticky"
            sx={{
              background: 'linear-gradient(135deg, #00d4ff, #5352ed)',
              boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
            }}
          >
            <Toolbar>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h4" sx={{ fontWeight: 800, flexGrow: 1 }}>
                  Smart City Dashboard
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {user && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ color: 'white' }} />
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                    </Box>
                  )}

                  <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
                    {selectedState.name} • Updated: {lastUpdate.toLocaleTimeString()}
                  </Typography>

                  <IconButton
                    onClick={handleGoHome}
                    color="inherit"
                    sx={{ ml: 1 }}
                    title="Home"
                  >
                    <HomeIcon />
                  </IconButton>

                  <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 1 }}>
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                  </IconButton>

                  {user && (
                    <IconButton
                      onClick={handleLogout}
                      color="inherit"
                      sx={{ ml: 1 }}
                      title="Logout"
                    >
                      <LogoutIcon />
                    </IconButton>
                  )}
                </Box>
              </motion.div>
            </Toolbar>
          </AppBar>

          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* State Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Box sx={{ mb: 4 }}>
                <StateSelector selectedState={selectedState} onStateChange={setSelectedState} />
              </Box>
            </motion.div>

            {/* KPI Cards */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Box sx={{ mb: 4 }}>
                  <KPICards data={kpiData} />
                </Box>
              </motion.div>
            )}

            {/* Route Planner */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                <Box sx={{ mb: 4 }}>
                  <RoutePlanner
                    stateCenter={selectedState.center}
                    onRouteCalculated={handleRouteCalculated}
                  />
                </Box>
              </motion.div>
            )}

            {/* Main Content Grid */}
            {!loading && (
              <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                  <CityMap markers={mapMarkers} routeData={routeData} />
                </Grid>

                <Grid item xs={12} lg={4}>
                  <AlertSystem alerts={alerts} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TrafficChart data={trafficData} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <PollutionChart data={pollutionData} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <EnergyChart data={energyData} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <EventsList events={events} />
                </Grid>
              </Grid>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{
                marginTop: '40px',
                textAlign: 'center',
                padding: '20px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                🚀 Built for Hackathon 2026 | Real-time Smart City Monitoring System
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.7 }}>
                Data updates every 5 minutes • Interactive Charts • Live Map • Alert System
              </Typography>
            </motion.div>
          </Container>
        </>
      )}
    </Box>
  );
};

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Dashboard />
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;