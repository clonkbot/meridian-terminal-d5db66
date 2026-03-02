import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { Clock, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";

export function NewsFeed() {
  const news = useQuery(api.news.getLatest, { limit: 8 });

  if (!news) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white/[0.02] rounded-lg p-4 animate-pulse">
            <div className="h-4 w-3/4 bg-white/5 rounded mb-2" />
            <div className="h-3 w-full bg-white/5 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return <TrendingUp className="w-3 h-3 text-emerald-400" />;
      case "bearish":
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 text-amber-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Featured news (first item)
  const featured = news[0];
  const otherNews = news.slice(1);

  return (
    <div className="space-y-4">
      {/* Featured news */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] rounded-xl p-4 lg:p-5 hover:border-white/10 transition-colors group cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 text-[10px] font-mono rounded border ${getImpactColor(
                  featured.impact
                )}`}
              >
                {featured.impact.toUpperCase()} IMPACT
              </span>
              <span className="text-[10px] font-mono text-gray-500">{featured.source}</span>
            </div>
            {getSentimentIcon(featured.sentiment)}
          </div>

          <h4 className="text-base lg:text-lg font-serif font-bold text-white leading-snug mb-2 group-hover:text-amber-400 transition-colors">
            {featured.headline}
          </h4>

          <p className="text-sm text-gray-400 leading-relaxed mb-3">{featured.summary}</p>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {featured.relatedSymbols.slice(0, 3).map((symbol: string) => (
                <span
                  key={symbol}
                  className="px-1.5 py-0.5 text-[10px] font-mono bg-amber-500/10 text-amber-400 rounded"
                >
                  {symbol}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-600">
              <Clock className="w-3 h-3" />
              {formatTime(featured.publishedAt)}
            </div>
          </div>
        </motion.div>
      )}

      {/* News grid */}
      <div className="grid grid-cols-1 gap-3">
        {otherNews.map((item: { _id: string; headline: string; summary: string; source: string; sentiment: string; impact: string; relatedSymbols: string[]; publishedAt: number }, i: number) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg hover:border-white/10 transition-colors group cursor-pointer"
          >
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              {getSentimentIcon(item.sentiment)}
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  item.impact === "high"
                    ? "bg-red-400"
                    : item.impact === "medium"
                    ? "bg-amber-400"
                    : "bg-gray-500"
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-medium text-white leading-snug mb-1 group-hover:text-amber-400 transition-colors line-clamp-2">
                {item.headline}
              </h5>
              <div className="flex items-center gap-2 text-[10px] text-gray-600">
                <span className="font-mono">{item.source}</span>
                <span>•</span>
                <span>{formatTime(item.publishedAt)}</span>
                {item.relatedSymbols.length > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-amber-500/70">{item.relatedSymbols[0]}</span>
                  </>
                )}
              </div>
            </div>

            <ExternalLink className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors flex-shrink-0" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
