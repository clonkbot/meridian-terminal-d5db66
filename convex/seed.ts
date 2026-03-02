import { mutation } from "./_generated/server";
import { api } from "./_generated/api";

export const seedAllData = mutation({
  args: {},
  handler: async (ctx) => {
    // Seed all data tables
    await ctx.runMutation(api.marketData.seedMarketData, {});
    await ctx.runMutation(api.macroAnalysis.seedMacroAnalysis, {});
    await ctx.runMutation(api.biasScores.seedBiasScores, {});
    await ctx.runMutation(api.technicalIndicators.seedTechnicalIndicators, {});
    await ctx.runMutation(api.marketMood.seedMarketMood, {});
    await ctx.runMutation(api.orderFlow.seedOrderFlow, {});
    await ctx.runMutation(api.news.seedNews, {});
    await ctx.runMutation(api.tradingSessions.seedTradingSessions, {});
    await ctx.runMutation(api.relativeStrength.seedRelativeStrength, {});
  },
});
