/**
 * API Configuration for Smart City Dashboard
 * 
 * Leave as empty to use fallback realistic data
 */

export const API_CONFIG = {
  // Weather & Environmental Data
  OPENWEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
  
  // News & Events
  NEWS_API_KEY: import.meta.env.VITE_NEWS_API_KEY || '',
  
  // Ticketmaster Events
  TICKETMASTER_API_KEY: import.meta.env.VITE_TICKETMASTER_API_KEY || '',
  
  // Eventbrite (Optional)
  EVENTBRITE_API_KEY: import.meta.env.VITE_EVENTBRITE_API_KEY || '',
  
  // Air Quality (Optional - AQICN provides free API)
  AQICN_API_KEY: import.meta.env.VITE_AQICN_API_KEY || '',
  
  // Google Maps (Optional - for better routing)
  GOOGLE_MAPS_API_KEY: '',
};

export const isApiKeyConfigured = (apiKey) => {
  return !!apiKey && apiKey !== 'YOUR_API_KEY' && !apiKey.startsWith('YOUR_');
};

export const getApiStatus = () => {
  return {
    openWeather: isApiKeyConfigured(API_CONFIG.OPENWEATHER_API_KEY),
    newsAPI: isApiKeyConfigured(API_CONFIG.NEWS_API_KEY),
    ticketmaster: isApiKeyConfigured(API_CONFIG.TICKETMASTER_API_KEY),
    eventbrite: isApiKeyConfigured(API_CONFIG.EVENTBRITE_API_KEY),
    aqicn: isApiKeyConfigured(API_CONFIG.AQICN_API_KEY),
    googleMaps: isApiKeyConfigured(API_CONFIG.GOOGLE_MAPS_API_KEY),
  };
};