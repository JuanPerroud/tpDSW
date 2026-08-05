import { useState } from "react";
import "./ExerciseForm.css";

function ExerciseForm({ initialData, onSave, onCancel }) {
  const [prevInitialData, setPrevInitialData] = useState(initialData);
  const [name, setName] = useState(initialData ? initialData.name : "");
  const [description, setDescription] = useState(
    initialData ? initialData.description : ""
  );
  const [muscleGroup, setMuscleGroup] = useState(
    initialData ? initialData.muscleGroup : ""
  );
  const [sets, setSets] = useState(initialData ? (initialData.sets ?? 3) : 3);
  const [reps, setReps] = useState(initialData ? (initialData.reps ?? 10) : 10);

  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setName(initialData ? initialData.name : "");
    setDescription(initialData ? initialData.description : "");
    setMuscleGroup(initialData ? initialData.muscleGroup : "");
    setSets(initialData ? (initialData.sets ?? 3) : 3);
    setReps(initialData ? (initialData.reps ?? 10) : 10);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...(initialData && initialData.id ? { id: initialData.id } : {}),
        name,
        description,
        muscleGroup,
        sets: Number(sets),
        reps: Number(reps),
      });
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setName("");
      setDescription("");
      setMuscleGroup("");
      setSets(3);
      setReps(10);
    }
  };

  return (
    <form className="exercise-form" onSubmit={handleSubmit}>
      <h2>{initialData ? "Edit Exercise" : "New Exercise"}</h2>

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

        <div className="form-group form-row">
          <div className="form-group">
            <label htmlFor="sets">Series (sets)</label>
            <input
              id="sets"
              type="number"
              min="1"
              max="20"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reps">Repeticiones (reps)</label>
            <input
              id="reps"
              type="number"
              min="1"
              max="100"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ExerciseForm;
