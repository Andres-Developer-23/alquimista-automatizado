export const GOLEM_DAMPING = 12

// Amortiguación exponencial: recorre la celda en ~500 ms sin sobrepasarla.
export function dampAxis(current, target, delta) {
  return current + (target - current) * (1 - Math.exp(-GOLEM_DAMPING * delta))
}
