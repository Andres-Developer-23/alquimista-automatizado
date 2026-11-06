import { describe, expect, it } from 'vitest'
import {
  clampPointToBoard,
  createLevel,
  isGoal,
  isObstacle,
  isWithinBoard,
  validateLevel,
} from '../../../src/engine/levels/level'

const base = {
  id: 'nivel-01',
  title: 'Primer nivel',
  objective: 'Llega al caldero.',
  board: { minX: -2, maxX: 2, minY: -2, maxY: 2 },
  start: { x: -2, y: -2, rotation: 0 },
  goal: { x: 2, y: 2 },
  obstacles: [{ x: 0, y: 0 }],
}

describe('level validation', () => {
  it('accepts a valid level', () => {
    expect(validateLevel(base)).toEqual([])
  })

  it('rejects missing or non-object input', () => {
    expect(validateLevel(null)).toEqual(['El nivel debe ser un objeto.'])
    expect(validateLevel(undefined)).toEqual(['El nivel debe ser un objeto.'])
  })

  it('rejects missing id and title', () => {
    expect(validateLevel({ ...base, id: '' })).toContain('El nivel necesita un id.')
    expect(validateLevel({ ...base, title: '' })).toContain('El nivel necesita un título.')
  })

  it('rejects missing objective', () => {
    expect(validateLevel({ ...base, objective: '' })).toContain(
      'El nivel necesita un objetivo legible.'
    )
  })

  it('rejects invalid board limits', () => {
    const badBoard = { ...base, board: { minX: 2, maxX: -2, minY: -2, maxY: 2 } }
    expect(validateLevel(badBoard)).toContain(
      'Los límites mínimo y máximo del tablero están invertidos.'
    )

    const missingBoard = { ...base, board: null }
    expect(validateLevel(missingBoard)).toContain(
      'El tablero necesita límites enteros: minX, maxX, minY y maxY.'
    )
  })

  it('rejects positions outside the board', () => {
    const startOut = { ...base, start: { x: 9, y: 9 } }
    expect(validateLevel(startOut)).toContain('La posición inicial está fuera del tablero.')

    const goalOut = { ...base, goal: { x: 5, y: 0 } }
    expect(validateLevel(goalOut)).toContain('El objetivo está fuera del tablero.')
  })

  it('rejects obstacles outside the board', () => {
    const obsOut = { ...base, obstacles: [{ x: 9, y: 0 }] }
    expect(validateLevel(obsOut)).toContain(
      'El obstáculo 1 está fuera del tablero.'
    )
  })

  it('rejects duplicate coordinates between start, goal and obstacles', () => {
    const dup = { ...base, goal: { x: -2, y: -2 } }
    expect(validateLevel(dup)).toContain('Hay coordenadas duplicadas en -2,-2.')

    const dupObstacle = { ...base, start: { x: 0, y: 0 } }
    expect(validateLevel(dupObstacle)).toContain('Hay coordenadas duplicadas en 0,0.')
  })
})

describe('createLevel', () => {
  it('freezes and normalizes a valid level', () => {
    const level = createLevel(base)

    expect(level.id).toBe('nivel-01')
    expect(level.title).toBe('Primer nivel')
    expect(level.objective).toBe('Llega al caldero.')
    expect(level.start).toEqual({ x: -2, y: -2, rotation: 0 })
    expect(level.goal).toEqual({ x: 2, y: 2 })
    expect(level.obstacles).toEqual([{ x: 0, y: 0 }])

    expect(() => {
      level.start.x = 9
    }).toThrow()
  })

  it('defaults rotation to zero', () => {
    const level = createLevel({ ...base, start: { x: 0, y: 0 }, obstacles: [] })
    expect(level.start.rotation).toBe(0)
  })

  it('throws for invalid input', () => {
    expect(() => createLevel({ ...base, id: '' })).toThrow('Nivel inválido:')
  })
})

describe('board helpers', () => {
  const board = { minX: -2, maxX: 2, minY: -2, maxY: 2 }

  it('checks board bounds inclusively', () => {
    expect(isWithinBoard({ x: -2, y: -2 }, board)).toBe(true)
    expect(isWithinBoard({ x: 2, y: 2 }, board)).toBe(true)
    expect(isWithinBoard({ x: 3, y: 0 }, board)).toBe(false)
    expect(isWithinBoard({ x: 0, y: -3 }, board)).toBe(false)
  })

  it('clamps points to board bounds', () => {
    expect(clampPointToBoard({ x: 9, y: -9 }, board)).toEqual({ x: 2, y: -2 })
    expect(clampPointToBoard({ x: -5, y: 3 }, board)).toEqual({ x: -2, y: 2 })
    expect(clampPointToBoard({ x: 0, y: 0 }, board)).toEqual({ x: 0, y: 0 })
  })

  it('detects obstacles', () => {
    const obstacles = [{ x: 0, y: 0 }]
    expect(isObstacle({ x: 0, y: 0 }, obstacles)).toBe(true)
    expect(isObstacle({ x: 1, y: 0 }, obstacles)).toBe(false)
    expect(isObstacle({ x: 0, y: 0 }, [])).toBe(false)
  })

  it('detects the goal', () => {
    const goal = { x: 2, y: 2 }
    expect(isGoal({ x: 2, y: 2 }, goal)).toBe(true)
    expect(isGoal({ x: 2, y: 1 }, goal)).toBe(false)
  })
})
