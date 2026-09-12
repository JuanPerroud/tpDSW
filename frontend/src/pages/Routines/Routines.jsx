// src/pages/Routines.jsx
import { useState, useEffect, useRef } from "react";
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
  const [sortOrder, setSortOrder] = useState("desc");
  const [exercises, setExercises] = useState([]);
  const formRef = useRef(null);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm, editingRoutine]);

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

  const handleOnCheckeckbox = (e) => {
    const { value, checked } = e.target;
    setMuscularGroupSelected((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  const handleOrder = (e) => {
    setSortOrder(e.target.value);
  };


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
    const isCommunity = r.creatorId && r.creatorId !== currentUserId;
    if (!isCommunity) return false;

    const activeFilters = Object.keys(muscularGroupSelected).filter(
      (key) => muscularGroupSelected[key]
    );

    // Si no hay filtros activos, mostrar todas
    if (activeFilters.length === 0) return true;

    // Mapa de equivalencias entre filtros y posibles valores en BD
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
      abdomen: ["abdomen", "core"],
    };

    if (!r.RoutineExercises) return false;

    return r.RoutineExercises.some((re) => {
      if (!re.Exercise || !re.Exercise.muscleGroup) return false;
      const exerciseGroup = re.Exercise.muscleGroup.toLowerCase();
      return activeFilters.some((filterKey) => {
        const allowedValues = FILTER_ALIASES[filterKey] || [filterKey];
        return allowedValues.includes(exerciseGroup);
      });
    });
  });

  const sortedCommunityRoutines = [...communityRoutines].sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return sortOrder === "asc" ? 1 : -1;
    } if (nameA > nameB) {
      return sortOrder === "desc" ? 1 : -1;
    }
    return 0;
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
        <div className="routine-form-wrapper" ref={formRef} style={{ scrollMarginTop: "20px" }}>
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
          <div className="routines-content-layout">
            <aside className="routines-sidebar">
              <h3>Ordenar Rutinas</h3>
              <div className="filter-group">
                <h4>Grupo Muscular</h4>
                <div className='filters-container'>
                  <div className='checkbox-container'>
                    <input
                      onChange={handleOnCheckeckbox}
                      type='checkbox'
                      name='muscularGroup'
                      value='cuadriceps'
                      id='cuadriceps'
                    />
                    <label htmlFor='cuadriceps'>Cuádriceps</label>
                  </div>
                  <div className='checkbox-container'>
                    <input
                      onChange={handleOnCheckeckbox}
                      type='checkbox'
                      name='muscularGroup'
                      value='isquiotibiales'
                      id='isquiotibiales'
                    />
                    <label htmlFor='isquiotibiales'>Isquiotibiales</label>
                  </div>
                  <div className='checkbox-container'>
                    <input
                      onChange={handleOnCheckeckbox}
                      type='checkbox'
                      name='muscularGroup'
                      value='gluteos'
                      id='gluteos'
                    />
                    <label htmlFor='gluteos'>Glúteos</label>
                  </div>
                  <div className='checkbox-container'>
                    <input
                      onChange={handleOnCheckeckbox}
                      type='checkbox'
                      name='muscularGroup'
                      value='gemelos'
                      id='gemelos'
                    />
                    <label htmlFor='gemelos'>Gemelos</label>
                  </div>
                  <div className='checkbox-container'>
                    <input
                      onChange={handleOnCheckeckbox}
                      type='checkbox'
                      name='muscularGroup'
                      value='pecho'
                      id='pecho'
                    />
                    <label htmlFor='pecho'>Pecho</label>
                  </div>
                  <div className='checkbox-container'>
                    <input
                      onChange={handleOnCheckeckbox}
                      type='checkbox'
                      name='muscularGroup'
                      value='espalda'
                      id='espalda'
                    />
                    <label htmlFor='espalda'>Espalda</label>
                  </div>
                  <div className='checkbox-container'>
                    <input
                      onChange={handleOnCheckeckbox}
                      type='checkbox'
                      name='muscularGroup'
                      value='hombros'
                      id='hombros'
                    />
                    <label htmlFor='hombros'>Hombros</label>
                  </div>
                  <div className='checkbox-container'>
                    <input
                      onChange={handleOnCheckeckbox}
                      type='checkbox'
                      name='muscularGroup'
                      value='biceps'
                      id='biceps'
                    />
                    <label htmlFor='biceps'>Bíceps</label>
                  </div>
                  <div className='checkbox-container'>
                    <input
                      onChange={handleOnCheckeckbox}
                      type='checkbox'
                      name='muscularGroup'
                      value='triceps'
                      id='triceps'
                    />
                    <label htmlFor='triceps'>Tríceps</label>
                  </div>
                  <div className='checkbox-container'>
                    <input
                      onChange={handleOnCheckeckbox}
                      type='checkbox'
                      name='muscularGroup'
                      value='abdomen'
                      id='abdomen'
                    />
                    <label htmlFor='abdomen'>Abdomen</label>
                  </div>
                </div>
                <div className="order-selector">
                  <label htmlFor="sort">Ordenar por nombre: </label>
                  <select id="sort" onChange={handleOrder} value={sortOrder}>
                    <option value={"desc"}>A-Z (Menor a Mayor)</option>
                    <option value={"asc"}>Z-A (Mayor a menor)</option>
                  </select>
                </div>
                <div className="older-selector">
                  <label htmlFor="sort">Ordenar por fecha: </label>
                  <select id="sort" onChange={handleOrder} value={sortOrder}>
                    <option value={"desc"}>Mas recientes primero</option>
                    <option value={"asc"}>Mas antiguas primero</option>
                  </select>
                </div>

              </div>
            </aside>
            <main className="routines-main">
              <RoutineList
                routines={sortedCommunityRoutines}
                isMine={false}
                onSaveToMine={handleSaveCommunityRoutine}
                handleOnCheckeckbox={handleOnCheckeckbox}
                handleOrder={handleOrder}
              />
              <div className="container-info-selected">

              </div>
            </main>
          </div>
        </section>
      )}
    </div>
  );
}

export default Routines;
