import { useReducer } from "react";
import { validarSeleccionCurso } from "../utils/validaciones";

const estadoInicial = {
  cursosSeleccionados: [],
  error: null,
  matriculaConfirmada: false,
};

function matriculaReducer(state, action) {
  switch (action.type) {
    case "AGREGAR_CURSO": {
      const { curso, estudiante } = action.payload;
      const resultado = validarSeleccionCurso({
        curso,
        estudiante,
        cursosSeleccionados: state.cursosSeleccionados,
      });
      if (!resultado.valido) {
        return { ...state, error: resultado.motivo };
      }
      return {
        ...state,
        cursosSeleccionados: [...state.cursosSeleccionados, curso],
        error: null,
      };
    }
    case "QUITAR_CURSO": {
      return {
        ...state,
        cursosSeleccionados: state.cursosSeleccionados.filter(
          (c) => c.id !== action.payload.cursoId,
        ),
        error: null,
      };
    }
    case "LIMPIAR_ERROR": {
      return { ...state, error: null };
    }
    case "CONFIRMAR_MATRICULA": {
      return { ...state, matriculaConfirmada: true };
    }
    case "REINICIAR": {
      return estadoInicial;
    }

    default:
      return state;
  }
}

export function useMatricula() {
  const [state, dispatch] = useReducer(matriculaReducer, estadoInicial);

  const agregarCurso = (curso, estudiante) => {
    dispatch({ type: "AGREGAR_CURSO", payload: { curso, estudiante } });
  };

  const quitarCurso = (cursoId) => {
    dispatch({ type: "QUITAR_CURSO", payload: { cursoId } });
  };

  const limpiarError = () => {
    dispatch({ type: "LIMPIAR_ERROR" });
  };

  const confirmarMatricula = () => {
    dispatch({ type: "CONFIRMAR_MATRICULA" });
  };

  const reiniciar = () => {
    dispatch({ type: "REINICIAR" });
  };

  return {
    cursosSeleccionados: state.cursosSeleccionados,
    error: state.error,
    matriculaConfirmada: state.matriculaConfirmada,
    agregarCurso,
    quitarCurso,
    limpiarError,
    confirmarMatricula,
    reiniciar,
  };
}
