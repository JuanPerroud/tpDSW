import { useState, useEffect } from "react";
import axios from "axios";

const EXERCISE_API = "http://localhost:3000/api/exercise";

export function useExercises(currentUser) {
  const userId = currentUser?.id;
  const [exercises, setExercises] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
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
    const url = userId
      ? `${EXERCISE_API}?userId=${userId}`
      : EXERCISE_API;
    axios
      .get(url)
      .then((res) => setExercises(res.data || []))
      .catch((err) => console.error("Error al cargar ejercicios:", err));
  };

  useEffect(() => {
    fetchExercises();
  }, []);

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

  // Determina si el usuario actual puede editar/eliminar un ejercicio
  const canModifyExercise = (exercise) => {
    if (!currentUser || !exercise) return false;
    // Admin puede modificar ejercicios globales (públicos)
    if (exercise.isPublic) return currentUser.isAdmin === true;
    // Usuario común solo puede modificar sus propios ejercicios privados
    return exercise.creatorId === currentUser.id;
  };

  const saveExercise = (exerciseData, onSuccess) => {
    const dataToSend = { ...exerciseData, userId };
    const request = exerciseData.id
      ? axios.put(`${EXERCISE_API}/${exerciseData.id}`, dataToSend)
      : axios.post(EXERCISE_API, dataToSend);

    request
      .then(() => {
        fetchExercises();
        if (onSuccess) onSuccess();
      })
      .catch((err) => {
        console.error("Error al guardar ejercicio:", err);
        const msg = err.response?.data?.mensaje || "No se pudo guardar el ejercicio.";
        alert(msg);
      });
  };

  const deleteExercise = (id, onSuccess) => {
    if (!window.confirm("¿Estás seguro de que querés eliminar este ejercicio?")) {
      return;
    }
    axios
      .delete(`${EXERCISE_API}/${id}?userId=${userId}`)
      .then(() => {
        fetchExercises();
        if (onSuccess) onSuccess();
      })
      .catch((err) => {
        console.error("Error al eliminar ejercicio:", err);
        const msg = err.response?.data?.mensaje || "No se pudo eliminar el ejercicio.";
        alert(msg);
      });
  };

  const activeFilters = Object.keys(muscularGroupSelected).filter(
    (key) => muscularGroupSelected[key]
  );

  const filteredExercises = exercises.filter((ex) => {
    if (activeFilters.length === 0) return true;
    if (!ex.muscleGroup) return false;
    return activeFilters.includes(ex.muscleGroup.toLowerCase());
  });

  const sortedExercises = [...filteredExercises].sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) return sortOrder === "asc" ? 1 : -1;
    if (nameA > nameB) return sortOrder === "desc" ? 1 : -1;
    return 0;
  });

  return {
    exercises,
    sortedExercises,
    sortOrder,
    setSortOrder,
    muscularGroupSelected,
    handleOnCheckbox,
    resetFilters,
    saveExercise,
    deleteExercise,
    canModifyExercise,
  };
}
