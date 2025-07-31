import React, { useState, useEffect } from 'react';
import { TrendingUp, Filter, SortAsc, SortDesc, Star, AlertCircle, BarChart3 } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { AssetCard } from './components/AssetCard';
import { NewsCard } from './components/NewsCard';
import { PortfolioSummary } from './components/PortfolioSummary';
import { financeService } from './services/financeService';
import { AssetData, NewsItem } from './types/finance';
import { 
  sortAssetsByPrice, 
  sortAssetsByChange, 
  sortAssetsAlphabetically,
  filterAssetsByName,
  filterAssetsByType,
  calculatePortfolioSummary
} from './utils/helpers';

function App() {
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<AssetData[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterText, setFilterText] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'stock' | 'crypto'>('all');
  const [showFavorites, setShowFavorites] = useState(false);

  // Load popular assets and news on first load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load popular assets
        const popular = await financeService.getPopularAssets();
        const loadedAssets: AssetData[] = [];

        // Load some popular stocks
        for (const symbol of popular.stocks.slice(0, 3)) {
          try {
            const asset = await financeService.getStockData(symbol);
            loadedAssets.push(asset);
          } catch (err) {
            console.warn(`Failed to load ${symbol}:`, err);
          }
        }

        // Load some popular crypto
        for (const coinId of popular.cryptos.slice(0, 2)) {
          try {
            const asset = await financeService.getCryptoData(coinId);
            loadedAssets.push(asset);
          } catch (err) {
            console.warn(`Failed to load ${coinId}:`, err);
          }
        }

        setAssets(loadedAssets);

        // Load news
        const newsData = await financeService.getFinancialNews();
        setNews(newsData);
      } catch (err) {
        console.warn('Failed to load initial data:', err);
      }
    };

    loadInitialData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...assets];

    // Apply favorites filter
    if (showFavorites) {
      filtered = filtered.filter(asset => favorites.has(asset.symbol));
    }

    // Apply type filter
    filtered = filterAssetsByType(filtered, filterType);

    // Apply text filter
    filtered = filterAssetsByName(filtered, filterText);

    // Apply sorting
    switch (sortBy) {
      case 'price':
        filtered = sortAssetsByPrice(filtered, sortOrder === 'asc');
        break;
      case 'change':
        filtered = sortAssetsByChange(filtered, sortOrder === 'asc');
        break;
      case 'name':
      default:
        filtered = sortAssetsAlphabetically(filtered);
        if (sortOrder === 'desc') {
          filtered.reverse();
        }
        break;
    }

    setFilteredAssets(filtered);
  }, [assets, sortBy, sortOrder, filterText, filterType, showFavorites, favorites]);

  const handleAssetSearch = async (symbol: string, type: 'stock' | 'crypto', id?: string) => {
    setLoading(true);
    setError(null);

    try {
      let asset: AssetData;
      
      if (type === 'stock') {
        asset = await financeService.getStockData(symbol);
      } else {
        asset = await financeService.getCryptoData(id || symbol.toLowerCase());
      }
      
      // Check if asset already exists
      const existingIndex = assets.findIndex(a => a.symbol === asset.symbol);
      
      if (existingIndex >= 0) {
        // Update existing asset
        const updatedAssets = [...assets];
        updatedAssets[existingIndex] = asset;
        setAssets(updatedAssets);
      } else {
        // Add new asset
        setAssets(prev => [...prev, asset]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch asset data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (symbol: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(symbol)) {
        newFavorites.delete(symbol);
      } else {
        newFavorites.add(symbol);
      }
      return newFavorites;
    });
  };

  const handleSortChange = (newSortBy: 'name' | 'price' | 'change') => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const portfolio = calculatePortfolioSummary(assets.filter(asset => favorites.has(asset.symbol)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
            </div>
            <div className="text-sm text-gray-500">
              Real-time stocks & cryptocurrency data
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <SearchBar onAssetSelect={handleAssetSearch} loading={loading} error={error} />
        </div>

        {/* API Key Warning */}
        {!import.meta.env.VITE_FINNHUB_API_KEY && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-yellow-800 font-medium">API Keys Required</p>
                <p className="text-yellow-700 text-sm">
                  Please add your Finnhub, Alpha Vantage, and NewsAPI keys to the .env file to use this application.
                </p>
              </div>
            </div>
          </div>
        )}

        {assets.length > 0 && (
          <>
            {/* Controls */}
            <div className="mb-6 bg-white rounded-lg shadow p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <Filter className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Filter assets..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'stock' | 'crypto')}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Assets</option>
                  <option value="stock">Stocks Only</option>
                  <option value="crypto">Crypto Only</option>
                </select>

                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`flex items-center px-3 py-1 rounded text-sm transition-colors ${
                    showFavorites 
                      ? 'bg-red-100 text-red-700 border border-red-300' 
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <Star className={`w-4 h-4 mr-1 ${showFavorites ? 'fill-current' : ''}`} />
                  Favorites Only
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  {(['name', 'price', 'change'] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSortChange(option)}
                      className={`flex items-center px-2 py-1 rounded text-sm transition-colors ${
                        sortBy === option 
                          ? 'bg-green-100 text-green-700 border border-green-300' 
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {option === 'name' ? 'Name' : option === 'price' ? 'Price' : 'Change'}
                      {sortBy === option && (
                        sortOrder === 'asc' ? 
                          <SortAsc className="w-3 h-3 ml-1" /> : 
                          <SortDesc className="w-3 h-3 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Portfolio Summary */}
              <div className="lg:col-span-1">
                <PortfolioSummary portfolio={portfolio} />
              </div>

              {/* Assets Grid */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAssets.map((asset) => (
                    <AssetCard
                      key={asset.symbol}
                      asset={asset}
                      isFavorite={favorites.has(asset.symbol)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
                
                {filteredAssets.length === 0 && (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      No Assets Found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your filters or search for new assets.
                    </p>
                  </div>
                )}
              </div>

              {/* News */}
              <div className="lg:col-span-1">
                <NewsCard news={news} />
              </div>
            </div>
          </>
        )}

        {assets.length === 0 && !loading && (
          <div className="text-center py-12">
            <TrendingUp className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome to Finance Dashboard
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Search for stocks and cryptocurrencies to track their real-time prices, market data, and performance.
            </p>
            <div className="text-sm text-gray-500">
              <p>Features include:</p>
              <ul className="mt-2 space-y-1">
                <li>• Real-time stock and crypto prices</li>
                <li>• Portfolio tracking and management</li>
                <li>• Financial news and market updates</li>
                <li>• Advanced sorting and filtering</li>
                <li>• Favorite assets watchlist</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;