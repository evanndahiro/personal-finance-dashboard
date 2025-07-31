import React from 'react';
import { Heart, Thermometer, Droplets, Wind, Eye, Gauge } from 'lucide-react';
import { LocationData } from '../types/weather';
import { getWeatherIconUrl, formatTime } from '../utils/helpers';

interface WeatherCardProps {
  location: LocationData;
  onToggleFavorite: (id: string) => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ location, onToggleFavorite }) => {
  const { weather, airQuality } = location;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {location.name}, {location.country}
          </h3>
          <p className="text-sm text-gray-500">
            Updated {formatTime(weather.timestamp)}
          </p>
        </div>
        <button
          onClick={() => onToggleFavorite(location.id)}
          className={`p-2 rounded-full transition-colors duration-200 ${
            location.isFavorite
              ? 'text-red-500 bg-red-50 hover:bg-red-100'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${location.isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img
            src={getWeatherIconUrl(weather.icon)}
            alt={weather.description}
            className="w-16 h-16"
          />
          <div className="ml-4">
            <div className="text-3xl font-bold text-gray-800">
              {weather.temperature}°C
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {weather.description}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Feels like</div>
          <div className="text-lg font-semibold text-gray-700">
            {weather.feelsLike}°C
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <Droplets className="w-4 h-4 text-blue-500 mr-2" />
          <span className="text-sm text-gray-600">
            Humidity: {weather.humidity}%
          </span>
        </div>
        <div className="flex items-center">
          <Wind className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">
            Wind: {weather.windSpeed} m/s
          </span>
        </div>
        <div className="flex items-center">
          <Gauge className="w-4 h-4 text-purple-500 mr-2" />
          <span className="text-sm text-gray-600">
            Pressure: {weather.pressure} hPa
          </span>
        </div>
        <div className="flex items-center">
          <Eye className="w-4 h-4 text-green-500 mr-2" />
          <span className="text-sm text-gray-600">
            Visibility: {weather.visibility} km
          </span>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Air Quality</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            airQuality.level === 'Good' ? 'bg-green-100 text-green-800' :
            airQuality.level === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
            airQuality.level === 'Moderate' ? 'bg-orange-100 text-orange-800' :
            airQuality.level === 'Poor' ? 'bg-red-100 text-red-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {airQuality.level}
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {airQuality.recommendation}
        </p>
      </div>
    </div>
  );
};