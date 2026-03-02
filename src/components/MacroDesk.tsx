import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";

export function MacroDesk() {
  const analyses = useQuery(api.macroAnalysis.getLatest, { limit: 5 });

  if (!analyses) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/[0.02] rounded-xl p-4 animate-pulse">
            <div className="h-4 w-3/4 bg-white/5 rounded mb-3" />
            <div className="h-3 w-full bg-white/5 rounded mb-2" />
            <div className="h-3 w-2/3 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case "bearish":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-amber-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "border-emerald-500/30 bg-emerald-500/5";
      case "bearish":
        return "border-red-500/30 bg-red-500/5";
      default:
        return "border-amber-500/30 bg-amber-500/5";
    }
  };

  return (
    <div className="space-y-4">
      {/* Featured analysis */}
      {analyses[0] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 lg:p-6 border ${getSentimentColor(analyses[0].sentiment)}`}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-white/5 rounded-lg">
              <Brain className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-amber-500 uppercase tracking-wider">
                  AI Analysis
                </span>
                <span className="text-[10px] font-mono text-gray-500">
                  {analyses[0].confidence}% confidence
                </span>
              </div>
              <h4 className="text-base lg:text-lg font-serif font-bold text-white leading-tight">
                {analyses[0].title}
              </h4>
            </div>
            {getSentimentIcon(analyses[0].sentiment)}
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">{analyses[0].content}</p>
          <div className="flex flex-wrap gap-2">
            {analyses[0].topics.map((topic: string) => (
              <span
                key={topic}
                className="px-2 py-1 text-[10px] font-mono bg-white/5 text-gray-400 rounded-md"
              >
                {topic}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Other analyses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
        {analyses.slice(1).map((analysis: { _id: string; title: string; content: string; sentiment: string; confidence: number; topics: string[] }, i: number) => (
          <motion.div
            key={analysis._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 lg:p-4 hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h5 className="text-sm font-serif font-semibold text-white leading-snug line-clamp-2">
                {analysis.title}
              </h5>
              {getSentimentIcon(analysis.sentiment)}
            </div>
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{analysis.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {analysis.topics.slice(0, 2).map((topic: string) => (
                  <span
                    key={topic}
                    className="px-1.5 py-0.5 text-[9px] font-mono bg-white/5 text-gray-500 rounded"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <span className="text-[10px] font-mono text-gray-600">
                {analysis.confidence}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
