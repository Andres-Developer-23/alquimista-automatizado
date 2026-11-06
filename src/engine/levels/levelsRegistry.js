import { createLevel } from './level'
import nivel01 from '../../levels/nivel-01.json'
import nivel02 from '../../levels/nivel-02.json'

const created = [nivel01, nivel02].map(createLevel)

export const ALL_LEVELS = Object.freeze(created)

export function getLevel(id) {
  const level = ALL_LEVELS.find((level) => level.id === id)
  if (!level) throw new Error(`Nivel desconocido: ${id}`)
  return level
}

export function getLevelIds() {
  return ALL_LEVELS.map((level) => level.id)
}

export function firstLevelId() {
  return ALL_LEVELS[0]?.id
}
