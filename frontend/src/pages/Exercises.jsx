// src/pages/Exercises.jsx
import { useState, useEffect } from "react";
import ExerciseList from "../components/exercises/ExerciseList";
import ExerciseForm from "../components/exercises/ExerciseForm";
import axios from "axios";
import "./Exercises.css";

const EXERCISE_API = "http://localhost:3000/api/exercise";

function Exercises() {
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [exercises, setExercises] = useState([]);

  const fetchExercises = () => {
    axios
      .get(EXERCISE_API)
      .then((res) => setExercises(res.data || []))
      .catch((err) => console.error("Error al cargar ejercicios:", err));
  };

  useEffect(() => {
    fetchExercises();
  }, []);

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
      // Editar existente
      axios
        .put(`${EXERCISE_API}/${exerciseData.id}`, exerciseData)
        .then(() => {
          fetchExercises();
          setShowForm(false);
          setEditingExercise(null);
        })
        .catch((err) => {
          console.error("Error al actualizar ejercicio:", err);
          alert("No se pudo actualizar el ejercicio.");
        });
    } else {
      // Crear nuevo
      axios
        .post(EXERCISE_API, exerciseData)
        .then(() => {
          fetchExercises();
          setShowForm(false);
          setEditingExercise(null);
        })
        .catch((err) => {
          console.error("Error al crear ejercicio:", err);
          alert("No se pudo crear el ejercicio.");
        });
    }
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setShowForm(true);
  };

  const handleDeleteExercise = (id) => {
    axios
      .delete(`${EXERCISE_API}/${id}`)
      .then(() => {
        fetchExercises();
        if (editingExercise && editingExercise.id === id) {
          setEditingExercise(null);
          setShowForm(false);
        }
      })
      .catch((err) => {
        console.error("Error al eliminar ejercicio:", err);
        alert("No se pudo eliminar el ejercicio.");
      });
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
