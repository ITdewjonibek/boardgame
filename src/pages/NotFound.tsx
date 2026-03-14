import { Link } from "react-router-dom";
import { Home, Gamepad2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Sahifa topilmadi</h1>
        <p className="text-white/50 mb-8">
          Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary inline-flex items-center justify-center gap-2 py-4 px-8"
          >
            <Home className="w-5 h-5" />
            Bosh sahifa
          </Link>
          <Link
            to="/#oyinlar"
            className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-xl border border-white/20 text-white font-semibold hover:border-cyan-400/50 transition-colors"
          >
            <Gamepad2 className="w-5 h-5" />
            O'yinlar
          </Link>
        </div>
      </div>
    </div>
  );
}
