import "./ExercisesSelector.css";

function ExercisesSelector({ exercises, selected, onToggle, onUpdateConfig }) {
  // selected: array de objetos { id, sets, reps }
  const selectedIds = selected.map((s) => s.id);

  return (
    <div className="exercise-selector">
      <h3>Elegí los ejercicios</h3>

      {exercises.map((exercise) => {
        const isSelected = selectedIds.includes(exercise.id);
        const config = selected.find((s) => s.id === exercise.id) || { sets: 3, reps: 10 };

        return (
          <div key={exercise.id} className={`exercise-checkbox-item ${isSelected ? "selected" : ""}`}>
            <label className="exercise-main-label">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(exercise.id)}
              />
              <span className="exercise-name">{exercise.name}</span>
              {exercise.muscleGroup && (
                <span className="group-tag">{exercise.muscleGroup}</span>
              )}
            </label>

            {isSelected && (
              <div className="exercise-config">
                <label>
                  Series
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={config.sets}
                    onChange={(e) =>
                      onUpdateConfig(exercise.id, "sets", parseInt(e.target.value) || 1)
                    }
                  />
                </label>
                <label>
                  Reps
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={config.reps}
                    onChange={(e) =>
                      onUpdateConfig(exercise.id, "reps", parseInt(e.target.value) || 1)
                    }
                  />
                </label>
              </div>
            )}
          </div>
        );
      })}

      {exercises.length === 0 && (
        <p className="no-exercises">No hay ejercicios disponibles. Creá algunos primero.</p>
      )}
    </div>
  );
}

export default ExercisesSelector;
