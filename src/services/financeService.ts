import { StockData, CryptoData, NewsItem, SearchResult, ApiError } from '../types/finance';

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

class FinanceService {
  private alphaVantageUrl = 'https://www.alphavantage.co/query';
  private finnhubUrl = 'https://finnhub.io/api/v1';
  private newsApiUrl = 'https://newsapi.org/v2';
  private coinGeckoUrl = 'https://api.coingecko.com/api/v3';

  async getStockData(symbol: string): Promise<StockData> {
    if (!FINNHUB_API_KEY) {
      throw new ApiError('Finnhub API key is not configured');
    }

    try {
      // Get real-time quote
      const quoteResponse = await fetch(
        `${this.finnhubUrl}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );

      if (!quoteResponse.ok) {
        if (quoteResponse.status === 401) {
          throw new ApiError('Invalid Finnhub API key');
        }
        throw new ApiError(`Stock service error: ${quoteResponse.status}`);
      }

      const quoteData = await quoteResponse.json();

      if (quoteData.c === 0) {
        throw new ApiError('Stock symbol not found or market is closed');
      }

      // Get company profile for name
      const profileResponse = await fetch(
        `${this.finnhubUrl}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );

      let companyName = symbol;
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        companyName = profileData.name || symbol;
      }

      const stock: StockData = {
        symbol: symbol.toUpperCase(),
        name: companyName,
        price: quoteData.c,
        change: quoteData.d || 0,
        changePercent: quoteData.dp || 0,
        volume: 0, // Finnhub doesn't provide volume in quote endpoint
        high: quoteData.h,
        low: quoteData.l,
        open: quoteData.o,
        previousClose: quoteData.pc,
        timestamp: Date.now(),
        type: 'stock'
      };

      return stock;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Network error. Please check your internet connection.');
      }
      
      throw new ApiError('An unexpected error occurred while fetching stock data.');
    }
  }

  async getCryptoData(coinId: string): Promise<CryptoData> {
    try {
      const response = await fetch(
        `${this.coinGeckoUrl}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
      );

      if (!response.ok) {
        throw new ApiError(`Crypto service error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data[coinId]) {
        throw new ApiError('Cryptocurrency not found');
      }

      const coinData = data[coinId];

      // Get additional coin info
      const infoResponse = await fetch(
        `${this.coinGeckoUrl}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );

      let coinInfo = { name: coinId, symbol: coinId };
      if (infoResponse.ok) {
        const info = await infoResponse.json();
        coinInfo = {
          name: info.name,
          symbol: info.symbol.toUpperCase()
        };
      }

      const crypto: CryptoData = {
        id: coinId,
        symbol: coinInfo.symbol,
        name: coinInfo.name,
        price: coinData.usd,
        change: coinData.usd_24h_change || 0,
        changePercent: coinData.usd_24h_change || 0,
        volume: coinData.usd_24h_vol || 0,
        marketCap: coinData.usd_market_cap || 0,
        high: coinData.usd * 1.05, // Approximate since CoinGecko simple API doesn't provide 24h high/low
        low: coinData.usd * 0.95,
        timestamp: Date.now(),
        type: 'crypto'
      };

      return crypto;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Network error. Please check your internet connection.');
      }
      
      throw new ApiError('An unexpected error occurred while fetching crypto data.');
    }
  }

  async searchAssets(query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    // Search stocks using Alpha Vantage
    if (ALPHA_VANTAGE_API_KEY) {
      try {
        const response = await fetch(
          `${this.alphaVantageUrl}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${ALPHA_VANTAGE_API_KEY}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.bestMatches) {
            const stockResults = data.bestMatches.slice(0, 5).map((match: any) => ({
              symbol: match['1. symbol'],
              name: match['2. name'],
              type: 'stock' as const,
              exchange: match['4. region']
            }));
            results.push(...stockResults);
          }
        }
      } catch (error) {
        console.warn('Stock search failed:', error);
      }
    }

    // Search crypto using CoinGecko
    try {
      const response = await fetch(
        `${this.coinGeckoUrl}/search?query=${encodeURIComponent(query)}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.coins) {
          const cryptoResults = data.coins.slice(0, 5).map((coin: any) => ({
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            type: 'crypto' as const,
            id: coin.id
          }));
          results.push(...cryptoResults);
        }
      }
    } catch (error) {
      console.warn('Crypto search failed:', error);
    }

    return results;
  }

  async getFinancialNews(): Promise<NewsItem[]> {
    if (!NEWS_API_KEY) {
      // Return mock news if API key is not available
      return this.getMockNews();
    }

    try {
      const response = await fetch(
        `${this.newsApiUrl}/everything?q=finance OR stock OR cryptocurrency&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new ApiError('Invalid NewsAPI key');
        }
        throw new ApiError(`News service error: ${response.status}`);
      }

      const data = await response.json();

      return data.articles.map((article: any, index: number) => ({
        id: `news-${index}`,
        title: article.title,
        description: article.description || '',
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
        imageUrl: article.urlToImage
      }));

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      console.warn('News API failed, using mock data:', error);
      return this.getMockNews();
    }
  }

  private getMockNews(): NewsItem[] {
    return [
      {
        id: 'mock-1',
        title: 'Stock Market Reaches New Heights Amid Economic Recovery',
        description: 'Major indices continue their upward trajectory as investors remain optimistic about economic growth.',
        url: '#',
        source: 'Financial Times',
        publishedAt: new Date().toISOString(),
      },
      {
        id: 'mock-2',
        title: 'Cryptocurrency Market Shows Strong Performance',
        description: 'Bitcoin and other major cryptocurrencies see significant gains as institutional adoption increases.',
        url: '#',
        source: 'CoinDesk',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'mock-3',
        title: 'Tech Stocks Lead Market Rally',
        description: 'Technology companies report strong earnings, driving market sentiment higher.',
        url: '#',
        source: 'Bloomberg',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
      }
    ];
  }

  // Get popular assets for initial load
  async getPopularAssets(): Promise<{ stocks: string[], cryptos: string[] }> {
    return {
      stocks: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'],
      cryptos: ['bitcoin', 'ethereum', 'cardano', 'polkadot', 'chainlink']
    };
  }
}

class ApiError extends Error {
  constructor(message: string, public code?: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const financeService = new FinanceService();
export { ApiError };