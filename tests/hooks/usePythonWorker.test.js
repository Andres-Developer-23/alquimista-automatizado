import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePythonWorker } from '../../src/hooks/usePythonWorker'

const worker = {
  onmessage: null,
  onerror: null,
  postMessage: vi.fn(),
  terminate: vi.fn(),
}

vi.mock('../../src/engine/python/workerBridge', () => ({
  createPythonWorker: () => worker,
}))

const syntaxError = {
  type: 'syntax',
  title: 'Error de sintaxis',
  message: 'Python no pudo interpretar tu código en la línea 2.',
  line: 2,
  hint: 'Revisa dos puntos, comas, paréntesis e indentación.',
  details: 'SyntaxError: invalid syntax',
}

describe('usePythonWorker', () => {
  beforeEach(() => {
    worker.onmessage = null
    worker.onerror = null
    worker.postMessage.mockClear()
    worker.terminate.mockClear()
  })

  it('exposes a structured Python error and can run again', () => {
    const { result } = renderHook(() => usePythonWorker())

    act(() => result.current.run('def bad(:\n  pass'))
    expect(result.current.status).toBe('running')

    act(() => worker.onmessage({
      data: { type: 'error', error: syntaxError, message: syntaxError.message },
    }))

    expect(result.current.status).toBe('error')
    expect(result.current.error).toEqual(syntaxError)

    act(() => result.current.run('mover(1, 0)'))
    expect(result.current.status).toBe('running')
    expect(result.current.error).toBeNull()
    expect(worker.postMessage).toHaveBeenLastCalledWith({
      type: 'run',
      code: 'mover(1, 0)',
    })
  })

  it('shows an initialization error instead of stringifying it', () => {
    const { result } = renderHook(() => usePythonWorker())

    act(() => worker.onmessage({
      data: {
        type: 'error',
        error: { ...syntaxError, type: 'initialization', title: 'No se pudo iniciar Python' },
        message: 'No se pudo iniciar Python.',
      },
    }))

    expect(result.current.status).toBe('error')
    expect(result.current.error.type).toBe('initialization')
  })
})
