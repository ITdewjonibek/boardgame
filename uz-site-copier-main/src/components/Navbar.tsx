import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Xususiyatlar", href: "#features" },
  { label: "Qanday ishlaydi", href: "#how-it-works" },
  { label: "Izohlar", href: "#testimonials" },
  { label: "Aloqa", href: "#faq" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2 font-extrabold text-xl text-foreground">
          📚 Interaktiv-ta'lim
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
          <Button size="sm">Bepul qo'shilish</Button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-card border-b overflow-hidden"
          >
            <div className="container py-4 flex flex-col gap-3">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-semibold text-muted-foreground hover:text-primary py-2">
                  {l.label}
                </a>
              ))}
              <Button size="sm" className="w-fit">Bepul qo'shilish</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
