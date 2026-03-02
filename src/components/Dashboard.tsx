import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  LogOut,
  Clock,
  BarChart3,
  Globe,
  Newspaper,
  ListPlus,
  Activity,
  Brain,
  Menu,
  X,
} from "lucide-react";
import { MarketTicker } from "./MarketTicker";
import { MacroDesk } from "./MacroDesk";
import { TradingSessions } from "./TradingSessions";
import { NewsFeed } from "./NewsFeed";
import { BiasPanel } from "./BiasPanel";
import { TechnicalPanel } from "./TechnicalPanel";
import { RelativeStrength } from "./RelativeStrength";
import { MarketMoodPanel } from "./MarketMoodPanel";
import { Watchlist } from "./Watchlist";

export function Dashboard() {
  const { signOut } = useAuthActions();
  const simulatePrice = useMutation(api.marketData.simulatePriceUpdate);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      simulatePrice().catch(console.error);
    }, 3000);
    return () => clearInterval(interval);
  }, [simulatePrice]);

  // Update clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date, tz: string) => {
    return date.toLocaleTimeString("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#0a0a0c]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 lg:px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between h-14 lg:h-16 border-b border-white/[0.04]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-black" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold tracking-tight font-serif">MERIDIAN</h1>
                <p className="text-[10px] text-amber-500/60 font-mono tracking-widest uppercase hidden sm:block">
                  Trading Terminal
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-6 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">NYC</span>
                <span className="text-white">{formatTime(currentTime, "America/New_York")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">LDN</span>
                <span className="text-white">{formatTime(currentTime, "Europe/London")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">TKY</span>
                <span className="text-white">{formatTime(currentTime, "Asia/Tokyo")}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-500 font-mono">LIVE</span>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <button
                onClick={() => signOut()}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-white border border-white/10 rounded-lg hover:border-white/20 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Market ticker */}
          <MarketTicker />
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/[0.06] bg-[#0a0a0c] px-4 py-4"
          >
            <div className="flex items-center justify-between mb-4 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-gray-600">NYC </span>
                  <span className="text-white">{formatTime(currentTime, "America/New_York")}</span>
                </div>
                <div>
                  <span className="text-gray-600">LDN </span>
                  <span className="text-white">{formatTime(currentTime, "Europe/London")}</span>
                </div>
                <div>
                  <span className="text-gray-600">TKY </span>
                  <span className="text-white">{formatTime(currentTime, "Asia/Tokyo")}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-mono text-gray-400 hover:text-white border border-white/10 rounded-lg hover:border-white/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </motion.div>
        )}
      </header>

      {/* Main content - Newspaper grid layout */}
      <main className="px-4 lg:px-6 py-4 lg:py-6">
        {/* Masthead */}
        <div className="text-center border-b border-white/[0.06] pb-4 mb-4 lg:mb-6">
          <p className="text-[10px] lg:text-xs font-mono text-gray-500 mb-1 tracking-widest">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }).toUpperCase()}
          </p>
          <h2 className="text-xl lg:text-3xl font-serif font-bold tracking-tight">
            Global Markets Daily Brief
          </h2>
          <p className="text-xs lg:text-sm text-gray-500 mt-1">
            AI-Powered Analysis • Real-Time Data • Professional Trading Intelligence
          </p>
        </div>

        {/* Grid layout - responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left column */}
          <div className="lg:col-span-3 space-y-4 lg:space-y-6 order-2 lg:order-1">
            <SectionHeader icon={Activity} title="Market Mood" />
            <MarketMoodPanel />

            <SectionHeader icon={BarChart3} title="Relative Strength" />
            <RelativeStrength />

            <SectionHeader icon={ListPlus} title="Watchlist" />
            <Watchlist />
          </div>

          {/* Center column */}
          <div className="lg:col-span-6 space-y-4 lg:space-y-6 order-1 lg:order-2">
            <SectionHeader icon={Brain} title="AI Macro Desk" />
            <MacroDesk />

            <SectionHeader icon={Newspaper} title="Market News" />
            <NewsFeed />
          </div>

          {/* Right column */}
          <div className="lg:col-span-3 space-y-4 lg:space-y-6 order-3">
            <SectionHeader icon={Clock} title="Trading Sessions" />
            <TradingSessions />

            <SectionHeader icon={TrendingUp} title="Bias Scoring" />
            <BiasPanel />

            <SectionHeader icon={BarChart3} title="Technical Indicators" />
            <TechnicalPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] mt-8 lg:mt-12 py-4 lg:py-6 px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span className="font-mono">MERIDIAN TERMINAL v1.0</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Real-time market data for educational purposes</span>
          </div>
          <div className="text-center sm:text-right">
            <span className="text-gray-500">
              Requested by{" "}
              <a
                href="https://twitter.com/michaelonsol"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500/70 hover:text-amber-500 transition-colors"
              >
                @michaelonsol
              </a>
              {" · "}
              Built by{" "}
              <a
                href="https://twitter.com/clonkbot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500/70 hover:text-amber-500 transition-colors"
              >
                @clonkbot
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-amber-500/20 pb-2">
      <Icon className="w-4 h-4 text-amber-500" />
      <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
        {title}
      </h3>
    </div>
  );
}
