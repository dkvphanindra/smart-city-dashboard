/**
 * API Configuration for Smart City Dashboard
 * 
 * Get your FREE API keys from:
 * 1. OpenWeatherMap: https://openweathermap.org/api (Free tier: 1000 calls/day)
 * 2. NewsAPI: https://newsapi.org/ (Free tier: 100 requests/day)
 * 3. Ticketmaster: https://developer.ticketmaster.com/ (Free tier: 5000 requests/month)
 * 
 * Leave as 'YOUR_API_KEY' to use fallback realistic data
 */

export const API_CONFIG = {
  // Weather & Environmental Data
  OPENWEATHER_API_KEY: 'eb1c8af3b942be28e611daa672e3c714',
  
  // News & Events
  NEWS_API_KEY: 'dh00pZLRwsdKBFHcm1Nnkz4K2s5okae3',
  
  // Ticketmaster Events
  TICKETMASTER_API_KEY: 'o7GgJLKEOrwAAIz07uwYUd0RkAbi6mH4',
  
  // Eventbrite (Optional)
  EVENTBRITE_API_KEY: 'ASOIKQSPVRKNXHFNWR',
  
  // Air Quality (Optional - AQICN provides free API)
  AQICN_API_KEY: 'YOUR_AQICN_API_KEY',
  
  // Google Maps (Optional - for better routing)
  GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',
};

/**
 * Check if an API key is configured
 */
export const isApiKeyConfigured = (apiKey) => {
  return apiKey && apiKey !== 'YOUR_API_KEY' && !apiKey.startsWith('YOUR_');
};

/**
 * Get API status report
 */
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
