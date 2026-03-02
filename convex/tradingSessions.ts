import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tradingSessions").collect();
  },
});

export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tradingSessions")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
  },
});

export const seedTradingSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("tradingSessions").first();
    if (existing) return;

    const sessions = [
      {
        name: "Tokyo",
        status: "closed",
        openTime: "00:00",
        closeTime: "09:00",
        currentVolume: 850000,
        avgVolume: 920000,
        topMovers: [
          { symbol: "NI225", change: 0.46 },
          { symbol: "USDJPY", change: 0.29 },
          { symbol: "AUDJPY", change: -0.15 },
        ],
      },
      {
        name: "London",
        status: "open",
        openTime: "08:00",
        closeTime: "16:30",
        currentVolume: 1250000,
        avgVolume: 1180000,
        topMovers: [
          { symbol: "FTSE", change: -0.15 },
          { symbol: "GBPUSD", change: 0.20 },
          { symbol: "DAX", change: 0.73 },
        ],
      },
      {
        name: "New York",
        status: "open",
        openTime: "13:30",
        closeTime: "20:00",
        currentVolume: 2150000,
        avgVolume: 1980000,
        topMovers: [
          { symbol: "US100", change: 0.59 },
          { symbol: "US500", change: 0.30 },
          { symbol: "US30", change: -0.19 },
        ],
      },
    ];

    for (const session of sessions) {
      await ctx.db.insert("tradingSessions", {
        ...session,
        updatedAt: Date.now(),
      });
    }
  },
});
