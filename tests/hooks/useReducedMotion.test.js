import { act, renderHook } from '@testing-library/react'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { useReducedMotion } from '../../src/hooks/useReducedMotion'

describe('useReducedMotion', () => {
  let originalMatchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
    window.matchMedia = vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('devuelve false por defecto cuando no hay preferencia de movimiento reducido', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('devuelve true cuando el usuario prefiere movimiento reducido', () => {
    window.matchMedia = vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })

  it('actualiza el valor cuando cambia la preferencia del medio', () => {
    const listener = vi.fn()
    window.matchMedia = vi.fn(() => ({
      matches: false,
      addEventListener: (event, cb) => {
        listener.mockImplementation(cb)
      },
      removeEventListener: vi.fn(),
    }))

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)

    act(() => listener({ matches: true }))
    expect(result.current).toBe(true)

    act(() => listener({ matches: false }))
    expect(result.current).toBe(false)
  })
})
