export const GOLEM_DAMPING = 12

// Interpola por el giro más corto; los grados no crecen sin límite.
export function dampAngle(current, target, delta) {
  const shortest = ((((target - current) % 360) + 540) % 360) - 180
  return current + shortest * (1 - Math.exp(-GOLEM_DAMPING * delta))
}

// Punto del segmento lineal de un paso; progress se acota a 0..1.
export function segmentPoint(fromX, fromZ, toX, toZ, progress) {
  const t = Math.min(Math.max(progress, 0), 1)
  return [fromX + (toX - fromX) * t, fromZ + (toZ - fromZ) * t]
}
