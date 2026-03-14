import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchGameTests, type Test } from "@/lib/api";
import TestQuestion from "@/components/TestQuestion";

const WORDS = [
  ["KITOB", "DAFTAR", "QALAM"],
  ["MENEJER", "COMPUTER", "PROGRAM"],
];
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export default function WordSearchGame() {
  const [level, setLevel] = useState(0);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [showTest, setShowTest] = useState(false);
  const [testIdx, setTestIdx] = useState(0);
  const words = WORDS[level];

  useEffect(() => {
    fetchGameTests("word_search")
      .then((t) => setTests(t))
      .catch(() => setTests([]))
      .finally(() => setLoading(false));
  }, []);

  const grid = useMemo(() => {
    const size = 8;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
    const g: string[][] = Array(size).fill(null).map(() => Array(size).fill("").map(() => chars[Math.floor(Math.random() * 26)]));
    const dirs: [number, number][] = [[0, 1], [1, 0], [1, 1]];
    for (const word of words) {
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      let r = Math.floor(Math.random() * Math.max(1, size - word.length));
      let c = Math.floor(Math.random() * Math.max(1, size - word.length));
      for (let i = 0; i < word.length; i++) {
        const nr = r + dir[0] * i;
        const nc = c + dir[1] * i;
        if (nr < size && nc < size) g[nr][nc] = word[i];
      }
    }
    return g;
  }, [level]);

  const checkWord = (w: string) => {
    if (words.includes(w) && !found.includes(w)) {
      setFound((f) => [...f, w]);
      setSelected("");
      if (tests.length > 0) {
        setShowTest(true);
        setTestIdx((i) => i % tests.length);
      }
    }
  };

  const onTestAnswer = () => setShowTest(false);
  const allFound = found.length === words.length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-white/60">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Link to="/" className="text-white/60 hover:text-white text-sm mb-6 inline-block">← Orqaga</Link>
      <h1 className="text-2xl font-bold mb-6">So'z qidiruv</h1>

      {showTest && tests[testIdx] ? (
        <div>
          <p className="text-white/60 mb-2">So'z topildi! Testni yeching:</p>
          <TestQuestion test={tests[testIdx]} onAnswer={onTestAnswer} />
        </div>
      ) : (
        <div className="card p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {words.map((w) => (
              <span key={w} className={`px-2 py-1 rounded text-sm ${found.includes(w) ? "bg-green-500/20 text-green-400" : "bg-white/5"}`}>{w}</span>
            ))}
          </div>
          <div className="grid grid-cols-8 gap-1 mb-4">
            {grid.map((row, r) => row.map((cell, c) => (
              <div key={`${r}-${c}`} className="w-10 h-10 flex items-center justify-center font-mono text-sm border rounded" style={{ borderColor: "hsl(var(--border))" }}>{cell}</div>
            )))}
          </div>
          <div className="flex gap-2">
            <input value={selected} onChange={(e) => setSelected(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === "Enter" && checkWord(selected)} placeholder="So'z" className="input flex-1 py-2" />
            <button onClick={() => checkWord(selected)} className="btn-primary py-2">Tekshirish</button>
          </div>
          {allFound && <button onClick={() => { setLevel((l) => (l + 1) % 2); setFound([]); }} className="btn-primary mt-4">Keyingi daraja</button>}
        </div>
      )}
    </div>
  );
}
