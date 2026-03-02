import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("biasScores").collect();
  },
});

export const getBySymbol = query({
  args: { symbol: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("biasScores")
      .withIndex("by_symbol", (q) => q.eq("symbol", args.symbol))
      .first();
  },
});

export const upsert = mutation({
  args: {
    symbol: v.string(),
    bias: v.string(),
    score: v.number(),
    technicalScore: v.number(),
    fundamentalScore: v.number(),
    sentimentScore: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("biasScores")
      .withIndex("by_symbol", (q) => q.eq("symbol", args.symbol))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("biasScores", {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

export const seedBiasScores = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("biasScores").first();
    if (existing) return;

    const biasData = [
      { symbol: "US100", bias: "long", score: 68, technicalScore: 72, fundamentalScore: 65, sentimentScore: 67 },
      { symbol: "US500", bias: "long", score: 55, technicalScore: 58, fundamentalScore: 52, sentimentScore: 55 },
      { symbol: "US30", bias: "neutral", score: 12, technicalScore: 15, fundamentalScore: 8, sentimentScore: 13 },
      { symbol: "DXY", bias: "long", score: 42, technicalScore: 48, fundamentalScore: 38, sentimentScore: 40 },
      { symbol: "EURUSD", bias: "short", score: -38, technicalScore: -42, fundamentalScore: -35, sentimentScore: -37 },
      { symbol: "GBPUSD", bias: "neutral", score: 8, technicalScore: 12, fundamentalScore: 5, sentimentScore: 7 },
      { symbol: "VIX", bias: "short", score: -52, technicalScore: -55, fundamentalScore: -48, sentimentScore: -53 },
      { symbol: "BTCUSD", bias: "long", score: 75, technicalScore: 78, fundamentalScore: 70, sentimentScore: 77 },
      { symbol: "ETHUSD", bias: "long", score: 62, technicalScore: 65, fundamentalScore: 58, sentimentScore: 63 },
      { symbol: "SOLUSD", bias: "long", score: 82, technicalScore: 85, fundamentalScore: 78, sentimentScore: 83 },
    ];

    for (const data of biasData) {
      await ctx.db.insert("biasScores", {
        ...data,
        updatedAt: Date.now(),
      });
    }
  },
});
