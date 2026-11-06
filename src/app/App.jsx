import { useEffect, useState } from 'react'
import { CodeEditor } from '../components/editor/CodeEditor'
import { AlchemistScene } from '../components/scene/AlchemistScene'
import { PythonErrorPanel } from '../components/ui/PythonErrorPanel'
import { RunButton } from '../components/ui/RunButton'
import { useLevels } from '../hooks/useLevels'
import { useGameEngine } from '../hooks/useGameEngine'
import { usePythonWorker } from '../hooks/usePythonWorker'
import './App.css'

const DEFAULT_CODE = `# El Gólem obedece tus comandos.
# Cada llamada se convierte en una acción.
mover(-2, 0)
mover(0, 2)
mover(2, 2)
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
  const {
    levels,
    currentLevelId,
    selectLevel,
    completeLevel,
    resetProgress,
    isCompleted,
  } = useLevels()
  const {
    level: gameLevel,
    position,
    rotation,
    inventory,
    isWon,
    isPlaying,
    play,
    stop,
    resetLevel,
  } = useGameEngine({ levelId: currentLevelId })
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

  useEffect(() => {
    if (isWon && gameLevel) completeLevel(gameLevel.id)
  }, [isWon, gameLevel, completeLevel])

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

        <div className="level-brief">
          <div>
            <p className="level-kicker">Niveles</p>
            <p className="level-objective">{gameLevel.objective}</p>
          </div>

          <div className="level-pills" role="group" aria-label="Seleccionar nivel">
            {levels.map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                className={`level-pill ${
                  currentLevelId === lvl.id ? 'level-pill--active' : ''
                } ${isCompleted(lvl.id) ? 'level-pill--done' : ''}`}
                onClick={() => selectLevel(lvl.id)}
                aria-current={currentLevelId === lvl.id ? 'true' : undefined}
                aria-label={isCompleted(lvl.id)
                  ? `${lvl.title} (completado)`
                  : lvl.title}
              >
                {lvl.title}
                {isCompleted(lvl.id) && (
                  <span className="level-pill__done" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>

          <button className="reset-button" type="button" onClick={resetLevel}>
            Reiniciar nivel
          </button>
          <button className="reset-progress-button" type="button" onClick={resetProgress}>
            Borrar progreso
          </button>
        </div>

        {isWon && (
          <div className="victory-message" role="status" aria-live="polite">
            <strong>¡Nivel completado!</strong> El Gólem llegó al caldero.
          </div>
        )}

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
            <span className="inventory-count" role="status">
              Inventario: {inventory} {inventory === 1 ? 'objeto' : 'objetos'}
            </span>
          </div>
          <p className="command-help" aria-label="Comandos disponibles">
            <code>mover(1, 2)</code>
            <code>girar(90)</code>
            <code>recoger()</code>
          </p>
          <p className="hint">
            mover cambia de celda, girar rota al Gólem y recoger incrementa el inventario. Una acción se ejecuta cada 500 ms.
          </p>
          <PythonErrorPanel error={error} />
        </footer>
      </section>

      <section className="scene-panel" aria-label="Escena 3D del Gólem">
        <AlchemistScene
          golemPosition={[position.x, 0.5, position.y]}
          golemRotation={rotation}
          goal={gameLevel.goal}
          obstacles={gameLevel.obstacles}
        />
      </section>
    </main>
  )
}
