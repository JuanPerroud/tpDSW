import { useState } from "react";
import "./ExerciseForm.css";

function ExerciseForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, description, muscleGroup });
  };

  return (
    <form className="exercise-form" onSubmit={handleSubmit}>
      <h2>New Exercise</h2>

      <div className="exercise-form-fields">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g: Bench press"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g: 3 sets x 10 reps"
          />
        </div>

        <div className="form-group">
          <label htmlFor="muscleGroup">Muscle group</label>
          <select
            id="muscleGroup"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            required
          >
            <option value="">Select...</option>
            <option value="chest">Chest</option>
            <option value="back">Back</option>
            <option value="legs">Legs</option>
            <option value="biceps">Biceps</option>
            <option value="triceps">Triceps</option>
            <option value="core">Core</option>
          </select>
        </div>
      </div>

      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button type="reset" className="btn btn-secondary">
          Clear
        </button>
      </div>
    </form>
  );
}

export default ExerciseForm;
