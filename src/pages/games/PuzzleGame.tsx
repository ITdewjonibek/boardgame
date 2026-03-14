import React from 'react'
import PuzzleArena from '@/components/PuzzleArena'

export default function PuzzleGame() {
  return (
    <div className="w-full h-full">
      <PuzzleArena 
        gameTitle="PUZZLE ARENA" 
        gameTone="O'rta"
        leftTeamName="Jamoa 1"
        rightTeamName="Jamoa 2"
        initialDifficulty="O'rta"
        initialEnabledOps={['+', '-', 'x', '/']}
      />
    </div>
  )
}
