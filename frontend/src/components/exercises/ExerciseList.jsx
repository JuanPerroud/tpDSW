import ExerciseCard from "./ExerciseCard";
import "./ExerciseList.css";

function ExerciseList({ exercises, onEdit, onDelete }) {
  if (exercises.length === 0) {
    return (
      <div className="exercise-list-empty">
        <p className="exercise-list-empty-title">No exercises yet</p>
        <p className="exercise-list-empty-description">
          Add your first exercise to get started! 💪
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
