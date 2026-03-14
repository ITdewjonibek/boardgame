import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => (
  <section className="py-20 hero-bg">
    <div className="container text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-extrabold text-foreground mb-4"
      >
        Ta'limingizni yangi bosqichga olib chiqmoqchimisiz?
      </motion.h2>
      <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
        Allaqachon yuzlab o'quvchilar va ustozlar ta'limni qiziqarli va samarali qilmoqda.
      </p>
      <Button size="lg" className="gap-2">
        Bepul boshlash <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t py-8">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <span className="font-bold text-foreground">📚 BoardGame</span>
      <span>© 2025 Intertalim.uz — Barcha huquqlar himoyalangan</span>
    </div>
  </footer>
);

export { CTASection, Footer };
