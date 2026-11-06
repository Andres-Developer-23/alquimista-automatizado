import { useCallback, useEffect, useRef, useState } from 'react'
import { createActionQueue } from '../engine/actions/actionQueue'
import { TICK_INTERVAL_MS, createTickEngine } from '../engine/tick/tickEngine'
import { clampPointToBoard, isGoal, isObstacle } from '../engine/levels/level'
import { SHOP_OBSTACLES } from '../engine/levels/level'
import { getLevel, getLevelIds } from '../engine/levels/levelsRegistry'

const INITIAL_INVENTORY = 0

// Los grados negativos deben envolver, no saltar directamente.
const normalizeRotation = (degrees) => ((degrees % 360) + 360) % 360

export function useGameEngine({ levelId } = {}) {
  const resolvedLevelId = levelId ?? getLevelIds()[0]
  const queueRef = useRef(null)
  const engineRef = useRef(null)
  const completionTimerRef = useRef(null)
  const [position, setPosition] = useState({
    x: getLevel(resolvedLevelId).start.x,
    y: getLevel(resolvedLevelId).start.y,
  })
  const [rotation, setRotation] = useState(getLevel(resolvedLevelId).start.rotation)
  const [inventory, setInventory] = useState(INITIAL_INVENTORY)
  const [isWon, setIsWon] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const setEnginePosition = useCallback((value) => {
    setPosition(value)
  }, [])

  const clearCompletionTimer = useCallback(() => {
    if (completionTimerRef.current === null) return
    clearTimeout(completionTimerRef.current)
    completionTimerRef.current = null
  }, [])

  useEffect(() => {
    const level = getLevel(resolvedLevelId)
    const queue = createActionQueue()

    const finishLevel = () => {
      clearCompletionTimer()
      engineRef.current?.stop()
      queueRef.current?.clear()
      setIsWon(true)
      setIsPlaying(false)
    }

    const engine = createTickEngine({
      queue,
      onTick: (action) => {
        if (action.action === 'MOVER') {
          const target = clampPointToBoard(action, level.board)
          const allObstacles = [...level.obstacles, ...SHOP_OBSTACLES]
          if (isObstacle(target, allObstacles)) return

          setEnginePosition(target)
          if (isGoal(target, level.goal)) finishLevel()
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

    // Restablece el estado visible al cambiar de nivel.
    setEnginePosition({ x: level.start.x, y: level.start.y })
    setRotation(level.start.rotation)
    setInventory(INITIAL_INVENTORY)
    setIsWon(false)
    setIsPlaying(false)

    queueRef.current = queue
    engineRef.current = engine

    return () => {
      clearCompletionTimer()
      engine.stop()
      queue.clear()
      queueRef.current = null
      engineRef.current = null
    }
  }, [resolvedLevelId, clearCompletionTimer, setEnginePosition])

  const resetLevel = useCallback(() => {
    clearCompletionTimer()
    engineRef.current?.stop()
    queueRef.current?.clear()
    const level = getLevel(resolvedLevelId)
    setEnginePosition({ x: level.start.x, y: level.start.y })
    setRotation(level.start.rotation)
    setInventory(INITIAL_INVENTORY)
    setIsWon(false)
    setIsPlaying(false)
  }, [clearCompletionTimer, resolvedLevelId, setEnginePosition])

  const play = useCallback(
    (actions) => {
      const queue = queueRef.current
      const engine = engineRef.current
      if (!queue || !engine) return

      resetLevel()

      if (!Array.isArray(actions) || actions.length === 0) return

      queue.enqueueAll(actions)
      setIsPlaying(true)
      engine.start()
    },
    [resetLevel],
  )

  const stop = useCallback(() => {
    clearCompletionTimer()
    engineRef.current?.stop()
    queueRef.current?.clear()
    setIsPlaying(false)
  }, [clearCompletionTimer])

  return {
    level: getLevel(resolvedLevelId),
    position,
    rotation,
    inventory,
    isWon,
    isPlaying,
    play,
    stop,
    resetLevel,
  }
}
