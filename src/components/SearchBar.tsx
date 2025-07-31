import React, { useState, useEffect } from 'react';
import { Search, Loader2, TrendingUp } from 'lucide-react';
import { SearchResult } from '../types/finance';
import { financeService } from '../services/financeService';
import { debounce } from '../utils/helpers';

interface SearchBarProps {
  onAssetSelect: (symbol: string, type: 'stock' | 'crypto', id?: string) => void;
  loading: boolean;
  error: string | null;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onAssetSelect, loading, error }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const debouncedSearch = debounce(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);
    try {
      const results = await financeService.searchAssets(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, 500);

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    const id = 'id' in result ? result.id : undefined;
    onAssetSelect(result.symbol, result.type, id);
    setQuery('');
    setShowResults(false);
    setSearchResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && searchResults.length > 0) {
      handleResultClick(searchResults[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stocks (AAPL) or crypto (bitcoin)..."
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            disabled={loading}
          />
          {(searching || loading) && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 animate-spin" />
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {searchResults.map((result, index) => (
            <button
              key={`${result.type}-${result.symbol}-${index}`}
              onClick={() => handleResultClick(result)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">
                    {result.symbol}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {result.name}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    result.type === 'stock' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {result.type === 'stock' ? 'Stock' : 'Crypto'}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Popular Suggestions */}
      {!query && !showResults && (
        <div className="mt-4">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <TrendingUp className="w-4 h-4 mr-1" />
            Popular assets:
          </div>
          <div className="flex flex-wrap gap-2">
            {['AAPL', 'TSLA', 'GOOGL', 'bitcoin', 'ethereum'].map((symbol) => (
              <button
                key={symbol}
                onClick={() => {
                  const isStock = symbol === symbol.toUpperCase();
                  onAssetSelect(symbol, isStock ? 'stock' : 'crypto', isStock ? undefined : symbol);
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};