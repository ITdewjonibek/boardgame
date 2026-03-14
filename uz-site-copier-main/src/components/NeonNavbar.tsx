import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "O'yinlar", href: "/games" },
  { label: "Xususiyatlar", href: "/#features" },
  { label: "Qanday ishlaydi", href: "/#how-it-works" },
  { label: "Aloqa", href: "/#faq" },
];

const NeonNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-neon-cyan/20">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-neon-cyan">
          <Zap className="w-5 h-5" />
          INTERTALIM
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link key={l.href} to={l.href} className="text-sm font-semibold text-muted-foreground hover:text-neon-cyan transition-colors">
              {l.label}
            </Link>
          ))}
          <Link to="/games" className="neon-btn text-sm py-2 px-4">O'YNASH</Link>
        </div>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background/95 border-b border-neon-cyan/20 overflow-hidden"
          >
            <div className="container py-4 flex flex-col gap-3">
              {navLinks.map((l) => (
                <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="text-sm font-semibold text-muted-foreground hover:text-neon-cyan py-2">
                  {l.label}
                </Link>
              ))}
              <Link to="/games" onClick={() => setOpen(false)} className="neon-btn text-sm py-2 px-4 w-fit text-center">O'YNASH</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NeonNavbar;
