import ExerciseCard from "./ExerciseCard";
import "./ExerciseList.css";

function ExerciseList({ exercises }) {
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
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </ul>
  );
}

export default ExerciseList;
