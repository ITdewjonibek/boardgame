import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchGameTests, type Test } from "@/lib/api";
import TestQuestion from "@/components/TestQuestion";

const COUNTRIES: { name: string; flag: string }[] = [
  { name: "O'zbekiston", flag: "🇺🇿" },
  { name: "Rossiya", flag: "🇷🇺" },
  { name: "AQSH", flag: "🇺🇸" },
  { name: "Xitoy", flag: "🇨🇳" },
  { name: "Yaponiya", flag: "🇯🇵" },
  { name: "Germaniya", flag: "🇩🇪" },
  { name: "Fransiya", flag: "🇫🇷" },
  { name: "Turkiya", flag: "🇹🇷" },
  { name: "Qozog'iston", flag: "🇰🇿" },
];

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export default function CountryGame() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [countries] = useState(() => shuffle([...COUNTRIES]));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showTest, setShowTest] = useState(false);
  const [testIdx, setTestIdx] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetchGameTests("country")
      .then((t) => setTests(shuffle(t)))
      .catch(() => setTests([]))
      .finally(() => setLoading(false));
  }, []);

  const c = countries[current];
  const opts = useMemo(
    () =>
      c ? shuffle([c.name, ...COUNTRIES.filter((x) => x.name !== c.name).map((x) => x.name).slice(0, 3)]) : [],
    [current, c?.name]
  );

  const [selected, setSelected] = useState<string | null>(null);

  const handleCountryPick = (ans: string) => {
    if (selected) return;
    setSelected(ans);
    if (ans === c.name) setScore((s) => s + 1);
    if (tests.length > 0) {
      setShowTest(true);
    } else {
      setTimeout(nextQuestion, 1000);
    }
  };

  const onTestAnswer = (correct: boolean) => {
    setShowTest(false);
    nextQuestion();
  };

  const nextQuestion = () => {
    setSelected(null);
    if (current + 1 < countries.length) setCurrent((i) => i + 1);
    else setFinished(true);
    setTestIdx((i) => (i + 1) % tests.length);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-white/60">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <Link to="/" className="text-white/60 hover:text-white text-sm mb-6 inline-block">← Orqaga</Link>
      <h1 className="text-2xl font-bold mb-6">Davlatni top</h1>

      {finished ? (
        <div className="card p-8 text-center">
          <p className="text-2xl font-bold">Natija: {score}/{countries.length}</p>
        </div>
      ) : showTest && tests[testIdx] ? (
        <div>
          <p className="text-white/60 mb-2">Bayroq: {c.flag} — {selected === c.name ? "To'g'ri!" : "Noto'g'ri"}</p>
          <TestQuestion test={tests[testIdx]} onAnswer={onTestAnswer} />
        </div>
      ) : (
        <>
          <div className="flex justify-between text-sm text-white/60 mb-6">
            <span>{current + 1}/{countries.length}</span>
            <span>Ball: {score}</span>
          </div>
          <div className="text-8xl text-center py-8 mb-6">{c?.flag}</div>
          <p className="text-center text-white/60 mb-4">Bu qaysi davlat?</p>
          <div className="grid gap-2">
            {opts.map((opt) => (
              <button
                key={opt}
                onClick={() => handleCountryPick(opt)}
                disabled={!!selected}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selected ? (opt === c.name ? "border-green-500 bg-green-500/10" : "opacity-60") : "hover:border-white/40"
                }`}
                style={{ borderColor: "hsl(var(--border))" }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
