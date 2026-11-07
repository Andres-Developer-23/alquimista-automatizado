import { useCallback, useEffect, useRef, useState } from 'react'
import { createActionQueue } from '../engine/actions/actionQueue'
import { TICK_INTERVAL_MS, createTickEngine } from '../engine/tick/tickEngine'
import { clampPointToBoard, isAdjacent, isObstacle, isPlanter, isStation } from '../engine/levels/level'
import { SHOP_OBSTACLES } from '../engine/levels/level'
import { getLevel, getLevelIds } from '../engine/levels/levelsRegistry'

const INITIAL_INVENTORY = 0
const EMPTY_PLANTERS = Object.freeze({})

// Los grados negativos deben envolver, no saltar directamente.
const normalizeRotation = (degrees) => ((degrees % 360) + 360) % 360

const planterKey = (point) => `${point.x},${point.y}`

export function useGameEngine({ levelId } = {}) {
  const resolvedLevelId = levelId ?? getLevelIds()[0]
  const queueRef = useRef(null)
  const engineRef = useRef(null)
  const completionTimerRef = useRef(null)
  const [position, setPosition] = useState({
    x: getLevel(resolvedLevelId).start.x,
    y: getLevel(resolvedLevelId).start.y,
  })
  // Espejo síncrono de position para leerlo dentro de onTick.
  const positionRef = useRef({ ...position })
  const [rotation, setRotation] = useState(getLevel(resolvedLevelId).start.rotation)
  const [inventory, setInventory] = useState(INITIAL_INVENTORY)
  const [isWon, setIsWon] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  // Estado de cada maceta: 'planted' crece al siguiente tick, 'grown' se puede cosechar.
  const [plantersState, setPlantersState] = useState(EMPTY_PLANTERS)
  const plantersStateRef = useRef(EMPTY_PLANTERS)

  const setEnginePosition = useCallback((value) => {
    positionRef.current = value
    setPosition(value)
  }, [])

  const applyPlanters = useCallback((next) => {
    plantersStateRef.current = next
    setPlantersState(next)
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
        // El crecimiento avanza al inicio de cada tick: planted -> grown.
        const growing = plantersStateRef.current
        let grew = false
        for (const key of Object.keys(growing)) {
          if (growing[key] === 'planted') grew = true
        }
        if (grew) {
          const next = { ...growing }
          for (const key of Object.keys(next)) {
            if (next[key] === 'planted') next[key] = 'grown'
          }
          applyPlanters(next)
        }

        if (action.action === 'MOVER') {
          const target = clampPointToBoard(action, level.board)
          const allObstacles = [...level.obstacles, ...SHOP_OBSTACLES]
          if (isObstacle(target, allObstacles)) return
          // Las estaciones fijas (caldero, tolva) no se pueden pisar.
          if (isStation(target, level.stations)) return

          setEnginePosition(target)
          // Victoria al quedar en la casilla de al lado de la estación objetivo.
          if (isAdjacent(target, level.goal)) finishLevel()
          return
        }

        if (action.action === 'GIRAR') {
          setRotation((current) => normalizeRotation(current + action.grados))
          return
        }

        if (action.action === 'RECOGER') {
          setInventory((current) => current + 1)
          return
        }

        if (action.action === 'PLANTAR') {
          const current = positionRef.current
          if (!isPlanter(current, level.planters)) return
          const key = planterKey(current)
          const state = plantersStateRef.current
          if (state[key]) return
          applyPlanters({ ...state, [key]: 'planted' })
          return
        }

        if (action.action === 'COSECHAR') {
          const current = positionRef.current
          if (!isPlanter(current, level.planters)) return
          const key = planterKey(current)
          if (plantersStateRef.current[key] !== 'grown') return
          const next = { ...plantersStateRef.current }
          delete next[key]
          applyPlanters(next)
          setInventory((value) => value + 1)
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
    applyPlanters(EMPTY_PLANTERS)

    queueRef.current = queue
    engineRef.current = engine

    return () => {
      clearCompletionTimer()
      engine.stop()
      queue.clear()
      queueRef.current = null
      engineRef.current = null
    }
  }, [resolvedLevelId, clearCompletionTimer, setEnginePosition, applyPlanters])

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
    applyPlanters(EMPTY_PLANTERS)
  }, [clearCompletionTimer, resolvedLevelId, setEnginePosition, applyPlanters])

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
    plantersState,
    play,
    stop,
    resetLevel,
  }
}
