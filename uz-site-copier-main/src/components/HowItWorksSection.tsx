import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Ro'yhatdan o'ting", desc: "Platforma hozir test rejimida — sinab ko'rish uchun ro'yxatdan o'tish shart emas" },
  { num: "02", title: "O'yinlardan birini tanlang", desc: "Muvaffaqiyatli ro'yhatdan o'tgandan so'ng o'yinlardan birini tanlang." },
  { num: "03", title: "Birga O'ynang va O'rgating", desc: "Qiziqarli, interaktiv o'yinlar va vositalardan foydalanib dars sifatini oshiring." },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-20">
    <div className="container">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Platforma qanday ishlaydi</h2>
        <p className="text-muted-foreground mt-2">Uchta oddiy qadamda boshlang</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-extrabold text-primary">{s.num}</span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{s.title}</h3>
            <p className="text-muted-foreground text-sm">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
