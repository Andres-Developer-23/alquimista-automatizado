export function createActionQueue(initialActions = []) {
  const actions = [...initialActions]

  return {
    enqueue(action) {
      actions.push(action)
    },
    enqueueAll(nextActions) {
      if (Array.isArray(nextActions)) actions.push(...nextActions)
    },
    dequeue() {
      return actions.shift() ?? null
    },
    clear() {
      actions.length = 0
    },
    get size() {
      return actions.length
    },
    get isEmpty() {
      return actions.length === 0
    },
    toArray() {
      return [...actions]
    },
  }
}
