import { useState, useRef, useEffect } from "react";
import ExerciseList from "../../components/Exercises/ExerciseList/ExerciseList";
import ExerciseForm from "../../components/Exercises/ExerciseForm/ExerciseForm";
import FilterSidebar from "../../components/shared/FilterSidebar";
import SortOptios from "../../constants/SortOptions";
import { useExercises } from "../../hooks/useExercises";
import "./Exercises.css";

const Exercises = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const formRef = useRef(null);

  const {
    exercises,
    sortedExercises,
    sortOrder,
    setSortOrder,
    muscularGroupSelected,
    handleOnCheckbox,
    resetFilters,
    saveExercise,
    deleteExercise,
  } = useExercises();

  // Ref para hacer scroll al formulario
  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm, editingExercise]);

  const handleToggleForm = () => {
    if (showForm) {
      setShowForm(false);
      setEditingExercise(null);
    } else {
      setEditingExercise(null);
      setShowForm(true);
    }
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setShowForm(true);
  };

  const handleSave = (exerciseData) => {
    saveExercise(exerciseData, () => {
      setShowForm(false);
      setEditingExercise(null);
    });
  };

  const handleDelete = (id) => {
    deleteExercise(id, () => {
      if (editingExercise && editingExercise.id === id) {
        setEditingExercise(null);
        setShowForm(false);
      }
    });
  };

  return (
    <div className="exercises-page">
      <div className="exercises-header">
        <h1>Mis Ejercicios</h1>
        <button onClick={handleToggleForm}>
          {showForm ? "Cancelar" : "+ Nuevo Ejercicio"}
        </button>
      </div>

      {showForm && (
        <div ref={formRef} style={{ scrollMarginTop: "20px" }}>
          <ExerciseForm
            key={editingExercise?.id || "new"}
            initialData={editingExercise}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingExercise(null);
            }}
          />
        </div>
      )}

      <div className="exercises-content-layout">
        <FilterSidebar
          className="exercises-sidebar"
          idPrefix="ex"
          muscularGroupSelected={muscularGroupSelected}
          handleOnCheckbox={handleOnCheckbox}
          sortBy={sortOrder}
          setSortBy={setSortOrder}
          sortOptions={SortOptios}
        />

        <main className="exercises-main">
          <ExerciseList
            exercises={sortedExercises}
            totalCount={exercises.length}
            onResetFilter={resetFilters}
            onEdit={handleEditExercise}
            onDelete={handleDelete}
          />
        </main>
      </div>
    </div>
  );
}

export default Exercises;
