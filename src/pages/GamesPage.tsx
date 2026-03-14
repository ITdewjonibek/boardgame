import { Link } from "react-router-dom";
import NeonNavbar from "@/components/NeonNavbar";
import { NeonFooter } from "@/components/NeonFooterCTA";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const allGames = [
  { title: "BARABAN", desc: "Random isim tushsa, shu isimga mos testlar chiqadi", emoji: "🎯", color: "cyan", path: "/games/baraban" },
  { title: "ARQON TORTISH", desc: "Jamoaviy arqon tortish o'yinida g'alaba qozoning", emoji: "🪢", color: "orange", path: "/games/tug-of-war" },
  { title: "SO'Z QIDIRUV", desc: "Aralash harflar maydonidan so'zlarni topish", emoji: "🔤", color: "green", path: "/games/word-search" },
  { title: "XOTIRA O'YINI", desc: "Kartalarni ochib juftini toping", emoji: "🧠", color: "magenta", path: "/games/memory" },
  { title: "VIKTORINA", desc: "Bilimingizni sinab ko'ring", emoji: "❓", color: "green", path: "/games/quiz" },
  { title: "CHEMPION O'QUVCHI", desc: "Turnir ko'rinishida kubok uchun bellashish", emoji: "🏆", color: "yellow", path: "/games/champion" },
  { title: "DAVLATNI TOP", desc: "Bayroq orqali davlat nomini toping", emoji: "🌍", color: "magenta", path: "/games/country" },
  { title: "TEZKOR HISOB", desc: "Matematik misollarni tez yeching", emoji: "⚡", color: "yellow", path: "/games/math" },
  { title: "SO'Z TOPISH", desc: "Harflardan so'z tuzing va ball to'plang", emoji: "🔤", color: "orange", path: "/games/word" },
  { title: "MILLIONER", desc: "Mashhur savol-javob o'yini", emoji: "💰", color: "cyan", path: "/games/millionaire" },
];

const textMap: Record<string, string> = {
  cyan: "text-neon-cyan", magenta: "text-neon-magenta", green: "text-neon-green",
  yellow: "text-neon-yellow", orange: "text-neon-orange",
};
const borderMap: Record<string, string> = {
  cyan: "border-neon-cyan/30 hover:border-neon-cyan",
  magenta: "border-neon-magenta/30 hover:border-neon-magenta",
  green: "border-neon-green/30 hover:border-neon-green",
  yellow: "border-neon-yellow/30 hover:border-neon-yellow",
  orange: "border-neon-orange/30 hover:border-neon-orange",
};

const GamesPage = () => (
  <div className="min-h-screen">
    <NeonNavbar />
    <div className="pt-24 pb-16 container">
      <h1 className="text-4xl md:text-5xl font-display font-black text-foreground text-center mb-4">
        BARCHA <span className="text-neon-cyan">O'YINLAR</span>
      </h1>
      <p className="text-center text-muted-foreground mb-12 text-lg">O'yinni tanlang va o'ynashni boshlang!</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {allGames.map((g, i) => (
          <motion.div key={g.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link to={g.path} className={`block bg-card border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 group ${borderMap[g.color]}`}>
              <div className="h-40 bg-muted/20 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">{g.emoji}</div>
              <div className="p-6">
                <h3 className={`font-display font-bold tracking-wider mb-2 ${textMap[g.color]}`}>{g.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{g.desc}</p>
                <span className={`flex items-center gap-1 text-sm font-semibold ${textMap[g.color]}`}>O'YNASH <ArrowRight className="w-3 h-3" /></span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
    <NeonFooter />
  </div>
);

export default GamesPage;
