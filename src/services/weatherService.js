// Weather Service using Open-Meteo API
// https://open-meteo.com/

class WeatherService {
  constructor() {
    this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
    this.geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
    this.defaultLocation = { lat: 42.0, lng: 21.4 }; // Skopje, Macedonia
  }

  // Get weather data for a location
  async getWeatherData(location = null) {
    try {
      const coords = location || this.defaultLocation;
      
      const response = await fetch(
        `${this.baseUrl}?latitude=${coords.lat}&longitude=${coords.lng}&hourly=temperature_2m,precipitation_probability,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformWeatherData(data, location);
    } catch (error) {
      console.error('Weather service error:', error);
      return this.getDefaultWeatherData();
    }
  }

  // Search for location by name
  async searchLocation(query) {
    try {
      const response = await fetch(
        `${this.geocodingUrl}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          lat: result.latitude,
          lng: result.longitude,
          name: result.name,
          country: result.country
        };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  // Transform Open-Meteo data to app format
  transformWeatherData(data, location = null) {
    const currentHour = new Date().getHours();
    const currentIndex = data.hourly.time.findIndex(time => 
      new Date(time).getHours() === currentHour
    );

    const current = {
      temperature: data.hourly.temperature_2m[currentIndex],
      condition: this.getWeatherCondition(data.hourly.weathercode[currentIndex]),
      precipitation: data.hourly.precipitation_probability[currentIndex]
    };

    const forecast = data.daily.time.slice(0, 5).map((date, index) => {
      const dayDate = new Date(date);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      return {
        day: dayNames[dayDate.getDay()],
        date: dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        condition: this.getWeatherCondition(data.daily.weathercode[index]),
        temp: {
          min: Math.round(data.daily.temperature_2m_min[index]),
          max: Math.round(data.daily.temperature_2m_max[index])
        },
        rainChance: data.daily.precipitation_probability_max[index]
      };
    });

    const locationName = location?.name || 'Skopje, Macedonia';

    return {
      current,
      forecast,
      location: locationName,
      provider: 'Open-Meteo'
    };
  }

  // Get weather condition from WMO weather codes
  getWeatherCondition(code) {
    const conditions = {
      0: 'sunny',
      1: 'partly-cloudy',
      2: 'partly-cloudy',
      3: 'cloudy',
      45: 'cloudy',
      48: 'cloudy',
      51: 'rainy',
      53: 'rainy',
      55: 'rainy',
      61: 'rainy',
      63: 'rainy',
      65: 'rainy',
      71: 'rainy',
      73: 'rainy',
      75: 'rainy',
      77: 'rainy',
      80: 'rainy',
      81: 'rainy',
      82: 'rainy',
      85: 'rainy',
      86: 'rainy',
      95: 'rainy',
      96: 'rainy',
      99: 'rainy'
    };

    return conditions[code] || 'partly-cloudy';
  }

  // Get rain risk level
  getRainRiskLevel(rainChance) {
    if (rainChance >= 70) {
      return {
        level: 'High Risk',
        color: 'text-red-600',
        bg: 'bg-red-100'
      };
    } else if (rainChance >= 40) {
      return {
        level: 'Medium Risk',
        color: 'text-yellow-600',
        bg: 'bg-yellow-100'
      };
    } else {
      return {
        level: 'Low Risk',
        color: 'text-green-600',
        bg: 'bg-green-100'
      };
    }
  }

  // Get work recommendation based on weather
  getWorkRecommendation(rainChance, condition) {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('thunder') || conditionLower.includes('heavy rain')) {
      return 'Consider indoor work or postpone outdoor activities';
    }
    
    if (conditionLower.includes('rain') || rainChance > 70) {
      return 'Bring rain gear and consider indoor alternatives';
    }
    
    if (conditionLower.includes('snow')) {
      return 'Ensure proper winter safety equipment';
    }
    
    if (conditionLower.includes('clear') || conditionLower.includes('partly cloudy')) {
      return 'Good conditions for outdoor work';
    }
    
    return 'Standard safety precautions recommended';
  }

  // Default weather data for fallback
  getDefaultWeatherData() {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    
    return {
      current: {
        temperature: 20,
        condition: 'partly-cloudy',
        precipitation: 20
      },
      forecast: [
        { 
          day: dayNames[today.getDay()], 
          date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
          condition: 'partly-cloudy', 
          temp: { min: 15, max: 22 }, 
          rainChance: 20 
        },
        { 
          day: dayNames[(today.getDay() + 1) % 7], 
          date: new Date(today.getTime() + 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
          condition: 'sunny', 
          temp: { min: 16, max: 24 }, 
          rainChance: 10 
        },
        { 
          day: dayNames[(today.getDay() + 2) % 7], 
          date: new Date(today.getTime() + 172800000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
          condition: 'rainy', 
          temp: { min: 14, max: 21 }, 
          rainChance: 60 
        },
        { 
          day: dayNames[(today.getDay() + 3) % 7], 
          date: new Date(today.getTime() + 259200000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
          condition: 'partly-cloudy', 
          temp: { min: 17, max: 23 }, 
          rainChance: 30 
        },
        { 
          day: dayNames[(today.getDay() + 4) % 7], 
          date: new Date(today.getTime() + 345600000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
          condition: 'sunny', 
          temp: { min: 18, max: 25 }, 
          rainChance: 5 
        }
      ],
      location: 'Skopje, Macedonia',
      provider: 'Open-Meteo (Fallback)'
    };
  }
}

export default new WeatherService(); 