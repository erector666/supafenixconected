# Weather Feature for FENIX Construction Tracker

## Overview

The weather feature provides a 5-day weather forecast to help construction teams plan their work around weather conditions, particularly rain. This feature helps optimize work scheduling by identifying optimal days for outdoor work and planning indoor tasks for rainy days.

## Features

### Current Implementation
- **5-Day Forecast**: Shows weather predictions for the next 5 days
- **Rain Risk Assessment**: Color-coded rain probability indicators
  - 🟢 Low Risk (0-39%): Green indicators
  - 🟡 Medium Risk (40-69%): Yellow indicators  
  - 🔴 High Risk (70%+): Red indicators
- **Work Planning Recommendations**: Smart suggestions based on weather conditions
- **Temperature Display**: Min/max temperatures for each day
- **Weather Icons**: Visual weather condition indicators
- **Responsive Design**: Works on desktop and mobile devices

### Weather Conditions Supported
- ☀️ Sunny
- ⛅ Partly Cloudy
- ☁️ Cloudy
- 🌧️ Rainy
- 💨 Windy

## Integration Points

### Employee Dashboard
- Weather widget appears after the location card
- Shows weather for current work location
- Helps workers plan their daily activities

### Admin Dashboard
- Weather widget appears in the Overview tab
- Shows weather for work site
- Helps administrators plan team assignments

## Technical Implementation

### Components
- `WeatherWidget.jsx`: Main weather display component
- `weatherService.js`: Service layer for weather data

### Service Architecture
The weather service is designed to be easily extended to integrate with real weather APIs:

```javascript
// Current mock implementation
const data = await weatherService.getWeatherForecast(location, 5);

// Future real API implementation
const data = await weatherService.getRealWeatherForecast(latitude, longitude, 5);
```

## Integration with Real Weather APIs

### Supported APIs
The service is prepared to integrate with:
- **OpenWeatherMap API** (primary)
- **WeatherAPI.com**
- **AccuWeather API**
- **Weather.gov API** (US only, free)

### Setup Instructions

#### 1. Get API Key
1. Sign up for a weather API service (recommended: OpenWeatherMap)
2. Get your API key from the service dashboard
3. Add the key to your environment variables

#### 2. Environment Configuration
Add to your `.env` file:
```env
REACT_APP_WEATHER_API_KEY=your_api_key_here
```

#### 3. Update Service Implementation
In `src/services/weatherService.js`, uncomment and configure the real API methods:

```javascript
// Replace the mock implementation with real API calls
async getWeatherForecast(location, days = 5) {
  // If you have coordinates, use real API
  if (this.apiKey && location.includes(',')) {
    const [lat, lon] = location.split(',').map(Number);
    return await this.getRealWeatherForecast(lat, lon, days);
  }
  
  // Fallback to mock data
  return await this.getMockWeatherForecast(location, days);
}
```

### API Rate Limits
- **OpenWeatherMap**: 1000 calls/day (free tier)
- **WeatherAPI.com**: 1,000,000 calls/month (free tier)
- **AccuWeather**: 50 calls/day (free tier)

### Caching Strategy
For production use, implement caching to reduce API calls:

```javascript
// Example caching implementation
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

async getWeatherForecast(location, days = 5) {
  const cacheKey = `weather_${location}_${days}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  
  const data = await this.fetchFromAPI(location, days);
  localStorage.setItem(cacheKey, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
  
  return data;
}
```

## Customization

### Styling
The weather widget uses Tailwind CSS classes and can be customized by modifying:
- Color schemes in `getRainRiskLevel()` method
- Component styling in `WeatherWidget.jsx`
- Icon selection in `getWeatherIcon()` method

### Weather Conditions
Add new weather conditions by updating:
1. `getWeatherIcon()` method in `WeatherWidget.jsx`
2. `mapWeatherCondition()` method in `weatherService.js`
3. Weather condition logic in the service

### Recommendations
Customize work recommendations by modifying:
- `getWorkRecommendation()` method in `weatherService.js`
- Risk level thresholds in `getRainRiskLevel()` method

## Testing

### Manual Testing
1. Login as employee or admin
2. Navigate to dashboard
3. Verify weather widget appears
4. Check loading states and error handling
5. Test responsive design on mobile

### Automated Testing
The weather feature is covered by the existing Playwright test suite:
- Weather widget display and functionality
- Loading states and error handling
- Responsive design testing

## Future Enhancements

### Planned Features
- **Hourly Forecast**: More detailed hourly weather predictions
- **Weather Alerts**: Severe weather notifications
- **Historical Data**: Weather patterns and trends
- **Multiple Locations**: Weather for multiple work sites
- **Push Notifications**: Weather alerts for mobile users
- **Work Schedule Integration**: Automatic work rescheduling based on weather

### Advanced Features
- **Machine Learning**: Predict work delays based on weather patterns
- **Equipment Recommendations**: Suggest appropriate equipment for weather conditions
- **Safety Alerts**: Weather-related safety warnings
- **Cost Impact Analysis**: Calculate weather-related project delays and costs

## Troubleshooting

### Common Issues

#### Weather Widget Not Loading
1. Check browser console for errors
2. Verify network connectivity
3. Check if location data is available
4. Verify service implementation

#### API Integration Issues
1. Verify API key is correctly set
2. Check API rate limits
3. Verify API endpoint URLs
4. Check CORS settings for API calls

#### Styling Issues
1. Verify Tailwind CSS is properly loaded
2. Check for CSS conflicts
3. Verify responsive breakpoints

### Debug Mode
Enable debug logging by adding to `weatherService.js`:

```javascript
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Weather service initialized');
  console.log('API Key available:', !!this.apiKey);
}
```

## Support

For issues or questions about the weather feature:
1. Check this documentation
2. Review the changelog for recent updates
3. Test with mock data first
4. Verify API integration step by step

## License

This weather feature is part of the FENIX Construction Tracker project and follows the same licensing terms. 