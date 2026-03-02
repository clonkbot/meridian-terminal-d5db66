import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("marketMood").collect();
  },
});

export const getByRegion = query({
  args: { region: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("marketMood")
      .withIndex("by_region", (q) => q.eq("region", args.region))
      .first();
  },
});

export const seedMarketMood = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("marketMood").first();
    if (existing) return;

    const moods = [
      { region: "global", fearGreedIndex: 62, sentiment: "greed", volatilityLevel: "low", riskAppetite: "high" },
      { region: "us", fearGreedIndex: 68, sentiment: "greed", volatilityLevel: "low", riskAppetite: "high" },
      { region: "eu", fearGreedIndex: 52, sentiment: "neutral", volatilityLevel: "moderate", riskAppetite: "moderate" },
      { region: "asia", fearGreedIndex: 58, sentiment: "greed", volatilityLevel: "moderate", riskAppetite: "moderate" },
    ];

    for (const mood of moods) {
      await ctx.db.insert("marketMood", {
        ...mood,
        updatedAt: Date.now(),
      });
    }
  },
});
