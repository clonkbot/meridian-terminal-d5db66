import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getLatest = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("newsItems")
      .withIndex("by_published")
      .order("desc")
      .take(limit);
  },
});

export const getByCategory = query({
  args: { category: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("newsItems")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .take(limit);
  },
});

export const seedNews = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("newsItems").first();
    if (existing) return;

    const newsData = [
      {
        headline: "Federal Reserve Signals Cautious Approach to Rate Cuts in 2025",
        summary: "Fed officials indicate patience on policy easing as inflation remains above target. Markets adjust expectations for fewer cuts.",
        source: "Reuters",
        category: "central-banks",
        impact: "high",
        sentiment: "bearish",
        relatedSymbols: ["DXY", "US10Y", "US500"],
      },
      {
        headline: "NVIDIA Reports Record Quarterly Revenue on AI Chip Demand",
        summary: "Tech giant beats estimates with $35B revenue. Data center segment surges 200% YoY. Forward guidance exceeds Wall Street expectations.",
        source: "Bloomberg",
        category: "earnings",
        impact: "high",
        sentiment: "bullish",
        relatedSymbols: ["US100", "NVDA"],
      },
      {
        headline: "Bitcoin ETF Inflows Hit $2B Weekly Record",
        summary: "Institutional adoption accelerates as spot Bitcoin ETFs see unprecedented demand. BlackRock's IBIT leads with $800M single-day inflow.",
        source: "CoinDesk",
        category: "crypto",
        impact: "high",
        sentiment: "bullish",
        relatedSymbols: ["BTCUSD", "ETHUSD"],
      },
      {
        headline: "ECB's Lagarde Hints at April Rate Cut Amid Weak Growth",
        summary: "European Central Bank president suggests policy easing may come sooner than expected as eurozone PMI disappoints.",
        source: "Financial Times",
        category: "central-banks",
        impact: "medium",
        sentiment: "bearish",
        relatedSymbols: ["EURUSD", "DAX"],
      },
      {
        headline: "Oil Prices Surge on Middle East Supply Disruption Fears",
        summary: "Brent crude jumps 3% following attacks on shipping lanes. Analysts warn of potential supply squeeze if tensions escalate.",
        source: "WSJ",
        category: "commodities",
        impact: "medium",
        sentiment: "neutral",
        relatedSymbols: ["CL", "XLE"],
      },
      {
        headline: "China Property Sector Shows Signs of Stabilization",
        summary: "New home sales in tier-1 cities rise for first time in 18 months. Government support measures beginning to take effect.",
        source: "SCMP",
        category: "macro",
        impact: "medium",
        sentiment: "bullish",
        relatedSymbols: ["HSI", "AUDUSD"],
      },
      {
        headline: "US Jobs Report Beats Expectations: NFP +275K",
        summary: "Labor market remains resilient with unemployment steady at 3.7%. Wage growth moderates to 4.1% YoY, easing inflation concerns.",
        source: "Reuters",
        category: "economic-data",
        impact: "high",
        sentiment: "bullish",
        relatedSymbols: ["US500", "DXY", "US10Y"],
      },
      {
        headline: "Solana TVL Hits All-Time High as DeFi Activity Surges",
        summary: "Total value locked on Solana reaches $8.5B. Memecoin trading and Jupiter DEX volume drive network activity to records.",
        source: "The Block",
        category: "crypto",
        impact: "medium",
        sentiment: "bullish",
        relatedSymbols: ["SOLUSD"],
      },
    ];

    for (let i = 0; i < newsData.length; i++) {
      await ctx.db.insert("newsItems", {
        ...newsData[i],
        publishedAt: Date.now() - i * 3600000,
      });
    }
  },
});
