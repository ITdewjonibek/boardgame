import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { BookOpen, Users } from 'lucide-react';
import { difficultyLabel, getQuestions } from '../data/gameBank';
export default function SubjectQuizGame({ topic }) {
    const [difficulty, setDifficulty] = useState('easy');
    const [mode, setMode] = useState('SOLO');
    const [turn, setTurn] = useState('A');
    const [idx, setIdx] = useState(0);
    const [scoreA, setScoreA] = useState(0);
    const [scoreB, setScoreB] = useState(0);
    const qs = useMemo(() => getQuestions(topic, difficulty, 10), [topic, difficulty]);
    const q = qs[idx % qs.length];
    const answer = (i) => {
        const correct = i === q.correctIndex;
        if (correct) {
            if (mode === 'SOLO')
                setScoreA((s) => s + 1);
            else
                turn === 'A' ? setScoreA((s) => s + 1) : setScoreB((s) => s + 1);
        }
        setIdx((x) => x + 1);
        if (mode === 'TEAM')
            setTurn((t) => (t === 'A' ? 'B' : 'A'));
    };
    return (_jsxs("div", { className: "grid gap-5 xl:grid-cols-[0.95fr_1.05fr]", children: [_jsxs("div", { className: "premium-card p-6", children: [_jsxs("div", { className: "premium-kicker", children: [_jsx(BookOpen, { size: 14 }), " SUBJECT MODE"] }), _jsx("div", { className: "mt-3 text-3xl font-black text-white", children: topic.toUpperCase() }), _jsxs("div", { className: "mt-5 grid gap-3 sm:grid-cols-2", children: [_jsx("button", { className: `premium-button ${mode === 'SOLO' ? '' : 'secondary'}`, onClick: () => setMode('SOLO'), children: "SOLO" }), _jsxs("button", { className: `premium-button ${mode === 'TEAM' ? '' : 'secondary'}`, onClick: () => setMode('TEAM'), children: [_jsx(Users, { size: 16 }), " TEAM"] }), ['easy', 'medium', 'hard'].map((d) => _jsx("button", { className: `premium-button ${difficulty === d ? '' : 'secondary'}`, onClick: () => { setDifficulty(d); setIdx(0); setScoreA(0); setScoreB(0); }, children: difficultyLabel(d) }, d))] }), _jsxs("div", { className: "subject-score mt-5", children: [_jsxs("div", { children: [_jsx("span", { children: "1-Jamoa / Siz" }), _jsx("b", { children: scoreA })] }), _jsxs("div", { children: [_jsx("span", { children: "2-Jamoa" }), _jsx("b", { children: scoreB })] })] })] }), _jsxs("div", { className: "premium-card p-6", children: [_jsx("div", { className: "text-xs uppercase tracking-[0.28em] text-slate-400", children: "FANGA OID TEST" }), _jsx("div", { className: "mt-3 text-3xl font-black text-white", children: mode === 'TEAM' ? `${turn === 'A' ? '1-Jamoa' : '2-Jamoa'} navbatda` : `Savol #${idx + 1}` }), _jsxs("div", { className: "quiz-shell mt-6", children: [_jsx("div", { className: "text-2xl font-black text-white", children: q.prompt }), _jsx("div", { className: "mt-5 grid gap-3", children: q.options.map((opt, i) => _jsx("button", { className: "quiz-option", onClick: () => answer(i), children: opt }, opt)) })] })] })] }));
}
