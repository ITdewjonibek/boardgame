import { ArrowLeft, PlusCircle } from 'lucide-react'
import type { GameKey } from '../data/gameBank'
import CourierRoadGame from '../games/CourierRoadGame'
import LuckyTicketGame from '../games/LuckyTicketGame'
import LuckyWheelGame from '../games/LuckyWheelGame'
import Neo2048Game from '../games/Neo2048Game'
import SubjectQuizGame from '../games/SubjectQuizGame'
import TugOfWarGame from '../games/TugOfWarGame'

const titles: Record<GameKey, { title: string; subtitle: string }> = {
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
}

export default function GameShell({ gameKey, onBack, onAddTests }: { gameKey: GameKey; onBack: () => void; onAddTests: () => void }) {
  const meta = titles[gameKey]

  return (
    <div className="min-h-screen px-4 py-4 md:px-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="premium-topbar">
          <button className="premium-button secondary" onClick={onBack}><ArrowLeft size={16} /> Games</button>
          <div>
            <div className="text-2xl font-black text-white md:text-3xl">{meta.title}</div>
            <div className="text-sm text-slate-400 md:text-base">{meta.subtitle}</div>
          </div>
          <button className="premium-button secondary" onClick={onAddTests}><PlusCircle size={16} /> Test qo'shish</button>
        </div>

        {gameKey === 'courier-road' && <CourierRoadGame />}
        {gameKey === 'neo-2048' && <Neo2048Game />}
        {gameKey === 'lucky-ticket' && <LuckyTicketGame />}
        {gameKey === 'lucky-wheel' && <LuckyWheelGame />}
        {gameKey === 'tug-of-war' && <TugOfWarGame />}
        {!['courier-road', 'neo-2048', 'lucky-ticket', 'lucky-wheel', 'tug-of-war'].includes(gameKey) && (
          <SubjectQuizGame topic={gameKey} />
        )}
      </div>
    </div>
  )
}
