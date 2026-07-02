import { useState } from "react";

function ExerciseForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");

  return (
    <div className="exercise-form">
      <h2>New Exercise</h2>

      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="E.g: Bench press"
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="E.g: 3 sets x 10 reps"
      />

      <label>Muscle group</label>
      <select
        value={muscleGroup}
        onChange={(e) => setMuscleGroup(e.target.value)}
      >
        <option value="">Select...</option>
        <option value="chest">Chest</option>
        <option value="back">Back</option>
        <option value="legs">Legs</option>
        <option value="biceps">Biceps</option>
        <option value="triceps">Triceps</option>
        <option value="core">Core</option>
      </select>

      <button>Save</button>
    </div>
  );
}

export default ExerciseForm;
