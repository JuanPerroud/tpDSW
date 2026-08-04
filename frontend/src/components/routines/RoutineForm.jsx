import "./RoutineForm.css";

import { useState } from "react";
import ExercisesSelector from "./ExercisesSelector";

function RoutineForm({ exercisesAvailable, initialValues, onSave, onCancel }) {
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [exercisesSelected, setExercisesSelected] = useState(
    (initialValues?.exercises || []).map((ex) => ex.id)
  );

  function handleToggleExercise(id) {
    setExercisesSelected((prev) =>
      prev.includes(id)
        ? prev.filter((exerciseId) => exerciseId !== id)
        : [...prev, id]
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const selectedExercisesObjects = (exercisesAvailable || []).filter((ex) =>
      exercisesSelected.includes(ex.id)
    );
    if (onSave) {
      onSave({
        name,
        description,
        exercises: selectedExercisesObjects,
      });
    }
  };

  return (
    <form className="routine-form" onSubmit={handleSubmit}>
      <h2>{initialValues ? "Edit Routine" : "New Routine"}</h2>

      <label htmlFor="routine-name">Name</label>
      <input
        id="routine-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="E.g: Chest and triceps routine"
        required
      />

      <label htmlFor="routine-description">Description</label>
      <textarea
        id="routine-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="E.g: Routine for 3 times a week"
      />

      <ExercisesSelector
        exercises={exercisesAvailable || []}
        selected={exercisesSelected}
        onToggle={handleToggleExercise}
      />

      <p>{exercisesSelected.length} exercise(s) selected</p>

      <div className="routine-form-buttons" style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <button type="submit" className="btn btn-primary">
          {initialValues ? "Update Routine" : "Save Routine"}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default RoutineForm;
