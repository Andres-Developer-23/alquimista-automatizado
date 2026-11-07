import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGameEngine } from '../../src/hooks/useGameEngine'

const mover = (x, y) => ({ action: 'MOVER', x, y })
const girar = (grados) => ({ action: 'GIRAR', grados })
const recoger = () => ({ action: 'RECOGER' })
const plantar = () => ({ action: 'PLANTAR' })
const cosechar = () => ({ action: 'COSECHAR' })

describe('useGameEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('empieza en la posición de inicio del nivel indicado', () => {
    const { result } = renderHook(() => useGameEngine({ levelId: 'nivel-02' }))

    expect(result.current.position).toEqual({ x: 2, y: -2 })
    expect(result.current.level.id).toBe('nivel-02')
  })

  it('moves the golem one action per tick', () => {
    const { result } = renderHook(() => useGameEngine())

    act(() => result.current.play([mover(-1, 0), mover(1, -1)]))

    expect(result.current.isPlaying).toBe(true)
    expect(result.current.position).toEqual({ x: -2, y: -2 })

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.position).toEqual({ x: -1, y: 0 })

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.position).toEqual({ x: 1, y: -1 })
    expect(result.current.isPlaying).toBe(true)

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.isPlaying).toBe(false)
  })

  it('rotates and collects one action per tick', () => {
    const { result } = renderHook(() => useGameEngine())

    act(() => result.current.play([girar(90), recoger(), girar(-10)]))

    expect(result.current.rotation).toBe(0)
    expect(result.current.inventory).toBe(0)

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.rotation).toBe(90)
    expect(result.current.inventory).toBe(0)

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.inventory).toBe(1)

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.rotation).toBe(80)
  })

  it('resets the run state when new actions are played', () => {
    const { result } = renderHook(() => useGameEngine())

    act(() => result.current.play([mover(-1, 0), girar(180), recoger()]))
    act(() => vi.advanceTimersByTime(1500))
    expect(result.current.position).toEqual({ x: -1, y: 0 })
    expect(result.current.rotation).toBe(180)
    expect(result.current.inventory).toBe(1)

    act(() => result.current.play([girar(45)]))
    expect(result.current.position).toEqual({ x: -2, y: -2 })
    expect(result.current.rotation).toBe(0)
    expect(result.current.inventory).toBe(0)
  })

  it('clamps actions to the board limits', () => {
    const { result } = renderHook(() => useGameEngine())

    act(() => result.current.play([mover(9, -9)]))
    act(() => vi.advanceTimersByTime(500))

    expect(result.current.position).toEqual({ x: 2, y: -2 })
  })

  it('does not move into an obstacle', () => {
    const { result } = renderHook(() => useGameEngine())

    act(() => result.current.play([mover(0, 0)]))
    act(() => vi.advanceTimersByTime(500))
    expect(result.current.position).toEqual({ x: -2, y: -2 })
    expect(result.current.isPlaying).toBe(true)

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.isPlaying).toBe(false)
  })

  it('detects victory when the golem reaches the cell next to the goal', () => {
    const { result } = renderHook(() => useGameEngine())

    act(() => result.current.play([mover(-2, 0), mover(0, 2), mover(1, 2)]))

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.position).toEqual({ x: -2, y: 0 })
    expect(result.current.isWon).toBe(false)

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.position).toEqual({ x: 0, y: 2 })
    expect(result.current.isWon).toBe(false)

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.position).toEqual({ x: 1, y: 2 })
    expect(result.current.isWon).toBe(true)
    expect(result.current.isPlaying).toBe(false)
  })

  it('does not move into a fixed station', () => {
    const { result } = renderHook(() => useGameEngine())

    // El caldero (2, 2) es una estación fija: no se puede pisar.
    act(() => result.current.play([mover(2, 2)]))
    act(() => vi.advanceTimersByTime(500))

    expect(result.current.position).toEqual({ x: -2, y: -2 })
    expect(result.current.isWon).toBe(false)
    expect(result.current.isPlaying).toBe(true)

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.isPlaying).toBe(false)
  })

  it('stops playback when requested', () => {
    const { result } = renderHook(() => useGameEngine())

    act(() => result.current.play([mover(1, 2)]))
    act(() => result.current.stop())
    act(() => vi.advanceTimersByTime(1000))

    expect(result.current.position).toEqual({ x: -2, y: -2 })
    expect(result.current.isPlaying).toBe(false)
  })

  it('reiniciar nivel restablece posición, rotación e inventario', () => {
    const { result } = renderHook(() => useGameEngine())

    act(() => result.current.play([mover(-1, 0), recoger()]))
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.position).toEqual({ x: -1, y: 0 })
    expect(result.current.inventory).toBe(1)

    act(() => result.current.resetLevel())
    expect(result.current.position).toEqual({ x: -2, y: -2 })
    expect(result.current.rotation).toBe(0)
    expect(result.current.inventory).toBe(0)
    expect(result.current.isWon).toBe(false)
    expect(result.current.isPlaying).toBe(false)
  })

  it('plants and harvests only on a planter cell', () => {
    const { result } = renderHook(() => useGameEngine())

    // La maceta está en (-1, 1). Primero hay que moverse hasta ella.
    act(() => result.current.play([mover(-1, 1), plantar(), cosechar()]))
    act(() => vi.advanceTimersByTime(500))
    expect(result.current.position).toEqual({ x: -1, y: 1 })

    // plantar() deja la maceta en 'planted'
    act(() => vi.advanceTimersByTime(500))
    expect(result.current.plantersState['-1,1']).toBe('planted')
    expect(result.current.inventory).toBe(0)

    // Al siguiente tick la planta crece y cosechar() la recolecta.
    act(() => vi.advanceTimersByTime(500))
    expect(result.current.inventory).toBe(1)
    expect(result.current.plantersState['-1,1']).toBeUndefined()
  })

  it('ignores plantar and cosechar outside a planter', () => {
    const { result } = renderHook(() => useGameEngine())

    // (-2, -2) es el inicio y no es maceta.
    act(() => result.current.play([plantar(), cosechar()]))
    act(() => vi.advanceTimersByTime(1000))

    expect(result.current.plantersState).toEqual({})
    expect(result.current.inventory).toBe(0)
  })
})
