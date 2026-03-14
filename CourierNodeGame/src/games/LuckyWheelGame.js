import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { difficultyLabel, getQuestions } from '../data/gameBank';
export default function LuckyWheelGame() {
    const [difficulty, setDifficulty] = useState('medium');
    const [rotation, setRotation] = useState(0);
    const [picked, setPicked] = useState(null);
    const qs = useMemo(() => getQuestions('lucky-wheel', difficulty, 12), [difficulty]);
    const spin = () => {
        const n = Math.floor(Math.random() * 12) + 1;
        setPicked(n);
        setRotation((r) => r + 1080 + n * 30);
    };
    const q = picked ? qs[(picked - 1) % qs.length] : null;
    return (_jsxs("div", { className: "grid gap-5 xl:grid-cols-[1.05fr_0.95fr]", children: [_jsxs("div", { className: "premium-card p-6", children: [_jsx("div", { className: "mb-5 flex flex-wrap gap-3", children: ['easy', 'medium', 'hard'].map((d) => _jsx("button", { className: `premium-button ${difficulty === d ? '' : 'secondary'}`, onClick: () => setDifficulty(d), children: difficultyLabel(d) }, d)) }), _jsxs("div", { className: "grid gap-5 lg:grid-cols-[1.05fr_0.95fr]", children: [_jsxs("div", { className: "wheel-scene", children: [_jsx("div", { className: "wheel-pointer" }), _jsx("div", { className: "wheel-disc", style: { transform: `rotate(${rotation}deg)` }, children: Array.from({ length: 12 }, (_, i) => _jsx("div", { className: "wheel-segment", style: { transform: `rotate(${i * 30}deg)` }, children: _jsx("span", { children: i + 1 }) }, i)) }), _jsxs("button", { className: "premium-button mt-5 w-full", onClick: spin, children: [_jsx(RotateCw, { size: 18 }), " START"] })] }), _jsxs("div", { className: "premium-side-info", children: [_jsx("div", { className: "text-xl font-black text-white", children: "Baraban natijasi" }), _jsx("div", { className: "reveal-card mt-5", children: picked ?? '--' }), _jsx("p", { className: "mt-4 text-sm leading-7 text-slate-300", children: "Baraban qaysi raqamga tushsa, shu raqamdagi savol avtomatik tanlanadi. Tugma premium ko'rinishda yangilandi." })] })] })] }), _jsxs("div", { className: "premium-card p-6", children: [_jsx("div", { className: "text-xs uppercase tracking-[0.28em] text-slate-400", children: "TEST PANEL" }), _jsx("div", { className: "mt-3 text-3xl font-black text-white", children: picked ? `Raqam #${picked}` : 'START ni bosing' }), q ? (_jsxs("div", { className: "quiz-shell mt-6", children: [_jsx("div", { className: "text-2xl font-black text-white", children: q.prompt }), _jsx("div", { className: "mt-5 grid gap-3", children: q.options.map((opt, i) => _jsx("button", { className: `quiz-option ${i === q.correctIndex ? 'hint' : ''}`, children: opt }, opt)) })] })) : _jsx("div", { className: "empty-panel mt-6", children: "Baraban aylangach shu yerda savol chiqadi." })] })] }));
}
