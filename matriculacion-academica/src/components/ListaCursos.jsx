import { useState } from "react";
import CursoCard from "./CursoCard";

function ListaCursos({
  cursos,
  estudiante,
  cursosSeleccionados,
  onAgregarCurso,
  onQuitarCurso,
}) {
  const [semestreAbierto, setSemestreAbierto] = useState(estudiante.semestre);

  const idsSeleccionados = cursosSeleccionados.map((c) => c.id);

  const cursosPorSemestre = cursos.reduce((grupos, curso) => {
    const grupo = grupos[curso.semestre] || [];
    grupos[curso.semestre] = [...grupo, curso];
    return grupos;
  }, {});

  const semestres = Object.keys(cursosPorSemestre)
    .map(Number)
    .sort((a, b) => a - b);

  const alternarSemestre = (semestre) => {
    if (semestre !== estudiante.semestre) return;
    setSemestreAbierto((actual) => (actual === semestre ? null : semestre));
  };

  return (
    <div className="lista-cursos">
      <h2>Cursos por semestre</h2>

      {semestres.map((semestre) => {
        const esSemestreActual = semestre === estudiante.semestre;
        const estaAbierto = semestreAbierto === semestre;
        const cursosDelGrupo = cursosPorSemestre[semestre];

        return (
          <div
            key={semestre}
            className={`acordeon-semestre ${esSemestreActual ? "acordeon-semestre--actual" : "acordeon-semestre--bloqueado"}`}
          >
            <button
              className="acordeon-semestre__header"
              onClick={() => alternarSemestre(semestre)}
              disabled={!esSemestreActual}
              aria-expanded={estaAbierto}
            >
              <span>
                Semestre {semestre}
                {esSemestreActual && (
                  <span className="acordeon-semestre__etiqueta">
                    tu semestre
                  </span>
                )}
              </span>
              <span className="acordeon-semestre__meta">
                {!esSemestreActual && (
                  <svg
                    className="acordeon-semestre__candado"
                    viewBox="0 0 16 16"
                    width="12"
                    height="12"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M4 7V5a4 4 0 1 1 8 0v2h.5A1.5 1.5 0 0 1 14 8.5v5A1.5 1.5 0 0 1 12.5 15h-9A1.5 1.5 0 0 1 2 13.5v-5A1.5 1.5 0 0 1 3.5 7H4zm1.5 0h5V5a2.5 2.5 0 0 0-5 0v2z"
                    />
                  </svg>
                )}
                {cursosDelGrupo.length} curso
                {cursosDelGrupo.length !== 1 ? "s" : ""}
                {esSemestreActual && (estaAbierto ? " ▲" : " ▼")}
              </span>
            </button>

            {!esSemestreActual && (
              <p className="acordeon-semestre__aviso">
                Solo puedes matricular cursos de tu semestre actual.
              </p>
            )}

            {esSemestreActual && estaAbierto && (
              <div className="lista-cursos__grid">
                {cursosDelGrupo.map((curso) => (
                  <CursoCard
                    key={curso.id}
                    curso={curso}
                    estaSeleccionado={idsSeleccionados.includes(curso.id)}
                    onAgregar={onAgregarCurso}
                    onQuitar={onQuitarCurso}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ListaCursos;
