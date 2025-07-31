export interface WeatherData {
  id: string;
  name: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  icon: string;
  timestamp: number;
}

export interface AirQualityData {
  aqi: number;
  co: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  recommendation: string;
  level: 'Good' | 'Fair' | 'Moderate' | 'Poor' | 'Very Poor';
}

export interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  chanceOfRain: number;
}

export interface LocationData {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  weather: WeatherData;
  airQuality: AirQualityData;
  forecast: ForecastDay[];
  isFavorite: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}