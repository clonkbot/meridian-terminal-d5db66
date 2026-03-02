import { useConvexAuth } from "convex/react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";
import { AuthScreen } from "./components/AuthScreen";
import { Dashboard } from "./components/Dashboard";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const seedData = useMutation(api.seed.seedAllData);

  useEffect(() => {
    if (isAuthenticated) {
      seedData().catch(console.error);
    }
  }, [isAuthenticated, seedData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 border-2 border-amber-500/20 rounded-full" />
            <motion.div
              className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-amber-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-amber-500/60 font-mono text-sm tracking-widest uppercase">
            Initializing Terminal
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isAuthenticated ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Dashboard />
        </motion.div>
      ) : (
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AuthScreen />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
