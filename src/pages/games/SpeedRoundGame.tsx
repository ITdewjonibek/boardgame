import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchGameTests, type Test } from "@/lib/api";
import TestQuestion from "@/components/TestQuestion";

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
const ROUND_SECONDS = 30;

export default function SpeedRoundGame() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetchGameTests("speed_round")
      .then((t) => setTests(shuffle(t)))
      .catch(() => setTests([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!started || finished || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [started, finished, timeLeft]);

  useEffect(() => {
    if (started && timeLeft <= 0 && !finished) setFinished(true);
  }, [started, timeLeft, finished]);

  const onAnswer = useCallback((correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    setCurrent((c) => c + 1);
  }, []);

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
        <span className="text-4xl">⏱️</span> Vaqt boshi
      </h1>
      <p className="text-white/60 mb-6">30 soniya ichida qancha to'g'ri javob berasiz?</p>

      {!started ? (
        <div className="card p-8 text-center">
          <p className="text-lg text-white/80 mb-6">
            {tests.length} ta savol tayyor. Tezlik bilan to'g'ri javob bering!
          </p>
          <button onClick={() => setStarted(true)} className="btn-primary px-8 py-4 text-lg">
            Boshlash
          </button>
        </div>
      ) : finished ? (
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-2xl font-bold mb-2">Natija</p>
          <p className="text-5xl font-bold text-cyan-400 mb-2">{score}</p>
          <p className="text-white/60 mb-6">to'g'ri javob — 30 soniyada</p>
          <button
            onClick={() => {
              setStarted(false);
              setFinished(false);
              setTimeLeft(ROUND_SECONDS);
              setCurrent(0);
              setScore(0);
              setTests(shuffle([...tests]));
            }}
            className="btn-primary"
          >
            Qayta
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
              <span>{Math.floor(timeLeft / 10)}</span>
              <span className="text-lg">:</span>
              <span>{(timeLeft % 10).toString().padStart(2, "0")}</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
              Ball: {score}
            </div>
          </div>
          <TestQuestion
            test={tests[current % tests.length]}
            onAnswer={onAnswer}
          />
        </div>
      )}
    </div>
  );
}
