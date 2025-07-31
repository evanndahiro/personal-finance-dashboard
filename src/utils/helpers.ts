import { AssetData, Portfolio } from '../types/finance';

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatLargeNumber = (num: number): string => {
  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(2)}T`;
  }
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  }
  if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`;
  }
  return formatCurrency(num);
};

export const formatPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getChangeColor = (change: number): string => {
  if (change > 0) return 'text-green-600';
  if (change < 0) return 'text-red-600';
  return 'text-gray-600';
};

export const getChangeBackgroundColor = (change: number): string => {
  if (change > 0) return 'bg-green-100';
  if (change < 0) return 'bg-red-100';
  return 'bg-gray-100';
};

export const sortAssetsByPrice = (assets: AssetData[], ascending = false): AssetData[] => {
  return [...assets].sort((a, b) => {
    return ascending ? a.price - b.price : b.price - a.price;
  });
};

export const sortAssetsByChange = (assets: AssetData[], ascending = false): AssetData[] => {
  return [...assets].sort((a, b) => {
    return ascending ? a.changePercent - b.changePercent : b.changePercent - a.changePercent;
  });
};

export const sortAssetsByMarketCap = (assets: AssetData[], ascending = false): AssetData[] => {
  return [...assets].sort((a, b) => {
    const marketCapA = a.type === 'crypto' ? a.marketCap : 0;
    const marketCapB = b.type === 'crypto' ? b.marketCap : 0;
    return ascending ? marketCapA - marketCapB : marketCapB - marketCapA;
  });
};

export const sortAssetsAlphabetically = (assets: AssetData[]): AssetData[] => {
  return [...assets].sort((a, b) => a.symbol.localeCompare(b.symbol));
};

export const filterAssetsByName = (assets: AssetData[], searchTerm: string): AssetData[] => {
  if (!searchTerm.trim()) return assets;
  
  const term = searchTerm.toLowerCase();
  return assets.filter(asset => 
    asset.symbol.toLowerCase().includes(term) ||
    asset.name.toLowerCase().includes(term)
  );
};

export const filterAssetsByType = (assets: AssetData[], type: 'all' | 'stock' | 'crypto'): AssetData[] => {
  if (type === 'all') return assets;
  return assets.filter(asset => asset.type === type);
};

export const calculatePortfolioSummary = (assets: AssetData[]): Portfolio => {
  if (assets.length === 0) {
    return {
      assets: [],
      totalValue: 0,
      totalChange: 0,
      totalChangePercent: 0
    };
  }

  const totalValue = assets.reduce((sum, asset) => sum + asset.price, 0);
  const totalChange = assets.reduce((sum, asset) => sum + asset.change, 0);
  const totalChangePercent = assets.length > 0 ? (totalChange / assets.length) : 0;

  return {
    assets,
    totalValue,
    totalChange,
    totalChangePercent
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const generateMockPriceHistory = (currentPrice: number, days = 30): number[] => {
  const history = [];
  let price = currentPrice * 0.9; // Start 10% lower
  
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * 0.1; // ±5% daily change
    price = price * (1 + change);
    history.push(price);
  }
  
  return history;
};

export const isMarketOpen = (): boolean => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getHours();
  
  // Simple check: Monday-Friday, 9 AM - 4 PM EST (approximate)
  return day >= 1 && day <= 5 && hour >= 9 && hour <= 16;
};