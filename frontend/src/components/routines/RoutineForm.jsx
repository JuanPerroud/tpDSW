import "./RoutineForm.css";

import { useState } from "react";
import ExercisesSelector from "./ExercisesSelector";

function RoutineForm({ exercisesAvailable, initialValues, onSave, onCancel }) {
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(initialValues?.description || "");

  // Estado: array de { id, sets, reps }
  const [exercisesSelected, setExercisesSelected] = useState(() => {
    const initial = initialValues?.exercises || [];
    return initial.map((ex) => ({
      id: ex.id,
      sets: ex.sets ?? 3,
      reps: ex.reps ?? 10,
    }));
  });

  function handleToggleExercise(id) {
    setExercisesSelected((prev) => {
      const exists = prev.find((e) => e.id === id);
      if (exists) {
        return prev.filter((e) => e.id !== id);
      } else {
        return [...prev, { id, sets: 3, reps: 10 }];
      }
    });
  }

  function handleUpdateConfig(id, field, value) {
    setExercisesSelected((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Construir array completo con datos del ejercicio + sets/reps configurados
    const selectedExercisesObjects = exercisesSelected.map((sel) => {
      const exerciseData = (exercisesAvailable || []).find((ex) => ex.id === sel.id);
      return {
        ...(exerciseData || {}),
        id: sel.id,
        sets: sel.sets,
        reps: sel.reps,
      };
    });

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
      <h2>{initialValues ? "Editar Rutina" : "Nueva Rutina"}</h2>

      <label htmlFor="routine-name">Nombre</label>
      <input
        id="routine-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ej: Rutina de pecho y tríceps"
        required
      />

      <label htmlFor="routine-description">Descripción</label>
      <textarea
        id="routine-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Ej: Rutina 3 veces por semana"
      />

      <ExercisesSelector
        exercises={exercisesAvailable || []}
        selected={exercisesSelected}
        onToggle={handleToggleExercise}
        onUpdateConfig={handleUpdateConfig}
      />

      <p>{exercisesSelected.length} ejercicio(s) seleccionado(s)</p>

      <div className="routine-form-buttons" style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <button type="submit" className="btn btn-primary">
          {initialValues ? "Actualizar Rutina" : "Guardar Rutina"}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default RoutineForm;
