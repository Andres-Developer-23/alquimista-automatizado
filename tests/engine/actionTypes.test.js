import { describe, expect, it } from 'vitest'
import {
  ACTION,
  isValidAction,
  normalizeActions,
} from '../../src/engine/actions/actionTypes'

describe('action validation', () => {
  it('accepts a valid mover action', () => {
    expect(isValidAction({ action: ACTION.MOVER, x: 1, y: 2 })).toBe(true)
  })

  it('rejects malformed actions', () => {
    expect(isValidAction(null)).toBe(false)
    expect(isValidAction({ action: 'VOLAR', x: 1, y: 2 })).toBe(false)
    expect(isValidAction({ action: ACTION.MOVER, x: 1.5, y: 2 })).toBe(false)
    expect(isValidAction({ action: ACTION.MOVER, x: '1', y: 2 })).toBe(false)
  })

  it('filters invalid actions from the worker response', () => {
    const actions = normalizeActions([
      { action: ACTION.MOVER, x: 1, y: 2 },
      { action: ACTION.MOVER, x: null, y: 2 },
      { action: 'DESCONOCIDA' },
    ])

    expect(actions).toEqual([{ action: ACTION.MOVER, x: 1, y: 2 }])
  })

  it('returns an empty list for a non-array response', () => {
    expect(normalizeActions(null)).toEqual([])
    expect(normalizeActions({})).toEqual([])
  })
})
