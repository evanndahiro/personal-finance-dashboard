import React from 'react';
import { Heart, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { AssetData } from '../types/finance';
import { formatCurrency, formatPercentage, formatTime, getChangeColor, formatLargeNumber } from '../utils/helpers';

interface AssetCardProps {
  asset: AssetData;
  isFavorite: boolean;
  onToggleFavorite: (symbol: string) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, isFavorite, onToggleFavorite }) => {
  const isPositive = asset.changePercent >= 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-gray-800">
              {asset.symbol}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              asset.type === 'stock' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {asset.type === 'stock' ? 'Stock' : 'Crypto'}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate max-w-48">
            {asset.name}
          </p>
          <p className="text-xs text-gray-500">
            Updated {formatTime(asset.timestamp)}
          </p>
        </div>
        <button
          onClick={() => onToggleFavorite(asset.symbol)}
          className={`p-2 rounded-full transition-colors duration-200 ${
            isFavorite
              ? 'text-red-500 bg-red-50 hover:bg-red-100'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-3xl font-bold text-gray-800">
            {formatCurrency(asset.price)}
          </div>
          <div className={`flex items-center text-sm ${getChangeColor(asset.changePercent)}`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span className="font-medium">
              {formatCurrency(asset.change)} ({formatPercentage(asset.changePercent)})
            </span>
          </div>
        </div>
        <div className={`text-right p-3 rounded-lg ${
          isPositive ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="text-xs text-gray-500">24h Change</div>
          <div className={`text-lg font-bold ${getChangeColor(asset.changePercent)}`}>
            {formatPercentage(asset.changePercent)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 text-green-500 mr-2" />
          <div>
            <div className="text-xs text-gray-500">High</div>
            <div className="text-sm font-medium text-gray-700">
              {formatCurrency(asset.high)}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 text-red-500 mr-2" />
          <div>
            <div className="text-xs text-gray-500">Low</div>
            <div className="text-sm font-medium text-gray-700">
              {formatCurrency(asset.low)}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <BarChart3 className="w-4 h-4 text-blue-500 mr-2" />
          <div>
            <div className="text-xs text-gray-500">Open</div>
            <div className="text-sm font-medium text-gray-700">
              {formatCurrency(asset.open)}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <BarChart3 className="w-4 h-4 text-purple-500 mr-2" />
          <div>
            <div className="text-xs text-gray-500">
              {asset.type === 'stock' ? 'Prev Close' : 'Volume'}
            </div>
            <div className="text-sm font-medium text-gray-700">
              {asset.type === 'stock' 
                ? formatCurrency(asset.previousClose)
                : formatLargeNumber(asset.volume)
              }
            </div>
          </div>
        </div>
      </div>

      {asset.type === 'crypto' && asset.marketCap > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Market Cap</span>
            <span className="text-sm font-bold text-gray-800">
              {formatLargeNumber(asset.marketCap)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};