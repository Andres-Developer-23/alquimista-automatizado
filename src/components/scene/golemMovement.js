export const GOLEM_DAMPING = 12

// Amortiguación exponencial: recorre la celda en ~500 ms sin sobrepasarla.
export function dampAxis(current, target, delta) {
  return current + (target - current) * (1 - Math.exp(-GOLEM_DAMPING * delta))
}

// Interpola por el giro más corto; los grados no crecen sin límite.
export function dampAngle(current, target, delta) {
  const shortest = ((((target - current) % 360) + 540) % 360) - 180
  return current + shortest * (1 - Math.exp(-GOLEM_DAMPING * delta))
}
