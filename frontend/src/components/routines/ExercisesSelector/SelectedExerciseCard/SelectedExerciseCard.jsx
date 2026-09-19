import MuscleGroupLabels from "../../../../constants/MuscleGroupLabels";
import "./SelectedExerciseCard.css";

const SelectedExerciseCard = ({
    exerciseDef,
    routineItem,
    index,
    isExpanded,
    isDragging,
    isDragOver,
    onToggleExpand,
    onToggleRemove,
    onUpdateConfig,
    onAddSet,
    onRemoveSet,
    onUpdateSet,
    dragHandlers
}) => {
    const name = exerciseDef ? exerciseDef.name : `Ejercicio #${routineItem.id}`;
    const muscleGroup = exerciseDef ? exerciseDef.muscleGroup : null;

    return (
        <div
            className={`selected-exercise-card ${isExpanded ? "expanded" : ""} ${isDragging ? "dragging" : ""} ${isDragOver ? "drag-over" : ""}`}
            draggable
            {...dragHandlers}
        >
            <div className="exercise-card-header">
                <div className="drag-handle" title="Arrastrar para cambiar el orden">⠿</div>
                <span className="exercise-order-badge">#{index + 1}</span>

                <div
                    className="exercise-info-toggle"
                    onClick={onToggleExpand}
                    title={isExpanded ? "Ocultar detalle" : "Ver detalle"}
                >
                    <span className="exercise-name">{name}</span>
                    {muscleGroup && (
                        <span className="group-tag">{MuscleGroupLabels[muscleGroup] || muscleGroup}</span>
                    )}
                </div>

                <div className="card-header-actions">
                    <button type="button" className="btn-toggle-accordion" onClick={onToggleExpand}>
                        {isExpanded ? "▲" : "▼"}
                    </button>
                    <button type="button" className="btn-remove-exercise" onClick={onToggleRemove} title="Quitar ejercicio">
                        🗑️
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="exercise-config advanced-config">
                    <div className="config-header">
                        <label>
                            Descanso entre series (seg):
                            <input
                                type="number"
                                min="0"
                                step="15"
                                value={routineItem.restSeconds}
                                onChange={(e) => onUpdateConfig(routineItem.id, "restSeconds", parseInt(e.target.value) || 0)}
                            />
                        </label>
                    </div>

                    <div className="sets-list">
                        {routineItem.sets.map((set, setIdx) => (
                            <div key={setIdx} className="set-row">
                                <span className="set-number">Serie {setIdx + 1}</span>
                                <label>Reps:
                                    <input
                                        type="number"
                                        min="1"
                                        value={set.reps}
                                        onChange={(e) => onUpdateSet(routineItem.id, setIdx, "reps", parseInt(e.target.value) || 0)}
                                    />
                                </label>
                                <label>Peso (Kg):
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        placeholder="0"
                                        value={set.weightKg}
                                        onChange={(e) => onUpdateSet(routineItem.id, setIdx, "weightKg", e.target.value)}
                                    />
                                </label>
                                {routineItem.sets.length > 1 && (
                                    <button type="button" className="btn-remove-set" onClick={() => onRemoveSet(routineItem.id, setIdx)}>
                                        ❌
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button type="button" className="btn-add-set" onClick={() => onAddSet(routineItem.id)}>
                        ➕ Añadir Serie
                    </button>
                </div>
            )}
        </div>
    );
};

export default SelectedExerciseCard;