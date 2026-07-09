import RoutineCard from "./RoutineCard";
import "./RoutineList.css";

function RoutineList({ routines }) {
  if (routines.length === 0) {
    return <p>No routines created yet.</p>;
  }

  return (
    <div className="routine-list">
      {routines.map((routine) => (
        <RoutineCard key={routine.id} routine={routine} />
      ))}
    </div>
  );
}

export default RoutineList;
