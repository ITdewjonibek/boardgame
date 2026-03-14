import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-kids.png";

const HeroSection = () => (
  <section className="relative hero-bg pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
    <div className="container relative z-10 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 bg-card rounded-full px-4 py-1.5 text-sm font-semibold text-muted-foreground card-shadow mb-6"
      >
        🎉 100+ O'qituvchilar safiga qo'shiling
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight max-w-3xl"
      >
        Ta'lim jarayoni biz bilan{" "}
        <span className="text-gradient">Raqamli</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mt-5 text-lg text-muted-foreground max-w-xl"
      >
        Interaktiv o'yinlar, metodlar va o'qitish vositalari — hammasi bir joyda. O'rganish va o'qitish usulingizni boyiting.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="mt-8 flex flex-wrap gap-4 justify-center"
      >
        <Button size="lg" className="gap-2">
          Hozir boshlash <ArrowRight className="w-4 h-4" />
        </Button>
        <Button size="lg" variant="outline">
          O'yinlarni ko'rish
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
      >
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < 4 ? "fill-accent text-accent" : "fill-accent/50 text-accent/50"}`} />
          ))}
        </div>
        O'qituvchilar 4.7 bilan baholadi
      </motion.div>

      <motion.img
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        src={heroImage}
        alt="Ta'lim bolalar"
        className="mt-10 max-w-2xl w-full rounded-2xl"
      />
    </div>
  </section>
);

export default HeroSection;
