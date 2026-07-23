// src/pages/Routines.jsx
import { useState } from "react";
import RoutineList from "../components/routines/RoutineList";
import RoutineForm from "../components/routines/RoutineForm";
import "./Routines.css";

function Routines() {
  const [showForm, setShowForm] = useState(false);

  const testExercises = [
    { id: 1, name: "Squat", muscleGroup: "legs" },
    { id: 2, name: "Bench Press", muscleGroup: "chest" },
    { id: 3, name: "Pull-ups", muscleGroup: "back" },
  ];

  const [routines, setRoutines] = useState([
    {
      id: 1,
      name: "Full Body Routine",
      description: "For 3 times a week",
      exercises: [
        { id: 1, name: "Squat" },
        { id: 2, name: "Bench Press" },
      ],
    },
  ]);

  const handleAddRoutine = (routineData) => {
    const newRoutine = {
      ...routineData,
      id: Date.now(),
    };
    setRoutines((prev) => [...prev, newRoutine]);
    setShowForm(false);
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
          onSave={handleAddRoutine}
          onCancel={() => setShowForm(false)}
        />
      )}

      <RoutineList routines={routines} />
    </div>
  );
}

export default Routines;
