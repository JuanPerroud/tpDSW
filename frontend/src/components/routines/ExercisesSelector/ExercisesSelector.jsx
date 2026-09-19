import { useState } from "react";
import ExerciseCatalogModal from "./ExerciseCatalogModal/ExerciseCatalogModal";
import SelectedExercisesList from "./SelectedExerciseList/SelectedExercisesList";
import "./ExercisesSelector.css";
const ExercisesSelector = ({
    exercises = [],
    selected = [],
    onToggle,
    onUpdateConfig,
    onAddSet,
    onRemoveSet,
    onUpdateSet,
    onReorder,
}) => {
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);

    return (
        <div className="exercise-selector">
            <div className="selector-header">
                <h3>Ejercicios de la rutina</h3>
                <span className="selector-subtitle">
                    Arrastrá los ejercicios para reordenar o tocá la flecha para ver series y pesos
                </span>
            </div>

            <SelectedExercisesList
                selected={selected}
                exercises={exercises}
                onToggle={onToggle}
                onUpdateConfig={onUpdateConfig}
                onAddSet={onAddSet}
                onRemoveSet={onRemoveSet}
                onUpdateSet={onUpdateSet}
                onReorder={onReorder}
            />

            <button
                type="button"
                className="btn-open-catalog"
                onClick={() => setIsCatalogOpen(true)}
            >
                ➕ Agregar ejercicio
            </button>

            <ExerciseCatalogModal
                isOpen={isCatalogOpen}
                onClose={() => setIsCatalogOpen(false)}
                exercises={exercises}
                selected={selected}
                onToggle={onToggle}
            />
        </div>
    );
};

export default ExercisesSelector;