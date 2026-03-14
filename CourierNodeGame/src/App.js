import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import AdminLoginPage from './components/AdminLoginPage';
import GameShell from './components/GameShell';
import PremiumHome from './components/PremiumHome';
import TestManagementPage from './components/TestManagementPage';
import { getMockSections } from './mockData';
import { useAuthStore, useSectionStore } from './store';
export default function App() {
    const [screen, setScreen] = useState('home');
    const [activeGame, setActiveGame] = useState('courier-road');
    const { isLoggedIn, teacher } = useAuthStore();
    const { sections, loadSections } = useSectionStore();
    useEffect(() => {
        loadSections();
        const currentTeacher = localStorage.getItem('currentTeacher');
        if (!localStorage.getItem('testSections') && sections.length === 0) {
            getMockSections().forEach((section) => useSectionStore.getState().addSection(section));
        }
        if (currentTeacher) {
            const parsed = JSON.parse(currentTeacher);
            useAuthStore.setState({ teacher: parsed, isLoggedIn: true });
        }
    }, []);
    const openGame = (key) => {
        setActiveGame(key);
        setScreen('game');
    };
    const openTests = () => setScreen(isLoggedIn ? 'admin' : 'login');
    return (_jsxs("div", { className: "min-h-screen bg-gradient-dark text-white", children: [screen === 'home' && _jsx(PremiumHome, { onOpenGame: openGame, onAddTests: openTests }), screen === 'game' && _jsx(GameShell, { gameKey: activeGame, onBack: () => setScreen('home'), onAddTests: openTests }), screen === 'login' && _jsx(AdminLoginPage, { onSuccess: () => setScreen('admin'), onCancel: () => setScreen('home') }), screen === 'admin' && teacher && _jsx(TestManagementPage, { teacher: teacher, onBack: () => setScreen('home') })] }));
}
