import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Market data streams
  marketData: defineTable({
    symbol: v.string(),
    price: v.number(),
    change: v.number(),
    changePercent: v.number(),
    high: v.number(),
    low: v.number(),
    volume: v.number(),
    category: v.string(), // "indices", "forex", "volatility", "crypto"
    updatedAt: v.number(),
  }).index("by_symbol", ["symbol"])
    .index("by_category", ["category"]),

  // AI Macro Analysis
  macroAnalysis: defineTable({
    title: v.string(),
    content: v.string(),
    sentiment: v.string(), // "bullish", "bearish", "neutral"
    confidence: v.number(),
    topics: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_created", ["createdAt"]),

  // Bias scoring for instruments
  biasScores: defineTable({
    symbol: v.string(),
    bias: v.string(), // "long", "short", "neutral"
    score: v.number(), // -100 to 100
    technicalScore: v.number(),
    fundamentalScore: v.number(),
    sentimentScore: v.number(),
    updatedAt: v.number(),
  }).index("by_symbol", ["symbol"]),

  // Technical indicators
  technicalIndicators: defineTable({
    symbol: v.string(),
    rsi: v.number(),
    macd: v.number(),
    macdSignal: v.number(),
    ema20: v.number(),
    ema50: v.number(),
    sma200: v.number(),
    atr: v.number(),
    bollingerUpper: v.number(),
    bollingerLower: v.number(),
    updatedAt: v.number(),
  }).index("by_symbol", ["symbol"]),

  // Market mood/sentiment
  marketMood: defineTable({
    region: v.string(), // "global", "us", "eu", "asia"
    fearGreedIndex: v.number(),
    sentiment: v.string(),
    volatilityLevel: v.string(),
    riskAppetite: v.string(),
    updatedAt: v.number(),
  }).index("by_region", ["region"]),

  // Order flow data
  orderFlow: defineTable({
    symbol: v.string(),
    buyVolume: v.number(),
    sellVolume: v.number(),
    netFlow: v.number(),
    largeOrders: v.number(),
    delta: v.number(),
    updatedAt: v.number(),
  }).index("by_symbol", ["symbol"]),

  // News feed
  newsItems: defineTable({
    headline: v.string(),
    summary: v.string(),
    source: v.string(),
    category: v.string(),
    impact: v.string(), // "high", "medium", "low"
    sentiment: v.string(),
    relatedSymbols: v.array(v.string()),
    publishedAt: v.number(),
  }).index("by_published", ["publishedAt"])
    .index("by_category", ["category"]),

  // User watchlists
  watchlists: defineTable({
    userId: v.id("users"),
    name: v.string(),
    symbols: v.array(v.string()),
    isDefault: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Trading sessions
  tradingSessions: defineTable({
    name: v.string(), // "London", "New York", "Asia"
    status: v.string(), // "open", "closed", "pre-market"
    openTime: v.string(),
    closeTime: v.string(),
    currentVolume: v.number(),
    avgVolume: v.number(),
    topMovers: v.array(v.object({
      symbol: v.string(),
      change: v.number(),
    })),
    updatedAt: v.number(),
  }).index("by_name", ["name"]),

  // Relative strength baskets
  relativeStrength: defineTable({
    basket: v.string(), // "US100", "DXY", "VIX"
    components: v.array(v.object({
      symbol: v.string(),
      strength: v.number(),
      trend: v.string(),
    })),
    overallStrength: v.number(),
    trend: v.string(),
    updatedAt: v.number(),
  }).index("by_basket", ["basket"]),
});
