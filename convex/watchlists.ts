import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserWatchlists = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("watchlists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    symbols: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingWatchlists = await ctx.db
      .query("watchlists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return await ctx.db.insert("watchlists", {
      userId,
      name: args.name,
      symbols: args.symbols,
      isDefault: existingWatchlists.length === 0,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("watchlists"),
    name: v.optional(v.string()),
    symbols: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const watchlist = await ctx.db.get(args.id);
    if (!watchlist || watchlist.userId !== userId) {
      throw new Error("Watchlist not found");
    }

    await ctx.db.patch(args.id, {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.symbols !== undefined && { symbols: args.symbols }),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("watchlists") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const watchlist = await ctx.db.get(args.id);
    if (!watchlist || watchlist.userId !== userId) {
      throw new Error("Watchlist not found");
    }

    await ctx.db.delete(args.id);
  },
});

export const addSymbol = mutation({
  args: {
    watchlistId: v.id("watchlists"),
    symbol: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const watchlist = await ctx.db.get(args.watchlistId);
    if (!watchlist || watchlist.userId !== userId) {
      throw new Error("Watchlist not found");
    }

    if (!watchlist.symbols.includes(args.symbol)) {
      await ctx.db.patch(args.watchlistId, {
        symbols: [...watchlist.symbols, args.symbol],
      });
    }
  },
});

export const removeSymbol = mutation({
  args: {
    watchlistId: v.id("watchlists"),
    symbol: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const watchlist = await ctx.db.get(args.watchlistId);
    if (!watchlist || watchlist.userId !== userId) {
      throw new Error("Watchlist not found");
    }

    await ctx.db.patch(args.watchlistId, {
      symbols: watchlist.symbols.filter((s) => s !== args.symbol),
    });
  },
});
