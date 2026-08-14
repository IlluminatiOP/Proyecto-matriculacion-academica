import { sumarCreditos } from "../utils/validaciones";

function ConfirmacionMatricula({
  cursosSeleccionados,
  estudiante,
  onReiniciar,
}) {
  const totalCreditos = sumarCreditos(cursosSeleccionados);

  return (
    <div className="confirmacion-matricula">
      <h2>¡Matrícula confirmada!</h2>
      <p>
        {estudiante.nombre}, tu matrícula para el semestre {estudiante.semestre}{" "}
        quedó registrada.
      </p>

      <ul className="confirmacion-matricula__lista">
        {cursosSeleccionados.map((curso) => (
          <li key={curso.id}>
            {curso.nombre} ({curso.codigo}) — {curso.creditos} créditos
          </li>
        ))}
      </ul>

      <p>
        <strong>Total: {totalCreditos} créditos</strong>
      </p>

      <button onClick={onReiniciar}>Hacer una nueva matrícula</button>
    </div>
  );
}

export default ConfirmacionMatricula;
