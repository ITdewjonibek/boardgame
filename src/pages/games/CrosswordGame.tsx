import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchGameTests, type Test } from "@/lib/api";
import TestQuestion from "@/components/TestQuestion";

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export default function CrosswordGame() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetchGameTests("crossword")
      .then((t) => setTests(shuffle(t)))
      .catch(() => setTests([]))
      .finally(() => setLoading(false));
  }, []);

  const onAnswer = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (current + 1 < tests.length) setCurrent((c) => c + 1);
      else setFinished(true);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-white/60">Yuklanmoqda...</p>
      </div>
    );
  }

  if (!tests.length) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-white/80 mb-4">Bu o'yin uchun testlar hali qo'silmagan.</p>
        <Link to="/add-test" className="btn-primary inline-block">Test qo'shish</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Link to="/" className="text-white/60 hover:text-white text-sm mb-6 inline-block">← Orqaga</Link>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <span className="text-4xl">📝</span> Krossvord
      </h1>
      <p className="text-white/60 mb-6">So'zlar kesishadi — har bir savolga to'g'ri javob bering</p>

      {finished ? (
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">✨</div>
          <p className="text-2xl font-bold mb-2">Tugadi!</p>
          <p className="text-4xl font-bold text-cyan-400 mb-6">{score}/{tests.length}</p>
          <button onClick={() => { setCurrent(0); setScore(0); setFinished(false); setTests(shuffle([...tests])); }} className="btn-primary">
            Qayta
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-2xl blur-sm" />
          <div className="relative card p-6 border-violet-500/30">
            <div className="flex justify-between text-sm text-white/60 mb-4">
              <span>Savol {current + 1}/{tests.length}</span>
              <span>Ball: {score}</span>
            </div>
            <TestQuestion test={tests[current]} onAnswer={onAnswer} />
          </div>
        </div>
      )}
    </div>
  );
}
