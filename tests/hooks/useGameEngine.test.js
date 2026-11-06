import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGameEngine } from '../../src/hooks/useGameEngine'

const mover = (x, y) => ({ action: 'MOVER', x, y })
const girar = (grados) => ({ action: 'GIRAR', grados })
const recoger = () => ({ action: 'RECOGER' })

describe('useGameEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts at the level start position', () => {
    const { result } = renderHook(() => useGameEngine())

    expect(result.current.position).toEqual({ x: -2, y: -2 })
    expect(result.current.rotation).toBe(0)
    expect(result.current.inventory).toBe(0)
    expect(result.current.isWon).toBe(false)
    expect(result.current.level.id).toBe('nivel-01')
  })

  it('moves the golem one action per tick', () => {
    const { result } = renderHook(() => useGameEngine())

    act(() => result.current.play([mover(1, 2), mover(-1, 0)]))

    expect(result.current.isPlaying).toBe(true)
    expect(result.current.position).toEqual({ x: -2, y: -2 })

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.position).toEqual({ x: 1, y: 2 })

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.position).toEqual({ x: -1, y: 0 })
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

    act(() => result.current.play([mover(1, 2), girar(180), recoger()]))
    act(() => vi.advanceTimersByTime(1500))
    expect(result.current.position).toEqual({ x: 1, y: 2 })
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

  it('detects victory when the golem reaches the goal', () => {
    const { result } = renderHook(() => useGameEngine())

    act(() => result.current.play([mover(-2, 0), mover(0, 2), mover(2, 2)]))

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.position).toEqual({ x: -2, y: 0 })
    expect(result.current.isWon).toBe(false)

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.position).toEqual({ x: 0, y: 2 })
    expect(result.current.isWon).toBe(false)

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.position).toEqual({ x: 2, y: 2 })
    expect(result.current.isWon).toBe(true)
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

    act(() => result.current.play([mover(1, 2), recoger()]))
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.position).toEqual({ x: 1, y: 2 })
    expect(result.current.inventory).toBe(1)

    act(() => result.current.resetLevel())
    expect(result.current.position).toEqual({ x: -2, y: -2 })
    expect(result.current.rotation).toBe(0)
    expect(result.current.inventory).toBe(0)
    expect(result.current.isWon).toBe(false)
    expect(result.current.isPlaying).toBe(false)
  })
})
