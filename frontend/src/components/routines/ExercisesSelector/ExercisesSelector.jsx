import "./ExercisesSelector.css";

function ExercisesSelector({ exercises, selected, onToggle, onUpdateConfig, onAddSet, onRemoveSet, onUpdateSet }) {
  // selected: array de objetos { id, sets, reps }
  const selectedIds = selected.map((s) => s.id);

  return (
    <div className="exercise-selector">
      <h3>Elegí los ejercicios</h3>

      {exercises.map((exercise) => {
        const isSelected = selectedIds.includes(exercise.id);
        const config = selected.find((s) => s.id === exercise.id) || { restSeconds: 90, sets: [] };

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
              <div className="exercise-config advanced-config">
                <div className="config-header">
                  <label>
                    Descanso (seg):
                    <input
                      type="number"
                      min="0"
                      step="15"
                      value={config.restSeconds}
                      onChange={(e) =>
                        onUpdateConfig(exercise.id, "restSeconds", parseInt(e.target.value) || 0)
                      }
                    />
                  </label>
                </div>
                
                <div className="sets-list">
                  {config.sets.map((set, idx) => (
                    <div key={idx} className="set-row">
                      <span className="set-number">Set {idx + 1}</span>
                      <label>
                        Reps:
                        <input
                          type="number"
                          min="1"
                          value={set.reps}
                          onChange={(e) =>
                            onUpdateSet(exercise.id, idx, "reps", parseInt(e.target.value) || 0)
                          }
                        />
                      </label>
                      <label>
                        Peso (Kg):
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder="0"
                          value={set.weightKg}
                          onChange={(e) =>
                            onUpdateSet(exercise.id, idx, "weightKg", e.target.value)
                          }
                        />
                      </label>
                      {config.sets.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-set"
                          onClick={() => onRemoveSet(exercise.id, idx)}
                          title="Eliminar Serie"
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn-add-set"
                  onClick={() => onAddSet(exercise.id)}
                >
                  ➕ Añadir Serie
                </button>
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
