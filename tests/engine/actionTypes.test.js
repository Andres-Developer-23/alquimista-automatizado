import { describe, expect, it } from 'vitest'
import {
  ACTION,
  isValidAction,
  normalizeActions,
} from '../../src/engine/actions/actionTypes'

describe('action validation', () => {
  it('accepts valid girar and recoger actions', () => {
    expect(isValidAction({ action: ACTION.GIRAR, grados: 90 })).toBe(true)
    expect(isValidAction({ action: ACTION.GIRAR, grados: -45.5 })).toBe(true)
    expect(isValidAction({ action: ACTION.RECOGER })).toBe(true)
  })

  it('rejects malformed girar and recoger actions', () => {
    expect(isValidAction({ action: ACTION.GIRAR })).toBe(false)
    expect(isValidAction({ action: ACTION.GIRAR, grados: '90' })).toBe(false)
    expect(isValidAction({ action: ACTION.GIRAR, grados: Number.NaN })).toBe(false)
    expect(isValidAction({ action: ACTION.GIRAR, grados: Number.POSITIVE_INFINITY })).toBe(false)
    expect(isValidAction({ action: ACTION.RECOGER, x: 1 })).toBe(true)
    expect(isValidAction({ action: 'SALTAR' })).toBe(false)
  })

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
      { action: ACTION.GIRAR, grados: 90 },
      { action: ACTION.RECOGER },
      { action: ACTION.GIRAR, grados: Number.NaN },
      { action: 'DESCONOCIDA' },
    ])

    expect(actions).toEqual([
      { action: ACTION.MOVER, x: 1, y: 2 },
      { action: ACTION.GIRAR, grados: 90 },
      { action: ACTION.RECOGER },
    ])
  })

  it('returns an empty list for a non-array response', () => {
    expect(normalizeActions(null)).toEqual([])
    expect(normalizeActions({})).toEqual([])
  })
})
