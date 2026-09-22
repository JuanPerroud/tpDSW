import { useState } from "react";
import ExercisesSelector from "../ExercisesSelector/ExercisesSelector";
import AISuggester from "../AISuggester/AISuggester";
import "./RoutineForm.css";

const RoutineForm = ({ exercisesAvailable, initialValues, onSave, onCancel }) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [showAI, setShowAI] = useState(false);

  // Estado: array de { id, restSeconds, sets: [{ reps, weightKg }] }
  const [exercisesSelected, setExercisesSelected] = useState(() => {
    const routineExercises = initialValues?.RoutineExercises;
    if (routineExercises && routineExercises.length > 0) {
      return routineExercises.map((re) => {
        const sets = re.ExerciseSets && re.ExerciseSets.length > 0
          ? re.ExerciseSets.map(set => ({ reps: set.reps, weightKg: set.weightKg || '' }))
          : [{ reps: 10, weightKg: '' }, { reps: 10, weightKg: '' }, { reps: 10, weightKg: '' }];
        return {
          id: re.exerciseId,
          restSeconds: re.restSeconds || 90,
          sets
        };
      });
    }
    const initial = initialValues?.exercises || [];
    return initial.map((ex) => ({
      id: ex.id,
      restSeconds: 90,
      sets: Array.from({ length: ex.sets ?? 3 }).map(() => ({ reps: ex.reps ?? 10, weightKg: '' })),
    }));
  });

  function handleToggleExercise(id) {
    setExercisesSelected((prev) => {
      const exists = prev.find((e) => e.id === id);
      if (exists) {
        return prev.filter((e) => e.id !== id);
      } else {
        return [...prev, {
          id,
          restSeconds: 90,
          sets: [{ reps: 10, weightKg: '' }, { reps: 10, weightKg: '' }, { reps: 10, weightKg: '' }]
        }];
      }
    });
  }

  function handleUpdateConfig(id, field, value) {
    setExercisesSelected((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  }

  function handleAddSet(id) {
    setExercisesSelected((prev) => prev.map((e) => {
      if (e.id === id) {
        const lastSet = e.sets.length > 0 ? e.sets[e.sets.length - 1] : { reps: 10, weightKg: '' };
        return { ...e, sets: [...e.sets, { ...lastSet }] };
      }
      return e;
    }));
  }

  function handleRemoveSet(id, setIndex) {
    setExercisesSelected((prev) => prev.map((e) => {
      if (e.id === id) {
        return { ...e, sets: e.sets.filter((_, idx) => idx !== setIndex) };
      }
      return e;
    }));
  }

  function handleUpdateSet(id, setIndex, field, value) {
    setExercisesSelected((prev) => prev.map((e) => {
      if (e.id === id) {
        const newSets = e.sets.map((s, idx) => (idx === setIndex ? { ...s, [field]: value } : s));
        return { ...e, sets: newSets };
      }
      return e;
    }));
  }

  function handleReorderExercises(fromIndex, toIndex) {
    setExercisesSelected((prev) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex >= prev.length
      ) {
        return prev;
      }
      const newArr = [...prev];
      const [movedItem] = newArr.splice(fromIndex, 1);
      newArr.splice(toIndex, 0, movedItem);
      return newArr;
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Construir RoutineExercises manteniendo el orden actual en exercisesSelected
    const routineExercisesObjects = exercisesSelected.map((sel, idx) => {
      const setsArray = sel.sets.map((s, i) => ({
        setNumber: i + 1,
        reps: s.reps || 0,
        weightKg: s.weightKg !== '' ? parseFloat(s.weightKg) : null,
      }));

      return {
        exerciseId: sel.id,
        orderIndex: idx + 1,
        restSeconds: sel.restSeconds || 90,
        ExerciseSets: setsArray,
      };
    });

    if (onSave) {
      onSave({
        name,
        description,
        RoutineExercises: routineExercisesObjects,
      });
    }
  };

  return (
    <div className={`routine-page-layout ${showAI ? 'with-ai' : ''}`}>
      <div className="form-content">

        <form className="routine-form" onSubmit={handleSubmit}>
          <div className="routine-form-header">
            <h2>{initialValues ? "Editar Rutina" : "Nueva Rutina"}</h2>
            {!showAI && (
              <button
                type="button"
                className="btn btn-ai-suggest"
                onClick={() => setShowAI(true)}
              >
                ✨ Sugerir con IA
              </button>
            )}
          </div>


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
            placeholder="Ej: Rutina enfocada en fuerza e hipertrofia"
          />

          <ExercisesSelector
            exercises={exercisesAvailable || []}
            selected={exercisesSelected}
            onToggle={handleToggleExercise}
            onUpdateConfig={handleUpdateConfig}
            onAddSet={handleAddSet}
            onRemoveSet={handleRemoveSet}
            onUpdateSet={handleUpdateSet}
            onReorder={handleReorderExercises}
          />

          <p className="selected-count-badge">{exercisesSelected.length} ejercicio(s) seleccionado(s)</p>

          <div className="routine-form-buttons">
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
      </div>
      {showAI && (
        <aside className="ai-sidebar">
          <AISuggester onClose={() => setShowAI(false)} />
        </aside>
      )}
    </div>
  );
}

export default RoutineForm;
