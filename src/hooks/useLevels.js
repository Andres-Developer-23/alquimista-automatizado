import { useCallback, useState } from 'react'
import { ALL_LEVELS } from '../engine/levels/levelsRegistry'

const STORAGE_KEY = 'alquimista-automatizado/progress'

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

function savedCurrentLevelId(parsed, levelIds) {
  if (!parsed || !parsed.currentLevelId) return null
  return levelIds.includes(parsed.currentLevelId) ? parsed.currentLevelId : null
}

function savedCompletedIds(parsed, levelIds) {
  if (!parsed || !Array.isArray(parsed.completed)) return new Set()
  return new Set(parsed.completed.filter((id) => levelIds.includes(id)))
}

export function useLevels() {
  const [levels] = useState(() => ALL_LEVELS)
  const levelIds = levels.map((level) => level.id)
  const firstLevelId = levelIds[0]

  const saved = loadProgress()

  const [currentLevelId, setCurrentLevelId] = useState(() =>
    savedCurrentLevelId(saved, levelIds) ?? firstLevelId
  )
  const [completedIds, setCompletedIds] = useState(() =>
    savedCompletedIds(saved, levelIds)
  )

  const persist = useCallback(
    (next) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // localStorage no disponible (p.ej. modo privado): se ignora silenciosamente
      }
    },
    []
  )

  const selectLevel = useCallback(
    (id) => {
      if (!levelIds.includes(id)) return
      setCurrentLevelId(id)
      persist({ currentLevelId: id, completed: [...completedIds] })
    },
    [levelIds, completedIds, persist]
  )

  const completeLevel = useCallback(
    (id) => {
      if (completedIds.has(id)) return
      setCompletedIds((previous) => {
        const next = new Set(previous)
        next.add(id)
        persist({ currentLevelId, completed: [...next] })
        return next
      })
    },
    [completedIds, currentLevelId, persist]
  )

  const resetProgress = useCallback(() => {
    setCurrentLevelId(firstLevelId)
    setCompletedIds(new Set())
    persist({ currentLevelId: firstLevelId, completed: [] })
  }, [firstLevelId, persist])

  const isCompleted = useCallback((id) => completedIds.has(id), [completedIds])

  return {
    levels,
    currentLevelId,
    selectLevel,
    completedIds,
    completeLevel,
    resetProgress,
    isCompleted,
    firstLevelId,
  }
}
