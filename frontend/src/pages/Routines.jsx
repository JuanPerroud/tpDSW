// src/pages/Routines.jsx
import { useState } from "react";
import RoutineList from "../components/routines/RoutineList";
import RoutineForm from "../components/routines/RoutineForm";

function Routines() {
  const [showForm, setShowForm] = useState(false);

  const testExercises = [
    { id: 1, name: "Squat", muscleGroup: "legs" },
    { id: 2, name: "Bench Press", muscleGroup: "chest" },
    { id: 3, name: "Pull-ups", muscleGroup: "back" },
  ];

  const testRoutines = [
    {
      id: 1,
      name: "Full Body Routine",
      description: "For 3 times a week",
      exercises: [
        { id: 1, name: "Squat" },
        { id: 2, name: "Bench Press" },
      ],
    },
  ];

  return (
    <div className="routines-page">
      <div className="routines-header">
        <h1>My Routines</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Routine"}
        </button>
      </div>

      {showForm && <RoutineForm exercisesAvailable={testExercises} />}

      <RoutineList routines={testRoutines} />
    </div>
  );
}

export default Routines;
