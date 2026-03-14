import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowLeft, PlusCircle } from 'lucide-react';
import CourierRoadGame from '../games/CourierRoadGame';
import LuckyTicketGame from '../games/LuckyTicketGame';
import LuckyWheelGame from '../games/LuckyWheelGame';
import Neo2048Game from '../games/Neo2048Game';
import SubjectQuizGame from '../games/SubjectQuizGame';
import TugOfWarGame from '../games/TugOfWarGame';
const titles = {
    'courier-road': { title: 'Courier Road Quiz', subtitle: 'Mashina yo\'lda yuradi, test o\'ng panelda' },
    'neo-2048': { title: 'NEO 2048 Gate', subtitle: 'Premium 2048 + quiz gate' },
    'lucky-ticket': { title: 'Omadli Chipta', subtitle: 'Random chipta ochiladi va savol chiqadi' },
    'lucky-wheel': { title: 'Omadli Baraban', subtitle: 'Baraban raqami savol bilan birga' },
    'tug-of-war': { title: 'Arqon Tortish', subtitle: '2 jamoa, bolalar rasmi va jonli arqon' },
    math: { title: 'Matematika Quiz', subtitle: 'Fan testi' },
    physics: { title: 'Fizika Quiz', subtitle: 'Fan testi' },
    chemistry: { title: 'Kimyo Quiz', subtitle: 'Fan testi' },
    biology: { title: 'Biologiya Quiz', subtitle: 'Fan testi' },
    history: { title: 'Tarix Quiz', subtitle: 'Fan testi' },
    geography: { title: 'Geografiya Quiz', subtitle: 'Fan testi' },
    english: { title: 'English Quiz', subtitle: 'Fan testi' },
    'mother-language': { title: 'Ona Tili Quiz', subtitle: 'Fan testi' },
    informatics: { title: 'Informatika Quiz', subtitle: 'Fan testi' },
    logic: { title: 'Mantiq Quiz', subtitle: 'Fan testi' },
};
export default function GameShell({ gameKey, onBack, onAddTests }) {
    const meta = titles[gameKey];
    return (_jsx("div", { className: "min-h-screen px-4 py-4 md:px-6", children: _jsxs("div", { className: "mx-auto max-w-7xl space-y-4", children: [_jsxs("div", { className: "premium-topbar", children: [_jsxs("button", { className: "premium-button secondary", onClick: onBack, children: [_jsx(ArrowLeft, { size: 16 }), " Games"] }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-black text-white md:text-3xl", children: meta.title }), _jsx("div", { className: "text-sm text-slate-400 md:text-base", children: meta.subtitle })] }), _jsxs("button", { className: "premium-button secondary", onClick: onAddTests, children: [_jsx(PlusCircle, { size: 16 }), " Test qo'shish"] })] }), gameKey === 'courier-road' && _jsx(CourierRoadGame, {}), gameKey === 'neo-2048' && _jsx(Neo2048Game, {}), gameKey === 'lucky-ticket' && _jsx(LuckyTicketGame, {}), gameKey === 'lucky-wheel' && _jsx(LuckyWheelGame, {}), gameKey === 'tug-of-war' && _jsx(TugOfWarGame, {}), !['courier-road', 'neo-2048', 'lucky-ticket', 'lucky-wheel', 'tug-of-war'].includes(gameKey) && (_jsx(SubjectQuizGame, { topic: gameKey }))] }) }));
}
