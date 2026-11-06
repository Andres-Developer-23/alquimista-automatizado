import { useCallback, useEffect, useRef, useState } from 'react'
import { createPythonWorker } from '../engine/python/workerBridge'
import { normalizeActions } from '../engine/actions/actionTypes'
import { formatPythonError } from '../engine/python/pythonError'

export function usePythonWorker() {
  const workerRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const [lastResponse, setLastResponse] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const worker = createPythonWorker()
    workerRef.current = worker

    worker.onmessage = (event) => {
      const message = event.data

      if (message?.type === 'ready') {
        setStatus('ready')
      }

      if (message?.type === 'result') {
        const actions = normalizeActions(message.actions)
        console.log('[pythonWorker] acciones:', actions)
        setLastResponse(actions)
        setStatus('ready')
      }

      if (message?.type === 'error') {
        const fallback = formatPythonError(message.message ?? 'No se pudo ejecutar el código.')
        setError(message.error ?? fallback)
        setStatus('error')
      }
    }

    worker.onerror = (event) => {
      const fallback = formatPythonError(
        event.message || 'No se pudo inicializar el Web Worker.',
        { kind: 'initialization' },
      )
      setError(fallback)
      setStatus('error')
    }

    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  const run = useCallback((code) => {
    if (!workerRef.current) return
    setError(null)
    setStatus('running')
    workerRef.current.postMessage({ type: 'run', code })
  }, [])

  return { status, lastResponse, error, run }
}
