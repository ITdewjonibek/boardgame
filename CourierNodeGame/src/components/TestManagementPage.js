import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useSectionStore } from '../store';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
export default function TestManagementPage({ teacher, onBack, }) {
    const { sections, addSection, removeSection, addQuestionToSection } = useSectionStore();
    const [expandedSection, setExpandedSection] = useState(null);
    const [showNewSection, setShowNewSection] = useState(false);
    const [newSectionName, setNewSectionName] = useState('');
    const [newSectionDifficulty, setNewSectionDifficulty] = useState('oson');
    const [showNewQuestion, setShowNewQuestion] = useState(null);
    const createdSectionCount = sections.filter((s) => s.teacherId === teacher.id).length;
    const canAddMore = createdSectionCount < 3;
    const handleCreateSection = (e) => {
        e.preventDefault();
        if (!newSectionName.trim())
            return;
        const newSection = {
            id: `sec_${Date.now()}`,
            name: newSectionName,
            description: '',
            questions: [],
            difficulty: newSectionDifficulty,
            createdAt: Date.now(),
            teacherId: teacher.id,
        };
        addSection(newSection);
        setNewSectionName('');
        setShowNewSection(false);
    };
    const handleAddQuestion = (sectionId, questionData) => {
        const newQuestion = {
            id: `q_${Date.now()}`,
            prompt: questionData.prompt,
            options: questionData.options,
            correctIndex: questionData.correctIndex,
            difficulty: questionData.difficulty,
            sectionId,
        };
        addQuestionToSection(sectionId, newQuestion);
        setShowNewQuestion(null);
    };
    const userSections = sections.filter((s) => s.teacherId === teacher.id);
    return (_jsx("div", { className: "min-h-screen p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold neon-text mb-2", children: "Test Boshqaruvi" }), _jsxs("p", { className: "text-gray-400", children: ["Salom, ", teacher.username, "! O'z testlarni boshqaring"] })] }), _jsx("button", { onClick: onBack, className: "px-6 py-2 bg-dark-border hover:bg-dark-border/80 text-white font-bold rounded-lg transition", children: "Oyiniga qaytish" })] }), canAddMore && !showNewSection && (_jsxs("button", { onClick: () => setShowNewSection(true), className: "mb-6 flex items-center gap-2 px-6 py-3 bg-gradient-primary hover:opacity-90 text-white font-bold rounded-lg transition", children: [_jsx(Plus, { size: 20 }), "Bo'lim Qo'shish"] })), showNewSection && (_jsxs("div", { className: "mb-6 bg-gradient-card border border-brand-primary/50 rounded-lg p-6", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Yangi Bo'lim" }), _jsxs("form", { onSubmit: handleCreateSection, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-gray-300 mb-2", children: "Bo'lim nomi" }), _jsx("input", { type: "text", value: newSectionName, onChange: (e) => setNewSectionName(e.target.value), placeholder: "Masalan: Matematika asoslari", className: "w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-gray-300 mb-2", children: "Darajasi" }), _jsxs("select", { value: newSectionDifficulty, onChange: (e) => setNewSectionDifficulty(e.target.value), className: "w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-brand-primary", children: [_jsx("option", { value: "oson", children: "Oson" }), _jsx("option", { value: "orta", children: "O'rta" }), _jsx("option", { value: "qiyin", children: "Qiyin" })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "submit", className: "flex-1 py-2 bg-success hover:opacity-90 text-white font-bold rounded-lg transition", children: "Yaratish" }), _jsx("button", { type: "button", onClick: () => {
                                                setShowNewSection(false);
                                                setNewSectionName('');
                                            }, className: "flex-1 py-2 bg-dark-border hover:bg-dark-border/80 text-white font-bold rounded-lg transition", children: "Bekor" })] })] })] })), _jsx("div", { className: "space-y-3", children: userSections.length === 0 ? (_jsx("div", { className: "text-center py-12 bg-gradient-card border border-dark-border rounded-lg", children: _jsx("p", { className: "text-gray-400", children: "Hali bo'lim yo'q. Bo'lim qo'shishni boshlang!" }) })) : (userSections.map((section) => (_jsxs("div", { className: "bg-gradient-card border border-dark-border rounded-lg overflow-hidden", children: [_jsxs("button", { onClick: () => setExpandedSection(expandedSection === section.id ? null : section.id), className: "w-full flex items-center justify-between p-4 hover:bg-dark-border/50 transition", children: [_jsxs("div", { className: "flex-1 text-left", children: [_jsx("h3", { className: "text-lg font-bold text-white", children: section.name }), _jsxs("p", { className: "text-sm text-gray-400", children: [section.questions.length, " / 20 testlar \u2022 ", section.difficulty === 'oson' ? '🟢 Oson' : section.difficulty === 'orta' ? '🟡 O\'rta' : '🔴 Qiyin'] })] }), _jsx("div", { className: "flex items-center gap-3", children: expandedSection === section.id ? (_jsx(ChevronUp, { className: "text-brand-primary" })) : (_jsx(ChevronDown, { className: "text-gray-500" })) })] }), expandedSection === section.id && (_jsxs("div", { className: "border-t border-dark-border p-4 space-y-4", children: [section.questions.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-bold text-gray-400", children: "Testlar:" }), section.questions.map((q, idx) => (_jsxs("div", { className: "flex items-start gap-3 p-3 bg-dark-bg rounded-lg", children: [_jsxs("span", { className: "text-sm font-bold text-brand-primary flex-shrink-0", children: [idx + 1, "."] }), _jsx("span", { className: "text-sm text-gray-300 flex-1", children: q.prompt })] }, q.id)))] })), section.questions.length < 20 && (_jsxs("button", { onClick: () => setShowNewQuestion(section.id), className: "w-full py-2 px-4 flex items-center justify-center gap-2 border-2 border-dashed border-brand-primary/50 hover:border-brand-primary text-brand-primary font-bold rounded-lg transition", children: [_jsx(Plus, { size: 18 }), "Test Qo'shish"] })), _jsxs("button", { onClick: () => {
                                            if (confirm(`"${section.name}" bo'limini o'chirilsinmi?`)) {
                                                removeSection(section.id);
                                                setExpandedSection(null);
                                            }
                                        }, className: "w-full py-2 px-4 flex items-center justify-center gap-2 bg-error/20 hover:bg-error/30 text-error font-bold rounded-lg transition", children: [_jsx(Trash2, { size: 18 }), "Bo'limni O'chirish"] })] }))] }, section.id)))) }), _jsxs("div", { className: "mt-8 p-4 bg-dark-card border border-dark-border rounded-lg text-center", children: [_jsxs("p", { className: "text-sm text-gray-400", children: ["Siz ", createdSectionCount, " / 3 bepul bo'lim foydalanmoqdasiz"] }), !canAddMore && (_jsx("p", { className: "text-xs text-warning mt-2", children: "Qo'shimcha bo'limlar uchun obunani yangilang" }))] })] }) }));
}
