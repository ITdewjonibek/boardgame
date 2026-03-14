import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { CarFront, Gauge, Timer } from 'lucide-react';
import { difficultyLabel, getQuestions } from '../data/gameBank';
export default function CourierRoadGame() {
    const [difficulty, setDifficulty] = useState('medium');
    const [index, setIndex] = useState(0);
    const [carStep, setCarStep] = useState(0);
    const [score, setScore] = useState(0);
    const questions = useMemo(() => getQuestions('courier-road', difficulty, 20), [difficulty]);
    const q = questions[index % questions.length];
    const answer = (idx) => {
        if (idx === q.correctIndex) {
            setScore((s) => s + 10);
            setCarStep((s) => Math.min(20, s + 1));
        }
        else {
            setScore((s) => Math.max(0, s - 5));
            setCarStep((s) => Math.max(0, s - 1));
        }
        setIndex((i) => i + 1);
    };
    return (_jsxs("div", { className: "grid gap-5 xl:grid-cols-[1.15fr_0.85fr]", children: [_jsxs("div", { className: "premium-card overflow-hidden p-6", children: [_jsxs("div", { className: "mb-5 flex flex-wrap items-center gap-3", children: [_jsxs("span", { className: "premium-pill", children: [_jsx(CarFront, { size: 14 }), " Kuryer yo'li"] }), _jsxs("span", { className: "premium-pill", children: [_jsx(Timer, { size: 14 }), " 20 checkpoint"] }), _jsxs("span", { className: "premium-pill", children: [_jsx(Gauge, { size: 14 }), " Ball: ", score] })] }), _jsxs("div", { className: "grid gap-4 lg:grid-cols-[0.9fr_1.1fr]", children: [_jsxs("div", { className: "premium-side-info", children: [_jsx("h3", { className: "text-xl font-black text-white", children: "O'yin haqida" }), _jsx("p", { className: "mt-3 text-sm leading-7 text-slate-300", children: "Ekran ikkiga bo'lingan: chap tomonda mashina yo'lda harakat qiladi, o'ng tomonda test turadi. To'g'ri javob bersangiz mashina oldinga yuradi." }), _jsx("div", { className: "mt-4 grid grid-cols-3 gap-3", children: ['easy', 'medium', 'hard'].map((d) => (_jsx("button", { onClick: () => { setDifficulty(d); setIndex(0); setCarStep(0); setScore(0); }, className: `premium-button ${difficulty === d ? '' : 'secondary'}`, children: difficultyLabel(d) }, d))) })] }), _jsxs("div", { className: "road-scene", children: [_jsx("div", { className: "road-sky" }), _jsxs("div", { className: "road-track", children: [_jsx("div", { className: "road-lane lane-1" }), _jsx("div", { className: "road-lane lane-2" }), _jsx("div", { className: "finish-line" }), Array.from({ length: 20 }).map((_, i) => (_jsx("div", { className: `checkpoint ${i < carStep ? 'done' : i === carStep ? 'active' : ''}`, style: { left: `${6 + i * 4.6}%` } }, i))), _jsxs("div", { className: "car-wrap", style: { left: `${8 + carStep * 4.5}%` }, children: [_jsx("div", { className: "car-shadow" }), _jsxs("div", { className: "car-body-premium", children: [_jsx("span", { className: "window" }), _jsx("span", { className: "wheel left" }), _jsx("span", { className: "wheel right" })] })] })] }), _jsx("div", { className: "progress-shell", children: _jsx("div", { className: "progress-bar", style: { width: `${(carStep / 20) * 100}%` } }) })] })] })] }), _jsxs("div", { className: "premium-card p-6", children: [_jsx("div", { className: "text-xs uppercase tracking-[0.28em] text-slate-400", children: "TEST PANEL" }), _jsxs("div", { className: "mt-3 text-3xl font-black text-white", children: ["Checkpoint #", Math.min(carStep + 1, 20)] }), _jsxs("div", { className: "mt-2 text-sm text-slate-400", children: [difficultyLabel(difficulty), " daraja \u2022 Savol #", index + 1] }), _jsxs("div", { className: "quiz-shell mt-6", children: [_jsx("div", { className: "text-2xl font-black text-white", children: q.prompt }), _jsx("div", { className: "mt-5 grid gap-3", children: q.options.map((opt, i) => (_jsx("button", { onClick: () => answer(i), className: "quiz-option", children: opt }, opt))) }), _jsxs("div", { className: "mt-6 flex items-center justify-between text-sm text-slate-400", children: [_jsx("span", { children: "To'g'ri javob = mashina oldinga" }), _jsxs("span", { children: ["Qolgan masofa: ", 20 - carStep] })] })] })] })] }));
}
