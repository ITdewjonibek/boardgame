import { motion } from "framer-motion";

const games = [
  { title: "Baraban metodi", desc: "Barabanni aylantiring va tasodifiy o'quvchini tanlang.", usage: "300+", level: "Oddiy", emoji: "🎯" },
  { title: "Arqon tortish o'yini", desc: "Jamoaviy arqon tortish o'yinida g'alaba qozoning", usage: "600+", level: "Oddiy", emoji: "🏋️" },
  { title: "So'z qidiruv o'yini", desc: "Aralash harflar maydonidan so'zlarni topish o'yini", usage: "650+", level: "Murakkab", emoji: "🔍" },
  { title: "Chempion o'quvchi", desc: "O'quvchilar turnir ko'rinishida kubok uchun bellashishadi", usage: "250+", level: "Murakkab", emoji: "🏆" },
  { title: "Davlatni top o'yini", desc: "Bayroq orqali davlat nomini to'g'ri topish", usage: "250+", level: "Murakkab", emoji: "🌍" },
  { title: "Millioner o'yini", desc: "Viktorina ko'rinishidagi mashhur savol-javob o'yini", usage: "400+", level: "Murakkab", emoji: "💰" },
];

const GamesSection = () => (
  <section className="py-20 bg-secondary/30">
    <div className="container">
      <div className="text-center mb-12">
        <p className="text-sm font-bold text-accent uppercase tracking-wider mb-2">⭐ O'qituvchilarning tanlovlari</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Sevimli O'yinlar</h2>
        <p className="text-muted-foreground mt-2">O'qituvchilar eng ko'p tanlayotgan o'yinlar va metodlar</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((g, i) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-xl overflow-hidden card-shadow hover:card-hover-shadow transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
          >
            <div className="h-40 bg-primary/5 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
              {g.emoji}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-foreground text-lg mb-1">{g.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{g.desc}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-primary font-bold">{g.usage} foydalanish</span>
                <span className={`px-2 py-0.5 rounded-full font-semibold ${g.level === "Oddiy" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                  {g.level}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default GamesSection;
