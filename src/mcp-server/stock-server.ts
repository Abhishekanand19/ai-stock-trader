import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import Alpaca from "@alpacahq/alpaca-trade-api";
import dotenv from "dotenv";

dotenv.config();

// Initialize Alpaca client
// Note: 'any' is used here because the official Alpaca types sometimes lag behind the SDK version
const alpaca = new (Alpaca as any)({
  keyId: process.env.ALPACA_API_KEY!,
  secretKey: process.env.ALPACA_API_SECRET!,
  paper: true,
  baseUrl: process.env.ALPACA_BASE_URL,
});

// Create MCP server
const server = new Server(
  {
    name: "stock-trading-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "buy_stock",
        description: "Buy shares of a stock at market price",
        inputSchema: {
          type: "object",
          properties: {
            symbol: { type: "string", description: "Ticker symbol (e.g., AAPL)" },
            quantity: { type: "number", description: "Number of shares" },
          },
          required: ["symbol", "quantity"],
        },
      },
      {
        name: "sell_stock",
        description: "Sell shares of a stock at market price",
        inputSchema: {
          type: "object",
          properties: {
            symbol: { type: "string", description: "Ticker symbol" },
            quantity: { type: "number", description: "Number of shares" },
          },
          required: ["symbol", "quantity"],
        },
      },
      {
        name: "get_positions",
        description: "Get all current stock positions",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "get_account",
        description: "Get account info and buying power",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "get_stock_price",
        description: "Get the current real-time price of a stock",
        inputSchema: {
          type: "object",
          properties: {
            symbol: { type: "string", description: "Ticker symbol" },
          },
          required: ["symbol"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "buy_stock": {
        const { symbol, quantity } = args as { symbol: string; quantity: number };
        const order = await alpaca.createOrder({
          symbol: symbol.toUpperCase(),
          qty: quantity,
          side: "buy",
          type: "market",
          time_in_force: "day",
        });
        return { content: [{ type: "text", text: `Order ${order.id} placed for ${symbol}. Status: ${order.status}` }] };
      }

      case "sell_stock": {
        const { symbol, quantity } = args as { symbol: string; quantity: number };
        const order = await alpaca.createOrder({
          symbol: symbol.toUpperCase(),
          qty: quantity,
          side: "sell",
          type: "market",
          time_in_force: "day",
        });
        return { content: [{ type: "text", text: `Order ${order.id} placed for ${symbol}. Status: ${order.status}` }] };
      }

      case "get_positions": {
        const positions = await alpaca.getPositions();
        return { content: [{ type: "text", text: JSON.stringify(positions, null, 2) }] };
      }

      case "get_account": {
        const account = await alpaca.getAccount();
        return { content: [{ type: "text", text: JSON.stringify(account, null, 2) }] };
      }

      case "get_stock_price": {
        const { symbol } = args as { symbol: string };
        const trade = await alpaca.getLatestTrade(symbol.toUpperCase());
        // Use trade.Price (Uppercase P) for Alpaca response format
        return { content: [{ type: "text", text: `The current price of ${symbol.toUpperCase()} is $${trade.Price}` }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Stock Trading MCP Server running");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});