export const ACTION = Object.freeze({
  MOVER: 'MOVER',
  GIRAR: 'GIRAR',
  RECOGER: 'RECOGER',
})

export function isValidAction(action) {
  if (!action || typeof action !== 'object') return false

  if (action.action === ACTION.MOVER) {
    return Number.isInteger(action.x) && Number.isInteger(action.y)
  }

  if (action.action === ACTION.GIRAR) {
    return Number.isFinite(action.grados)
  }

  return action.action === ACTION.RECOGER
}

export function normalizeActions(actions) {
  if (!Array.isArray(actions)) return []
  return actions.filter(isValidAction)
}
