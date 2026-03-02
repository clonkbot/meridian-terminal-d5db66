import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export function TradingSessions() {
  const sessions = useQuery(api.tradingSessions.getAll);

  if (!sessions) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/[0.02] rounded-lg p-3 animate-pulse">
            <div className="h-4 w-20 bg-white/5 rounded mb-2" />
            <div className="h-3 w-full bg-white/5 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-emerald-500";
      case "pre-market":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-3">
      {sessions.map((session: { _id: string; name: string; status: string; openTime: string; closeTime: string; currentVolume: number; avgVolume: number; topMovers: { symbol: string; change: number }[] }, i: number) => (
        <motion.div
          key={session._id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 hover:border-white/10 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${getStatusColor(session.status)} ${
                  session.status === "open" ? "animate-pulse" : ""
                }`}
              />
              <span className="text-sm font-semibold text-white">{session.name}</span>
            </div>
            <span className="text-[10px] font-mono text-gray-500 uppercase">
              {session.status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Clock className="w-3 h-3" />
            <span>
              {session.openTime} - {session.closeTime} UTC
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Volume</span>
            <span
              className={`font-mono ${
                session.currentVolume > session.avgVolume
                  ? "text-emerald-400"
                  : "text-gray-400"
              }`}
            >
              {((session.currentVolume / session.avgVolume) * 100).toFixed(0)}% avg
            </span>
          </div>

          {/* Volume bar */}
          <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                session.currentVolume > session.avgVolume
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                  : "bg-gradient-to-r from-gray-600 to-gray-500"
              }`}
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((session.currentVolume / session.avgVolume) * 100, 100)}%`,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          {/* Top movers */}
          {session.topMovers.length > 0 && (
            <div className="mt-3 pt-2 border-t border-white/[0.04]">
              <span className="text-[10px] font-mono text-gray-600 uppercase">Top Movers</span>
              <div className="flex gap-2 mt-1 flex-wrap">
                {session.topMovers.map((mover: { symbol: string; change: number }) => (
                  <span
                    key={mover.symbol}
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      mover.change >= 0
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {mover.symbol} {mover.change >= 0 ? "+" : ""}
                    {mover.change.toFixed(2)}%
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
