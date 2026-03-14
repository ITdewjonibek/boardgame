import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import GameShell from './components/GameShell'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/games" replace />} />
      <Route path="/games" element={<Home />} />
      <Route path="/games/:key" element={<GameShell />} />
      <Route path="*" element={<Navigate to="/games" replace />} />
    </Routes>
  )
}
