import React from 'react';
import { ForecastDay } from '../types/weather';
import { formatDate } from '../utils/helpers';
import { Droplets, Wind } from 'lucide-react';

interface ForecastCardProps {
  forecast: ForecastDay[];
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  if (forecast.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">5-Day Forecast</h3>
        <p className="text-gray-500">Forecast data unavailable</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">5-Day Forecast</h3>
      <div className="space-y-4">
        {forecast.map((day, index) => (
          <div key={day.date} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center flex-1">
              <div className="text-sm font-medium text-gray-700 w-16">
                {index === 0 ? 'Today' : formatDate(day.date)}
              </div>
              <img
                src={day.icon.startsWith('http') ? day.icon : `https:${day.icon}`}
                alt={day.description}
                className="w-8 h-8 mx-3"
              />
              <div className="flex-1">
                <div className="text-sm text-gray-800 capitalize">
                  {day.description}
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Droplets className="w-3 h-3 mr-1" />
                  <span className="mr-3">{day.chanceOfRain}%</span>
                  <Wind className="w-3 h-3 mr-1" />
                  <span>{day.windSpeed} km/h</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-800">
                {day.maxTemp}° / {day.minTemp}°
              </div>
              <div className="text-xs text-gray-500">
                {day.humidity}% humidity
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};