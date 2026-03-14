import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { checkApiHealth } from "@/lib/api";
import { Gamepad2, LogOut, PlusCircle, Home, Menu, X, BookOpen } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, logout } = useAuth();
  const loc = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkApiHealth().then(setApiOnline);
    const t = setInterval(() => checkApiHealth().then(setApiOnline), 30000);
    return () => clearInterval(t);
  }, []);

  const navLink = (to: string, label: string, Icon: React.ElementType) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${loc.pathname === to ? "bg-cyan-500/20 text-cyan-400" : "text-white/70 hover:text-white hover:bg-white/5"
        }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--bg))]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[hsl(var(--bg))]/95 backdrop-blur-xl shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white hidden sm:inline">BoardGame</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {apiOnline !== null && (
                <span className={`w-2 h-2 rounded-full mr-1 ${apiOnline ? "bg-emerald-500" : "bg-amber-500"}`} title={apiOnline ? "Server ishlayapti" : "Server oflayn"} />
              )}
              {navLink("/", "Bosh sahifa", Home)}
              {isLoggedIn && navLink("/test-manager", "Test boshqaruvi", PlusCircle)}
              {isLoggedIn ? (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white/70 hover:text-white hover:bg-white/5"
                >
                  <LogOut className="w-4 h-4" /> Chiqish
                </button>
              ) : (
                <Link to="/login" className="btn-primary flex items-center gap-2 px-6 py-2.5 ml-2">
                  Kirish
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-3 md:hidden">
              {apiOnline !== null && (
                <span
                  className={`w-2 h-2 rounded-full ${apiOnline ? "bg-emerald-500" : "bg-amber-500"}`}
                  title={apiOnline ? "Server ishlayapti" : "Server oflayn"}
                />
              )}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-white/80 hover:bg-white/10"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="md:hidden py-4 border-t border-white/10 flex flex-col gap-2">
              {navLink("/", "Bosh sahifa", Home)}
              {isLoggedIn && navLink("/test-manager", "Test boshqaruvi", PlusCircle)}
              {isLoggedIn ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white/70"
                >
                  <LogOut className="w-4 h-4" /> Chiqish
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary flex items-center gap-2 px-5 py-2.5">
                  Kirish
                </Link>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-white/10 bg-black/40 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="font-bold text-lg text-white">BoardGame</span>
              </div>
              <p className="text-white/50 text-sm max-w-md">
                Ta'limni barcha uchun qiziqarli va samarali qilamiz. 15+ interaktiv o'yin, testlar va metodlar.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Havolalar</h4>
              <div className="flex flex-col gap-2 text-sm text-white/50">
                <Link to="/" className="hover:text-cyan-400 transition-colors">Bosh sahifa</Link>
                <Link to="/#oyinlar" className="hover:text-cyan-400 transition-colors">O'yinlar</Link>
                <Link to="/login" className="hover:text-cyan-400 transition-colors">Kirish</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platforma</h4>
              <p className="text-sm text-white/50">15+ ta o'yin</p>
              <p className="text-sm text-white/50">Test qo'shish imkoniyati</p>
              <p className="text-sm text-white/50">Database bilan integratsiya</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">© 2026 BoardGame. Barcha huquqlar himoyalangan.</p>
            {apiOnline !== null && (
              <span className={`text-xs px-3 py-1 rounded-full ${apiOnline ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                {apiOnline ? "Server onlayn" : "Server oflayn"}
              </span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
