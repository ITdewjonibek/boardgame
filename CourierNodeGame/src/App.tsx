import { useEffect, useState } from 'react'
import AdminLoginPage from './components/AdminLoginPage'
import GameShell from './components/GameShell'
import PremiumHome from './components/PremiumHome'
import TestManagementPage from './components/TestManagementPage'
import { getMockSections } from './mockData'
import { useAuthStore, useSectionStore } from './store'
import type { GameKey } from './data/gameBank'

type Screen = 'home' | 'game' | 'login' | 'admin'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [activeGame, setActiveGame] = useState<GameKey>('courier-road')
  const { isLoggedIn, teacher } = useAuthStore()
  const { sections, loadSections } = useSectionStore()

  useEffect(() => {
    loadSections()
    const currentTeacher = localStorage.getItem('currentTeacher')
    if (!localStorage.getItem('testSections') && sections.length === 0) {
      getMockSections().forEach((section) => useSectionStore.getState().addSection(section))
    }
    if (currentTeacher) {
      const parsed = JSON.parse(currentTeacher)
      useAuthStore.setState({ teacher: parsed, isLoggedIn: true })
    }
  }, [])

  const openGame = (key: GameKey) => {
    setActiveGame(key)
    setScreen('game')
  }

  const openTests = () => setScreen(isLoggedIn ? 'admin' : 'login')

  return (
    <div className="min-h-screen bg-gradient-dark text-white">
      {screen === 'home' && <PremiumHome onOpenGame={openGame} onAddTests={openTests} />}
      {screen === 'game' && <GameShell gameKey={activeGame} onBack={() => setScreen('home')} onAddTests={openTests} />}
      {screen === 'login' && <AdminLoginPage onSuccess={() => setScreen('admin')} onCancel={() => setScreen('home')} />}
      {screen === 'admin' && teacher && <TestManagementPage teacher={teacher} onBack={() => setScreen('home')} />}
    </div>
  )
}
