import RoutineCard from "./RoutineCard";
import "./RoutineList.css";

function RoutineList({ routines, isMine = true, onUpdate, onDelete, onSaveToMine }) {
  if (!routines || routines.length === 0) {
    return (
      <div className="empty-routines-container">
        <p className="empty-routines-text">
          {isMine
            ? "Aún no tenés rutinas creadas o guardadas."
            : "No hay rutinas públicas disponibles en la comunidad."}
        </p>
      </div>
    );
  }

  return (
    <div className="routine-list">
      {routines.map((routine) => (
        <RoutineCard
          key={routine.id}
          routine={routine}
          isMine={isMine}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onSaveToMine={onSaveToMine}
        />
      ))}
    </div>
  );
}

export default RoutineList;
