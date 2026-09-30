import MuscleGroupLabels from "../../../constants/MuscleGroupLabels";

const ExerciseCard = ({ exercise, onEdit, onDelete, canModify }) => {
  return (
    <li className="exercise-card">
      <div className="exercise-card-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <h3>{exercise.name}</h3>
          <span
            className={`exercise-badge ${exercise.isPublic ? "exercise-badge-public" : "exercise-badge-private"}`}
          >
            {exercise.isPublic ? "Global" : "Privado"}
          </span>
        </div>
        <p>{exercise.description}</p>
      </div>

      <div className="exercise-card-body">
        <div className="exercise-info">
          <div className="exercise-info-icon">💪</div>
          <div className="exercise-info-content">
            <span className="exercise-info-label">Grupo Muscular</span>
            <span className="exercise-info-value">
              {MuscleGroupLabels[exercise.muscleGroup] || "No especificado"}
            </span>
          </div>
        </div>
      </div>

      {canModify && (
        <div className="exercise-card-footer">
          <button
            className="exercise-card-btn exercise-btn-edit"
            onClick={() => onEdit && onEdit(exercise)}
          >
            Editar
          </button>
          <button
            className="exercise-card-btn exercise-btn-delete"
            onClick={() => onDelete && onDelete(exercise.id)}
          >
            Eliminar
          </button>
        </div>
      )}
    </li>
  );
};

export default ExerciseCard;