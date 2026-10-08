import { useState } from "react";
import "./RoutineCard.css";
import MuscleGroupLabels from "../../../constants/MuscleGroupLabels";
import routineService from "../../../services/routineService";

function RoutineCard({ routine, isMine = true, onUpdate, onDelete, onSaveToMine }) {
  const [expanded, setExpanded] = useState(false);
  // Detalle completo traído del backend al expandir (rutina + ejercicios + series + creador)
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState(false);

  const handleToggleDetail = () => {
    const willExpand = !expanded;
    setExpanded(willExpand);

    if (willExpand && !detail && routine.id) {
      setLoadingDetail(true);
      setDetailError(false);
      routineService
        .getById(routine.id)
        .then(setDetail)
        .catch((error) => {
          console.error("Error al cargar el detalle de la rutina:", error);
          setDetailError(true);
        })
        .finally(() => setLoadingDetail(false));
    }
  };

  const source = detail ?? routine;
  const routineExercises = [...(source.RoutineExercises || [])].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
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
    : (source.exercises || []);

  return (
    <div className={`routine-card ${expanded ? "routine-card--expanded" : ""}`}>
      <div className="routine-card-header">
        <h3>{routine.name}</h3>
        <span className={`routine-badge ${isMine ? "badge-mine" : "badge-community"}`}>
          {isMine ? "Mi Rutina" : "Comunidad"}
        </span>
      </div>

      {routine.description && <p className="routine-desc">{routine.description}</p>}

      {/* Detail expanded */}
      {expanded && (
        <div className="routine-detail">
          <h4>Detalle de ejercicios</h4>
          {loadingDetail && <p className="no-ex">Cargando detalle...</p>}
          {detailError && (
            <p className="no-ex" role="alert">
              No se pudo actualizar el detalle desde el servidor. Se muestran los datos disponibles.
            </p>
          )}
          {detail?.creator && (
            <p className="routine-creator">
              Creada por {detail.creator.name} {detail.creator.surname}
            </p>
          )}
          {exercises.length > 0 ? (
            <div className="routine-detail-list">
              {exercises.map((exercise, idx) => (
                <div key={exercise.id || idx} className="routine-detail-item">
                  <div className="detail-item-header">
                    <span className="detail-exercise-name">{exercise.name}</span>
                    {exercise.muscleGroup && (
                      <span className="detail-muscle-tag">
                        {MuscleGroupLabels[exercise.muscleGroup] || exercise.muscleGroup}
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
          onClick={handleToggleDetail}
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
