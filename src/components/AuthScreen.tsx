import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Zap, Globe } from "lucide-react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials" : "Account creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnonymous = async () => {
    setIsSubmitting(true);
    try {
      await signIn("anonymous");
    } catch (err) {
      setError("Failed to continue as guest");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px]" />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left panel - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center"
        >
          <div className="mb-8 lg:mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-black" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight font-serif">
                MERIDIAN
              </h1>
            </div>
            <p className="text-amber-500/60 font-mono text-xs tracking-[0.3em] uppercase">
              AI Trading Intelligence
            </p>
          </div>

          <h2 className="text-3xl lg:text-5xl xl:text-6xl font-serif text-white leading-tight mb-6 lg:mb-8">
            Institutional-Grade{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Market Intelligence
            </span>
          </h2>

          <p className="text-gray-400 text-base lg:text-lg leading-relaxed mb-8 lg:mb-12 max-w-xl">
            Real-time market data, AI-powered macro analysis, and professional trading tools.
            Built for traders who demand precision.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            {[
              { icon: Zap, label: "Real-time Data", desc: "Sub-second updates" },
              { icon: Shield, label: "AI Analysis", desc: "Macro insights" },
              { icon: Globe, label: "Global Markets", desc: "24/7 coverage" },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4"
              >
                <feature.icon className="w-5 h-5 text-amber-500 mb-2" />
                <p className="text-white font-medium text-sm">{feature.label}</p>
                <p className="text-gray-500 text-xs">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right panel - Auth form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center"
        >
          <div className="w-full max-w-md">
            <div className="bg-[#111114] border border-white/[0.06] rounded-2xl p-6 lg:p-8 shadow-2xl shadow-black/50">
              <div className="text-center mb-6 lg:mb-8">
                <h3 className="text-xl lg:text-2xl font-serif text-white mb-2">
                  {flow === "signIn" ? "Welcome Back" : "Create Account"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {flow === "signIn"
                    ? "Sign in to access your terminal"
                    : "Start your trading journey"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                    placeholder="trader@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <input name="flow" type="hidden" value={flow} />

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold py-3 rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                      />
                      Processing...
                    </span>
                  ) : flow === "signIn" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="relative my-6 lg:my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#111114] px-4 text-gray-500 font-mono">or</span>
                </div>
              </div>

              <button
                onClick={handleAnonymous}
                disabled={isSubmitting}
                className="w-full bg-white/[0.03] border border-white/10 text-gray-300 font-medium py-3 rounded-lg hover:bg-white/[0.06] hover:border-white/20 transition-all disabled:opacity-50"
              >
                Continue as Guest
              </button>

              <p className="text-center text-gray-500 text-sm mt-6">
                {flow === "signIn" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                  className="text-amber-500 hover:text-amber-400 transition-colors"
                >
                  {flow === "signIn" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            <p className="text-center text-gray-600 text-xs mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
