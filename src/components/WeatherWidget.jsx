import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Cloudy, Wind, Thermometer, Calendar, RefreshCw } from 'lucide-react';
import weatherService from '../services/weatherService';

const WeatherWidget = ({ location }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState(location);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchWeatherData = async (targetLocation = currentLocation) => {
    console.log('fetchWeatherData called with:', { targetLocation });
    setLoading(true);
    setError(null);
    
    try {
      const data = await weatherService.getWeatherData(targetLocation);
      console.log('Weather data received:', data);
      setWeatherData(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update weather when location prop changes
  useEffect(() => {
    if (location && location !== currentLocation) {
      console.log('Location prop changed:', { old: currentLocation, new: location });
      setCurrentLocation(location);
      // Don't auto-fetch if it's a search result, only for GPS location updates
      if (typeof location === 'string' && location.includes(',')) {
        fetchWeatherData(location);
      }
    }
  }, [location]);

  // Initial weather fetch
  useEffect(() => {
    if (currentLocation) {
      fetchWeatherData();
    }
  }, [currentLocation]);

  // Auto-refresh weather data every 30 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentLocation && !loading) {
        console.log('Auto-refreshing weather data');
        fetchWeatherData();
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(intervalId);
  }, [currentLocation, loading]);

  const handleSearch = async () => {
    if (searchLocation.trim()) {
      console.log('Searching for location:', searchLocation.trim());
      setLoading(true);
      setError(null);
      
      try {
        const locationData = await weatherService.searchLocation(searchLocation.trim());
        if (locationData) {
          const data = await weatherService.getWeatherData(locationData);
          console.log('Search result:', data);
          setWeatherData(data);
          setCurrentLocation(locationData.name);
          setSearchLocation('');
        } else {
          throw new Error('Location not found');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const useCurrentLocation = () => {
    console.log('Using current location:', location);
    setCurrentLocation(location);
    setSearchLocation('');
    fetchWeatherData(location);
  };

  const refreshWeather = () => {
    fetchWeatherData();
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'cloudy':
        return <Cloudy className="w-6 h-6 text-gray-500" />;
      case 'partly-cloudy':
        return <Cloud className="w-6 h-6 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="w-6 h-6 text-blue-500" />;
      case 'windy':
        return <Wind className="w-6 h-6 text-gray-400" />;
      default:
        return <Cloud className="w-6 h-6 text-gray-400" />;
    }
  };

  const getWeatherBackground = (condition) => {
    switch (condition) {
      case 'sunny':
        return 'bg-gradient-to-br from-yellow-300 via-orange-400 to-yellow-500';
      case 'cloudy':
        return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500';
      case 'partly-cloudy':
        return 'bg-gradient-to-br from-blue-200 via-blue-300 to-gray-300';
      case 'rainy':
        return 'bg-gradient-to-br from-blue-300 via-gray-400 to-blue-500';
      case 'windy':
        return 'bg-gradient-to-br from-gray-200 via-blue-200 to-gray-300';
      default:
        return 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400';
    }
  };

  const getRainRiskLevel = (rainChance) => {
    return weatherService.getRainRiskLevel(rainChance);
  };

  const getWorkRecommendation = (rainChance, condition) => {
    return weatherService.getWorkRecommendation(rainChance, condition);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-4">
        <div className="flex items-center justify-center h-20">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-4">
        <div className="text-center text-red-600">
          <p className="text-sm">Failed to load weather data</p>
          <p className="text-xs text-gray-500 mt-1">{error}</p>
          <button 
            onClick={fetchWeatherData}
            className="mt-2 text-xs text-orange-500 hover:text-orange-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-4">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            <h3 className="text-base font-semibold text-gray-800">5-Day Weather Forecast</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-600">
              {weatherData.location}
            </div>
            <button
              onClick={refreshWeather}
              disabled={loading}
              className="text-orange-500 hover:text-orange-700 disabled:text-gray-400 transition-colors"
              title="Refresh weather data"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Last Update Info */}
        {lastUpdate && (
          <div className="text-xs text-gray-500 mb-2">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
        
        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search city or address..."
              className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!searchLocation.trim()}
            className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Search
          </button>
          <button
            onClick={useCurrentLocation}
            className="px-2 py-1.5 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            title="Use current location"
          >
            📍
          </button>
        </div>
      </div>

      {/* Provider Info */}
      {weatherData.provider && (
        <div className="mb-2 text-xs text-gray-500 text-center">
          Data from: {weatherData.provider}
        </div>
      )}

      <div className="grid grid-cols-5 gap-2">
        {weatherData.forecast.map((day, index) => {
          const rainRisk = getRainRiskLevel(day.rainChance);
          
          return (
            <div 
              key={index} 
              className={`p-2 rounded-lg border-2 relative overflow-hidden ${
                day.rainChance >= 70 ? 'border-red-300' :
                day.rainChance >= 40 ? 'border-yellow-300' :
                'border-green-300'
              }`}
            >
              {/* Weather Background */}
              <div className={`absolute inset-0 ${getWeatherBackground(day.condition)} opacity-25`}></div>
              
              {/* Weather Pattern Overlay */}
              {day.condition === 'rainy' && (
                <div className="absolute inset-0 opacity-30">
                  <div className="w-full h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse"></div>
                </div>
              )}
              {day.condition === 'sunny' && (
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full bg-gradient-to-br from-yellow-200 via-transparent to-orange-200"></div>
                </div>
              )}
              {day.condition === 'cloudy' && (
                <div className="absolute inset-0 opacity-30">
                  <div className="w-full h-full bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500"></div>
                </div>
              )}
              
              {/* Content */}
              <div className="text-center relative z-10">
                <div className="font-medium text-gray-800 text-xs mb-1">{day.day}</div>
                <div className="text-xs text-gray-600 mb-2">{day.date}</div>
                
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(day.condition)}
                </div>
                
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Thermometer className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-medium">
                    {day.temp.min}° - {day.temp.max}°
                  </span>
                </div>
                
                <div className={`text-xs font-medium ${rainRisk.color} mb-2`}>
                  Rain: {day.rainChance}%
                </div>
                
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${rainRisk.bg} ${rainRisk.color}`}>
                  {rainRisk.level}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs text-blue-800">
          <strong>Work Planning Tip:</strong> Use this forecast to schedule outdoor work on days with low rain probability and plan indoor tasks for rainy days.
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget; 