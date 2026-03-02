import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export function MarketTicker() {
  const marketData = useQuery(api.marketData.getAll);

  if (!marketData) {
    return (
      <div className="h-10 flex items-center">
        <div className="animate-pulse flex gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-2">
              <div className="h-3 w-12 bg-white/5 rounded" />
              <div className="h-3 w-16 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-10 flex items-center overflow-hidden">
      <motion.div
        className="flex gap-4 sm:gap-8"
        animate={{ x: [0, -1000] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {[...marketData, ...marketData].map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-xs font-mono font-bold text-white">{item.symbol}</span>
            <span className="text-xs font-mono text-gray-300">
              {item.price.toLocaleString(undefined, {
                minimumFractionDigits: item.category === "forex" ? 4 : 2,
                maximumFractionDigits: item.category === "forex" ? 4 : 2,
              })}
            </span>
            <span
              className={`flex items-center gap-0.5 text-xs font-mono ${
                item.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {item.changePercent >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {item.changePercent >= 0 ? "+" : ""}
              {item.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
