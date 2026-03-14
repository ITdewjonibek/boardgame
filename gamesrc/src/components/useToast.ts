import { useEffect, useState } from 'react'

export function useToast(timeoutMs = 1800) {
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!msg) return
    const t = window.setTimeout(() => setMsg(null), timeoutMs)
    return () => window.clearTimeout(t)
  }, [msg, timeoutMs])

  return { msg, toast: setMsg }
}
