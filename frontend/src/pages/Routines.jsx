// src/pages/Routines.jsx
import { useState, useEffect } from "react";
import RoutineList from "../components/routines/RoutineList";
import RoutineForm from "../components/routines/RoutineForm";
import axios from "axios";
import "./Routines.css";

const API_URL = "http://localhost:3000/api/routine";

function Routines() {
  const [showForm, setShowForm] = useState(false);
  const [routines, setRoutines] = useState([]);
  const [editingRoutine, setEditingRoutine] = useState(null); // null o objeto rutina

  const testExercises = [
    { id: 1, name: "Squat", muscleGroup: "legs" },
    { id: 2, name: "Bench Press", muscleGroup: "chest" },
    { id: 3, name: "Pull-ups", muscleGroup: "back" },
  ];

  // Cargar rutinas del backend al montar el componente
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setRoutines(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar las rutinas:", error);
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        setRoutines((prev) => prev.filter((routine) => routine.id !== id));
        alert("Rutina eliminada");
      })
      .catch((error) => {
        console.error("Error al eliminar la rutina:", error);
        alert("Ocurrio un error al intentar eliminar la rutina");
      });
  };

  const onSubmit = (values) => {
    axios
      .post(API_URL, values)
      .then((response) => {
        alert("Nueva rutina creada");
        setRoutines((prev) => [...prev, response.data]);
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error al crear la rutina:", error);
        alert("Error al crear la rutina. Verificá que el servidor esté corriendo.");
      });
  };

  const handleEditClick = (routine) => {
    setEditingRoutine(routine);
    setShowForm(true);
  };

  const onSubmitEdit = (values) => {
    if (editingRoutine) {
      axios
        .put(`${API_URL}/${editingRoutine.id}`, values)
        .then(() => {
          alert("Rutina actualizada");
          setRoutines((prev) =>
            prev.map((routine) =>
              routine.id === editingRoutine.id ? { ...routine, ...values } : routine
            )
          );
          setShowForm(false);
          setEditingRoutine(null);
        })
        .catch((error) => console.error("Error al editar:", error));
    }
  };

  return (
    <div className="routines-page">
      <div className="routines-header">
        <h1>My Routines</h1>
        <button
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingRoutine(null);
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Cancel" : "+ New Routine"}
        </button>
      </div>

      {showForm && (
        <RoutineForm
          exercisesAvailable={testExercises}
          initialValues={editingRoutine}
          onSave={editingRoutine ? onSubmitEdit : onSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingRoutine(null);
          }}
        />
      )}

      <RoutineList
        routines={routines}
        onUpdate={handleEditClick}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Routines;
