import MuscleGroupLabels from "../../../constants/MuscleGroupLabels";

const ExerciseCard = ({ exercise, onEdit, onDelete }) => {
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
            <span className="exercise-info-label">Grupo Muscular</span>
            <span className="exercise-info-value">
              {MuscleGroupLabels[exercise.muscleGroup] || "No especificado"}
            </span>
          </div>
        </div>
      </div>

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
    </li>
  );
};

export default ExerciseCard;