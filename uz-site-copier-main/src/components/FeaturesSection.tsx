import { motion } from "framer-motion";
import { Gamepad2, Wrench, Layout, Smartphone } from "lucide-react";

const features = [
  { icon: Gamepad2, title: "Ta'limiy o'yinlar", desc: "O'rganishni qiziqarli qiladigan interaktiv o'yinlar" },
  { icon: Wrench, title: "Samarali vositalar", desc: "Topshiriq berish uchun qiziqarli vositalar" },
  { icon: Layout, title: "Qulay interfeys", desc: "Chiroyli va yengil foydalanuvchi interfeysi" },
  { icon: Smartphone, title: "Mobil moslashuv", desc: "Barcha qurilmalar uchun moslashuvchan UI" },
];

const FeaturesSection = () => (
  <section id="features" className="py-20">
    <div className="container">
      <div className="text-center mb-14">
        <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Platforma xususiyatlari</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
          Zamonaviy ustozlar va o'quvchilar uchun <span className="text-gradient">samarali vositalar</span>
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
            className="bg-card rounded-xl p-6 card-shadow hover:card-hover-shadow transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
