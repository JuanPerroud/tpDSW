// src/components/routines/RoutineForm.jsx
import { useState } from "react";
import ExercisesSelector from "./ExercisesSelector";

function RoutineForm({ exercisesAvailable }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [exercisesSelected, setExercisesSelected] = useState([]);

  function handleToggleExercise(id) {
    setExercisesSelected((prev) =>
      prev.includes(id)
        ? prev.filter((exerciseId) => exerciseId !== id)
        : [...prev, id],
    );
  }

  return (
    <div className="routine-form">
      <h2>New Routine</h2>

      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="E.g: Chest and triceps routine"
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="E.g: Routine for 3 times a week"
      />

      <ExercisesSelector
        exercises={exercisesAvailable}
        selected={exercisesSelected}
        onToggle={handleToggleExercise}
      />

      <p>{exercisesSelected.length} exercise(s) selected</p>

      <button>Save Routine</button>
    </div>
  );
}

export default RoutineForm;
