import { describe, expect, it } from 'vitest'
import { formatPythonError } from '../../src/engine/python/pythonError.js'

describe('formatPythonError', () => {
  it('identifies syntax errors and extracts the source line', () => {
    const error = new Error(
      'Traceback (most recent call last):\n  File "<string>", line 3, in <module>\nSyntaxError: invalid syntax',
    )

    expect(formatPythonError(error)).toMatchObject({
      type: 'syntax',
      title: 'Error de sintaxis',
      line: 3,
    })
  })

  it('prefers the user-code frame over Pyodide internals', () => {
    const error = new Error(
      'Traceback (most recent call last):\n  File "/lib/python311.zip/_pyodide/_base.py", line 573, in eval_code_async\n  File "<exec>", line 1\nSyntaxError: invalid syntax',
    )

    expect(formatPythonError(error).line).toBe(1)
  })

  it('identifies runtime exceptions without losing the Python detail', () => {
    const error = new Error(
      'Traceback (most recent call last):\n  File "<string>", line 2, in <module>\nZeroDivisionError: division by zero',
    )

    expect(formatPythonError(error)).toMatchObject({
      type: 'runtime',
      title: 'Error de ejecución',
      line: 2,
    })
    expect(formatPythonError(error).details).toContain('ZeroDivisionError')
  })

  it('identifies initialization failures explicitly', () => {
    expect(formatPythonError(new Error('Failed to fetch')).type).toBe('runtime')
    expect(formatPythonError(new Error('Failed to fetch'), { kind: 'initialization' })).toMatchObject({
      type: 'initialization',
      title: 'No se pudo iniciar Python',
    })
  })

  it('returns a usable fallback for malformed errors', () => {
    const result = formatPythonError('unexpected worker failure')

    expect(result.type).toBe('runtime')
    expect(result.message).toContain('unexpected worker failure')
    expect(result.details).toBe('unexpected worker failure')
  })
})
