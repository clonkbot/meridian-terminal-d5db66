import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("relativeStrength").collect();
  },
});

export const getByBasket = query({
  args: { basket: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("relativeStrength")
      .withIndex("by_basket", (q) => q.eq("basket", args.basket))
      .first();
  },
});

export const seedRelativeStrength = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("relativeStrength").first();
    if (existing) return;

    const baskets = [
      {
        basket: "US100",
        overallStrength: 72,
        trend: "bullish",
        components: [
          { symbol: "AAPL", strength: 68, trend: "bullish" },
          { symbol: "MSFT", strength: 75, trend: "bullish" },
          { symbol: "NVDA", strength: 85, trend: "bullish" },
          { symbol: "AMZN", strength: 62, trend: "neutral" },
          { symbol: "GOOGL", strength: 58, trend: "neutral" },
          { symbol: "META", strength: 78, trend: "bullish" },
          { symbol: "TSLA", strength: 45, trend: "bearish" },
        ],
      },
      {
        basket: "DXY",
        overallStrength: 58,
        trend: "neutral",
        components: [
          { symbol: "EURUSD", strength: -42, trend: "bearish" },
          { symbol: "GBPUSD", strength: -15, trend: "neutral" },
          { symbol: "USDJPY", strength: 65, trend: "bullish" },
          { symbol: "USDCHF", strength: 52, trend: "neutral" },
          { symbol: "USDCAD", strength: 48, trend: "neutral" },
        ],
      },
      {
        basket: "VIX",
        overallStrength: -45,
        trend: "bearish",
        components: [
          { symbol: "VIX", strength: -52, trend: "bearish" },
          { symbol: "VVIX", strength: -38, trend: "bearish" },
          { symbol: "VXN", strength: -48, trend: "bearish" },
          { symbol: "MOVE", strength: -35, trend: "neutral" },
        ],
      },
    ];

    for (const basket of baskets) {
      await ctx.db.insert("relativeStrength", {
        ...basket,
        updatedAt: Date.now(),
      });
    }
  },
});
