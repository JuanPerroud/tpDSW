import { useState } from "react";
import "./RoutineCard.css";

const MUSCLE_GROUP_LABELS = {
  chest: "Pecho",
  back: "Espalda",
  legs: "Piernas",
  biceps: "Bíceps",
  triceps: "Tríceps",
  core: "Core",
};

function RoutineCard({ routine, isMine = true, onUpdate, onDelete, onSaveToMine }) {
  const [expanded, setExpanded] = useState(false);

  const routineExercises = routine.RoutineExercises || [];
  const exercises = routineExercises.length > 0
    ? routineExercises.map((re) => ({
        id: re.Exercise?.id || re.exerciseId,
        name: re.Exercise?.name || "Ejercicio desconocido",
        muscleGroup: re.Exercise?.muscleGroup,
        description: re.Exercise?.description,
        restSeconds: re.restSeconds,
        setsData: re.ExerciseSets || [],
        // Fallbacks para preview
        sets: re.ExerciseSets ? re.ExerciseSets.length : 0,
        reps: re.ExerciseSets && re.ExerciseSets.length > 0 ? re.ExerciseSets[0].reps : 0,
      }))
    : (routine.exercises || []);

  return (
    <div className={`routine-card ${expanded ? "routine-card--expanded" : ""}`}>
      <div className="routine-card-header">
        <h3>{routine.name}</h3>
        <span className={`routine-badge ${isMine ? "badge-mine" : "badge-community"}`}>
          {isMine ? "Mi Rutina" : "Comunidad"}
        </span>
      </div>

      {routine.description && <p className="routine-desc">{routine.description}</p>}

      {/* Preview collapsed */}
      {!expanded && (
        <div className="routine-exercises-preview">
          <strong>Ejercicios:</strong>
          <ul>
            {exercises.length > 0 ? (
              exercises.map((exercise, idx) => (
                <li key={exercise.id || idx}>{exercise.name}</li>
              ))
            ) : (
              <li className="no-ex">Sin ejercicios asignados</li>
            )}
          </ul>
        </div>
      )}

      {/* Detail expanded */}
      {expanded && (
        <div className="routine-detail">
          <h4>Detalle de ejercicios</h4>
          {exercises.length > 0 ? (
            <div className="routine-detail-list">
              {exercises.map((exercise, idx) => (
                <div key={exercise.id || idx} className="routine-detail-item">
                  <div className="detail-item-header">
                    <span className="detail-exercise-name">{exercise.name}</span>
                    {exercise.muscleGroup && (
                      <span className="detail-muscle-tag">
                        {MUSCLE_GROUP_LABELS[exercise.muscleGroup] || exercise.muscleGroup}
                      </span>
                    )}
                  </div>
                  {exercise.description && (
                    <p className="detail-exercise-desc">{exercise.description}</p>
                  )}
                  <div className="detail-stats">
                    {exercise.setsData && exercise.setsData.length > 0 ? (
                      <div className="sets-detail-list">
                        {exercise.restSeconds > 0 && (
                          <div className="rest-time-badge">⏱️ Descanso: {exercise.restSeconds}s</div>
                        )}
                        {exercise.setsData.map((set, i) => (
                          <div key={i} className="set-detail-item">
                            <span className="set-detail-num">Set {set.setNumber || i + 1}:</span>
                            <span className="set-detail-reps">{set.reps} reps</span>
                            {set.weightKg ? <span className="set-detail-weight">@ {set.weightKg} kg</span> : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="detail-stat">
                          <span className="stat-value">{exercise.sets ?? 0}</span>
                          <span className="stat-label">Series</span>
                        </div>
                        <div className="detail-stat-divider">×</div>
                        <div className="detail-stat">
                          <span className="stat-value">{exercise.reps ?? 0}</span>
                          <span className="stat-label">Reps</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-ex">Esta rutina no tiene ejercicios asignados.</p>
          )}
        </div>
      )}

      <div className="routine-actions">
        <button
          className="btn-detail"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "▲ Ocultar detalle" : "▼ Ver detalle"}
        </button>

        {isMine ? (
          <>
            <button className="btn-edit" onClick={() => onUpdate && onUpdate(routine)}>
              ✏️ Editar
            </button>
            <button className="btn-delete" onClick={() => onDelete && onDelete(routine.id)}>
              🗑️ Eliminar
            </button>
          </>
        ) : (
          <button className="btn-save-community" onClick={() => onSaveToMine && onSaveToMine(routine)}>
            ⭐ Guardar en Mis Rutinas
          </button>
        )}
      </div>
    </div>
  );
}

export default RoutineCard;
