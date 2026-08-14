# Sistema de Matriculación Académica

Aplicación web en React que permite a un estudiante seleccionar y matricular cursos disponibles para su semestre académico actual, respetando cupos y límite de créditos.

Desarrollada como prueba técnica de React.

---

## Instrucciones para ejecutar la aplicación

### Requisitos previos

- Node.js 18 o superior
- npm (incluido con Node.js)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd matriculacion-academica

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

No requiere backend, base de datos ni variables de entorno: todos los datos están simulados en archivos JSON locales.

---

## Tecnologías utilizadas

| Herramienta    | Uso                                     |
| -------------- | --------------------------------------- |
| React 18       | Librería de interfaz de usuario         |
| Vite           | Servidor de desarrollo y bundler        |
| `useReducer`   | Manejo de estado de la matrícula        |
| ESLint         | Linter de calidad de código             |
| CSS puro       | Estilos, sin librerías de UI externas   |
| `localStorage` | Persistencia de la matrícula confirmada |

No se usaron librerías de manejo de estado externas (Redux) ni de estilos (Tailwind, styled-components) de forma deliberada: dado el alcance del proyecto, `useReducer` y CSS plano son suficientes y evitan dependencias innecesarias que compliquen la evaluación del código.

---

## Estructura del proyecto

```
matriculacion-academica/
├── src/
│   ├── data/
│   │   ├── cursos.json          # Cursos disponibles simulados
│   │   └── estudiante.json      # Datos del estudiante simulado
│   ├── components/
│   │   ├── ListaCursos.jsx      # Acordeón por semestre + grilla de cursos
│   │   ├── CursoCard.jsx        # Tarjeta individual de un curso
│   │   ├── ResumenMatricula.jsx # Resumen tipo "ticket" + errores
│   │   └── ConfirmacionMatricula.jsx # Pantalla final tras confirmar
│   ├── hooks/
│   │   └── useMatricula.js      # useReducer con la lógica de estado
│   ├── utils/
│   │   └── validaciones.js      # Reglas de negocio (funciones puras)
│   ├── App.jsx                  # Orquestador: conecta estado, datos y vistas
│   ├── App.css                  # Estilos del proyecto
│   ├── index.css                # Reset base
│   └── main.jsx                 # Punto de entrada de React
├── index.html
├── package.json
└── README.md
```

---

## Decisiones de desarrollo

Esta sección explica el **por qué** detrás de cada decisión técnica, no solo el qué.

### 1. Separación de datos, lógica de negocio, estado y presentación

El proyecto está organizado en cuatro capas independientes:

- **`data/`** — información cruda simulada, sin ninguna lógica.
- **`utils/validaciones.js`** — reglas de negocio como funciones puras (sin JSX, sin `useState`). No dependen de React en absoluto, por lo que serían triviales de testear de forma aislada si se agregaran pruebas unitarias.
- **`hooks/useMatricula.js`** — maneja _transiciones de estado_ (agregar, quitar, confirmar, reiniciar) apoyándose en las validaciones de `utils/`, pero sin conocer nada de cómo se ve la interfaz.
- **`components/`** — solo presentación. Reciben datos y funciones por props; ninguno importa `cursos.json` ni `estudiante.json` directamente (excepto `App.jsx`, que es el único punto de entrada de datos).
  Esta separación permite que, si mañana los datos vinieran de una API real en lugar de JSON local, o si las reglas de negocio cambiaran, el cambio quede aislado en una sola capa sin tocar las demás.

### 2. `useReducer` en vez de múltiples `useState`

El estado de la matrícula tiene varias piezas relacionadas entre sí (cursos seleccionados, error activo, si la matrícula ya se confirmó) que cambian juntas ante una misma acción del usuario. `useReducer` centraliza esas transiciones en acciones explícitas y nombradas (`AGREGAR_CURSO`, `QUITAR_CURSO`, `CONFIRMAR_MATRICULA`, `LIMPIAR_ERROR`, `REINICIAR`), lo que hace el flujo de estado más predecible y fácil de razonar que coordinar varios `useState` sueltos.

### 3. Validaciones que devuelven motivo, no solo verdadero/falso

La función central `validarSeleccionCurso` no devuelve un simple booleano: devuelve `{ valido: false, motivo: '...' }`. Esto permite que la interfaz le muestre al estudiante _exactamente por qué_ no puede matricular un curso (sin cupos, fuera de su semestre, excede créditos, no está matriculado en el periodo), en lugar de solo deshabilitar un botón sin explicación. Esta decisión responde directamente al criterio de evaluación "capacidad para manejar validaciones y errores".

### 4. Cupos disponibles como valor derivado, no almacenado

El JSON de cursos trae `limiteCupos` y `matriculados`, pero no un campo `cuposDisponibles`. Ese valor se calcula en tiempo real (`limiteCupos - matriculados`) mediante `calcularCuposDisponibles()`, centralizado en un único lugar. Guardar `cuposDisponibles` como dato fijo habría creado el riesgo de que quedara desincronizado si `matriculados` cambia.

### 5. Acordeón por semestre en vez de ocultar otros semestres

El enunciado pide mostrar los cursos del semestre actual del estudiante. Se optó por mostrar **todos** los semestres como un acordeón, pero solo el del estudiante puede abrirse; los demás aparecen colapsados, con un candado y la leyenda "Solo puedes matricular cursos de tu semestre actual". La regla de negocio (no se puede interactuar con otros semestres) está aplicada tanto a nivel visual (`disabled` en el botón) como a nivel lógico (`alternarSemestre` rechaza el clic si el semestre no coincide con el del estudiante), para que no dependa únicamente del estado deshabilitado del botón.

### 6. `App.jsx` como único punto de contacto con `localStorage`

Ningún componente hijo accede a `localStorage` directamente. Solo `App.jsx`, en `manejarConfirmar`, arma el objeto final (`estudiante`, `cursos`, `fecha`) y lo guarda. Esto significa que si el almacenamiento cambiara en el futuro (por ejemplo, a una llamada a una API real), el único archivo que habría que tocar es `App.jsx`.

### 7. Renderizado condicional simple en lugar de un router

La aplicación tiene solo dos "pantallas" (flujo de selección y confirmación), controladas por un booleano (`matriculaConfirmada`) con un `if/else` visual dentro de `App.jsx`. Se descartó deliberadamente usar una librería de rutas (React Router): habría sido sobre-ingeniería para dos estados de una sola vista.

### 8. Diseño visual propio, no una plantilla genérica

El diseño sigue un concepto de "documento oficial de matrícula": tipografía serif editorial para títulos, monoespaciada para códigos de curso (`MAT101`, `PRG201`) porque se leen como datos, y el resumen de matrícula tiene forma de "ticket" con borde punteado y muescas laterales. El objetivo fue evitar un estilo por defecto y reforzar visualmente que se trata de un comprobante académico.

### 9. Accesibilidad básica cuidada a propósito

- Estados de foco visibles (`:focus-visible`) en todos los botones interactivos.
- `role="alert"` en los mensajes de error, para que lectores de pantalla los anuncien automáticamente.
- `aria-expanded` en el botón del acordeón, para indicar si una sección está abierta o cerrada.
- `aria-hidden="true"` en el ícono decorativo del candado, para no generar ruido a lectores de pantalla.
- Se respeta `prefers-reduced-motion` deshabilitando transiciones para quien lo configure en su sistema.

### 10. Login con ID de estudiante

El enunciado marca el inicio de sesión como **opcional**. No se implementó en esta entrega para priorizar que el flujo principal (selección, validación, confirmación) quedara completo y bien probado dentro del tiempo disponible. El estudiante actual se simula directamente desde `estudiante.json`.

---

## Datos simulados

### `src/data/cursos.json`

Array de cursos con `id`, `nombre`, `codigo`, `creditos`, `semestre`, `limiteCupos` y `matriculados`. Se amplió el set de datos original de la prueba con cursos adicionales para poder probar de forma más realista el límite de créditos del estudiante.

### `src/data/estudiante.json`

Objeto único con `id`, `nombre`, `carrera`, `semestre`, `matriculado` y `creditosPermitidos`.

Para simular distintos escenarios (estudiante no matriculado, otro semestre, otro límite de créditos), estos archivos pueden editarse manualmente y recargar la aplicación.

---

## Validaciones implementadas

Todas centralizadas en `src/utils/validaciones.js`:

1. El estudiante debe estar matriculado en el periodo académico (`matriculado: true`).
2. Solo se pueden seleccionar cursos del semestre actual del estudiante.
3. No se pueden seleccionar cursos sin cupos disponibles.
4. No se puede seleccionar dos veces el mismo curso.
5. No se puede exceder el límite de créditos permitido (`creditosPermitidos`) al sumar los cursos seleccionados.
   Cada validación fallida muestra su mensaje específico en el resumen de matrícula, descartable por el estudiante.

---

## Limitaciones y aspectos no implementados

- **No hay inicio de sesión real.** El estudiante se simula estáticamente desde `estudiante.json`, como permite el enunciado al marcar el login como opcional.
- **No hay backend real.** La matrícula confirmada se guarda únicamente en `localStorage` del navegador; no persiste entre dispositivos ni se sincroniza con un servidor.
- **No se agregaron pruebas automatizadas** (unitarias o de integración) por límite de tiempo, aunque la separación de `utils/validaciones.js` como funciones puras fue pensada precisamente para que fueran fáciles de testear si se decide agregarlas más adelante.
- **El estado se reinicia al recargar la página** (excepto la matrícula ya confirmada, que sí queda en `localStorage`). Los cursos seleccionados que aún no se han confirmado viven en memoria (`useReducer`), no en almacenamiento persistente.
