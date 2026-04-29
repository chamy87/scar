import { useEffect, useRef } from "react"

export function useInactivityTimer({
  enabled,
  timeoutMs,
  onTimeout,
}: {
  enabled: boolean
  timeoutMs: number
  onTimeout: () => void
}) {
  const timerRef = useRef<number | null>(null)
  const callbackRef = useRef(onTimeout)
  callbackRef.current = onTimeout

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = null
      return
    }

    const reset = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => callbackRef.current(), timeoutMs)
    }

    const events: (keyof WindowEventMap)[] = ["mousemove", "click", "keydown", "scroll", "touchstart"]
    events.forEach((evt) => window.addEventListener(evt, reset, { passive: true }))
    reset()

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, reset))
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [enabled, timeoutMs])
}
