import { useMemo } from 'react'

interface RoadAndCarProps {
  currentNode: number
  totalNodes: number
}

export default function RoadAndCar({ currentNode, totalNodes }: RoadAndCarProps) {
  const carPosition = useMemo(() => {
    return (currentNode / totalNodes) * 100
  }, [currentNode, totalNodes])

  return (
    <div className="flex-1 flex flex-col">
      {/* Road Scene */}
      <div className="flex-1 relative bg-gradient-card border border-dark-border rounded-3xl overflow-hidden">
        {/* Background City */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-card to-dark-bg opacity-50" />

        {/* Road */}
        <div className="absolute left-0 right-0 bottom-20 h-40 bg-gradient-to-b from-gray-800 to-gray-900 border-t-2 border-b-2 border-yellow-500/30">
          {/* Lane lines */}
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-yellow-500/40" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(234, 179, 8, 0.6) 40px, rgba(234, 179, 8, 0.6) 80px)',
          }} />
        </div>

        {/* Traffic Lights (Markers) */}
        <div className="absolute left-0 right-0 bottom-32 h-24 flex items-center justify-between px-8">
          {Array.from({ length: totalNodes }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 transition-all duration-300"
            >
              {/* Traffic light pole */}
              <div className="w-1 h-12 bg-gray-700 rounded-full" />
              {/* Traffic light */}
              <div className={`w-6 h-6 rounded-full border-2 border-gray-600 transition-all duration-300 ${
                idx < currentNode
                  ? 'bg-success glow shadow-lg shadow-success'
                  : idx === currentNode
                    ? 'bg-warning animate-pulse shadow-lg shadow-warning'
                    : 'bg-gray-700'
              }`} />
            </div>
          ))}
        </div>

        {/* Car */}
        <div
          className="absolute bottom-24 transition-all duration-700 ease-out"
          style={{ left: `${carPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="relative w-16 h-10">
            {/* Car body */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-400 rounded-2xl border-2 border-white/30 shadow-lg" />

            {/* Car window */}
            <div className="absolute top-2 right-3 w-5 h-4 bg-blue-300/60 border border-white/40 rounded-sm" />

            {/* Wheels */}
            <div className="absolute -bottom-1 left-2 w-3 h-3 bg-gray-900 border border-white/20 rounded-full" />
            <div className="absolute -bottom-1 right-2 w-3 h-3 bg-gray-900 border border-white/20 rounded-full" />

            {/* Light glow */}
            <div className="absolute inset-0 rounded-2xl bg-orange-400/30 filter blur-lg" />
          </div>
        </div>

        {/* Delivery House (at the end) */}
        {currentNode >= totalNodes - 1 && (
          <div className="absolute right-12 top-12 w-20 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg border-2 border-white/20 shadow-lg">
            {/* Roof */}
            <div className="absolute -top-3 left-0 right-0 h-6 bg-red-600 rounded-t-lg" style={{
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
            }} />
            {/* Door */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-12 bg-yellow-700 rounded border-2 border-white/30" />
            {/* Window */}
            <div className="absolute top-3 left-2 w-5 h-5 bg-sky-200 border border-white/40 rounded" />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="mt-4 flex items-center justify-between px-6 py-3 bg-dark-card border border-dark-border rounded-lg">
        <div>
          <p className="text-xs text-gray-500">Joriy Svetafor</p>
          <p className="text-lg font-bold text-brand-primary">
            {currentNode + 1} / {totalNodes}
          </p>
        </div>
        <div className="flex-1 mx-8">
          <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary transition-all duration-300"
              style={{ width: `${(currentNode / totalNodes) * 100}%` }}
            />
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Masofta</p>
          <p className="text-lg font-bold text-warning">
            {Math.round((currentNode / totalNodes) * 100)}%
          </p>
        </div>
      </div>
    </div>
  )
}
