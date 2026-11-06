import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGameEngine } from '../../src/hooks/useGameEngine'

const mover = (x, y) => ({ action: 'MOVER', x, y })

describe('useGameEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('moves the golem one action per tick', () => {
    const { result } = renderHook(() => useGameEngine())

    act(() => result.current.play([mover(1, 2), mover(-1, 0)]))

    expect(result.current.isPlaying).toBe(true)
    expect(result.current.position).toEqual({ x: 0, y: 0 })

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.position).toEqual({ x: 1, y: 2 })

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.position).toEqual({ x: -1, y: 0 })
    expect(result.current.isPlaying).toBe(false)
  })

  it('stops playback when requested', () => {
    const { result } = renderHook(() => useGameEngine())

    act(() => result.current.play([mover(1, 2)]))
    act(() => result.current.stop())
    act(() => vi.advanceTimersByTime(1000))

    expect(result.current.position).toEqual({ x: 0, y: 0 })
    expect(result.current.isPlaying).toBe(false)
  })
})
