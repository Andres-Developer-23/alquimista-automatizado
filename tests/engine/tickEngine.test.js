import { describe, expect, it, vi } from 'vitest'
import { createActionQueue } from '../../src/engine/actions/actionQueue'
import {
  createTickEngine,
  TICK_INTERVAL_MS,
} from '../../src/engine/tick/tickEngine'

const mover = (x, y) => ({ action: 'MOVER', x, y })

function createFakeScheduler() {
  let callback = null
  let active = false

  const scheduler = {
    delay: null,
    setInterval: vi.fn((nextCallback, intervalMs) => {
      callback = nextCallback
      active = true
      scheduler.delay = intervalMs
      return 1
    }),
    clearInterval: vi.fn(() => {
      active = false
    }),
    tick: () => {
      if (active) callback?.()
    },
  }

  return scheduler
}

describe('tick engine', () => {
  it('consumes one action per tick and stops when empty', () => {
    const first = mover(1, 2)
    const second = mover(3, 4)
    const queue = createActionQueue([first, second])
    const onTick = vi.fn()
    const onComplete = vi.fn()
    const scheduler = createFakeScheduler()
    const engine = createTickEngine({
      queue,
      onTick,
      onComplete,
      scheduler,
    })

    engine.start()

    expect(engine.isRunning).toBe(true)
    expect(scheduler.delay).toBe(TICK_INTERVAL_MS)
    expect(onTick).not.toHaveBeenCalled()

    scheduler.tick()
    expect(onTick).toHaveBeenLastCalledWith(first)
    expect(queue.size).toBe(1)

    scheduler.tick()
    expect(onTick).toHaveBeenLastCalledWith(second)
    expect(queue.isEmpty).toBe(true)
    expect(engine.isRunning).toBe(false)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('does not start with an empty queue', () => {
    const scheduler = createFakeScheduler()
    const engine = createTickEngine({
      queue: createActionQueue(),
      onTick: vi.fn(),
      scheduler,
    })

    engine.start()

    expect(engine.isRunning).toBe(false)
    expect(scheduler.setInterval).not.toHaveBeenCalled()
  })

  it('stops without consuming more actions', () => {
    const queue = createActionQueue([mover(1, 2)])
    const onTick = vi.fn()
    const scheduler = createFakeScheduler()
    const engine = createTickEngine({ queue, onTick, scheduler })

    engine.start()
    engine.stop()
    scheduler.tick()

    expect(engine.isRunning).toBe(false)
    expect(onTick).not.toHaveBeenCalled()
    expect(queue.size).toBe(1)
  })

  it('cancels the previous timer when restarted', () => {
    const queue = createActionQueue([mover(1, 2)])
    const scheduler = createFakeScheduler()
    const engine = createTickEngine({
      queue,
      onTick: vi.fn(),
      scheduler,
    })

    engine.start()
    engine.start()

    expect(scheduler.clearInterval).toHaveBeenCalledWith(1)
    expect(scheduler.setInterval).toHaveBeenCalledTimes(2)
  })
})
