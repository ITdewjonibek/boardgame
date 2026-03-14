import React, { useEffect } from 'react'

type ConfettiOverlayProps = {
  burstKey?: string | number
}

export default function ConfettiOverlay({ burstKey }: ConfettiOverlayProps) {
  useEffect(() => {
    if (burstKey && typeof window !== 'undefined' && window.confetti) {
      window.confetti()
    }
  }, [burstKey])

  return null
}
