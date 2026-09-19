import { useState } from "react";
import SelectedExerciseCard from "../SelectedExerciseCard/SelectedExerciseCard";
import "./SelectedExercisesList.css";

const SelectedExercisesList = ({
    selected,
    exercises,
    onToggle,
    onUpdateConfig,
    onAddSet,
    onRemoveSet,
    onUpdateSet,
    onReorder
}) => {
    const [expandedIds, setExpandedIds] = useState([]);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const toggleExpand = (id) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        );
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (dragOverIndex !== index) setDragOverIndex(index);
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== targetIndex && onReorder) {
            onReorder(draggedIndex, targetIndex);
        }
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    if (selected.length === 0) {
        return (
            <div className="empty-selected-state">
                <p>Aún no agregaste ejercicios a la rutina.</p>
                <p className="empty-hint">Hacé clic en el botón de abajo para explorar y agregar ejercicios.</p>
            </div>
        );
    }

    return (
        <div className="selected-exercises-list">
            {selected.map((selItem, index) => {
                const exObj = exercises.find((e) => e.id === selItem.id);

                return (
                    <SelectedExerciseCard
                        key={selItem.id}
                        routineItem={selItem}
                        exerciseDef={exObj}
                        index={index}
                        isExpanded={expandedIds.includes(selItem.id)}
                        isDragging={draggedIndex === index}
                        isDragOver={dragOverIndex === index}
                        onToggleExpand={() => toggleExpand(selItem.id)}
                        onToggleRemove={() => onToggle(selItem.id)}
                        onUpdateConfig={onUpdateConfig}
                        onAddSet={onAddSet}
                        onRemoveSet={onRemoveSet}
                        onUpdateSet={onUpdateSet}
                        dragHandlers={{
                            onDragStart: (e) => handleDragStart(e, index),
                            onDragOver: (e) => handleDragOver(e, index),
                            onDrop: (e) => handleDrop(e, index),
                            onDragEnd: handleDragEnd
                        }}
                    />
                );
            })}
        </div>
    );
};

export default SelectedExercisesList;