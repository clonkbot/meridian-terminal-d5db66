import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getBySymbol = query({
  args: { symbol: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("technicalIndicators")
      .withIndex("by_symbol", (q) => q.eq("symbol", args.symbol))
      .first();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("technicalIndicators").collect();
  },
});

export const seedTechnicalIndicators = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("technicalIndicators").first();
    if (existing) return;

    const indicators = [
      { symbol: "US100", rsi: 62.5, macd: 45.2, macdSignal: 38.1, ema20: 21150, ema50: 20950, sma200: 19850, atr: 185.5, bollingerUpper: 21450, bollingerLower: 20850 },
      { symbol: "US500", rsi: 58.2, macd: 12.8, macdSignal: 10.5, ema20: 5980, ema50: 5920, sma200: 5650, atr: 42.3, bollingerUpper: 6080, bollingerLower: 5920 },
      { symbol: "DXY", rsi: 55.8, macd: 0.15, macdSignal: 0.12, ema20: 104.1, ema50: 103.8, sma200: 103.2, atr: 0.45, bollingerUpper: 104.8, bollingerLower: 103.5 },
      { symbol: "EURUSD", rsi: 42.3, macd: -0.0025, macdSignal: -0.0018, ema20: 1.0845, ema50: 1.0880, sma200: 1.0920, atr: 0.0065, bollingerUpper: 1.0920, bollingerLower: 1.0750 },
      { symbol: "VIX", rsi: 35.2, macd: -1.25, macdSignal: -0.85, ema20: 15.2, ema50: 16.8, sma200: 18.5, atr: 1.85, bollingerUpper: 18.5, bollingerLower: 12.5 },
      { symbol: "BTCUSD", rsi: 68.5, macd: 1250, macdSignal: 980, ema20: 102500, ema50: 98500, sma200: 85000, atr: 2850, bollingerUpper: 110000, bollingerLower: 98000 },
      { symbol: "ETHUSD", rsi: 64.2, macd: 85, macdSignal: 68, ema20: 3850, ema50: 3720, sma200: 3250, atr: 125, bollingerUpper: 4100, bollingerLower: 3700 },
      { symbol: "SOLUSD", rsi: 72.8, macd: 12.5, macdSignal: 9.2, ema20: 210, ema50: 195, sma200: 165, atr: 15.5, bollingerUpper: 235, bollingerLower: 195 },
    ];

    for (const data of indicators) {
      await ctx.db.insert("technicalIndicators", {
        ...data,
        updatedAt: Date.now(),
      });
    }
  },
});
