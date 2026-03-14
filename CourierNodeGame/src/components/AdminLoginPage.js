import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuthStore } from '../store';
import { X } from 'lucide-react';
export default function AdminLoginPage({ onSuccess, onCancel }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthStore();
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !username)
            return;
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            login(email, username);
            setIsLoading(false);
            onSuccess();
        }, 500);
    };
    return (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50", children: _jsxs("div", { className: "bg-gradient-card border border-brand-primary/50 rounded-3xl p-8 max-w-md w-[90vw] shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h1", { className: "text-2xl font-bold neon-text", children: "O'qituvchi Kirish" }), _jsx("button", { onClick: onCancel, className: "text-gray-400 hover:text-white transition", children: _jsx(X, { size: 24 }) })] }), _jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-gray-300 mb-2", children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "o'qituvchi@mail.com", className: "w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-gray-300 mb-2", children: "Foydalanuvchi nomi" }), _jsx("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), placeholder: "o'qituvchi_nomi", className: "w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition", required: true })] }), _jsx("button", { type: "submit", disabled: isLoading || !email || !username, className: "w-full py-3 bg-gradient-primary hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-lg transition mt-6", children: isLoading ? 'Kuting...' : 'Kirish' }), _jsx("button", { type: "button", onClick: onCancel, className: "w-full py-2 bg-dark-border hover:bg-dark-border/80 text-white font-bold rounded-lg transition", children: "Bekor qilish" })] }), _jsx("div", { className: "mt-6 pt-6 border-t border-dark-border", children: _jsx("p", { className: "text-xs text-gray-400 text-center", children: "Test o'qituvchilari uchun maxsus portalga kirish uchun email va foydalanuvchi nomini kiriting." }) })] }) }));
}
