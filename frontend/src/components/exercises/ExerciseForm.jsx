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


  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setName(initialData ? initialData.name : "");
    setDescription(initialData ? initialData.description : "");
    setMuscleGroup(initialData ? initialData.muscleGroup : "");

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...(initialData && initialData.id ? { id: initialData.id } : {}),
        name,
        description,
        muscleGroup,
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
            placeholder="Ejemplo: Press banca inclinado"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ejemplo: Banco inclinado a 30 grados, al fallo"
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
