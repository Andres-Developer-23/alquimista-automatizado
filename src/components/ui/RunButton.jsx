export function RunButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      className="run-button"
      onClick={onClick}
      disabled={disabled}
    >
      <span aria-hidden="true">▶</span> Ejecutar
    </button>
  )
}
