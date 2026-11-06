const isInteger = Number.isInteger

const asCoordinate = (point) =>
  point && isInteger(point.x) && isInteger(point.y) ? { x: point.x, y: point.y } : null

const sameCoordinate = (a, b) => a?.x === b?.x && a?.y === b?.y

export function validateLevel(input) {
  const errors = []
  const board = input?.board

  if (!input || typeof input !== 'object') return ['El nivel debe ser un objeto.']
  if (typeof input.id !== 'string' || !input.id.trim()) errors.push('El nivel necesita un id.')
  if (typeof input.title !== 'string' || !input.title.trim()) errors.push('El nivel necesita un título.')
  if (typeof input.objective !== 'string' || !input.objective.trim()) {
    errors.push('El nivel necesita un objetivo legible.')
  }

  if (!board || !isInteger(board.minX) || !isInteger(board.maxX) || !isInteger(board.minY) || !isInteger(board.maxY)) {
    errors.push('El tablero necesita límites enteros: minX, maxX, minY y maxY.')
  } else if (board.minX >= board.maxX || board.minY >= board.maxY) {
    errors.push('Los límites mínimo y máximo del tablero están invertidos.')
  }

  const start = asCoordinate(input.start)
  const goal = asCoordinate(input.goal)
  const obstacles = Array.isArray(input.obstacles ?? [])
    ? input.obstacles.map(asCoordinate)
    : null

  if (!start) errors.push('La posición inicial debe tener x e y enteros.')
  if (!goal) errors.push('El objetivo debe tener x e y enteros.')
  if (!obstacles) errors.push('Los obstáculos deben ser un arreglo de coordenadas enteras.')

  if (board && start && !isWithinBoard(start, board)) errors.push('La posición inicial está fuera del tablero.')
  if (board && goal && !isWithinBoard(goal, board)) errors.push('El objetivo está fuera del tablero.')

  if (obstacles) {
    obstacles.forEach((obstacle, index) => {
      if (!obstacle) errors.push(`El obstáculo ${index + 1} no tiene coordenadas enteras.`)
      else if (board && !isWithinBoard(obstacle, board)) {
        errors.push(`El obstáculo ${index + 1} está fuera del tablero.`)
      }
    })

    const positions = [start, goal, ...obstacles].filter(Boolean)
    const seen = new Set()
    for (const point of positions) {
      const key = `${point.x},${point.y}`
      if (seen.has(key)) errors.push(`Hay coordenadas duplicadas en ${key}.`)
      seen.add(key)
    }
  }

  return errors
}

export function createLevel(input) {
  const errors = validateLevel(input)
  if (errors.length > 0) {
    throw new Error(`Nivel inválido:\n- ${errors.join('\n- ')}`)
  }

  return Object.freeze({
    id: input.id,
    title: input.title,
    description: input.description ?? '',
    objective: input.objective,
    board: Object.freeze({ ...input.board }),
    start: Object.freeze({
      ...asCoordinate(input.start),
      rotation: Number.isFinite(input.start.rotation) ? input.start.rotation : 0,
    }),
    goal: Object.freeze(asCoordinate(input.goal)),
    obstacles: Object.freeze((input.obstacles ?? []).map((obstacle) => Object.freeze(asCoordinate(obstacle)))),
  })
}

export function isWithinBoard(point, board) {
  return (
    point.x >= board.minX && point.x <= board.maxX &&
    point.y >= board.minY && point.y <= board.maxY
  )
}

export function clampPointToBoard(point, board) {
  return {
    x: Math.min(board.maxX, Math.max(board.minX, point.x)),
    y: Math.min(board.maxY, Math.max(board.minY, point.y)),
  }
}

export function isObstacle(point, obstacles = []) {
  return obstacles.some((obstacle) => sameCoordinate(obstacle, point))
}

export function isGoal(point, goal) {
  return sameCoordinate(point, goal)
}
