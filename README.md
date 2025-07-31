# Personal Finance Dashboard

A comprehensive financial tracking application that provides real-time stock prices, cryptocurrency data, market news, and portfolio management tools.

## Features

- **Real-time Stock Data**: Current prices, daily changes, and market information
- **Cryptocurrency Tracking**: Live crypto prices and market data
- **Portfolio Management**: Add/remove assets, track performance
- **Market News**: Latest financial news and market updates
- **Price Alerts**: Set alerts for target prices (frontend simulation)
- **Data Filtering**: Sort and filter by performance, market cap, sector
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Error Handling**: Robust error handling for API failures

## APIs Used

- **Alpha Vantage API**: Stock market data and company information
  - Documentation: https://www.alphavantage.co/documentation/
- **Finnhub API**: Real-time stock prices and market data
  - Documentation: https://finnhub.io/docs/api
- **NewsAPI**: Financial news and market updates
  - Documentation: https://newsapi.org/docs
- **CoinGecko API**: Cryptocurrency data (no API key required)
  - Documentation: https://www.coingecko.com/en/api/documentation

## Local Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- API keys from Alpha Vantage, Finnhub, and NewsAPI

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd finance-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
VITE_FINNHUB_API_KEY=your_finnhub_api_key_here
VITE_NEWS_API_KEY=your_news_api_key_here
```

### Getting API Keys

#### Alpha Vantage API
1. Visit https://www.alphavantage.co/support/#api-key
2. Sign up for a free account
3. Get your API key (free tier: 5 calls/minute, 500/day)
4. Add it to your `.env` file

#### Finnhub API
1. Visit https://finnhub.io/register
2. Sign up for a free account
3. Get your API key (free tier: 60 calls/minute)
4. Add it to your `.env` file

#### NewsAPI
1. Visit https://newsapi.org/register
2. Sign up for a free account
3. Get your API key (free tier: 1000 requests/day)
4. Add it to your `.env` file

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. **Search Assets**: Use the search bar to find stocks (e.g., "AAPL", "TSLA") or cryptocurrencies
2. **Add to Portfolio**: Click the heart icon to add assets to your watchlist
3. **View Details**: Click on any asset to see detailed information
4. **Sort & Filter**: Use the controls to sort by price change, market cap, or alphabetically
5. **Market News**: Stay updated with the latest financial news
6. **Set Alerts**: Set price targets for your favorite assets

## Project Structure

```
src/
├── components/          # React components
│   ├── AssetCard.tsx
│   ├── SearchBar.tsx
│   ├── NewsCard.tsx
│   ├── PortfolioSummary.tsx
│   └── PriceChart.tsx
├── services/           # API service functions
│   └── financeService.ts
├── types/              # TypeScript type definitions
│   └── finance.ts
├── utils/              # Utility functions
│   └── helpers.ts
└── App.tsx            # Main application component
```

## Error Handling

The application includes comprehensive error handling for:
- API rate limits
- Network connectivity issues
- Invalid asset searches
- Missing API keys
- Server downtime

## Security

- API keys are stored in environment variables
- No sensitive data is exposed in the client-side code
- Input validation prevents malicious queries

## Future Enhancements

- Real-time price alerts via notifications
- Advanced charting and technical analysis
- Portfolio performance analytics
- User authentication and data persistence
- Mobile app version

## Credits

- Stock data provided by Alpha Vantage and Finnhub APIs
- Cryptocurrency data from CoinGecko API
- News data from NewsAPI
- Icons from Lucide React
- Built with React, TypeScript, and Tailwind CSS

## License

This project is for educational purposes as part of a web development assignment.