import { motion } from "framer-motion";
import { Gamepad2, Wrench, Layout, Smartphone } from "lucide-react";

const features = [
  { icon: Gamepad2, title: "TA'LIMIY O'YINLAR", desc: "O'rganishni qiziqarli qiladigan interaktiv o'yinlar", color: "cyan" },
  { icon: Wrench, title: "SAMARALI VOSITALAR", desc: "Topshiriq berish uchun qiziqarli vositalar", color: "magenta" },
  { icon: Layout, title: "QULAY INTERFEYS", desc: "Chiroyli va yengil foydalanuvchi interfeysi", color: "green" },
  { icon: Smartphone, title: "MOBIL MOSLIK", desc: "Barcha qurilmalar uchun moslashuvchan UI", color: "cyan" },
];

const colorMap: Record<string, string> = {
  cyan: "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/5",
  magenta: "text-neon-magenta border-neon-magenta/30 bg-neon-magenta/5",
  green: "text-neon-green border-neon-green/30 bg-neon-green/5",
};

const NeonFeatures = () => (
  <section id="features" className="py-24 grid-bg">
    <div className="container">
      <div className="text-center mb-16">
        <p className="text-sm font-display font-bold text-neon-magenta uppercase tracking-[0.3em] mb-3">XUSUSIYATLAR</p>
        <h2 className="text-3xl md:text-5xl font-display font-black text-foreground">
          NIMA UCHUN <span className="text-neon-cyan">BIZ?</span>
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="neon-card p-6 group"
          >
            <div className={`w-14 h-14 rounded-lg border flex items-center justify-center mb-5 ${colorMap[f.color]} transition-all duration-300`}>
              <f.icon className="w-7 h-7" />
            </div>
            <h3 className="font-display font-bold text-sm text-foreground mb-2 tracking-wider">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default NeonFeatures;
