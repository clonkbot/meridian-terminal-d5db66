import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, X, TrendingUp, TrendingDown, Star } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";

export function Watchlist() {
  const watchlists = useQuery(api.watchlists.getUserWatchlists);
  const marketData = useQuery(api.marketData.getAll);
  const createWatchlist = useMutation(api.watchlists.create);
  const addSymbol = useMutation(api.watchlists.addSymbol);
  const removeSymbol = useMutation(api.watchlists.removeSymbol);

  const [showAddSymbol, setShowAddSymbol] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [activeWatchlistId, setActiveWatchlistId] = useState<Id<"watchlists"> | null>(null);

  const handleCreateDefaultWatchlist = async () => {
    await createWatchlist({
      name: "Main Watchlist",
      symbols: ["US100", "BTCUSD", "DXY", "VIX"],
    });
  };

  const handleAddSymbol = async () => {
    if (!activeWatchlistId || !newSymbol.trim()) return;
    await addSymbol({
      watchlistId: activeWatchlistId,
      symbol: newSymbol.toUpperCase().trim(),
    });
    setNewSymbol("");
    setShowAddSymbol(false);
  };

  const handleRemoveSymbol = async (watchlistId: Id<"watchlists">, symbol: string) => {
    await removeSymbol({ watchlistId, symbol });
  };

  const getMarketDataForSymbol = (symbol: string) => {
    return marketData?.find((d: { symbol: string }) => d.symbol === symbol);
  };

  // No watchlists yet
  if (watchlists && watchlists.length === 0) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.06] border-dashed rounded-xl p-6 text-center">
        <Star className="w-8 h-8 text-amber-500/50 mx-auto mb-3" />
        <p className="text-sm text-gray-400 mb-4">No watchlists yet</p>
        <button
          onClick={handleCreateDefaultWatchlist}
          className="px-4 py-2 text-xs font-mono bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20 transition-colors"
        >
          Create Watchlist
        </button>
      </div>
    );
  }

  if (!watchlists || !marketData) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/[0.02] rounded-lg p-3 animate-pulse">
            <div className="h-4 w-16 bg-white/5 rounded mb-2" />
            <div className="h-3 w-full bg-white/5 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const activeWatchlist = watchlists[0];

  return (
    <div className="space-y-2">
      {/* Watchlist header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-gray-500">{activeWatchlist.name}</span>
        <button
          onClick={() => {
            setActiveWatchlistId(activeWatchlist._id);
            setShowAddSymbol(true);
          }}
          className="p-1 text-gray-500 hover:text-amber-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add symbol modal */}
      {showAddSymbol && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.04] border border-white/[0.08] rounded-lg p-3 mb-3"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="Symbol (e.g. AAPL)"
              className="flex-1 bg-black/50 border border-white/10 rounded px-2 py-1 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
              onKeyDown={(e) => e.key === "Enter" && handleAddSymbol()}
            />
            <button
              onClick={handleAddSymbol}
              className="px-3 py-1 text-xs font-mono bg-amber-500 text-black rounded hover:bg-amber-400 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddSymbol(false)}
              className="p-1 text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Symbols list */}
      {activeWatchlist.symbols.map((symbol: string, i: number) => {
        const data = getMarketDataForSymbol(symbol);
        return (
          <motion.div
            key={symbol}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-2.5 hover:border-white/10 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white">{symbol}</span>
                {data && (
                  data.changePercent >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )
                )}
              </div>
              <button
                onClick={() => handleRemoveSymbol(activeWatchlist._id, symbol)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-400 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {data && (
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-sm font-mono text-gray-300">
                  {data.price.toLocaleString(undefined, {
                    minimumFractionDigits: data.category === "forex" ? 4 : 2,
                    maximumFractionDigits: data.category === "forex" ? 4 : 2,
                  })}
                </span>
                <span
                  className={`text-[10px] font-mono ${
                    data.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {data.changePercent >= 0 ? "+" : ""}
                  {data.changePercent.toFixed(2)}%
                </span>
              </div>
            )}

            {data && (
              <div className="flex justify-between mt-1 text-[9px] font-mono text-gray-600">
                <span>H: {data.high.toLocaleString()}</span>
                <span>L: {data.low.toLocaleString()}</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
