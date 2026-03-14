import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Move, ShieldCheck } from 'lucide-react';
import { getQuestions } from '../data/gameBank';
const size = 4;
function spawn(board) {
    const empty = board.map((v, i) => (v === 0 ? i : -1)).filter((x) => x >= 0);
    if (!empty.length)
        return board;
    const idx = empty[Math.floor(Math.random() * empty.length)];
    const next = [...board];
    next[idx] = Math.random() < 0.9 ? 2 : 4;
    return next;
}
function slide(line) {
    const arr = line.filter(Boolean);
    const out = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i] === arr[i + 1]) {
            out.push(arr[i] * 2);
            i++;
        }
        else
            out.push(arr[i]);
    }
    while (out.length < size)
        out.push(0);
    return out;
}
function move(board, dir) {
    const next = [...board];
    const getRow = (r) => next.slice(r * size, r * size + size);
    const setRow = (r, vals) => vals.forEach((v, i) => { next[r * size + i] = v; });
    const getCol = (c) => Array.from({ length: size }, (_, r) => next[r * size + c]);
    const setCol = (c, vals) => vals.forEach((v, r) => { next[r * size + c] = v; });
    if (dir === 'left' || dir === 'right') {
        for (let r = 0; r < size; r++) {
            const row = getRow(r);
            const shifted = dir === 'left' ? slide(row) : slide([...row].reverse()).reverse();
            setRow(r, shifted);
        }
    }
    else {
        for (let c = 0; c < size; c++) {
            const col = getCol(c);
            const shifted = dir === 'up' ? slide(col) : slide([...col].reverse()).reverse();
            setCol(c, shifted);
        }
    }
    return JSON.stringify(next) === JSON.stringify(board) ? board : spawn(next);
}
export default function Neo2048Game() {
    const [board, setBoard] = useState(() => spawn(spawn(Array(16).fill(0))));
    const [moves, setMoves] = useState(0);
    const [gate, setGate] = useState(false);
    const [gateScore, setGateScore] = useState(32);
    const qs = useMemo(() => getQuestions('neo-2048', 'medium', 10), []);
    const q = qs[(moves / 4) % qs.length];
    const maxTile = Math.max(...board);
    const doMove = (dir) => {
        if (gate)
            return;
        setBoard((b) => move(b, dir));
        setMoves((m) => m + 1);
    };
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowLeft')
                doMove('left');
            if (e.key === 'ArrowRight')
                doMove('right');
            if (e.key === 'ArrowUp')
                doMove('up');
            if (e.key === 'ArrowDown')
                doMove('down');
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });
    useEffect(() => {
        if (maxTile >= gateScore)
            setGate(true);
    }, [maxTile, gateScore]);
    const answer = (idx) => {
        if (idx === q.correctIndex) {
            setGate(false);
            setGateScore((s) => s * 2);
        }
        else {
            setBoard((b) => spawn([...b].sort((a, b2) => a - b2)));
            setGate(false);
        }
    };
    return (_jsxs("div", { className: "grid gap-5 xl:grid-cols-[1fr_0.92fr]", children: [_jsxs("div", { className: "premium-card p-6", children: [_jsxs("div", { className: "mb-4 flex flex-wrap gap-3", children: [_jsxs("span", { className: "premium-pill", children: [_jsx(Move, { size: 14 }), " Arrow keys"] }), _jsxs("span", { className: "premium-pill", children: [_jsx(ShieldCheck, { size: 14 }), " Gate: ", gateScore] }), _jsxs("span", { className: "premium-pill", children: ["Moves: ", moves] })] }), _jsxs("div", { className: "grid gap-5 lg:grid-cols-[0.9fr_1.1fr]", children: [_jsxs("div", { className: "premium-side-info", children: [_jsx("div", { className: "text-xl font-black text-white", children: "NEO 2048" }), _jsx("p", { className: "mt-3 text-sm leading-7 text-slate-300", children: "2048 premium qora stilga o'tkazildi. Muayyan tile ga yetganda o'ng panelda quiz gate ochiladi." }), _jsx("div", { className: "mt-4 grid grid-cols-2 gap-3", children: ['left', 'up', 'down', 'right'].map((dir) => _jsx("button", { className: "premium-button secondary", onClick: () => doMove(dir), children: dir.toUpperCase() }, dir)) })] }), _jsx("div", { className: "board-2048", children: board.map((cell, i) => _jsx("div", { className: `tile tile-${cell || 0}`, children: cell || '' }, i)) })] })] }), _jsxs("div", { className: "premium-card p-6", children: [_jsx("div", { className: "text-xs uppercase tracking-[0.28em] text-slate-400", children: "QUIZ GATE" }), _jsx("div", { className: "mt-3 text-3xl font-black text-white", children: gate ? `Tile ${gateScore} gate` : "O'yinni davom ettiring" }), gate ? (_jsxs("div", { className: "quiz-shell mt-6", children: [_jsx("div", { className: "text-2xl font-black text-white", children: q?.prompt }), _jsx("div", { className: "mt-5 grid gap-3", children: q?.options.map((opt, i) => _jsx("button", { className: "quiz-option", onClick: () => answer(i), children: opt }, opt)) })] })) : _jsx("div", { className: "empty-panel mt-6", children: "32, 64, 128 kabi qiymatlarga yetganda test chiqadi." })] })] }));
}
