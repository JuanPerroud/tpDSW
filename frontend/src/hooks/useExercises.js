import { useState, useEffect } from "react";
import exerciseService from "../services/exerciseService";
import { getErrorMessage } from "../services/api";
import { useConfirmModal } from "./useConfirmModal";

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

export function useExercises(currentUser) {
  const [exercises, setExercises] = useState([]);
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [muscularGroupSelected, setMuscularGroupSelected] = useState(EMPTY_FILTERS);

  const fetchExercises = () => {
    exerciseService
      .list()
      .then(setExercises)
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
    setMuscularGroupSelected(EMPTY_FILTERS);
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
    const { id, name, description, muscleGroup } = exerciseData;
    const data = { name, description, muscleGroup };
    const request = id
      ? exerciseService.update(id, data)
      : exerciseService.create(data);

    request
      .then(() => {
        fetchExercises();
        if (onSuccess) onSuccess();
      })
      .catch((err) => {
        console.error("Error al guardar ejercicio:", err);
        alert(getErrorMessage(err, "No se pudo guardar el ejercicio."));
      });
  };

  const { modalProps: confirmModalProps, requestConfirm } = useConfirmModal();

  const deleteExercise = (id, onSuccess) => {
    requestConfirm(
      () => {
        exerciseService
          .remove(id)
          .then(() => {
            fetchExercises();
            if (onSuccess) onSuccess();
          })
          .catch((err) => {
            console.error("Error al eliminar ejercicio:", err);
            alert(getErrorMessage(err, "No se pudo eliminar el ejercicio."));
          });
      },
      {
        title: "Eliminar ejercicio",
        message: "¿Estás seguro de que querés eliminar este ejercicio? Esta acción no se puede deshacer.",
        confirmLabel: "Eliminar",
      }
    );
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
    if (sortOrder === "name-asc" || sortOrder === "asc") return (a.name || "").localeCompare(b.name || "");
    if (sortOrder === "name-desc" || sortOrder === "desc") return (b.name || "").localeCompare(a.name || "");
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
    confirmModalProps,
  };
}
