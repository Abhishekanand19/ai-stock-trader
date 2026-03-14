 🤖 AI Stock Trading Agent

An intelligent stock trading agent powered by Google Gemini and Alpaca API. Chat naturally to buy, sell, and manage your stock portfolio!

## ✨ Features

- 💬 Natural language trading with Google Gemini
- 📈 Real-time stock price lookups
- 💰 Buy and sell stocks via voice commands
- 📊 Portfolio management and position tracking
- 🔍 Order history and account information
- 🎯 Paper trading (no real money risk)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Alpaca account (free paper trading)
- Google Gemini API key

### Installation

1. Clone or create the project:
   ```bash
   mkdir ai-stock-trader
   cd ai-stock-trader
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   ALPACA_API_KEY=your_key
   ALPACA_API_SECRET=your_secret
   ALPACA_BASE_URL=https://paper-api.alpaca.markets
   GEMINI_API_KEY=your_gemini_key
   ```

4. Run the agent:
   ```bash
   npm start
   ```

## 📖 Usage Examples

```
You: Buy 10 shares of Apple
🤖 Gemini: I've purchased 10 shares of AAPL for you!

You: What's my portfolio worth?
🤖 Gemini: Your portfolio value is $12,450.00

You: Show all my positions
🤖 Gemini: You have positions in:
- AAPL: 10 shares (+$250.00)
- TSLA: 5 shares (-$45.00)

You: What's the current price of Tesla?
🤖 Gemini: TSLA is currently trading at $242.84
```

## 🛠️ Available Commands

- Buy/sell stocks: "Buy 5 AAPL", "Sell all my Tesla shares"
- Check prices: "What's the price of Microsoft?"
- View portfolio: "Show my positions", "How's my portfolio doing?"
- Account info: "How much buying power do I have?"
- Order history: "Show my recent orders"

## 🔑 Getting API Keys

1. **Alpaca**: Sign up at [alpaca.markets](https://alpaca.markets) → Get paper trading keys
2. **Gemini**: Get key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 📁 Project Structure

```
ai-stock-trader/
├── src/
│   ├── mcp-server/
│   │   └── stock-server.ts    # MCP server handling Alpaca API
│   ├── client.ts               # Main Gemini chat client
│   └── types.ts                # TypeScript interfaces
├── .env                        # API credentials
├── package.json
└── tsconfig.json
```

## 🎯 Hackathon Tips

1. Use paper trading to avoid real money risk
2. Test basic flows first (buy → check positions → sell)
3. Add error handling for edge cases
4. Consider rate limits (Alpaca has limits on paper trading)

## 🐛 Troubleshooting

- **"Invalid API key"**: Check your `.env` file
- **"Market is closed"**: Paper trading works 24/7, but prices may be stale
- **Connection errors**: Ensure MCP server is running

## 📚 Resources

- [Alpaca API Docs](https://docs.alpaca.markets/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [MCP Protocol](https://modelcontextprotocol.io/)

## 🤝 Contributing

Feel free to enhance this project! Ideas:
- Add limit orders
- Portfolio analytics
- Price alerts
- Multi-asset support

## 📄 License

MIT License - use freely for your hackathon!

---

Built with ❤️ for hackathons


## 🎯 Setup Instructions

1. **Create all files** in the structure shown above
2. **Get API Keys**:
   - Alpaca: https://app.alpaca.markets/signup
   - Gemini: https://makersuite.google.com/app/apikey
3. **Fill `.env`** with your credentials
4. **Install & Run**:
   ```bash
   npm install
   npm start
   ```

## ✅ What You Need to Provide

1. ✅ Alpaca API Key & Secret (from alpaca.markets)
2. ✅ Google Gemini API Key (from Google AI Studio)
3. ✅ Node.js installed (v18+)
4. ✅ VS Code (you already have this)

That's it! Everything else is in the code above. Copy each file exactly as shown and you're ready to go! 🚀