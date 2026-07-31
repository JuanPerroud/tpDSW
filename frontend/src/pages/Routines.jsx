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

  const onSubmit = (values) => {
    axios
      .post(API_URL, values)
      .then((response) => {
        alert("Nueva rutina creada");
        // Agregar la rutina creada al estado local y cerrar el form
        setRoutines((prev) => [...prev, response.data]);
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error al crear la rutina:", error);
        alert("Error al crear la rutina. Verificá que el servidor esté corriendo.");
      });
  };

  return (
    <div className="routines-page">
      <div className="routines-header">
        <h1>My Routines</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Routine"}
        </button>
      </div>

      {showForm && (
        <RoutineForm
          exercisesAvailable={testExercises}
          onSave={onSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <RoutineList routines={routines} />
    </div>
  );
}

export default Routines;
