import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchGames, type Game } from "@/lib/api";
import {
  ArrowRight,
  Gamepad2,
  Sparkles,
  Zap,
  Shield,
  Users,
  Rocket,
  Atom,
  Swords,
  BookOpen,
  Cpu,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const GAME_METADATA: Record<string, { icon: any, color: string, badge?: string }> = {
  cosmic_quiz: { icon: Rocket, color: "text-cyan-400", badge: "PREMIUM" },
  molecular_lab: { icon: Atom, color: "text-emerald-400", badge: "PRO" },
  battle_of_wits: { icon: Swords, color: "text-orange-400", badge: "DUEL" },
  verbal_quest: { icon: BookOpen, color: "text-amber-400", badge: "RPG" },
  logic_master: { icon: Cpu, color: "text-purple-400", badge: "CYBER" },
  word_chain: { icon: Sparkles, color: "text-pink-400", badge: "YANGI" },
  wheel: { icon: Gamepad2, color: "text-blue-400" },
  tug_of_war: { icon: Users, color: "text-red-400" },
  word_search: { icon: Sparkles, color: "text-yellow-400" },
  quiz: { icon: Zap, color: "text-indigo-400" },
  memory: { icon: Shield, color: "text-green-400" },
};

const SLUG_TO_PATH: Record<string, string> = {
  wheel: "/games/wheel",
  tug_of_war: "/games/tug-of-war",
  word_search: "/games/word-search",
  country: "/games/country",
  champion: "/games/champion",
  quiz: "/games/quiz",
  millionaire: "/games/millionaire",
  memory: "/games/memory",
  math: "/games/math",
  word: "/games/word",
  word_chain: "/games/word-chain",
  speed_round: "/games/speed-round",
  crossword: "/games/crossword",
  biggest: "/games/biggest",
  duel: "/games/duel",
  chain: "/games/chain",
  "cosmic-quiz": "/games/cosmic-quiz",
  "molecular-lab": "/games/molecular-lab",
  "battle-of-wits": "/games/battle-of-wits",
  "verbal-quest": "/games/verbal-quest",
  "logic-master": "/games/logic-master",
  "word-chain": "/games/word-chain",
  "cosmic_quiz": "/games/cosmic-quiz",
  "molecular_lab": "/games/molecular-lab",
  "battle_of_wits": "/games/battle-of-wits",
  "verbal_quest": "/games/verbal-quest",
  "logic_master": "/games/logic-master",
};

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    fetchGames().then(res => {
      // Manually add the new premium games if not in backend yet
      const premiumGames: Game[] = [
        { id: 101, name: "Cosmic Quiz", slug: "cosmic-quiz", description: "Koinot testi" },
        { id: 102, name: "Molecular Lab", slug: "molecular-lab", description: "Kimyo lab" },
        { id: 103, name: "Battle of Wits", slug: "battle-of-wits", description: "Matematik duel" },
        { id: 104, name: "Verbal Quest", slug: "verbal-quest", description: "RPG so'z o'yini" },
        { id: 105, name: "Logic Master", slug: "logic-master", description: "Mantiqiy xakerlik" },
        { id: 106, name: "So'z Ketgani", slug: "word-chain", description: "So'z zanjiri o'yini - yangi noyob o'yin!" },
      ];
      const existingSlugs = new Set(res.map(g => g.slug));
      const missingPremium = premiumGames.filter(g => !existingSlugs.has(g.slug));

      setGames([...missingPremium, ...res]);
    }).catch(() => setGames([]));
  }, []);

  const stats = [
    { value: games.length || 20, label: "Jami O'yinlar", icon: Gamepad2, color: "text-cyan-400" },
    { value: "125k+", label: "Faol Foydalanuvchilar", icon: Users, color: "text-emerald-400" },
    { value: "98%", label: "Muvaffaqiyat Darajasi", icon: Zap, color: "text-yellow-400" },
    { value: "24/7", label: "AI Qo'llab-quvvatlash", icon: Shield, color: "text-purple-400" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden mesh-bg">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-primary/10 via-background to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-card border-primary/20 text-primary text-sm font-bold tracking-[0.2em] mb-8 uppercase">
              <Sparkles className="w-4 h-4" />
              Zamonaviy Ta'lim
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter mb-8 leading-[0.9]">
              O'YNANG. O'RGANING. <br />
              <span className="text-gradient">RIVOJLANISHNI.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/40 max-w-3xl mx-auto mb-12 font-medium">
              Interaktiv o'yinlar va zamonaviy metodlar bilan ta'lim jarayonini yangi darajaga olib chiqing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button variant="premium" size="lg" className="h-16 px-12 text-lg group" asChild>
                <Link to="#games">
                  O'YINLARNI KO'RISH <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-16 px-12 text-lg border-white/10 hover:bg-white/5" asChild>
                <Link to="/test-manager">TEST YARATISH</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 opacity-20 hidden xl:block"
        >
          <Rocket className="w-24 h-24 text-primary" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-10 opacity-20 hidden xl:block"
        >
          <Atom className="w-24 h-24 text-secondary" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01] backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, idx) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-8 glass-card border-white/5 group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <s.icon className={`w-8 h-8 ${s.color}`} />
                </div>
                <div className="text-4xl font-display font-black text-white mb-2">{s.value}</div>
                <div className="text-sm font-bold tracking-widest text-white/30 uppercase">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Grid Section */}
      <section id="games" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="text-left">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Arxiv 2026</span>
              <h2 className="text-5xl md:text-6xl font-display font-black tracking-tighter">PREMIUM O'YINLAR</h2>
            </div>
            <p className="text-white/40 max-w-sm text-right font-medium">
              Har bir o'yin yuqori sifatli vizual effektlar va immersiv o'yin jarayoniga ega.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {games.map((g) => {
              const meta = GAME_METADATA[g.slug.replace(/-/g, '_')] || { icon: Gamepad2, color: "text-white/60" };
              const Icon = meta.icon;
              return (
                <motion.div key={g.id} variants={item}>
                  <Link
                    to={SLUG_TO_PATH[g.slug] ?? `/games/${g.slug}`}
                    className="group relative block"
                  >
                    <div className="glass-card h-full p-8 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-500 overflow-hidden">
                      {meta.badge && (
                        <div className="absolute top-4 right-4 bg-primary px-3 py-1 rounded text-[10px] font-black tracking-widest text-black">
                          {meta.badge}
                        </div>
                      )}

                      <div className="relative mb-8 inline-block">
                        <div className={`absolute inset-0 ${meta.color} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
                        <Icon className={`w-12 h-12 ${meta.color} relative z-10 group-hover:scale-110 transition-transform duration-500`} />
                      </div>

                      <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-primary transition-colors">
                        {g.name}
                      </h3>
                      <p className="text-sm text-white/30 mb-8 line-clamp-2">
                        {g.description || "O'yinni boshlash uchun bosing va bilimingizni sinab ko'ring."}
                      </p>

                      <div className="flex items-center text-xs font-bold tracking-widest text-primary opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
                        O'YINNI BOSHLASH <ChevronRight className="w-4 h-4 ml-1" />
                      </div>

                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 border-t border-white/5 bg-black/50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-display font-black mb-8 tracking-tighter">
            O'YNASHGA <span className="text-primary italic">TAYYORMI?</span>
          </h2>
          <p className="text-xl text-white/40 mb-12 max-w-2xl mx-auto">
            Ro'yxatdan o'ting va o'zingizning shaxsiy testlaringizni yaratishni hozirdanoq boshlang.
          </p>
          <Button variant="premium" size="lg" className="h-20 px-16 text-2xl font-black italic rounded-none border-b-4 border-primary/50 shadow-[0_10px_30px_rgba(var(--primary),0.2)]" asChild>
            <Link to="/login">HOZIR BOSHLANG</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
