import { describe, expect, it } from 'vitest'
import { dampAngle, segmentPoint } from '../../src/components/scene/golemMovement'

describe('segmentPoint', () => {
  it('advances linearly from start to end', () => {
    expect(segmentPoint(0, 0, 2, 4, 0)).toEqual([0, 0])
    expect(segmentPoint(0, 0, 2, 4, 0.5)).toEqual([1, 2])
    expect(segmentPoint(0, 0, 2, 4, 1)).toEqual([2, 4])
  })

  it('clamps the progress outside 0..1', () => {
    expect(segmentPoint(0, 0, 2, 0, -1)).toEqual([0, 0])
    expect(segmentPoint(0, 0, 2, 0, 2)).toEqual([2, 0])
  })
})

describe('dampAngle', () => {
  it('rotates through the shortest path', () => {
    const next = dampAngle(350, 10, 0.5)

    expect(next).toBeGreaterThan(359)
    expect(next).toBeLessThan(370)
  })

  it('can turn counter-clockwise', () => {
    const next = dampAngle(10, 350, 0.5)

    expect(next).toBeLessThan(1)
    expect(next).toBeGreaterThan(-10)
  })
})
