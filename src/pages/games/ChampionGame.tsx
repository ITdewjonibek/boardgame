import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchGameTests, type Test } from "@/lib/api";
import TestQuestion from "@/components/TestQuestion";

const defaultNames = ["Ali", "Vali", "Sardor", "Dilnoza"];

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export default function ChampionGame() {
  const [names, setNames] = useState(defaultNames);
  const [inputVal, setInputVal] = useState("");
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(0);
  const [pairs, setPairs] = useState<[string, string][]>([]);
  const [currentPair, setCurrentPair] = useState<[string, string] | null>(null);
  const [winners, setWinners] = useState<string[]>([]);
  const [champion, setChampion] = useState<string | null>(null);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const testCounter = React.useRef(0);

  useEffect(() => {
    fetchGameTests("champion")
      .then((t) => setTests(shuffle(t)))
      .catch(() => setTests([]))
      .finally(() => setLoading(false));
  }, []);

  const addName = () => {
    if (inputVal.trim() && !names.includes(inputVal.trim())) {
      setNames([...names, inputVal.trim()]);
      setInputVal("");
    }
  };

  const startTournament = () => {
    const shuffled = shuffle([...names]);
    const p: [string, string][] = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      if (shuffled[i + 1]) p.push([shuffled[i], shuffled[i + 1]]);
      else p.push([shuffled[i], "BYE"]);
    }
    setPairs(p);
    setRound(1);
    setCurrentPair(p[0]);
    setWinners([]);
    setChampion(null);
    if (tests.length > 0) setCurrentTest(tests[testCounter.current % tests.length]);
  };

  const onAnswer = (correct: boolean) => {
    const realWinner = correct
      ? (currentPair![0] === "BYE" ? currentPair![1] : currentPair![0])
      : (currentPair![1] === "BYE" ? currentPair![0] : currentPair![1]);
    const newWinners = [...winners, realWinner];
    setWinners(newWinners);
    setCurrentTest(null);

    testCounter.current += 1;
    const idx = pairs.findIndex((p) => p[0] === currentPair![0] && p[1] === currentPair![1]);
    if (idx + 1 < pairs.length) {
      setCurrentPair(pairs[idx + 1]);
      if (tests.length > 0) setCurrentTest(tests[testCounter.current % tests.length]);
    } else {
      if (newWinners.length === 1) {
        setChampion(newWinners[0]);
        setCurrentPair(null);
      } else {
        const newPairs: [string, string][] = [];
        for (let i = 0; i < newWinners.length; i += 2) {
          if (newWinners[i + 1]) newPairs.push([newWinners[i], newWinners[i + 1]]);
          else newPairs.push([newWinners[i], "BYE"]);
        }
        setPairs(newPairs);
        setRound((r) => r + 1);
        setCurrentPair(newPairs[0]);
        setWinners([]);
        if (tests.length > 0) setCurrentTest(tests[testCounter.current % tests.length]);
      }
    }
  };

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
      <h1 className="text-2xl font-bold mb-8">Chempion o'quvchi</h1>

      {!currentPair && !champion && round === 0 && (
        <div className="card p-6">
          <h3 className="font-semibold mb-4">O'quvchilar</h3>
          <div className="flex gap-2 mb-4">
            <input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addName()}
              placeholder="Ism"
              className="input flex-1 py-2"
            />
            <button onClick={addName} className="btn-primary py-2">+</button>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {names.map((n) => (
              <span key={n} className="inline-flex items-center gap-1 bg-white/5 px-2 py-1 rounded text-sm">
                {n}
                <button onClick={() => setNames(names.filter((x) => x !== n))} className="text-red-400">×</button>
              </span>
            ))}
          </div>
          <button onClick={startTournament} disabled={names.length < 2} className="btn-primary disabled:opacity-50">
            Turnirni boshlash
          </button>
        </div>
      )}

      {champion && (
        <div className="card p-8 text-center">
          <p className="text-2xl font-bold text-green-400">Chempion: {champion}</p>
        </div>
      )}

      {currentPair && (
        <div className="space-y-6">
          <p className="text-white/60">Raund {round} — Testni to'g'ri yechgan g'olib bo'ladi</p>
          {currentTest ? (
            <TestQuestion test={currentTest} onAnswer={onAnswer} />
          ) : (
            <div className="card p-6">
              <p className="text-white/60 mb-4">Testlar qo'shilmagan. Kim g'olib?</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => onAnswer(true)} className="card p-6 hover:border-green-500">
                  {currentPair[0]}
                </button>
                <button onClick={() => onAnswer(false)} className="card p-6 hover:border-green-500">
                  {currentPair[1]}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
