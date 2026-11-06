import { describe, expect, it } from 'vitest'
import { ALL_LEVELS, getLevel, getLevelIds, firstLevelId } from '../../../src/engine/levels/levelsRegistry'
import { validateLevel } from '../../../src/engine/levels/level'

describe('levels registry', () => {
  it('exposes los niveles registrados', () => {
    expect(ALL_LEVELS.length).toBeGreaterThanOrEqual(2)
    expect(getLevelIds()).toEqual(ALL_LEVELS.map((lvl) => lvl.id))
  })

  it('devuelve un nivel por su id', () => {
    const nivel = getLevel('nivel-01')
    expect(nivel.id).toBe('nivel-01')
    expect(nivel.title).toBe('El primer encargo')
  })

  it('lanza error para un nivel desconocido', () => {
    expect(() => getLevel('nivel-99')).toThrow('Nivel desconocido: nivel-99')
  })

  it('devuelve el id del primer nivel', () => {
    expect(firstLevelId()).toBe('nivel-01')
  })

  it('todos los niveles registrados son válidos', () => {
    for (const nivel of ALL_LEVELS) {
      expect(validateLevel(nivel)).toEqual([])
    }
  })
})
