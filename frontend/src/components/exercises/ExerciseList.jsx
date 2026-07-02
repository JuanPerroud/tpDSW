import ExerciseCard from "./ExerciseCard";

function ExerciseList({ exercises }) {
  if (exercises.length === 0) {
    return <p>No exercises added yet.</p>;
  }

  return (
    <div className="exercise-list">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
}

export default ExerciseList;
