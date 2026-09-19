import { useState, useEffect, useRef } from "react";
import "./ExerciseForm.css";

const ExerciseForm = ({ initialData, onSave, onCancel }) => {
  // 1. Estados locales para los campos y control de props
  const [prevInitialData, setPrevInitialData] = useState(initialData);
  const [name, setName] = useState(initialData ? initialData.name : "");
  const [description, setDescription] = useState(
    initialData ? initialData.description : ""
  );
  const [muscleGroup, setMuscleGroup] = useState(
    initialData ? initialData.muscleGroup : ""
  );

  // 2. Referencia para el foco del input
  const inputRef = useRef(null);

  // Auto-foco en el campo Nombre al montar el componente
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Sincronización de estado si 'initialData' cambia desde el padre mientras el componente sigue montado
  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setName(initialData ? initialData.name : "");
    setDescription(initialData ? initialData.description : "");
    setMuscleGroup(initialData ? initialData.muscleGroup : "");
  }

  // 3. Manejo del envío del formulario
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

  // 4. Manejo de cancelación / reseteo
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
            <option value="abdomen">Abdomen</option>
            <option value="cardio">Cardio</option>
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
};

export default ExerciseForm;