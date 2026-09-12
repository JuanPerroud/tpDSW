import { useState, useEffect, useRef } from "react";
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
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
      <h2>{initialData ? "Editar Ejercicio" : "Nuevo Ejercicio"}</h2>

      <div className="exercise-form-fields">
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            ref={inputRef}
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ejemplo: Press banca inclinado"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ejemplo: Banco inclinado a 30 grados, al fallo"
          />
        </div>

        <div className="form-group">
          <label htmlFor="muscleGroup">Grupo muscular</label>
          <select
            id="muscleGroup"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            required
          >
            <option value="">Seleccionar...</option>
            <option value="pecho">Pecho</option>
            <option value="espalda">Espalda</option>
            <option value="hombros">Hombros</option>
            <option value="cuadriceps">Cuádriceps</option>
            <option value="isquiotibiales">Isquiotibiales</option>
            <option value="gluteos">Glúteos</option>
            <option value="gemelos">Gemelos</option>
            <option value="biceps">Bíceps</option>
            <option value="triceps">Tríceps</option>
            <option value="antebrazos">Antebrazos</option>
            <option value="abdomen">Abdomen / Core</option>
            <option value="cardio">Cardio</option>
            <option value="otro">Otro</option>
          </select>
        </div>


      </div>

      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default ExerciseForm;
