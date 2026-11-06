export const ACTION = Object.freeze({
  MOVER: 'MOVER',
})

export function isValidAction(action) {
  if (!action || typeof action !== 'object') return false

  if (action.action !== ACTION.MOVER) return false

  return Number.isInteger(action.x) && Number.isInteger(action.y)
}

export function normalizeActions(actions) {
  if (!Array.isArray(actions)) return []
  return actions.filter(isValidAction)
}
