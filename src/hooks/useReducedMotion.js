import { useCallback, useState, useEffect } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(QUERY).matches
  })

  const handleChange = useCallback((event) => {
    setReduced(event.matches)
  }, [])

  useEffect(() => {
    if (!window.matchMedia) return
    const media = window.matchMedia(QUERY)
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [handleChange])

  return reduced
}
