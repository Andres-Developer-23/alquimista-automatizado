import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useLevels } from '../../src/hooks/useLevels'

const STORAGE_KEY = 'alquimista-automatizado/progress'

describe('useLevels', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('empieza en el primer nivel sin progreso', () => {
    const { result } = renderHook(() => useLevels())

    expect(result.current.currentLevelId).toBe('nivel-01')
    expect(result.current.levels.length).toBeGreaterThanOrEqual(2)
    expect(result.current.isCompleted('nivel-01')).toBe(false)
    expect(result.current.isCompleted('nivel-02')).toBe(false)
  })

  it('permite cambiar de nivel sin recargar', () => {
    const { result } = renderHook(() => useLevels())

    act(() => result.current.selectLevel('nivel-02'))

    expect(result.current.currentLevelId).toBe('nivel-02')
  })

  it('ignora ids de nivel inexistentes', () => {
    const { result } = renderHook(() => useLevels())

    act(() => result.current.selectLevel('nivel-99'))

    expect(result.current.currentLevelId).toBe('nivel-01')
  })

  it('marca un nivel como completado', () => {
    const { result } = renderHook(() => useLevels())

    act(() => result.current.completeLevel('nivel-01'))

    expect(result.current.isCompleted('nivel-01')).toBe(true)
  })

  it('no duplica niveles ya completados', () => {
    const { result } = renderHook(() => useLevels())

    act(() => result.current.completeLevel('nivel-01'))
    act(() => result.current.completeLevel('nivel-01'))

    expect(result.current.isCompleted('nivel-01')).toBe(true)
    expect(localStorage.getItem(STORAGE_KEY)).toBe(
      JSON.stringify({ currentLevelId: 'nivel-01', completed: ['nivel-01'] })
    )
  })

  it('persiste el progreso en localStorage y lo lee al volver a renderizar', () => {
    const { result, rerender } = renderHook(() => useLevels())

    act(() => result.current.selectLevel('nivel-02'))
    act(() => result.current.completeLevel('nivel-01'))

    rerender()

    expect(result.current.currentLevelId).toBe('nivel-02')
    expect(result.current.isCompleted('nivel-01')).toBe(true)
  })

  it('borra todo el progreso al reiniciar', () => {
    const { result } = renderHook(() => useLevels())

    act(() => result.current.selectLevel('nivel-02'))
    act(() => result.current.completeLevel('nivel-01'))
    act(() => result.current.resetProgress())

    expect(result.current.currentLevelId).toBe('nivel-01')
    expect(result.current.isCompleted('nivel-01')).toBe(false)
    expect(result.current.isCompleted('nivel-02')).toBe(false)
    expect(localStorage.getItem(STORAGE_KEY)).toBe(
      JSON.stringify({ currentLevelId: 'nivel-01', completed: [] })
    )
  })
})
