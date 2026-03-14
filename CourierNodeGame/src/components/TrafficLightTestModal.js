import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
export default function TrafficLightTestModal({ question, onAnswer, }) {
    const [selectedIdx, setSelectedIdx] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const isCorrect = selectedIdx === question.correctIndex;
    const handleSubmit = () => {
        if (selectedIdx === null)
            return;
        setSubmitted(true);
        setTimeout(() => {
            onAnswer(isCorrect);
            setSelectedIdx(null);
            setSubmitted(false);
        }, 800);
    };
    return (_jsx("div", { className: "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-[90vw]", children: _jsxs("div", { className: "bg-gradient-card border-2 border-brand-primary/50 rounded-2xl p-6 shadow-2xl", children: [_jsx("h3", { className: "text-xl font-bold text-white mb-6 leading-snug", children: question.prompt }), _jsx("div", { className: "grid grid-cols-2 gap-3 mb-6", children: question.options.map((option, idx) => {
                        const selected = selectedIdx === idx;
                        const showResult = submitted;
                        const correct = idx === question.correctIndex;
                        let baseClass = 'p-4 rounded-lg border-2 font-bold text-left transition-all cursor-pointer';
                        if (showResult) {
                            if (correct) {
                                baseClass += ' bg-success/20 border-success';
                            }
                            else if (selected) {
                                baseClass += ' bg-error/20 border-error';
                            }
                            else {
                                baseClass += ' bg-dark-border border-dark-border opacity-50';
                            }
                        }
                        else if (selected) {
                            baseClass += ' bg-brand-primary/30 border-brand-primary';
                        }
                        else {
                            baseClass += ' bg-dark-border border-dark-border hover:bg-dark-border/80';
                        }
                        return (_jsx("button", { onClick: () => !submitted && setSelectedIdx(idx), disabled: submitted, className: baseClass, children: _jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("span", { className: "text-lg", children: String.fromCharCode(65 + idx) }), _jsx("span", { className: "flex-1 text-sm text-gray-200", children: option }), showResult && correct && _jsx(CheckCircle2, { size: 18, className: "text-success flex-shrink-0" }), showResult && selected && !correct && _jsx(XCircle, { size: 18, className: "text-error flex-shrink-0" })] }) }, idx));
                    }) }), !submitted && (_jsx("button", { onClick: handleSubmit, disabled: selectedIdx === null, className: "w-full py-3 bg-gradient-primary hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-lg transition", children: "Javob Bering" })), submitted && (_jsx("div", { className: "text-center", children: _jsx("p", { className: `text-lg font-bold ${isCorrect ? 'text-success' : 'text-error'}`, children: isCorrect ? '✅ To\'g\'ri!' : '❌ Xato!' }) }))] }) }));
}
