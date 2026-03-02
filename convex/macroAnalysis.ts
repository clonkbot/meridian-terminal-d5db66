import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getLatest = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    return await ctx.db
      .query("macroAnalysis")
      .withIndex("by_created")
      .order("desc")
      .take(limit);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    sentiment: v.string(),
    confidence: v.number(),
    topics: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("macroAnalysis", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const seedMacroAnalysis = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("macroAnalysis").first();
    if (existing) return;

    const analyses = [
      {
        title: "Fed Policy Outlook: Rates Likely to Remain Higher for Longer",
        content: "The Federal Reserve's latest communications suggest a hawkish stance will persist through Q1 2025. Core PCE remains sticky above 2.5%, and labor markets show resilience despite cooling. Expect USD strength and pressure on risk assets in the near term. Key levels: DXY 104.50 resistance, US10Y yields testing 4.5%.",
        sentiment: "bearish",
        confidence: 78,
        topics: ["Federal Reserve", "Interest Rates", "USD", "Monetary Policy"],
      },
      {
        title: "China Stimulus Measures Boost Global Risk Appetite",
        content: "Beijing's latest fiscal stimulus package targeting infrastructure and property sectors has exceeded market expectations. Asian equities rally with HSI up 3.2%. Commodity currencies (AUD, NZD) showing strength. Watch copper prices for continuation signals. Risk-on sentiment likely to persist into weekly close.",
        sentiment: "bullish",
        confidence: 72,
        topics: ["China", "Stimulus", "Commodities", "Risk Sentiment"],
      },
      {
        title: "Geopolitical Tensions: Energy Markets in Focus",
        content: "Escalating tensions in the Middle East have pushed crude oil above $78/barrel. Energy sector outperforming broader markets. VIX elevated but not signaling panic. Portfolio positioning suggests hedging demand increasing. Consider defensive rotations and volatility plays.",
        sentiment: "neutral",
        confidence: 65,
        topics: ["Geopolitics", "Energy", "Volatility", "Risk Management"],
      },
      {
        title: "Tech Earnings Season: AI Theme Remains Dominant",
        content: "Mega-cap tech earnings continue to surprise to the upside with AI monetization narratives driving valuations. NASDAQ 100 breaking key resistance levels. Breadth improving as mid-caps participate. Momentum indicators suggest continuation, though RSI approaching overbought territory.",
        sentiment: "bullish",
        confidence: 82,
        topics: ["Technology", "Earnings", "AI", "NASDAQ"],
      },
      {
        title: "European Central Bank: Divergence from Fed Playbook",
        content: "ECB signals potential rate cuts in H1 2025 as eurozone growth stagnates. EUR weakness accelerating with EURUSD testing 1.08 support. German Bunds rallying. European exporters may benefit from currency tailwinds. Watch for further policy divergence implications.",
        sentiment: "bearish",
        confidence: 70,
        topics: ["ECB", "EUR", "European Markets", "Rate Cuts"],
      },
    ];

    for (const analysis of analyses) {
      await ctx.db.insert("macroAnalysis", {
        ...analysis,
        createdAt: Date.now() - Math.random() * 86400000,
      });
    }
  },
});
