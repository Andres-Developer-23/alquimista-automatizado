import { useEffect, useState } from 'react'
import { CodeEditor } from '../components/editor/CodeEditor'
import { AlchemistScene } from '../components/scene/AlchemistScene'
import { RunButton } from '../components/ui/RunButton'
import { useGameEngine } from '../hooks/useGameEngine'
import { usePythonWorker } from '../hooks/usePythonWorker'
import './App.css'

const DEFAULT_CODE = `# El Gólem obedece tus comandos.
# Cada llamada a mover() se convierte en una acción.
mover(1, 2)
`

const STATUS_LABELS = {
  loading: 'Cargando Python…',
  ready: 'Listo',
  running: 'Ejecutando…',
  error: 'Error',
}

export function App() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const { status, lastResponse, error, run } = usePythonWorker()
  const { position, isPlaying, play, stop } = useGameEngine()
  const isBusy = status === 'loading' || status === 'running'
  const showPlaying = isPlaying && status !== 'error'
  const statusClass = showPlaying ? 'running' : status
  const statusLabel = showPlaying ? 'Moviendo…' : STATUS_LABELS[status]

  useEffect(() => {
    if (lastResponse) play(lastResponse)
  }, [lastResponse, play])

  useEffect(() => {
    if (error) stop()
  }, [error, stop])

  return (
    <main className="app-shell">
      <section className="editor-panel" aria-label="Editor de código Python">
        <header className="panel-header">
          <div>
            <p className="eyebrow">El Alquimista Automatizado</p>
            <h1>Taller del Gólem</h1>
          </div>
          <span className={`status status--${statusClass}`} role="status">
            {statusLabel}
          </span>
        </header>

        <div className="editor-wrap">
          <CodeEditor value={code} onChange={setCode} />
        </div>

        <footer className="editor-footer">
          <div className="footer-actions">
            <RunButton
              onClick={() => {
                stop()
                run(code)
              }}
              disabled={isBusy}
            />
            {lastResponse && (
              <span className="action-count">
                {lastResponse.length}{' '}
                {lastResponse.length === 1 ? 'acción' : 'acciones'}
              </span>
            )}
          </div>
          <p className="hint">
            El Gólem ejecuta una acción cada 500 ms. La respuesta JSON también se
            imprime en la consola.
          </p>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
        </footer>
      </section>

      <section className="scene-panel" aria-label="Escena 3D del Gólem">
        <AlchemistScene golemPosition={[position.x, 0.5, position.y]} />
      </section>
    </main>
  )
}
