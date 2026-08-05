import ExerciseCard from "./ExerciseCard";
import "./ExerciseList.css";

function ExerciseList({ exercises, onEdit, onDelete }) {
  if (exercises.length === 0) {
    return (
      <div className="exercise-list-empty">
        <p className="exercise-list-empty-title">No hay ejercicios cargados todavia</p>
        <p className="exercise-list-empty-description">
          Agrega tu primer ejercicio para empezar 💪
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
