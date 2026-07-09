function ExerciseCard({ exercise }) {
  return (
    <li className="exercise-card">
      <div className="exercise-card-header">
        <h3>{exercise.name}</h3>
        <p>{exercise.description}</p>
      </div>

      <div className="exercise-card-body">
        <div className="exercise-info">
          <div className="exercise-info-icon">💪</div>
          <div className="exercise-info-content">
            <span className="exercise-info-label">Muscle Group</span>
            <span className="exercise-info-value">{exercise.muscleGroup}</span>
          </div>
        </div>
      </div>

      <div className="exercise-card-footer">
        <button className="exercise-card-btn exercise-btn-edit">Edit</button>
        <button className="exercise-card-btn exercise-btn-delete">
          Delete
        </button>
      </div>
    </li>
  );
}

export default ExerciseCard;
