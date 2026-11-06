export function RunButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      className="run-button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Ejecutar código"
    >
      <span aria-hidden="true">▶</span> Ejecutar
    </button>
  )
}
