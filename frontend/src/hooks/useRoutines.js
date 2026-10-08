import { useState, useEffect, useCallback } from "react";
import routineService from "../services/routineService";
import exerciseService from "../services/exerciseService";
import { getErrorMessage } from "../services/api";

const EMPTY_FILTERS = {
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
};

export function useRoutines(mode, currentUser) {
  const [activeTab, setActiveTab] = useState(mode === "community" ? "community" : "my");
  const [showForm, setShowForm] = useState(mode === "create");
  const [routines, setRoutines] = useState([]);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [sortBy, setSortBy] = useState("name-asc");
  const [exercises, setExercises] = useState([]);
  const [muscularGroupSelected, setMuscularGroupSelected] = useState(EMPTY_FILTERS);

  const handleOnCheckbox = (e) => {
    const { value, checked } = e.target;
    setMuscularGroupSelected((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  const fetchRoutines = useCallback(() => {
    routineService
      .list()
      .then(setRoutines)
      .catch((error) => console.error("Error al cargar las rutinas:", error));
  }, []);

  useEffect(() => {
    fetchRoutines();
    exerciseService
      .list()
      .then(setExercises)
      .catch((err) => console.error("Error al cargar ejercicios:", err));
  }, [currentUser?.id, fetchRoutines]);

  const handleDelete = (id) => {
    if (!window.confirm("¿Estás seguro de que querés eliminar esta rutina?")) {
      return;
    }
    routineService
      .remove(id)
      .then(() => {
        setRoutines((prev) => prev.filter((routine) => routine.id !== id));
        alert("Rutina eliminada correctamente");
      })
      .catch((error) => {
        console.error("Error al eliminar la rutina:", error);
        alert(getErrorMessage(error, "Ocurrió un error al intentar eliminar la rutina"));
      });
  };

  // El dueño de la rutina lo define el backend a partir del token
  const onSubmit = (values) => {
    routineService
      .create(values)
      .then(() => {
        alert("¡Rutina creada con éxito!");
        fetchRoutines();
        setShowForm(false);
        setActiveTab("my");
      })
      .catch((error) => {
        console.error("Error al crear la rutina:", error);
        alert(getErrorMessage(error, "Error al crear la rutina. Verificá la conexión."));
      });
  };

  const onSubmitEdit = (values) => {
    if (editingRoutine) {
      routineService
        .update(editingRoutine.id, values)
        .then(() => {
          alert("Rutina actualizada correctamente");
          fetchRoutines();
          setShowForm(false);
          setEditingRoutine(null);
        })
        .catch((error) => {
          console.error("Error al editar:", error);
          alert(getErrorMessage(error, "No se pudo actualizar la rutina."));
        });
    }
  };

  const handleSaveCommunityRoutine = (communityRoutine) => {
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
    };

    routineService
      .create(newRoutineData)
      .then(() => {
        alert(`¡Guardaste "${communityRoutine.name}" en tus rutinas!`);
        fetchRoutines();
        setActiveTab("my");
      })
      .catch((error) => {
        console.error("Error al guardar rutina de la comunidad:", error);
        alert(getErrorMessage(error, "No se pudo guardar la rutina."));
      });
  };

  const currentUserId = currentUser?.id;

  const myRoutines = routines.filter((r) => {
    if (!r.creatorId) return true;
    return r.creatorId === currentUserId;
  });

  const communityRoutines = routines.filter((r) => {
    const isCommunity = r.creatorId && r.creatorId !== currentUserId;
    if (!isCommunity) return false;

    const activeFilters = Object.keys(muscularGroupSelected).filter(
      (key) => muscularGroupSelected[key]
    );

    if (activeFilters.length === 0) return true;

    if (!r.RoutineExercises) return false;

    return r.RoutineExercises.some((re) => {
      if (!re.Exercise || !re.Exercise.muscleGroup) return false;
      return activeFilters.includes(re.Exercise.muscleGroup.toLowerCase());
    });
  });

  const sortedCommunityRoutines = [...communityRoutines].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    if (sortBy === "date-desc") {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return (dateB || b.id || 0) - (dateA || a.id || 0);
    }
    if (sortBy === "date-asc") {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return (dateA || a.id || 0) - (dateB || b.id || 0);
    }
    return 0;
  });

  return {
    activeTab,
    setActiveTab,
    showForm,
    setShowForm,
    editingRoutine,
    setEditingRoutine,
    exercises,
    myRoutines,
    sortedCommunityRoutines,
    sortBy,
    setSortBy,
    muscularGroupSelected,
    handleOnCheckbox,
    handleDelete,
    onSubmit,
    onSubmitEdit,
    handleSaveCommunityRoutine,
  };
}
