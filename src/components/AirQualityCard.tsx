import React from 'react';
import { AirQualityData } from '../types/weather';
import { getAirQualityColor } from '../utils/helpers';

interface AirQualityCardProps {
  airQuality: AirQualityData;
  locationName: string;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality, locationName }) => {
  const pollutants = [
    { name: 'PM2.5', value: airQuality.pm2_5, unit: 'μg/m³', description: 'Fine particles' },
    { name: 'PM10', value: airQuality.pm10, unit: 'μg/m³', description: 'Coarse particles' },
    { name: 'NO₂', value: airQuality.no2, unit: 'μg/m³', description: 'Nitrogen dioxide' },
    { name: 'O₃', value: airQuality.o3, unit: 'μg/m³', description: 'Ozone' },
    { name: 'SO₂', value: airQuality.so2, unit: 'μg/m³', description: 'Sulfur dioxide' },
    { name: 'CO', value: airQuality.co, unit: 'μg/m³', description: 'Carbon monoxide' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          Air Quality - {locationName}
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAirQualityColor(airQuality.level)}`}>
          AQI {airQuality.aqi} - {airQuality.level}
        </span>
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">{airQuality.recommendation}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {pollutants.map((pollutant) => (
          <div key={pollutant.name} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-800">
              {pollutant.value.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">{pollutant.unit}</div>
            <div className="text-sm font-medium text-gray-700 mt-1">
              {pollutant.name}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {pollutant.description}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>AQI Scale: 1-Good, 2-Fair, 3-Moderate, 4-Poor, 5-Very Poor</p>
      </div>
    </div>
  );
};