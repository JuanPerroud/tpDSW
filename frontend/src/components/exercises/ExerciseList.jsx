import ExerciseCard from "./ExerciseCard";
import "./ExerciseList.css";

function ExerciseList({ exercises, totalCount, onResetFilter, onEdit, onDelete }) {
  if (exercises.length === 0) {
    if (totalCount > 0) {
      return (
        <div className="exercise-list-empty">
          <p className="exercise-list-empty-title">No hay ejercicios para este grupo muscular</p>
          <p className="exercise-list-empty-description">
            Probá seleccionando otro filtro.
          </p>
          {onResetFilter && (
            <button
              onClick={onResetFilter}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "var(--primary-color)",
                color: "white",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Ver todos los ejercicios
            </button>
          )}
        </div>
      );
    }
    return (
      <div className="exercise-list-empty">
        <p className="exercise-list-empty-title">No hay ejercicios cargados todavía</p>
        <p className="exercise-list-empty-description">
          Agregá tu primer ejercicio para empezar 💪
        </p>
      </div>
    );
  }

  return (
    <ul className="exercise-list">
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default ExerciseList;
