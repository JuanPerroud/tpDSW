import RoutineCard from "./RoutineCard";
import "./RoutineList.css";

function RoutineList({ routines, onUpdate, onDelete }) {
  if (routines.length === 0) {
    return <p>No routines created yet.</p>;
  }

  return (
    <div className="routine-list">
      {routines.map((routine) => (
        <RoutineCard key={routine.id} routine={routine} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default RoutineList;
