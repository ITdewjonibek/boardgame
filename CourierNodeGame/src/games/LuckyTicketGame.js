import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Dice5, Tickets, Users } from 'lucide-react';
import { difficultyLabel, getQuestions } from '../data/gameBank';
export default function LuckyTicketGame() {
    const [difficulty, setDifficulty] = useState('medium');
    const [mode, setMode] = useState('TEAM');
    const [opened, setOpened] = useState([]);
    const [current, setCurrent] = useState(null);
    const [turn, setTurn] = useState('A');
    const [scoreA, setScoreA] = useState(0);
    const [scoreB, setScoreB] = useState(0);
    const qs = useMemo(() => getQuestions('lucky-ticket', difficulty, 15), [difficulty]);
    const roll = () => {
        const remain = Array.from({ length: 15 }, (_, i) => i + 1).filter((n) => !opened.includes(n));
        if (!remain.length)
            return;
        const next = remain[Math.floor(Math.random() * remain.length)];
        setCurrent(next);
        setOpened((prev) => [...prev, next]);
    };
    const answer = (idx) => {
        const q = qs[(current ?? 1) - 1];
        const correct = idx === q.correctIndex;
        if (mode === 'SOLO') {
            if (correct)
                setScoreA((s) => s + 10);
        }
        else {
            if (correct)
                turn === 'A' ? setScoreA((s) => s + 10) : setScoreB((s) => s + 10);
            setTurn((t) => (t === 'A' ? 'B' : 'A'));
        }
        setCurrent(null);
    };
    const q = current ? qs[current - 1] : null;
    return (_jsxs("div", { className: "grid gap-5 xl:grid-cols-[1.05fr_0.95fr]", children: [_jsxs("div", { className: "premium-card p-6", children: [_jsxs("div", { className: "mb-5 flex flex-wrap items-center gap-3", children: [_jsxs("span", { className: "premium-pill", children: [_jsx(Tickets, { size: 14 }), " 15 ta chipta"] }), _jsx("button", { className: `premium-button ${mode === 'SOLO' ? '' : 'secondary'}`, onClick: () => setMode('SOLO'), children: "SOLO" }), _jsxs("button", { className: `premium-button ${mode === 'TEAM' ? '' : 'secondary'}`, onClick: () => setMode('TEAM'), children: [_jsx(Users, { size: 16 }), " TEAM"] })] }), _jsxs("div", { className: "grid gap-4 lg:grid-cols-[0.9fr_1.1fr]", children: [_jsxs("div", { className: "premium-side-info", children: [_jsx("div", { className: "text-2xl font-black text-white", children: "Omadli raqam" }), _jsx("div", { className: "mt-4 reveal-card", children: current ?? '--' }), _jsx("div", { className: "mt-4 grid grid-cols-3 gap-2", children: ['easy', 'medium', 'hard'].map((d) => (_jsx("button", { className: `premium-button ${difficulty === d ? '' : 'secondary'}`, onClick: () => setDifficulty(d), children: difficultyLabel(d) }, d))) }), _jsxs("button", { className: "premium-button mt-4 w-full", onClick: roll, children: [_jsx(Dice5, { size: 18 }), " Random chipta"] }), _jsxs("div", { className: "mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm", children: [_jsxs("span", { children: ["1-Jamoa: ", _jsx("b", { children: scoreA })] }), _jsxs("span", { children: ["2-Jamoa: ", _jsx("b", { children: scoreB })] })] })] }), _jsx("div", { className: "ticket-grid", children: Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (_jsxs("div", { className: `ticket-card ${opened.includes(n) ? 'open' : ''} ${current === n ? 'current' : ''}`, children: [_jsx("div", { className: "ticket-number", children: n }), _jsx("div", { className: "ticket-label", children: "CHIPTA" })] }, n))) })] })] }), _jsxs("div", { className: "premium-card p-6", children: [_jsx("div", { className: "text-xs uppercase tracking-[0.28em] text-slate-400", children: "QUIZ PANEL" }), _jsx("div", { className: "mt-3 text-3xl font-black text-white", children: current ? `Chipta #${current}` : 'Random tugmani bosing' }), _jsx("div", { className: "mt-2 text-sm text-slate-400", children: mode === 'TEAM' ? `${turn === 'A' ? '1-Jamoa' : '2-Jamoa'} navbatda` : 'Yakka tartib' }), q ? (_jsxs("div", { className: "quiz-shell mt-6", children: [_jsx("div", { className: "text-2xl font-black text-white", children: q.prompt }), _jsx("div", { className: "mt-5 grid gap-3", children: q.options.map((opt, i) => _jsx("button", { className: "quiz-option", onClick: () => answer(i), children: opt }, opt)) })] })) : (_jsx("div", { className: "empty-panel mt-6", children: "Random tugmasi bosilganda chiqqan raqamga tegishli chipta shu yerda ochiladi." }))] })] }));
}
