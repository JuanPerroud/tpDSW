function ExercisesSelector({ exercises, selected, onToggle }) {
  return (
    <div className="exercise-selector">
      <h3>Choose the exercises</h3>

      {exercises.map((exercise) => (
        <label key={exercise.id} className="exercise-checkbox-item">
          <input
            type="checkbox"
            checked={selected.includes(exercise.id)}
            onChange={() => onToggle(exercise.id)}
          />
          {exercise.name}
          <span className="group-tag">{exercise.muscleGroup}</span>
        </label>
      ))}
    </div>
  );
}

export default ExercisesSelector;
