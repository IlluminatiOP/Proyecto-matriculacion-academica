export function calcularCuposDisponibles(curso) {
  return curso.limiteCupos - curso.matriculados;
}

export function esCursoMatriculable(curso, SemestreEstudiante) {
  const tieneCupos = calcularCuposDisponibles(curso) > 0;
  const esDelSemestre = curso.semestre === SemestreEstudiante;
  return tienecupos && esDelSemestre;
}

export function estudianteHabilitado(estudiante) {
  return Boolean(estudiante?.matriculado);
}

export function sumarCreditos(cursosSeleccionados) {
  return cursosSeleccionados.reduce(
    (total, curso) => total + curso.creditos,
    0,
  );
}

export function excedeLimiteCreditos(
  cursosSeleccionados,
  cursoNuevo,
  creditosPermitidos,
) {
  const totalConNuevo =
    sumarCreditos(cursosSeleccionados) + cursoNuevo.creditos;
  return totalConNuevo > creditosPermitidos;
}

export function validarSeleccionCurso({
  curso,
  estudiante,
  cursosSeleccionados,
}) {
  if (!estudianteHabilitado(estudiante)) {
    return {
      valido: false,
      motivo: "El estudiante no está matriculado en el semestre academico.",
    };
  }
  if (curso.semestre !== estudiante.semestre) {
    return {
      valido: false,
      motivo: "El curso no corresponde al semestre del estudiante.",
    };
  }
  if (calcularCuposDisponibles(curso) <= 0) {
    return { valido: false, motivo: "El curso no tiene cupos disponibles." };
  }

  const yaSeleccionado = cursosSeleccionados.some((c) => c.id === curso.id);
  if (yaSeleccionado) {
    return { valido: false, motivo: "Ya seleccionaste este curso." };
  }

  if (
    excedeLimiteCreditos(
      cursosSeleccionados,
      curso,
      estudiante.creditosPermitidos,
    )
  ) {
    return {
      valido: false,
      motivo: "Seleccionar este curso excede el límite de créditos permitidos.",
    };
  }

  return { valido: true, motivo: "Curso seleccionado correctamente." };
}
