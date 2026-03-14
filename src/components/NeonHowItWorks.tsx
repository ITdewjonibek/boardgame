import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "PLATFORMAGA KIRING", desc: "Ro'yxatdan o'tish shart emas — hoziroq sinab ko'ring", color: "text-neon-cyan" },
  { num: "02", title: "O'YINNI TANLANG", desc: "Ko'plab interaktiv o'yinlar va metodlardan birini tanlang", color: "text-neon-magenta" },
  { num: "03", title: "O'RGATING VA O'YNANG", desc: "Dars sifatini oshiring va o'quvchilarni qiziqtiring", color: "text-neon-green" },
];

const NeonHowItWorks = () => (
  <section id="how-it-works" className="py-24 grid-bg">
    <div className="container">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-display font-black text-foreground">
          QANDAY <span className="text-neon-cyan">ISHLAYDI?</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connection line */}
        <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-neon-cyan/30 via-neon-magenta/30 to-neon-green/30" />
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center relative"
          >
            <div className={`w-20 h-20 rounded-full border-2 border-current flex items-center justify-center mx-auto mb-6 ${s.color}`}
              style={{ boxShadow: i === 0 ? "var(--glow-cyan)" : i === 1 ? "var(--glow-magenta)" : "var(--glow-green)" }}
            >
              <span className="text-2xl font-display font-black">{s.num}</span>
            </div>
            <h3 className={`text-lg font-display font-bold mb-3 tracking-wider ${s.color}`}>{s.title}</h3>
            <p className="text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default NeonHowItWorks;
