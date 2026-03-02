import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";

export function MarketMoodPanel() {
  const moods = useQuery(api.marketMood.getAll);

  if (!moods) {
    return (
      <div className="bg-white/[0.02] rounded-lg p-4 animate-pulse">
        <div className="h-24 w-24 mx-auto bg-white/5 rounded-full mb-4" />
        <div className="h-4 w-32 mx-auto bg-white/5 rounded" />
      </div>
    );
  }

  const globalMood = moods.find((m: { region: string }) => m.region === "global");

  const getMoodColor = (index: number) => {
    if (index >= 75) return { bg: "from-emerald-500 to-emerald-400", text: "text-emerald-400" };
    if (index >= 55) return { bg: "from-emerald-600 to-emerald-500", text: "text-emerald-500" };
    if (index >= 45) return { bg: "from-amber-500 to-amber-400", text: "text-amber-400" };
    if (index >= 25) return { bg: "from-orange-500 to-orange-400", text: "text-orange-400" };
    return { bg: "from-red-500 to-red-400", text: "text-red-400" };
  };

  const getMoodLabel = (index: number) => {
    if (index >= 75) return "Extreme Greed";
    if (index >= 55) return "Greed";
    if (index >= 45) return "Neutral";
    if (index >= 25) return "Fear";
    return "Extreme Fear";
  };

  return (
    <div className="space-y-4">
      {globalMood && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
          {/* Fear & Greed Gauge */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            {/* Background arc */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="188 63"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="188 63"
                initial={{ strokeDashoffset: 188 }}
                animate={{
                  strokeDashoffset: 188 - (globalMood.fearGreedIndex / 100) * 188,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className={`text-3xl font-bold font-mono ${
                  getMoodColor(globalMood.fearGreedIndex).text
                }`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                {globalMood.fearGreedIndex}
              </motion.span>
              <span className="text-[10px] font-mono text-gray-500 uppercase">
                {getMoodLabel(globalMood.fearGreedIndex)}
              </span>
            </div>
          </div>

          {/* Labels */}
          <div className="flex justify-between text-[10px] font-mono text-gray-600 px-2">
            <span>Fear</span>
            <span>Neutral</span>
            <span>Greed</span>
          </div>
        </div>
      )}

      {/* Regional breakdown */}
      <div className="space-y-2">
        {moods
          .filter((m: { region: string }) => m.region !== "global")
          .map((mood: { _id: string; region: string; fearGreedIndex: number; volatilityLevel: string; riskAppetite: string }, i: number) => (
            <motion.div
              key={mood._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-white uppercase">
                  {mood.region}
                </span>
                <span
                  className={`text-xs font-mono ${getMoodColor(mood.fearGreedIndex).text}`}
                >
                  {mood.fearGreedIndex}
                </span>
              </div>

              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${
                    getMoodColor(mood.fearGreedIndex).bg
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${mood.fearGreedIndex}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              <div className="flex justify-between mt-2 text-[9px] font-mono text-gray-600">
                <span>Vol: {mood.volatilityLevel}</span>
                <span>Risk: {mood.riskAppetite}</span>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
