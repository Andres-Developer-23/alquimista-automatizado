export function PythonErrorPanel({ error }) {
  if (!error) return null

  return (
    <section className="python-error" role="alert" aria-labelledby="python-error-title">
      <div className="python-error__heading">
        <span className="python-error__badge">{error.type === 'syntax' ? 'Sintaxis' : error.type === 'initialization' ? 'Arranque' : 'Ejecución'}</span>
        <h2 id="python-error-title">{error.title}</h2>
      </div>

      <p className="python-error__message">
        {error.message}
      </p>
      <p className="python-error__hint">{error.hint}</p>

      {error.details && (
        <details className="python-error__details">
          <summary>Ver detalle técnico</summary>
          <pre>{error.details}</pre>
        </details>
      )}
    </section>
  )
}
