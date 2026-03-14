import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, ShieldCheck, ArrowLeft, Sparkles, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/add-test");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-white overflow-hidden flex items-center justify-center p-4 mesh-bg">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-md w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-widest uppercase">TERMINALGA QAYTISH</span>
          </Link>

          <div className="relative inline-block mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full scale-150"
            />
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 glass-card flex items-center justify-center relative z-10">
              <Rocket className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
            </div>
          </div>

          <h1 className="text-5xl font-display font-black tracking-tighter mb-2">ACCESS CONTROL</h1>
          <p className="text-white/40 font-medium tracking-[0.2em] uppercase text-xs">Identifikatsiya tizimi v4.0</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-card p-10 border-white/5 bg-white/[0.02] relative"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black px-6 py-1 font-display font-black italic text-xs skew-x-[-12deg] shadow-[0_5px_15px_rgba(var(--primary),0.3)]">
            SECURE CONNECT
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-8 text-red-400 text-sm font-medium"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-white/30 uppercase ml-1">KOD_NOMI</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="USER_ADMIN"
                className="h-14 bg-white/5 border-white/10 text-lg rounded-xl focus:border-primary/50 transition-all font-mono"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-white/30 uppercase ml-1">PAROL_KALITI</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-14 bg-white/5 border-white/10 text-lg rounded-xl focus:border-primary/50 transition-all font-mono"
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={loading}
                variant="premium"
                className="h-16 text-lg font-black italic rounded-xl border-b-4 border-primary/50 shadow-[0_10px_30px_rgba(var(--primary),0.2)] group"
              >
                <LogIn className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                {loading ? "AUTHORIZING..." : "SYSTEM_ENTRY"}
              </Button>

              <button
                type="button"
                onClick={() => { setUsername("admin"); setPassword("admin123"); setError(""); }}
                className="h-14 rounded-xl border border-white/10 text-white/40 text-sm font-bold tracking-widest uppercase hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-3"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Quick Demo Bypass
              </button>
            </div>
          </form>

          <div className="mt-12 flex items-center justify-center gap-6 opacity-20 hover:opacity-100 transition-opacity">
            <ShieldCheck className="w-6 h-6" />
            <div className="h-px w-12 bg-white/20" />
            <span className="text-[10px] font-mono tracking-widest uppercase">Encrypted 256-bit AES</span>
            <div className="h-px w-12 bg-white/20" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-[10px] font-mono tracking-[0.3em] text-white/20 uppercase"
        >
          System authorized for Jonibek Jonjorayev © 2026
        </motion.p>
      </div>
    </div>
  );
}
