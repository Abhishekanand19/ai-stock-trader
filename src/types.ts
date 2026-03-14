export interface StockOrder {
  symbol: string;
  quantity: number;
  side: "buy" | "sell";
  type: "market" | "limit";
  time_in_force: "day" | "gtc" | "ioc";
  limit_price?: number;
}

export interface Position {
  symbol: string;
  quantity: number;
  current_price: number;
  market_value: number;
  profit_loss: number;
  profit_loss_percent: number;
}

export interface Account {
  buying_power: number;
  cash: number;
  portfolio_value: number;
  equity: number;
}

export interface StockPrice {
  symbol: string;
  price: number;
  timestamp: string;
}

export interface ToolResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}