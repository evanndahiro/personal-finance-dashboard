import { WeatherData, AirQualityData, ForecastDay, LocationData, ApiError } from '../types/weather';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WEATHERAPI_KEY = import.meta.env.VITE_WEATHERAPI_KEY;

class WeatherService {
  private baseUrl = 'https://api.openweathermap.org/data/2.5';
  private weatherApiUrl = 'https://api.weatherapi.com/v1';

  async searchLocation(query: string): Promise<LocationData> {
    if (!OPENWEATHER_API_KEY || !WEATHERAPI_KEY) {
      throw new ApiError('API keys are not configured. Please check your environment variables.');
    }

    try {
      // Get basic weather data from OpenWeatherMap
      const weatherResponse = await fetch(
        `${this.baseUrl}/weather?q=${encodeURIComponent(query)}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );

      if (!weatherResponse.ok) {
        if (weatherResponse.status === 404) {
          throw new ApiError('Location not found. Please check the spelling and try again.');
        }
        if (weatherResponse.status === 401) {
          throw new ApiError('Invalid API key. Please check your OpenWeatherMap API key.');
        }
        throw new ApiError(`Weather service error: ${weatherResponse.status}`);
      }

      const weatherData = await weatherResponse.json();

      // Get air quality data
      const airQualityResponse = await fetch(
        `${this.baseUrl}/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${OPENWEATHER_API_KEY}`
      );

      let airQualityData: AirQualityData = {
        aqi: 0,
        co: 0,
        no2: 0,
        o3: 0,
        so2: 0,
        pm2_5: 0,
        pm10: 0,
        recommendation: 'Data unavailable',
        level: 'Good'
      };

      if (airQualityResponse.ok) {
        const airData = await airQualityResponse.json();
        const components = airData.list[0].components;
        const aqi = airData.list[0].main.aqi;
        
        airQualityData = {
          aqi,
          co: components.co,
          no2: components.no2,
          o3: components.o3,
          so2: components.so2,
          pm2_5: components.pm2_5,
          pm10: components.pm10,
          ...this.getAirQualityInfo(aqi)
        };
      }

      // Get forecast data from WeatherAPI
      const forecastResponse = await fetch(
        `${this.weatherApiUrl}/forecast.json?key=${WEATHERAPI_KEY}&q=${weatherData.coord.lat},${weatherData.coord.lon}&days=5&aqi=no&alerts=no`
      );

      let forecast: ForecastDay[] = [];

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        forecast = forecastData.forecast.forecastday.map((day: any) => ({
          date: day.date,
          maxTemp: Math.round(day.day.maxtemp_c),
          minTemp: Math.round(day.day.mintemp_c),
          description: day.day.condition.text,
          icon: day.day.condition.icon,
          humidity: day.day.avghumidity,
          windSpeed: day.day.maxwind_kph,
          chanceOfRain: day.day.daily_chance_of_rain
        }));
      }

      const weather: WeatherData = {
        id: `${weatherData.coord.lat}-${weatherData.coord.lon}`,
        name: weatherData.name,
        country: weatherData.sys.country,
        temperature: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        pressure: weatherData.main.pressure,
        visibility: weatherData.visibility / 1000,
        uvIndex: 0, // Would need additional API call
        icon: weatherData.weather[0].icon,
        timestamp: Date.now()
      };

      return {
        id: weather.id,
        name: weather.name,
        country: weather.country,
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon,
        weather,
        airQuality: airQualityData,
        forecast,
        isFavorite: false
      };

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Network error. Please check your internet connection.');
      }
      
      throw new ApiError('An unexpected error occurred. Please try again.');
    }
  }

  private getAirQualityInfo(aqi: number): { recommendation: string; level: AirQualityData['level'] } {
    switch (aqi) {
      case 1:
        return {
          level: 'Good',
          recommendation: 'Air quality is good. Perfect for outdoor activities.'
        };
      case 2:
        return {
          level: 'Fair',
          recommendation: 'Air quality is acceptable for most people.'
        };
      case 3:
        return {
          level: 'Moderate',
          recommendation: 'Sensitive individuals should consider limiting outdoor activities.'
        };
      case 4:
        return {
          level: 'Poor',
          recommendation: 'Everyone should limit outdoor activities.'
        };
      case 5:
        return {
          level: 'Very Poor',
          recommendation: 'Avoid outdoor activities. Health warnings recommended.'
        };
      default:
        return {
          level: 'Good',
          recommendation: 'Air quality data unavailable.'
        };
    }
  }
}

class ApiError extends Error {
  constructor(message: string, public code?: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const weatherService = new WeatherService();
export { ApiError };