// src/pages/Exercises.jsx
import { useState, useEffect, useRef } from "react";
import ExerciseList from "../../components/exercises/ExerciseList";
import ExerciseForm from "../../components/exercises/ExerciseForm";
import axios from "axios";
import "./Exercises.css";

const EXERCISE_API = "http://localhost:3000/api/exercise";

const CATEGORIES = [
  { id: "todos", label: "Todos" },
  { id: "pecho", label: "Pecho" },
  { id: "espalda", label: "Espalda" },
  { id: "hombros", label: "Hombros" },
  { id: "cuadriceps", label: "Cuádriceps" },
  { id: "isquiotibiales", label: "Isquiotibiales" },
  { id: "gluteos", label: "Glúteos" },
  { id: "gemelos", label: "Gemelos" },
  { id: "biceps", label: "Bíceps" },
  { id: "triceps", label: "Tríceps" },
  { id: "antebrazos", label: "Antebrazos" },
  { id: "abdomen", label: "Abdomen" },
  { id: "cardio", label: "Cardio" },
  { id: "otro", label: "Otro" },
];

const FILTER_ALIASES = {
  cuadriceps: ["cuadriceps", "legs", "piernas"],
  isquiotibiales: ["isquiotibiales", "legs", "piernas"],
  gluteos: ["gluteos", "legs", "piernas"],
  gemelos: ["gemelos", "calves", "legs", "piernas"],
  pecho: ["pecho", "chest"],
  espalda: ["espalda", "back"],
  hombros: ["hombros", "shoulder", "shoulders"],
  biceps: ["biceps"],
  triceps: ["triceps"],
  antebrazos: ["antebrazos"],
  abdomen: ["abdomen", "core"],
  cardio: ["cardio"],
  otro: ["otro", "other"],
};

function Exercises() {
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const formRef = useRef(null);

  const [muscularGroupSelected, setMuscularGroupSelected] = useState({
    cuadriceps: false,
    isquiotibiales: false,
    gluteos: false,
    gemelos: false,
    espalda: false,
    hombros: false,
    pecho: false,
    biceps: false,
    triceps: false,
    abdomen: false,
  });

  const fetchExercises = () => {
    axios
      .get(EXERCISE_API)
      .then((res) => setExercises(res.data || []))
      .catch((err) => console.error("Error al cargar ejercicios:", err));
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm, editingExercise]);

  const handleOnCheckbox = (e) => {
    const { value, checked } = e.target;
    setMuscularGroupSelected((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  const resetFilters = () => {
    setMuscularGroupSelected({
      cuadriceps: false,
      isquiotibiales: false,
      gluteos: false,
      gemelos: false,
      espalda: false,
      hombros: false,
      pecho: false,
      biceps: false,
      triceps: false,
      abdomen: false,
    });
  };

  const handleToggleForm = () => {
    if (showForm) {
      setShowForm(false);
      setEditingExercise(null);
    } else {
      setEditingExercise(null);
      setShowForm(true);
    }
  };

  const handleSaveExercise = (exerciseData) => {
    if (exerciseData.id) {
      // Editar existente
      axios
        .put(`${EXERCISE_API}/${exerciseData.id}`, exerciseData)
        .then(() => {
          fetchExercises();
          setShowForm(false);
          setEditingExercise(null);
        })
        .catch((err) => {
          console.error("Error al actualizar ejercicio:", err);
          alert("No se pudo actualizar el ejercicio.");
        });
    } else {
      // Crear nuevo
      axios
        .post(EXERCISE_API, exerciseData)
        .then(() => {
          fetchExercises();
          setShowForm(false);
          setEditingExercise(null);
        })
        .catch((err) => {
          console.error("Error al crear ejercicio:", err);
          alert("No se pudo crear el ejercicio.");
        });
    }
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setShowForm(true);
  };

  const handleDeleteExercise = (id) => {
    if (!window.confirm("¿Estás seguro de que querés eliminar este ejercicio?")) {
      return;
    }
    axios
      .delete(`${EXERCISE_API}/${id}`)
      .then(() => {
        fetchExercises();
        if (editingExercise && editingExercise.id === id) {
          setEditingExercise(null);
          setShowForm(false);
        }
      })
      .catch((err) => {
        console.error("Error al eliminar ejercicio:", err);
        alert("No se pudo eliminar el ejercicio.");
      });
  };

  const activeFilters = Object.keys(muscularGroupSelected).filter(
    (key) => muscularGroupSelected[key]
  );

  const filteredExercises = exercises.filter((ex) => {
    if (activeFilters.length === 0) return true;
    if (!ex.muscleGroup) return false;
    const exGroup = ex.muscleGroup.toLowerCase();
    return activeFilters.some((filterKey) => {
      const allowed = FILTER_ALIASES[filterKey] || [filterKey];
      return allowed.includes(exGroup);
    });
  });

  const sortedExercises = [...filteredExercises].sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) return sortOrder === "asc" ? 1 : -1;
    if (nameA > nameB) return sortOrder === "desc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="exercises-page">
      <div className="exercises-header">
        <h1>Mis Ejercicios</h1>
        <button onClick={handleToggleForm}>
          {showForm ? "Cancelar" : "+ Nuevo Ejercicio"}
        </button>
      </div>

      {showForm && (
        <div ref={formRef} style={{ scrollMarginTop: "20px" }}>
          <ExerciseForm
            key={editingExercise?.id || "new"}
            initialData={editingExercise}
            onSave={handleSaveExercise}
            onCancel={() => {
              setShowForm(false);
              setEditingExercise(null);
            }}
          />
        </div>
      )}

      <div className="exercises-content-layout">
        <aside className="exercises-sidebar">
          <h3>Filtros y Orden</h3>
          <div className="filter-group">
            <h4>Grupo Muscular</h4>
            <div className="filters-container">
              <div className="checkbox-container">
                <input
                  onChange={handleOnCheckbox}
                  type="checkbox"
                  name="muscularGroup"
                  value="cuadriceps"
                  id="ex-cuadriceps"
                  checked={muscularGroupSelected.cuadriceps}
                />
                <label htmlFor="ex-cuadriceps">Cuádriceps</label>
              </div>
              <div className="checkbox-container">
                <input
                  onChange={handleOnCheckbox}
                  type="checkbox"
                  name="muscularGroup"
                  value="isquiotibiales"
                  id="ex-isquiotibiales"
                  checked={muscularGroupSelected.isquiotibiales}
                />
                <label htmlFor="ex-isquiotibiales">Isquiotibiales</label>
              </div>
              <div className="checkbox-container">
                <input
                  onChange={handleOnCheckbox}
                  type="checkbox"
                  name="muscularGroup"
                  value="gluteos"
                  id="ex-gluteos"
                  checked={muscularGroupSelected.gluteos}
                />
                <label htmlFor="ex-gluteos">Glúteos</label>
              </div>
              <div className="checkbox-container">
                <input
                  onChange={handleOnCheckbox}
                  type="checkbox"
                  name="muscularGroup"
                  value="gemelos"
                  id="ex-gemelos"
                  checked={muscularGroupSelected.gemelos}
                />
                <label htmlFor="ex-gemelos">Gemelos</label>
              </div>
              <div className="checkbox-container">
                <input
                  onChange={handleOnCheckbox}
                  type="checkbox"
                  name="muscularGroup"
                  value="pecho"
                  id="ex-pecho"
                  checked={muscularGroupSelected.pecho}
                />
                <label htmlFor="ex-pecho">Pecho</label>
              </div>
              <div className="checkbox-container">
                <input
                  onChange={handleOnCheckbox}
                  type="checkbox"
                  name="muscularGroup"
                  value="espalda"
                  id="ex-espalda"
                  checked={muscularGroupSelected.espalda}
                />
                <label htmlFor="ex-espalda">Espalda</label>
              </div>
              <div className="checkbox-container">
                <input
                  onChange={handleOnCheckbox}
                  type="checkbox"
                  name="muscularGroup"
                  value="hombros"
                  id="ex-hombros"
                  checked={muscularGroupSelected.hombros}
                />
                <label htmlFor="ex-hombros">Hombros</label>
              </div>
              <div className="checkbox-container">
                <input
                  onChange={handleOnCheckbox}
                  type="checkbox"
                  name="muscularGroup"
                  value="biceps"
                  id="ex-biceps"
                  checked={muscularGroupSelected.biceps}
                />
                <label htmlFor="ex-biceps">Bíceps</label>
              </div>
              <div className="checkbox-container">
                <input
                  onChange={handleOnCheckbox}
                  type="checkbox"
                  name="muscularGroup"
                  value="triceps"
                  id="ex-triceps"
                  checked={muscularGroupSelected.triceps}
                />
                <label htmlFor="ex-triceps">Tríceps</label>
              </div>
              <div className="checkbox-container">
                <input
                  onChange={handleOnCheckbox}
                  type="checkbox"
                  name="muscularGroup"
                  value="abdomen"
                  id="ex-abdomen"
                  checked={muscularGroupSelected.abdomen}
                />
                <label htmlFor="ex-abdomen">Abdomen</label>
              </div>
            </div>
            <div className="order-selector">
              <label htmlFor="ex-sort">Ordenar por nombre: </label>
              <select id="ex-sort" onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                <option value="desc">A-Z (Menor a Mayor)</option>
                <option value="asc">Z-A (Mayor a menor)</option>
              </select>
            </div>
          </div>
        </aside>

        <main className="exercises-main">
          <ExerciseList
            exercises={sortedExercises}
            totalCount={exercises.length}
            onResetFilter={resetFilters}
            onEdit={handleEditExercise}
            onDelete={handleDeleteExercise}
          />
        </main>
      </div>
    </div>
  );
}

export default Exercises;
