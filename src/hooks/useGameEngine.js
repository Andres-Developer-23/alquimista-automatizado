import { useCallback, useEffect, useRef, useState } from 'react'
import { createActionQueue } from '../engine/actions/actionQueue'
import { createTickEngine } from '../engine/tick/tickEngine'

const INITIAL_POSITION = { x: 0, y: 0 }

export function useGameEngine() {
  const queueRef = useRef(null)
  const engineRef = useRef(null)
  const [position, setPosition] = useState(INITIAL_POSITION)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const queue = createActionQueue()
    const engine = createTickEngine({
      queue,
      // shortcut: el Gólem salta de celda; la interpolación visual llega en #12.
      onTick: (action) => setPosition({ x: action.x, y: action.y }),
      onComplete: () => setIsPlaying(false),
    })

    queueRef.current = queue
    engineRef.current = engine

    return () => {
      engine.stop()
      queue.clear()
      queueRef.current = null
      engineRef.current = null
    }
  }, [])

  const play = useCallback((actions) => {
    const queue = queueRef.current
    const engine = engineRef.current
    if (!queue || !engine) return

    engine.stop()
    queue.clear()

    if (!Array.isArray(actions) || actions.length === 0) {
      setIsPlaying(false)
      return
    }

    queue.enqueueAll(actions)
    setIsPlaying(true)
    engine.start()
  }, [])

  const stop = useCallback(() => {
    engineRef.current?.stop()
    queueRef.current?.clear()
    setIsPlaying(false)
  }, [])

  return { position, isPlaying, play, stop }
}
