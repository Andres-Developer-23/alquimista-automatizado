import { describe, expect, it } from 'vitest'
import { createActionQueue } from '../../src/engine/actions/actionQueue'

const mover = (x, y) => ({ action: 'MOVER', x, y })

describe('action queue', () => {
  it('starts empty', () => {
    const queue = createActionQueue()

    expect(queue.isEmpty).toBe(true)
    expect(queue.size).toBe(0)
    expect(queue.dequeue()).toBeNull()
  })

  it('dequeues actions in FIFO order', () => {
    const first = mover(1, 2)
    const second = mover(3, 4)
    const queue = createActionQueue([first])

    queue.enqueue(second)

    expect(queue.size).toBe(2)
    expect(queue.dequeue()).toBe(first)
    expect(queue.dequeue()).toBe(second)
    expect(queue.isEmpty).toBe(true)
  })

  it('appends a batch of actions', () => {
    const queue = createActionQueue()

    queue.enqueueAll([mover(1, 2), mover(3, 4)])

    expect(queue.toArray()).toEqual([mover(1, 2), mover(3, 4)])
  })

  it('ignores non-array batches', () => {
    const queue = createActionQueue()

    queue.enqueueAll(null)

    expect(queue.isEmpty).toBe(true)
  })

  it('clears every pending action', () => {
    const queue = createActionQueue([mover(1, 2), mover(3, 4)])

    queue.clear()

    expect(queue.isEmpty).toBe(true)
    expect(queue.toArray()).toEqual([])
  })

  it('returns a copy of the pending actions', () => {
    const queue = createActionQueue([mover(1, 2)])
    const snapshot = queue.toArray()

    snapshot.push(mover(3, 4))

    expect(queue.size).toBe(1)
  })
})
