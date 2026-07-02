function ExerciseCard({ exercise }) {
  return (
    <div className="exercise-card">
      <h3>{exercise.name}</h3>
      <p>{exercise.description}</p>
      <span className="exercise-group">{exercise.muscleGroup}</span>

      <div className="exercise-actions">
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  );
}

export default ExerciseCard;
