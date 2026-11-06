import { useCallback, useEffect, useRef, useState } from 'react'
import { createActionQueue } from '../engine/actions/actionQueue'
import { createTickEngine, TICK_INTERVAL_MS } from '../engine/tick/tickEngine'

const INITIAL_POSITION = { x: 0, y: 0 }
const INITIAL_ROTATION = 0
const INITIAL_INVENTORY = 0
const BOARD_LIMIT = 2

const clampToBoard = (value) =>
  Math.min(BOARD_LIMIT, Math.max(-BOARD_LIMIT, value))

// Los grados negativos deben envolver, no saltar directamente.
const normalizeRotation = (degrees) => ((degrees % 360) + 360) % 360

export function useGameEngine() {
  const queueRef = useRef(null)
  const engineRef = useRef(null)
  const completionTimerRef = useRef(null)
  const [position, setPosition] = useState(INITIAL_POSITION)
  const [rotation, setRotation] = useState(INITIAL_ROTATION)
  const [inventory, setInventory] = useState(INITIAL_INVENTORY)
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
      onTick: (action) => {
        if (action.action === 'MOVER') {
          setPosition({
            x: clampToBoard(action.x),
            y: clampToBoard(action.y),
          })
          return
        }

        if (action.action === 'GIRAR') {
          setRotation((current) => normalizeRotation(current + action.grados))
          return
        }

        if (action.action === 'RECOGER') {
          setInventory((current) => current + 1)
        }
      },
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
      setPosition(INITIAL_POSITION)
      setRotation(INITIAL_ROTATION)
      setInventory(INITIAL_INVENTORY)

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

  return { position, rotation, inventory, isPlaying, play, stop }
}
