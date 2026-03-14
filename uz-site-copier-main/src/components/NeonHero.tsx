import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const NeonHero = () => (
  <section className="relative min-h-screen flex items-center justify-center grid-bg pt-16 overflow-hidden">
    {/* Floating orbs */}
    <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-neon-cyan/5 blur-3xl" style={{ animation: "float 6s ease-in-out infinite" }} />
    <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-neon-magenta/5 blur-3xl" style={{ animation: "float 8s ease-in-out infinite 2s" }} />
    <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-green/3 blur-3xl" />

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
        <span className="text-neon-cyan">RAQAMLI</span>
        <br />
        <span className="text-neon-magenta">DUNYODA</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 text-xl text-muted-foreground max-w-xl font-body"
      >
        Interaktiv o'yinlar, metodlar va o'qitish vositalari — hammasi bir joyda.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="mt-10 flex flex-wrap gap-4 justify-center"
      >
        <Link to="/games" className="neon-btn flex items-center gap-2 text-base">
          O'YINLARNI BOSHLASH <ArrowRight className="w-4 h-4" />
        </Link>
        <a href="#features" className="neon-btn-magenta text-base">
          BATAFSIL
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
        <span>4.9 — O'qituvchilar bahosi</span>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-16 grid grid-cols-3 gap-8 md:gap-16"
      >
        {[
          { num: "6+", label: "O'yinlar" },
          { num: "1000+", label: "Foydalanish" },
          { num: "100+", label: "O'qituvchilar" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl md:text-4xl font-display font-black text-neon-cyan">{s.num}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default NeonHero;
