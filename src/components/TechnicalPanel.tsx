import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { useState } from "react";

export function TechnicalPanel() {
  const indicators = useQuery(api.technicalIndicators.getAll);
  const [selectedSymbol, setSelectedSymbol] = useState("US100");

  if (!indicators) {
    return (
      <div className="bg-white/[0.02] rounded-lg p-4 animate-pulse">
        <div className="h-4 w-24 bg-white/5 rounded mb-4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-3 w-full bg-white/5 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const selected = indicators.find((i: { symbol: string }) => i.symbol === selectedSymbol);

  const getRSIColor = (rsi: number) => {
    if (rsi >= 70) return "text-red-400";
    if (rsi <= 30) return "text-emerald-400";
    return "text-gray-300";
  };

  const getRSILabel = (rsi: number) => {
    if (rsi >= 70) return "Overbought";
    if (rsi <= 30) return "Oversold";
    return "Neutral";
  };

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg overflow-hidden">
      {/* Symbol selector */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-white/[0.06] bg-white/[0.02]">
        {indicators.map((ind: { symbol: string }) => (
          <button
            key={ind.symbol}
            onClick={() => setSelectedSymbol(ind.symbol)}
            className={`px-2 py-1 text-[10px] font-mono rounded transition-colors ${
              selectedSymbol === ind.symbol
                ? "bg-amber-500 text-black"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            {ind.symbol}
          </button>
        ))}
      </div>

      {selected && (
        <motion.div
          key={selected.symbol}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 space-y-3"
        >
          {/* RSI */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-gray-500">RSI (14)</span>
              <span className={`text-xs font-mono font-bold ${getRSIColor(selected.rsi)}`}>
                {selected.rsi.toFixed(1)} <span className="text-[9px] font-normal">{getRSILabel(selected.rsi)}</span>
              </span>
            </div>
            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="w-[30%] bg-emerald-500/20 border-r border-white/10" />
                <div className="w-[40%] bg-white/5" />
                <div className="w-[30%] bg-red-500/20 border-l border-white/10" />
              </div>
              <motion.div
                className="absolute top-0 bottom-0 w-1 bg-white rounded-full"
                initial={{ left: 0 }}
                animate={{ left: `${selected.rsi}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* MACD */}
          <div className="flex items-center justify-between py-2 border-t border-white/[0.04]">
            <span className="text-[10px] font-mono text-gray-500">MACD</span>
            <div className="text-right">
              <span
                className={`text-xs font-mono font-bold ${
                  selected.macd > selected.macdSignal ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {selected.macd.toFixed(2)}
              </span>
              <span className="text-[9px] font-mono text-gray-600 ml-1">
                / {selected.macdSignal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Moving Averages */}
          <div className="space-y-1.5 py-2 border-t border-white/[0.04]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-500">EMA 20</span>
              <span className="text-xs font-mono text-gray-300">
                {selected.ema20.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-500">EMA 50</span>
              <span className="text-xs font-mono text-gray-300">
                {selected.ema50.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-500">SMA 200</span>
              <span className="text-xs font-mono text-gray-300">
                {selected.sma200.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Bollinger Bands */}
          <div className="py-2 border-t border-white/[0.04]">
            <span className="text-[10px] font-mono text-gray-500 block mb-2">
              Bollinger Bands
            </span>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400">{selected.bollingerLower.toLocaleString()}</span>
              <span className="text-gray-600">—</span>
              <span className="text-red-400">{selected.bollingerUpper.toLocaleString()}</span>
            </div>
          </div>

          {/* ATR */}
          <div className="flex items-center justify-between py-2 border-t border-white/[0.04]">
            <span className="text-[10px] font-mono text-gray-500">ATR (14)</span>
            <span className="text-xs font-mono text-amber-400">
              {selected.atr.toFixed(2)}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
