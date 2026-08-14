import { useMatricula } from "./hooks/useMatricula";
import ListaCursos from "./components/ListaCursos";
import ResumenMatricula from "./components/ResumenMatricula";
import ConfirmacionMatricula from "./components/ConfirmacionMatricula";
import cursosData from "./data/cursos.json";
import estudianteData from "./data/estudiante.json";
import "./App.css";

function App() {
  const {
    cursosSeleccionados,
    error,
    matriculaConfirmada,
    agregarCurso,
    quitarCurso,
    limpiarError,
    confirmarMatricula,
    reiniciar,
  } = useMatricula();

  const manejarAgregar = (curso) => {
    agregarCurso(curso, estudianteData);
  };

  const manejarConfirmar = () => {
    const matriculaGuardada = {
      estudiante: estudianteData,
      cursos: cursosSeleccionados,
      fecha: new Date().toISOString(),
    };

    localStorage.setItem("matricula", JSON.stringify(matriculaGuardada));
    confirmarMatricula();
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>Sistema de Matriculación Académica</h1>
        <p>
          {estudianteData.nombre} — {estudianteData.carrera}
        </p>
      </header>

      {matriculaConfirmada ? (
        <ConfirmacionMatricula
          cursosSeleccionados={cursosSeleccionados}
          estudiante={estudianteData}
          onReiniciar={reiniciar}
        />
      ) : (
        <div className="app__contenido">
          <ListaCursos
            cursos={cursosData}
            estudiante={estudianteData}
            cursosSeleccionados={cursosSeleccionados}
            onAgregarCurso={manejarAgregar}
            onQuitarCurso={quitarCurso}
          />

          <ResumenMatricula
            cursosSeleccionados={cursosSeleccionados}
            estudiante={estudianteData}
            error={error}
            onQuitar={quitarCurso}
            onConfirmar={manejarConfirmar}
            onLimpiarError={limpiarError}
          />
        </div>
      )}
    </div>
  );
}

export default App;
