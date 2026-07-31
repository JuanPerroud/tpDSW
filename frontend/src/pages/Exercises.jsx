// src/pages/Exercises.jsx
import { useState } from "react";
import ExerciseList from "../components/exercises/ExerciseList";
import ExerciseForm from "../components/exercises/ExerciseForm";
import "./Exercises.css";

function Exercises() {
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [exercises, setExercises] = useState([
    { id: 1, name: "Squat", description: "3x12", muscleGroup: "legs" },
    { id: 2, name: "Bench Press", description: "4x8", muscleGroup: "chest" },
  ]);

  const handleToggleForm = () => {
    if (showForm) {
      setShowForm(false);
      setEditingExercise(null);
    } else {
      setEditingExercise(null);
      setShowForm(true);
    }
  };

  const handleSaveExercise = (exerciseData) => {
    if (exerciseData.id) {
      // Update existing
      setExercises((prev) =>
        prev.map((ex) => (ex.id === exerciseData.id ? exerciseData : ex))
      );
    } else {
      // Create new
      const newExercise = {
        ...exerciseData,
        id: Date.now(),
      };
      setExercises((prev) => [...prev, newExercise]);
    }
    setShowForm(false);
    setEditingExercise(null);
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setShowForm(true);
  };

  const handleDeleteExercise = (id) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
    if (editingExercise && editingExercise.id === id) {
      setEditingExercise(null);
      setShowForm(false);
    }
  };

  return (
    <div className="exercises-page">
      <div className="exercises-header">
        <h1>My Exercises</h1>
        <button onClick={handleToggleForm}>
          {showForm ? "Cancel" : "+ New Exercise"}
        </button>
      </div>

      {showForm && (
        <ExerciseForm
          key={editingExercise?.id || "new"}
          initialData={editingExercise}
          onSave={handleSaveExercise}
          onCancel={() => {
            setShowForm(false);
            setEditingExercise(null);
          }}
        />
      )}

      <ExerciseList
        exercises={exercises}
        onEdit={handleEditExercise}
        onDelete={handleDeleteExercise}
      />
    </div>
  );
}

export default Exercises;
