import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { text: "Sinfim bu o'yinlarga juda qiziqadi! Platformadan foydalangandan beri darsdagi faollik sezilarli oshdi.", name: "Dilnoza Karimova", role: "7-sinf o'qituvchisi", emoji: "👩‍🏫" },
  { text: "O'yinlar juda qiziqarli! O'qish endi majburiyat emas, zavq. Baholarim esa ancha yaxshilandi.", name: "Javohir Akmalov", role: "O'rta maktab o'quvchisi", emoji: "👨‍🎓" },
  { text: "Tayyorgarlik uchun vaqtim juda tejaldi. Platforma juda qulay va foydali.", name: "Mushtariy Abdullayeva", role: "Boshlang'ich sinf o'qituvchisi", emoji: "👩‍🏫" },
  { text: "Interaktiv o'yinlar sabab dars qilish ancha maroqli bo'ldi. Uy vazifasini bajarishni kutadigan bo'ldim!", name: "Sardorbek Mahmudov", role: "5-sinf o'quvchisi", emoji: "👨‍🎓" },
];

const TestimonialsSection = () => (
  <section id="testimonials" className="py-20 bg-secondary/30">
    <div className="container">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Ustoz va o'quvchilarning sevimli platformasi</h2>
        <p className="text-muted-foreground mt-2">Platforma haqida foydalanuvchilar fikri</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl p-6 card-shadow"
          >
            <div className="flex mb-3">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4 italic">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{t.emoji}</span>
              <div>
                <p className="text-sm font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
