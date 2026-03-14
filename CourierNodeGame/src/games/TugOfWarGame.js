import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Flag, Users } from 'lucide-react';
import { getQuestions } from '../data/gameBank';
export default function TugOfWarGame() {
    const [turn, setTurn] = useState('A');
    const [offset, setOffset] = useState(0);
    const [index, setIndex] = useState(0);
    const qs = useMemo(() => getQuestions('tug-of-war', 'medium', 20), []);
    const q = qs[index % qs.length];
    const answer = (idx) => {
        const correct = idx === q.correctIndex;
        setOffset((o) => Math.max(-40, Math.min(40, o + (correct ? (turn === 'A' ? -10 : 10) : (turn === 'A' ? 6 : -6)))));
        setTurn((t) => (t === 'A' ? 'B' : 'A'));
        setIndex((i) => i + 1);
    };
    return (_jsxs("div", { className: "grid gap-5 xl:grid-cols-[1.1fr_0.9fr]", children: [_jsxs("div", { className: "premium-card p-6", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "premium-kicker", children: [_jsx(Users, { size: 14 }), " JAMOAVIY MUSOBAQA"] }), _jsx("div", { className: "text-3xl font-black text-white", children: "Arqon tortish battle" })] }), _jsxs("div", { className: "premium-pill", children: [_jsx(Flag, { size: 14 }), " ", turn === 'A' ? '1-Jamoa' : '2-Jamoa', " navbatda"] })] }), _jsxs("div", { className: "rope-stage", children: [_jsx("div", { className: "mid-line" }), _jsx("img", { src: "/assets/rope-left.png", className: "rope-player left", style: { transform: `translateX(${offset}px)` } }), _jsx("img", { src: "/assets/rope-right.png", className: "rope-player right", style: { transform: `translateX(${offset}px)` } }), _jsx("div", { className: "rope-line", style: { transform: `translateX(${offset}px)` } })] }), _jsx("div", { className: "mt-4 text-center text-sm text-slate-400", children: "Qaysi jamoa to'g'ri javob bersa, arqon shu tomonga siljiydi." })] }), _jsxs("div", { className: "premium-card p-6", children: [_jsx("div", { className: "text-xs uppercase tracking-[0.28em] text-slate-400", children: "JAMOA TEST PANELI" }), _jsxs("div", { className: "mt-3 flex gap-3", children: [_jsx("span", { className: "premium-pill", children: "1-Jamoa" }), _jsx("span", { className: "premium-pill", children: "2-Jamoa" })] }), _jsxs("div", { className: "quiz-shell mt-6", children: [_jsx("div", { className: "text-2xl font-black text-white", children: q.prompt }), _jsx("div", { className: "mt-5 grid grid-cols-2 gap-3", children: q.options.map((opt, i) => _jsx("button", { className: "quiz-option", onClick: () => answer(i), children: opt }, opt)) })] })] })] }));
}
