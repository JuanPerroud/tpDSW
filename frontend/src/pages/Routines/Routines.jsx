// src/pages/Routines.jsx
import { useState, useEffect } from "react";
import RoutineList from "../../components/routines/RoutineList/RoutineList";
import RoutineForm from "../../components/routines/RoutineForm/RoutineForm";
import axios from "axios";
import "./Routines.css";

const API_URL = "http://localhost:3000/api/routine";
const EXERCISE_API = "http://localhost:3000/api/exercise";

function Routines({ mode = "my", currentUser }) {
  const [activeTab, setActiveTab] = useState(mode === "community" ? "community" : "my");
  const [showForm, setShowForm] = useState(mode === "create");
  const [routines, setRoutines] = useState([]);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [exercises, setExercises] = useState([]);



  const [prevMode, setPrevMode] = useState(mode);
  if (prevMode !== mode) {
    setPrevMode(mode);
    if (mode === "create") {
      setShowForm(true);
      setEditingRoutine(null);
    } else if (mode === "community") {
      setActiveTab("community");
      setShowForm(false);
    } else {
      setActiveTab("my");
      setShowForm(false);
    }
  }

  const fetchRoutines = () => {
    axios
      .get(API_URL)
      .then((response) => {
        setRoutines(response.data || []);
      })
      .catch((error) => {
        console.error("Error al cargar las rutinas:", error);
      });
  };

  useEffect(() => {
    fetchRoutines();
    axios
      .get(EXERCISE_API)
      .then((res) => setExercises(res.data || []))
      .catch((err) => console.error("Error al cargar ejercicios:", err));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("¿Estás seguro de que querés eliminar esta rutina?")) {
      return;
    }
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        setRoutines((prev) => prev.filter((routine) => routine.id !== id));
        alert("Rutina eliminada correctamente");
      })
      .catch((error) => {
        console.error("Error al eliminar la rutina:", error);
        alert("Ocurrió un error al intentar eliminar la rutina");
      });
  };

  const onSubmit = (values) => {
    const payload = {
      ...values,
      creatorId: currentUser?.id || null,
    };

    axios
      .post(API_URL, payload)
      .then((response) => {
        alert("¡Rutina creada con éxito!");
        setRoutines((prev) => [...prev, response.data]);
        setShowForm(false);
        setActiveTab("my");
      })
      .catch((error) => {
        console.error("Error al crear la rutina:", error);
        alert("Error al crear la rutina. Verificá la conexión.");
      });
  };

  const handleEditClick = (routine) => {
    setEditingRoutine(routine);
    setShowForm(true);
  };

  const onSubmitEdit = (values) => {
    if (editingRoutine) {
      axios
        .put(`${API_URL}/${editingRoutine.id}`, values)
        .then(() => {
          alert("Rutina actualizada correctamente");
          setRoutines((prev) =>
            prev.map((r) => (r.id === editingRoutine.id ? { ...r, ...values } : r))
          );
          setShowForm(false);
          setEditingRoutine(null);
        })
        .catch((error) => console.error("Error al editar:", error));
    }
  };

  const handleSaveCommunityRoutine = (communityRoutine) => {
    // Preparar RoutineExercises eliminando IDs para que se creen como nuevos registros
    const newRoutineExercises = (communityRoutine.RoutineExercises || []).map((re) => ({
      exerciseId: re.exerciseId,
      orderIndex: re.orderIndex,
      restSeconds: re.restSeconds,
      ExerciseSets: (re.ExerciseSets || []).map((set) => ({
        setNumber: set.setNumber,
        reps: set.reps,
        weightKg: set.weightKg,
      })),
    }));

    const newRoutineData = {
      name: `${communityRoutine.name} (Guardada)`,
      description: communityRoutine.description || "Rutina guardada de la comunidad",
      RoutineExercises: newRoutineExercises,
      creatorId: currentUser?.id || null,
    };

    axios
      .post(API_URL, newRoutineData)
      .then((response) => {
        alert(`¡Guardaste "${communityRoutine.name}" en tus rutinas!`);
        setRoutines((prev) => [...prev, response.data]);
        setActiveTab("my");
      })
      .catch((error) => {
        console.error("Error al guardar rutina de la comunidad:", error);
        alert("No se pudo guardar la rutina.");
      });
  };

  // Filtrado de rutinas
  const currentUserId = currentUser?.id;

  const myRoutines = routines.filter((r) => {
    if (!r.creatorId) return true; // Si no tiene creador explícito, se asigna a mis rutinas
    return r.creatorId === currentUserId;
  });

  const communityRoutines = routines.filter((r) => {
    return r.creatorId && r.creatorId !== currentUserId;
  });

  return (
    <div className="routines-page">
      <div className="routines-header">
        <div className="header-title-section">
          <h1>Gestión de Rutinas</h1>
          <p>Creá, organizá y explorá rutinas de entrenamiento</p>
        </div>

        <div className="routines-tabs">
          <button
            className={`tab-btn ${activeTab === "my" && !showForm ? "active" : ""}`}
            onClick={() => {
              setActiveTab("my");
              setShowForm(false);
              setEditingRoutine(null);
            }}
          >
            📋 Mis Rutinas ({myRoutines.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "community" && !showForm ? "active" : ""}`}
            onClick={() => {
              setActiveTab("community");
              setShowForm(false);
              setEditingRoutine(null);
            }}
          >
            🌐 Comunidad ({communityRoutines.length})
          </button>
          <button
            className={`tab-btn btn-new-routine ${showForm ? "active" : ""}`}
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditingRoutine(null);
              } else {
                setShowForm(true);
              }
            }}
          >
            {showForm ? "✖️ Cerrar Formulario" : "➕ Nueva Rutina"}
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="routine-form-wrapper">
          <RoutineForm
            exercisesAvailable={exercises}
            initialValues={editingRoutine}
            onSave={editingRoutine ? onSubmitEdit : onSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingRoutine(null);
            }}
          />
        </div>
      ) : activeTab === "my" ? (
        <section className="routines-section">
          <div className="section-header">
            <h2>Tus Rutinas Personales y Guardadas</h2>
            <p>Rutinas que creaste o agregaste a tu colección personal.</p>
          </div>
          <RoutineList
            routines={myRoutines}
            isMine={true}
            onUpdate={handleEditClick}
            onDelete={handleDelete}
          />
        </section>
      ) : (
        <section className="routines-section">
          <div className="section-header">
            <h2>Rutinas de la Comunidad</h2>
            <p>Descubrí rutinas creadas por otros atletas y guardalas en tu perfil.</p>
          </div>
          <RoutineList
            routines={communityRoutines}
            isMine={false}
            onSaveToMine={handleSaveCommunityRoutine}
          />
        </section>
      )}
    </div>
  );
}

export default Routines;
