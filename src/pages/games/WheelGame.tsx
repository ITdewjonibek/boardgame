import { useState, useCallback } from "react";
import NeonNavbar from "@/components/NeonNavbar";
import { NeonFooter } from "@/components/NeonFooterCTA";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

const defaultNames = ["Ali", "Vali", "Dilnoza", "Javohir", "Sardor", "Malika", "Nodir", "Gulnora", "Aziz", "Kamola"];

const WheelGame = () => {
  const [names, setNames] = useState(defaultNames);
  const [inputVal, setInputVal] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  const addName = () => {
    if (inputVal.trim() && !names.includes(inputVal.trim())) {
      setNames([...names, inputVal.trim()]);
      setInputVal("");
    }
  };

  const removeName = (n: string) => setNames(names.filter((x) => x !== n));

  const spin = useCallback(() => {
    if (spinning || names.length === 0) return;
    setSpinning(true);
    setWinner(null);
    const extra = 1440 + Math.random() * 1440;
    const newRot = rotation + extra;
    setRotation(newRot);

    setTimeout(() => {
      const deg = newRot % 360;
      const sliceAngle = 360 / names.length;
      const idx = Math.floor((360 - deg + sliceAngle / 2) % 360 / sliceAngle) % names.length;
      setWinner(names[idx]);
      setSpinning(false);
    }, 4000);
  }, [spinning, names, rotation]);

  const colors = ["#00e5ff", "#ff00ff", "#00ff88", "#ffeb3b", "#ff6f00", "#7c4dff", "#ff1744", "#00bfa5"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-neon-cyan/5 relative overflow-hidden">
      {/* Decorative stickers */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-32 right-10 text-5xl z-0">🎯</motion.div>
      <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute bottom-40 left-5 text-4xl z-0">⭐</motion.div>
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute top-1/2 right-1/4 text-5xl z-0">🎪</motion.div>
      
      <NeonNavbar />
      <div className="pt-24 pb-16 container relative z-10">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-5xl md:text-6xl font-display font-black mb-4"
          >
            🎯 <span className="bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan bg-clip-text text-transparent animate-pulse">BARABAN</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-lg text-neon-magenta font-semibold"
          >
            ✨ Nomini tanlang va barabanni aylantirib ko'ring! ✨
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Wheel */}
          <div className="flex flex-col items-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-neon-cyan" 
                style={{ filter: "drop-shadow(0 0 8px hsl(185 100% 50% / 0.8))" }} />
              
              <motion.svg
                viewBox="0 0 300 300"
                className="w-full h-full"
                animate={{ rotate: rotation }}
                transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 0.99] }}
              >
                {names.map((name, i) => {
                  const angle = 360 / names.length;
                  const startAngle = i * angle - 90;
                  const endAngle = startAngle + angle;
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  const x1 = 150 + 140 * Math.cos(startRad);
                  const y1 = 150 + 140 * Math.sin(startRad);
                  const x2 = 150 + 140 * Math.cos(endRad);
                  const y2 = 150 + 140 * Math.sin(endRad);
                  const largeArc = angle > 180 ? 1 : 0;
                  const midRad = ((startAngle + angle / 2) * Math.PI) / 180;
                  const tx = 150 + 90 * Math.cos(midRad);
                  const ty = 150 + 90 * Math.sin(midRad);
                  const textAngle = startAngle + angle / 2;

                  return (
                    <g key={name}>
                      <path
                        d={`M150,150 L${x1},${y1} A140,140 0 ${largeArc},1 ${x2},${y2} Z`}
                        fill={colors[i % colors.length]}
                        stroke="hsl(230 25% 7%)"
                        strokeWidth="2"
                        opacity={0.85}
                      />
                      <text
                        x={tx}
                        y={ty}
                        fill="#000"
                        fontSize={names.length > 8 ? "9" : "11"}
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${textAngle}, ${tx}, ${ty})`}
                      >
                        {name.length > 8 ? name.slice(0, 7) + "…" : name}
                      </text>
                    </g>
                  );
                })}
                <circle cx="150" cy="150" r="20" fill="hsl(230 25% 7%)" stroke="hsl(185 100% 50%)" strokeWidth="3" />
              </motion.svg>
            </div>

            <button
              onClick={spin}
              disabled={spinning || names.length < 2}
              className="neon-btn mt-6 text-lg px-10 py-3 disabled:opacity-40"
            >
              {spinning ? "AYLANMOQDA..." : "AYLANTIRISH"}
            </button>

            {winner && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-muted-foreground">Tanlangan:</p>
                <p className="text-3xl font-display font-black text-neon-green mt-1">{winner}</p>
              </motion.div>
            )}
          </div>

          {/* Names */}
          <div className="neon-card p-6">
            <h3 className="font-display font-bold text-neon-cyan tracking-wider mb-4">O'QUVCHILAR RO'YXATI</h3>
            <div className="flex gap-2 mb-4">
              <input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addName()}
                placeholder="Ism kiriting..."
                className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan"
              />
              <button onClick={addName} className="neon-btn py-2 px-4 text-sm">QO'SHISH</button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
              {names.map((n) => (
                <span key={n} className="inline-flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm text-foreground border border-border">
                  {n}
                  <button onClick={() => removeName(n)} className="text-destructive hover:text-destructive/80 ml-1">×</button>
                </span>
              ))}
            </div>
            <button onClick={() => setNames(defaultNames)} className="mt-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-neon-cyan">
              <RotateCcw className="w-3 h-3" /> Qayta tiklash
            </button>
          </div>
        </div>
      </div>
      <NeonFooter />
    </div>
  );
};

export default WheelGame;
