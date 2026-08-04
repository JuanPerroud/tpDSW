import "./RoutineCard.css";

function RoutineCard({ routine, onUpdate, onDelete }) {
  return (
    <div className="routine-card">
      <h3>{routine.name}</h3>
      <p>{routine.description}</p>

      <div className="routine-exercises-preview">
        <strong>Exercises:</strong>
        <ul>
          {(routine.exercises || []).map((exercise) => (
            <li key={exercise.id}>{exercise.name}</li>
          ))}
        </ul>
      </div>

      <div className="routine-actions">
        <button>View details</button>
        <button onClick={() => onUpdate && onUpdate(routine)}>Edit</button>
        <button onClick={() => onDelete && onDelete(routine.id)}>Delete</button>
      </div>
    </div>
  );
}

export default RoutineCard;
