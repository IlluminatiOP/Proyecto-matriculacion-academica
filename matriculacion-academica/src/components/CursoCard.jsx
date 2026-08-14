import { calcularCuposDisponibles } from "../utils/validaciones";

function CursoCard({ curso, estaSeleccionado, onAgregar, onQuitar }) {
  const cuposDisponibles = calcularCuposDisponibles(curso);
  const sinCupos = cuposDisponibles <= 0;

  const manejarClick = () => {
    if (estaSeleccionado) {
      onQuitar(curso.id);
    } else {
      onAgregar(curso);
    }
  };

  return (
    <div
      className={`curso-card ${estaSeleccionado ? "curso-card--seleccionado" : ""}`}
    >
      <div className="curso-card__info">
        <h3>{curso.nombre}</h3>
        <p className="curso-card__codigo">{curso.codigo}</p>
        <div className="curso-card__detalles">
          <span>{curso.creditos} créditos</span>
          <span className={sinCupos ? "curso-card__cupos--agotado" : ""}>
            {sinCupos ? "Sin cupos" : `${cuposDisponibles} cupos disponibles`}
          </span>
        </div>
      </div>

      <button
        onClick={manejarClick}
        disabled={sinCupos && !estaSeleccionado}
        className="curso-card__boton"
      >
        {estaSeleccionado ? "Quitar" : "Agregar"}
      </button>
    </div>
  );
}

export default CursoCard;
