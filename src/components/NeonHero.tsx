import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const NeonHero = () => (
  <section className="relative min-h-screen flex items-center justify-center grid-bg pt-16 overflow-hidden">
    {/* Floating orbs */}
    <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-neon-cyan/5 blur-3xl" style={{ animation: "float 6s ease-in-out infinite" }} />
    <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-neon-magenta/5 blur-3xl" style={{ animation: "float 8s ease-in-out infinite 2s" }} />
    <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-green/3 blur-3xl" />

    {/* Decorative Stickers */}
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-10 left-5 text-4xl">📚</motion.div>
    <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-32 right-12 text-5xl">🎓</motion.div>
    <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute bottom-32 left-1/4 text-4xl">⭐</motion.div>
    <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-16 right-1/4 text-5xl">🚀</motion.div>
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute top-1/3 right-5 text-4xl">💡</motion.div>
    <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 3.5, repeat: Infinity }} className="absolute bottom-1/4 left-10 text-4xl">🎯</motion.div>
    <motion.div animate={{ rotate: -360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} className="absolute top-2/3 right-1/3 text-5xl">🏆</motion.div>
    <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4.5, repeat: Infinity }} className="absolute bottom-1/3 right-5 text-4xl">✨</motion.div>

    <div className="container relative z-10 flex flex-col items-center text-center py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 border border-neon-cyan/30 rounded-full px-4 py-1.5 text-sm font-semibold text-neon-cyan mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
        100+ O'qituvchilar platformada
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-tight max-w-4xl"
      >
        <span className="text-foreground">TA'LIM</span>
        <br />
        <span className="bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan bg-clip-text text-transparent animate-pulse">RAQAMLI</span>
        <br />
        <span className="bg-gradient-to-r from-neon-magenta via-neon-green to-neon-magenta bg-clip-text text-transparent">DUNYODA</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 text-lg text-muted-foreground max-w-xl font-body font-semibold"
      >
        🎮 Interaktiv o'yinlar, metodlar va o'qitish vositalari — hammasi bir joyda. 🎮
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="mt-10 flex flex-wrap gap-4 justify-center"
      >
        <Link to="/games" className="neon-btn flex items-center gap-2 text-base px-8 py-3 font-bold">
          🎮 O'YINLARNI BOSHLASH <ArrowRight className="w-5 h-5" />
        </Link>
        <a href="#features" className="neon-btn-magenta text-base px-8 py-3 font-bold">
          📖 BATAFSIL
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex items-center gap-3 text-sm text-muted-foreground"
      >
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < 5 ? "fill-neon-yellow text-neon-yellow" : ""}`} />
          ))}
        </div>
        <span>⭐ 4.9 — O'qituvchilar bahosi</span>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-16 grid grid-cols-3 gap-8 md:gap-16"
      >
        {[
          { num: "6+", label: "O'yinlar", emoji: "🎯" },
          { num: "1000+", label: "Foydalanish", emoji: "👥" },
          { num: "100+", label: "O'qituvchilar", emoji: "👨‍🏫" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-4xl mb-2">{s.emoji}</div>
            <div className="text-3xl md:text-4xl font-display font-black text-neon-cyan">{s.num}</div>
            <div className="text-sm text-muted-foreground mt-1 font-semibold">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default NeonHero;
