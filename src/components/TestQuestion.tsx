import { useState } from "react";
import type { Test } from "@/lib/api";

interface Props {
  test: Test;
  onAnswer: (correct: boolean) => void;
}

export default function TestQuestion({ test, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleClick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    onAnswer(idx === test.correct_index);
  };

  const getClass = (idx: number) => {
    if (selected === null) return "hover:border-white/40";
    if (idx === test.correct_index) return "border-green-500 bg-green-500/10";
    if (idx === selected) return "border-red-500 bg-red-500/10";
    return "opacity-50";
  };

  return (
    <div className="card p-6">
      <p className="text-lg font-medium mb-4">{test.question}</p>
      <div className="grid gap-2">
        {test.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={selected !== null}
            className={`p-3 rounded-lg border text-left transition-all ${getClass(i)}`}
            style={{ borderColor: "hsl(var(--border))" }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
