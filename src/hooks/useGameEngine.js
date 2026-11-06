import { useCallback, useEffect, useRef, useState } from 'react'
import { createActionQueue } from '../engine/actions/actionQueue'
import { createTickEngine, TICK_INTERVAL_MS } from '../engine/tick/tickEngine'

const INITIAL_POSITION = { x: 0, y: 0 }
const BOARD_LIMIT = 2

const clampToBoard = (value) =>
  Math.min(BOARD_LIMIT, Math.max(-BOARD_LIMIT, value))

export function useGameEngine() {
  const queueRef = useRef(null)
  const engineRef = useRef(null)
  const completionTimerRef = useRef(null)
  const [position, setPosition] = useState(INITIAL_POSITION)
  const [isPlaying, setIsPlaying] = useState(false)

  const clearCompletionTimer = useCallback(() => {
    if (completionTimerRef.current === null) return
    clearTimeout(completionTimerRef.current)
    completionTimerRef.current = null
  }, [])

  useEffect(() => {
    const queue = createActionQueue()
    const engine = createTickEngine({
      queue,
      onTick: (action) =>
        setPosition({
          x: clampToBoard(action.x),
          y: clampToBoard(action.y),
        }),
      // La última acción también necesita 500 ms para completar su animación.
      onComplete: () => {
        completionTimerRef.current = setTimeout(() => {
          completionTimerRef.current = null
          setIsPlaying(false)
        }, TICK_INTERVAL_MS)
      },
    })

    queueRef.current = queue
    engineRef.current = engine

    return () => {
      clearCompletionTimer()
      engine.stop()
      queue.clear()
      queueRef.current = null
      engineRef.current = null
    }
  }, [clearCompletionTimer])

  const play = useCallback(
    (actions) => {
      const queue = queueRef.current
      const engine = engineRef.current
      if (!queue || !engine) return

      clearCompletionTimer()
      engine.stop()
      queue.clear()

      if (!Array.isArray(actions) || actions.length === 0) {
        setIsPlaying(false)
        return
      }

      queue.enqueueAll(actions)
      setIsPlaying(true)
      engine.start()
    },
    [clearCompletionTimer],
  )

  const stop = useCallback(() => {
    clearCompletionTimer()
    engineRef.current?.stop()
    queueRef.current?.clear()
    setIsPlaying(false)
  }, [clearCompletionTimer])

  return { position, isPlaying, play, stop }
}
