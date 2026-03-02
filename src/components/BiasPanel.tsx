import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";

export function BiasPanel() {
  const biasScores = useQuery(api.biasScores.getAll);

  if (!biasScores) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white/[0.02] rounded-lg p-2 animate-pulse">
            <div className="h-3 w-16 bg-white/5 rounded mb-2" />
            <div className="h-2 w-full bg-white/5 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const getBiasColor = (score: number) => {
    if (score > 30) return "from-emerald-500 to-emerald-400";
    if (score < -30) return "from-red-500 to-red-400";
    return "from-amber-500 to-amber-400";
  };

  const getBiasTextColor = (score: number) => {
    if (score > 30) return "text-emerald-400";
    if (score < -30) return "text-red-400";
    return "text-amber-400";
  };

  return (
    <div className="space-y-2">
      {biasScores.slice(0, 8).map((item: { _id: string; symbol: string; bias: string; score: number; technicalScore: number; fundamentalScore: number; sentimentScore: number }, i: number) => (
        <motion.div
          key={item._id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-2.5 hover:border-white/10 transition-colors"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono font-bold text-white">{item.symbol}</span>
            <span
              className={`text-[10px] font-mono uppercase ${getBiasTextColor(item.score)}`}
            >
              {item.bias}
            </span>
          </div>

          {/* Bias bar */}
          <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
            <motion.div
              className={`absolute inset-y-0 rounded-full bg-gradient-to-r ${getBiasColor(
                item.score
              )}`}
              initial={{ width: 0 }}
              animate={{
                width: `${Math.abs(item.score) / 2}%`,
                left: item.score >= 0 ? "50%" : undefined,
                right: item.score < 0 ? "50%" : undefined,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

          {/* Score breakdown */}
          <div className="flex justify-between mt-1.5 text-[9px] font-mono text-gray-600">
            <span>T:{item.technicalScore}</span>
            <span>F:{item.fundamentalScore}</span>
            <span>S:{item.sentimentScore}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
