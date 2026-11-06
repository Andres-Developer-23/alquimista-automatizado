export const TICK_INTERVAL_MS = 500

const defaultScheduler = {
  setInterval: (callback, intervalMs) =>
    globalThis.setInterval(callback, intervalMs),
  clearInterval: (timerId) => globalThis.clearInterval(timerId),
}

export function createTickEngine({
  queue,
  onTick,
  onComplete = () => {},
  intervalMs = TICK_INTERVAL_MS,
  scheduler = defaultScheduler,
}) {
  let timerId = null

  function stop() {
    if (timerId === null) return
    scheduler.clearInterval(timerId)
    timerId = null
  }

  function tick() {
    const action = queue.dequeue()

    if (!action) {
      stop()
      onComplete()
      return
    }

    onTick(action)

    if (queue.isEmpty) {
      stop()
      onComplete()
    }
  }

  function start() {
    stop()
    if (queue.isEmpty) return
    timerId = scheduler.setInterval(tick, intervalMs)
  }

  return {
    start,
    stop,
    get isRunning() {
      return timerId !== null
    },
  }
}
