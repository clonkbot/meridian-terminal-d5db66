import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("marketData").collect();
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("marketData")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const getBySymbol = query({
  args: { symbol: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("marketData")
      .withIndex("by_symbol", (q) => q.eq("symbol", args.symbol))
      .first();
  },
});

export const upsert = mutation({
  args: {
    symbol: v.string(),
    price: v.number(),
    change: v.number(),
    changePercent: v.number(),
    high: v.number(),
    low: v.number(),
    volume: v.number(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("marketData")
      .withIndex("by_symbol", (q) => q.eq("symbol", args.symbol))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("marketData", {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

// Seed initial market data
export const seedMarketData = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("marketData").first();
    if (existing) return;

    const marketData = [
      // Indices
      { symbol: "US100", price: 21245.50, change: 125.30, changePercent: 0.59, high: 21280.00, low: 21100.00, volume: 1250000, category: "indices" },
      { symbol: "US500", price: 6012.75, change: 18.25, changePercent: 0.30, high: 6025.00, low: 5990.00, volume: 980000, category: "indices" },
      { symbol: "US30", price: 44150.00, change: -85.50, changePercent: -0.19, high: 44300.00, low: 44050.00, volume: 750000, category: "indices" },
      { symbol: "DAX", price: 20125.00, change: 145.00, changePercent: 0.73, high: 20150.00, low: 19950.00, volume: 420000, category: "indices" },
      { symbol: "FTSE", price: 8425.50, change: -12.30, changePercent: -0.15, high: 8450.00, low: 8400.00, volume: 380000, category: "indices" },
      { symbol: "NI225", price: 39250.00, change: 180.00, changePercent: 0.46, high: 39300.00, low: 39000.00, volume: 520000, category: "indices" },
      // Forex
      { symbol: "DXY", price: 104.25, change: 0.15, changePercent: 0.14, high: 104.50, low: 104.00, volume: 0, category: "forex" },
      { symbol: "EURUSD", price: 1.0825, change: -0.0012, changePercent: -0.11, high: 1.0850, low: 1.0810, volume: 0, category: "forex" },
      { symbol: "GBPUSD", price: 1.2650, change: 0.0025, changePercent: 0.20, high: 1.2680, low: 1.2620, volume: 0, category: "forex" },
      { symbol: "USDJPY", price: 154.25, change: 0.45, changePercent: 0.29, high: 154.50, low: 153.80, volume: 0, category: "forex" },
      { symbol: "AUDUSD", price: 0.6525, change: -0.0018, changePercent: -0.28, high: 0.6550, low: 0.6510, volume: 0, category: "forex" },
      // Volatility
      { symbol: "VIX", price: 14.25, change: -0.85, changePercent: -5.63, high: 15.20, low: 14.10, volume: 0, category: "volatility" },
      { symbol: "VVIX", price: 82.50, change: 2.30, changePercent: 2.87, high: 84.00, low: 80.00, volume: 0, category: "volatility" },
      // Crypto
      { symbol: "BTCUSD", price: 105250.00, change: 2150.00, changePercent: 2.09, high: 106000.00, low: 103000.00, volume: 45000000000, category: "crypto" },
      { symbol: "ETHUSD", price: 3925.00, change: 85.00, changePercent: 2.21, high: 3980.00, low: 3850.00, volume: 18000000000, category: "crypto" },
      { symbol: "SOLUSD", price: 218.50, change: 12.30, changePercent: 5.97, high: 225.00, low: 205.00, volume: 8500000000, category: "crypto" },
    ];

    for (const data of marketData) {
      await ctx.db.insert("marketData", {
        ...data,
        updatedAt: Date.now(),
      });
    }
  },
});

// Simulate price updates
export const simulatePriceUpdate = mutation({
  args: {},
  handler: async (ctx) => {
    const allData = await ctx.db.query("marketData").collect();

    for (const data of allData) {
      const volatility = data.category === "crypto" ? 0.005 :
                         data.category === "volatility" ? 0.02 : 0.001;
      const priceChange = data.price * (Math.random() - 0.5) * volatility;
      const newPrice = data.price + priceChange;
      const newChange = data.change + priceChange;
      const newChangePercent = (newChange / (newPrice - newChange)) * 100;

      await ctx.db.patch(data._id, {
        price: Number(newPrice.toFixed(data.category === "forex" ? 4 : 2)),
        change: Number(newChange.toFixed(data.category === "forex" ? 4 : 2)),
        changePercent: Number(newChangePercent.toFixed(2)),
        high: Math.max(data.high, newPrice),
        low: Math.min(data.low, newPrice),
        updatedAt: Date.now(),
      });
    }
  },
});
