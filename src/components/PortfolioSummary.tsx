import React from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { Portfolio } from '../types/finance';
import { formatCurrency, formatPercentage, getChangeColor } from '../utils/helpers';

interface PortfolioSummaryProps {
  portfolio: Portfolio;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ portfolio }) => {
  const { assets, totalValue, totalChange, totalChangePercent } = portfolio;
  const isPositive = totalChangePercent >= 0;

  if (assets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          Portfolio Summary
        </h3>
        <div className="text-center py-8">
          <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Add assets to your portfolio to see summary</p>
        </div>
      </div>
    );
  }

  const stockCount = assets.filter(asset => asset.type === 'stock').length;
  const cryptoCount = assets.filter(asset => asset.type === 'crypto').length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <Wallet className="w-5 h-5 mr-2" />
        Portfolio Summary
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {formatCurrency(totalValue)}
          </div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <PieChart className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {assets.length}
          </div>
          <div className="text-sm text-gray-600">Assets</div>
        </div>

        <div className={`text-center p-4 rounded-lg ${
          isPositive ? 'bg-green-50' : 'bg-red-50'
        }`}>
          {isPositive ? (
            <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${getChangeColor(totalChangePercent)}`} />
          ) : (
            <TrendingDown className={`w-8 h-8 mx-auto mb-2 ${getChangeColor(totalChangePercent)}`} />
          )}
          <div className={`text-2xl font-bold ${getChangeColor(totalChangePercent)}`}>
            {formatPercentage(totalChangePercent)}
          </div>
          <div className="text-sm text-gray-600">Avg Change</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600">Stocks</div>
            <div className="text-lg font-bold text-blue-800">{stockCount}</div>
          </div>
          <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-blue-800" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600">Crypto</div>
            <div className="text-lg font-bold text-orange-800">{cryptoCount}</div>
          </div>
          <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-orange-800" />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total Change (24h)</span>
          <span className={`font-medium ${getChangeColor(totalChange)}`}>
            {formatCurrency(totalChange)} ({formatPercentage(totalChangePercent)})
          </span>
        </div>
      </div>
    </div>
  );
};