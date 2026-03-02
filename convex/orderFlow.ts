import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getBySymbol = query({
  args: { symbol: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orderFlow")
      .withIndex("by_symbol", (q) => q.eq("symbol", args.symbol))
      .first();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orderFlow").collect();
  },
});

export const seedOrderFlow = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("orderFlow").first();
    if (existing) return;

    const flowData = [
      { symbol: "US100", buyVolume: 680000, sellVolume: 520000, netFlow: 160000, largeOrders: 245, delta: 12.5 },
      { symbol: "US500", buyVolume: 520000, sellVolume: 480000, netFlow: 40000, largeOrders: 180, delta: 4.2 },
      { symbol: "US30", buyVolume: 380000, sellVolume: 420000, netFlow: -40000, largeOrders: 125, delta: -5.3 },
      { symbol: "EURUSD", buyVolume: 2500000, sellVolume: 2800000, netFlow: -300000, largeOrders: 520, delta: -6.8 },
      { symbol: "BTCUSD", buyVolume: 25000000000, sellVolume: 22000000000, netFlow: 3000000000, largeOrders: 1850, delta: 8.5 },
      { symbol: "ETHUSD", buyVolume: 9500000000, sellVolume: 8800000000, netFlow: 700000000, largeOrders: 920, delta: 5.2 },
    ];

    for (const data of flowData) {
      await ctx.db.insert("orderFlow", {
        ...data,
        updatedAt: Date.now(),
      });
    }
  },
});
