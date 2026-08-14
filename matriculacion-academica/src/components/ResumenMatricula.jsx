import { sumarCreditos } from "../utils/validaciones";

function ResumenMatricula({
  cursosSeleccionados,
  estudiante,
  error,
  onQuitar,
  onConfirmar,
  onLimpiarError,
}) {
  const totalCreditos = sumarCreditos(cursosSeleccionados);
  const creditosRestantes = estudiante.creditosPermitidos - totalCreditos;

  return (
    <div className="resumen-matricula">
      <h2>Resumen de matrícula</h2>

      {error && (
        <div className="resumen-matricula__error" role="alert">
          <span>{error}</span>
          <button onClick={onLimpiarError} aria-label="Cerrar mensaje de error">
            ×
          </button>
        </div>
      )}

      {cursosSeleccionados.length === 0 ? (
        <p>Aún no has seleccionado ningún curso.</p>
      ) : (
        <ul className="resumen-matricula__lista">
          {cursosSeleccionados.map((curso) => (
            <li key={curso.id}>
              <span>
                {curso.nombre} — {curso.creditos} créditos
              </span>
              <button onClick={() => onQuitar(curso.id)}>Quitar</button>
            </li>
          ))}
        </ul>
      )}

      <div className="resumen-matricula__creditos">
        <p>
          Créditos seleccionados: <strong>{totalCreditos}</strong> /{" "}
          {estudiante.creditosPermitidos}
        </p>
        <p>Créditos restantes: {creditosRestantes}</p>
      </div>

      <button
        className="resumen-matricula__confirmar"
        onClick={onConfirmar}
        disabled={cursosSeleccionados.length === 0}
      >
        Confirmar matrícula
      </button>
    </div>
  );
}

export default ResumenMatricula;
