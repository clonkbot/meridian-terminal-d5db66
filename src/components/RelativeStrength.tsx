import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function RelativeStrength() {
  const baskets = useQuery(api.relativeStrength.getAll);
  const [expandedBasket, setExpandedBasket] = useState<string | null>("US100");

  if (!baskets) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/[0.02] rounded-lg p-3 animate-pulse">
            <div className="h-4 w-20 bg-white/5 rounded mb-2" />
            <div className="h-2 w-full bg-white/5 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "bullish":
        return <TrendingUp className="w-3 h-3 text-emerald-400" />;
      case "bearish":
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 text-amber-400" />;
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength > 50) return "bg-emerald-500";
    if (strength < -50) return "bg-red-500";
    if (strength > 0) return "bg-emerald-500/60";
    if (strength < 0) return "bg-red-500/60";
    return "bg-gray-500";
  };

  return (
    <div className="space-y-3">
      {baskets.map((basket: { _id: string; basket: string; overallStrength: number; trend: string; components: { symbol: string; strength: number; trend: string }[] }, i: number) => (
        <motion.div
          key={basket._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-lg overflow-hidden"
        >
          <button
            onClick={() =>
              setExpandedBasket(expandedBasket === basket.basket ? null : basket.basket)
            }
            className="w-full p-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-white">{basket.basket}</span>
              {getTrendIcon(basket.trend)}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-mono font-bold ${
                  basket.overallStrength > 0 ? "text-emerald-400" : basket.overallStrength < 0 ? "text-red-400" : "text-gray-400"
                }`}
              >
                {basket.overallStrength > 0 ? "+" : ""}
                {basket.overallStrength}
              </span>
            </div>
          </button>

          {/* Strength bar */}
          <div className="px-3 pb-2">
            <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
              <motion.div
                className={`absolute inset-y-0 rounded-full ${getStrengthColor(
                  basket.overallStrength
                )}`}
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.abs(basket.overallStrength) / 2}%`,
                  left: basket.overallStrength >= 0 ? "50%" : undefined,
                  right: basket.overallStrength < 0 ? "50%" : undefined,
                }}
              />
            </div>
          </div>

          {/* Expanded components */}
          {expandedBasket === basket.basket && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/[0.06] bg-black/20"
            >
              <div className="p-2 space-y-1">
                {basket.components.map((comp: { symbol: string; strength: number; trend: string }) => (
                  <div
                    key={comp.symbol}
                    className="flex items-center justify-between py-1 px-2 hover:bg-white/[0.02] rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-400">
                        {comp.symbol}
                      </span>
                      {getTrendIcon(comp.trend)}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${getStrengthColor(comp.strength)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.abs(comp.strength)}%` }}
                        />
                      </div>
                      <span
                        className={`text-[10px] font-mono w-8 text-right ${
                          comp.strength > 0 ? "text-emerald-400" : comp.strength < 0 ? "text-red-400" : "text-gray-500"
                        }`}
                      >
                        {comp.strength > 0 ? "+" : ""}
                        {comp.strength}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
