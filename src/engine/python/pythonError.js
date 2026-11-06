const SYNTAX_PATTERN = /SyntaxError|IndentationError|TabError/i
const USER_FRAME_LINE_PATTERN = /File\s+"<(?:exec|string|stdin)>",\s+line\s+(\d+)/i
const GENERIC_LINE_PATTERN = /line\s+(\d+)/i

function rawMessage(error) {
  if (error === null || error === undefined) return 'Error desconocido'
  if (typeof error === 'string') return error
  return error.message ? String(error.message) : String(error)
}

function cleanDetails(raw) {
  return String(raw).trim() || 'Error desconocido'
}

function extractLine(raw) {
  const userFrame = String(raw).match(USER_FRAME_LINE_PATTERN)
  if (userFrame) return Number(userFrame[1])

  const generic = String(raw).match(GENERIC_LINE_PATTERN)
  return generic ? Number(generic[1]) : null
}

function lastMeaningfulLine(raw) {
  const lines = String(raw)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  return lines.at(-1) ?? 'Error desconocido'
}

function baseError(type, title, message, hint, raw, line = null) {
  return {
    type,
    title,
    message,
    line,
    hint,
    details: cleanDetails(raw),
  }
}

export function formatPythonError(error, { kind = 'auto' } = {}) {
  const raw = rawMessage(error)
  const line = extractLine(raw)

  if (kind === 'initialization') {
    return baseError(
      'initialization',
      'No se pudo iniciar Python',
      'La consola de Python no terminó de cargar.',
      'Revisa tu conexión y recarga la página para volver a intentar.',
      raw,
    )
  }

  if (SYNTAX_PATTERN.test(raw)) {
    const location = line ? ` en la línea ${line}` : ''
    return baseError(
      'syntax',
      'Error de sintaxis',
      `Python no pudo interpretar tu código${location}.`,
      'Revisa dos puntos, comas, paréntesis e indentación.',
      raw,
      line,
    )
  }

  const location = line ? ` en la línea ${line}` : ''
  return baseError(
    'runtime',
    'Error de ejecución',
    `Python se detuvo${location}: ${lastMeaningfulLine(raw)}`,
    'Revisa nombres de variables, tipos y operaciones.',
    raw,
    line,
  )
}
