import { describe, expect, it } from 'vitest'
import { dampAxis } from '../../src/components/scene/golemMovement'

describe('dampAxis', () => {
  it('reaches the target in about one tick without overshooting', () => {
    const next = dampAxis(0, 2, 0.5)

    expect(next).toBeGreaterThan(1.99)
    expect(next).toBeLessThanOrEqual(2)
  })

  it('moves in the direction of the target', () => {
    const next = dampAxis(2, -2, 0.1)

    expect(next).toBeGreaterThan(-2)
    expect(next).toBeLessThan(2)
  })
})
