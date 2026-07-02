// src/pages/Exercises.jsx
import { useState } from "react";
import ExerciseList from "../components/exercises/ExerciseList";
import ExerciseForm from "../components/exercises/ExerciseForm";

function Exercises() {
  const [showForm, setShowForm] = useState(false);

  const testExercises = [
    { id: 1, name: "Squat", description: "3x12", muscleGroup: "legs" },
    { id: 2, name: "Bench Press", description: "4x8", muscleGroup: "chest" },
  ];

  return (
    <div className="exercises-page">
      <div className="exercises-header">
        <h1>My Exercises</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Exercise"}
        </button>
      </div>

      {showForm && <ExerciseForm />}

      <ExerciseList exercises={testExercises} />
    </div>
  );
}

export default Exercises;
