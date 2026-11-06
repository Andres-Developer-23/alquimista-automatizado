import { useState } from 'react'
import { CodeEditor } from '../components/editor/CodeEditor'
import { AlchemistScene } from '../components/scene/AlchemistScene'
import { RunButton } from '../components/ui/RunButton'
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
  const isBusy = status === 'loading' || status === 'running'

  return (
    <main className="app-shell">
      <section className="editor-panel" aria-label="Editor de código Python">
        <header className="panel-header">
          <div>
            <p className="eyebrow">El Alquimista Automatizado</p>
            <h1>Taller del Gólem</h1>
          </div>
          <span className={`status status--${status}`} role="status">
            {STATUS_LABELS[status]}
          </span>
        </header>

        <div className="editor-wrap">
          <CodeEditor value={code} onChange={setCode} />
        </div>

        <footer className="editor-footer">
          <div className="footer-actions">
            <RunButton onClick={() => run(code)} disabled={isBusy} />
            {lastResponse && (
              <span className="action-count">
                {lastResponse.length}{' '}
                {lastResponse.length === 1 ? 'acción' : 'acciones'}
              </span>
            )}
          </div>
          <p className="hint">
            La respuesta JSON del Worker se imprime en la consola del navegador.
          </p>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
        </footer>
      </section>

      <section className="scene-panel" aria-label="Escena 3D del Gólem">
        <AlchemistScene />
      </section>
    </main>
  )
}
