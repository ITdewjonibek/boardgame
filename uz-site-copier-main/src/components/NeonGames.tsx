import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const games = [
  { title: "BARABAN", desc: "Barabanni aylantiring va tasodifiy o'quvchini tanlang", usage: "300+", emoji: "🎯", color: "cyan", path: "/games/wheel" },
  { title: "XOTIRA O'YINI", desc: "Kartalarni ochib juftini toping — xotirangizni sinang", usage: "500+", emoji: "🧠", color: "magenta", path: "/games/memory" },
  { title: "VIKTORINA", desc: "Bilimingizni sinab ko'ring — test savollari", usage: "650+", emoji: "❓", color: "green", path: "/games/quiz" },
  { title: "TEZKOR HISOB", desc: "Matematik misollarni tez yeching", usage: "400+", emoji: "⚡", color: "yellow", path: "/games/math" },
  { title: "SO'Z TOPISH", desc: "Harflardan so'z tuzing va balllar to'plang", usage: "350+", emoji: "🔤", color: "orange", path: "/games/word" },
  { title: "MILLIONER", desc: "Viktorina ko'rinishidagi mashhur savol-javob o'yini", usage: "400+", emoji: "💰", color: "cyan", path: "/games/millionaire" },
];

const neonBorderMap: Record<string, string> = {
  cyan: "border-neon-cyan/40 hover:border-neon-cyan hover:shadow-[0_0_25px_hsl(185_100%_50%/0.2)]",
  magenta: "border-neon-magenta/40 hover:border-neon-magenta hover:shadow-[0_0_25px_hsl(300_100%_60%/0.2)]",
  green: "border-neon-green/40 hover:border-neon-green hover:shadow-[0_0_25px_hsl(120_100%_50%/0.2)]",
  yellow: "border-neon-yellow/40 hover:border-neon-yellow hover:shadow-[0_0_25px_hsl(55_100%_55%/0.2)]",
  orange: "border-neon-orange/40 hover:border-neon-orange hover:shadow-[0_0_25px_hsl(25_100%_55%/0.2)]",
};

const textColorMap: Record<string, string> = {
  cyan: "text-neon-cyan",
  magenta: "text-neon-magenta",
  green: "text-neon-green",
  yellow: "text-neon-yellow",
  orange: "text-neon-orange",
};

const NeonGames = () => (
  <section className="py-24 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
    <div className="container relative z-10">
      <div className="text-center mb-14">
        <p className="text-sm font-display font-bold text-neon-green uppercase tracking-[0.3em] mb-3">⚡ O'YINLAR</p>
        <h2 className="text-3xl md:text-5xl font-display font-black text-foreground">
          <span className="text-neon-magenta">INTERAKTIV</span> O'YINLAR
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">O'qituvchilar eng ko'p tanlayotgan o'yinlar</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((g, i) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={g.path}
              className={`block bg-card border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 group ${neonBorderMap[g.color]}`}
            >
              <div className="h-36 bg-muted/30 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                {g.emoji}
              </div>
              <div className="p-5">
                <h3 className={`font-display font-bold text-sm tracking-wider mb-2 ${textColorMap[g.color]}`}>{g.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{g.desc}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{g.usage} foydalanish</span>
                  <span className={`flex items-center gap-1 ${textColorMap[g.color]} font-semibold`}>
                    O'YNASH <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default NeonGames;
