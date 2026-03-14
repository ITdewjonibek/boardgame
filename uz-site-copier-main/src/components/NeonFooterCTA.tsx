import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

const NeonCTA = () => (
  <section className="py-24 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-cyan/3 blur-3xl" />
    <div className="container relative z-10 text-center">
      <h2 className="text-3xl md:text-5xl font-display font-black text-foreground mb-4">
        TAYYOR<span className="text-neon-cyan">MISIZ?</span>
      </h2>
      <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
        Yuzlab o'qituvchilar va o'quvchilar allaqachon platformadan foydalanmoqda.
      </p>
      <Link to="/games" className="neon-btn inline-flex items-center gap-2 text-lg px-8 py-4">
        HOZIR BOSHLASH <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  </section>
);

const NeonFooter = () => (
  <footer className="border-t border-neon-cyan/10 py-8">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <span className="font-display font-bold text-neon-cyan flex items-center gap-2">
        <Zap className="w-4 h-4" /> INTERTALIM
      </span>
      <span>© 2025 Intertalim.uz — Barcha huquqlar himoyalangan</span>
    </div>
  </footer>
);

export { NeonCTA, NeonFooter };
