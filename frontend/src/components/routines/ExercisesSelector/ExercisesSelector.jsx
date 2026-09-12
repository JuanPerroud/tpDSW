import { useState } from "react";
import "./ExercisesSelector.css";

const MUSCLE_GROUP_LABELS = {
  cuadriceps: "Cuádriceps",
  isquiotibiales: "Isquiotibiales",
  gluteos: "Glúteos",
  gemelos: "Gemelos",
  calves: "Gemelos",
  legs: "Piernas",
  piernas: "Piernas",
  chest: "Pecho",
  pecho: "Pecho",
  back: "Espalda",
  espalda: "Espalda",
  biceps: "Bíceps",
  triceps: "Tríceps",
  shoulders: "Hombros",
  shoulder: "Hombros",
  hombros: "Hombros",
  antebrazos: "Antebrazos",
  core: "Abdomen",
  abdomen: "Abdomen",
  cardio: "Cardio",
  other: "Otro",
  otro: "Otro",
};

function ExercisesSelector({
  exercises = [],
  selected = [],
  onToggle,
  onUpdateConfig,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
  onReorder,
}) {
  // Estado para acordeón (IDs de ejercicios desplegados)
  const [expandedIds, setExpandedIds] = useState([]);
  
  // Estado para modal de catálogo de ejercicios
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogMuscle, setCatalogMuscle] = useState("all");

  // Estado para Drag & Drop
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const selectedIds = selected.map((s) => s.id);

  // Alternar acordeón para un ejercicio
  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Handlers para Drag & Drop
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
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

  // Filtro de ejercicios en el catálogo
  const filteredCatalogExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesMuscle =
      catalogMuscle === "all" ||
      (ex.muscleGroup && ex.muscleGroup.toLowerCase() === catalogMuscle.toLowerCase());
    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="exercise-selector">
      <div className="selector-header">
        <h3>Ejercicios de la rutina</h3>
        <span className="selector-subtitle">
          Arrastrá los ejercicios para reordenar o tocá la flecha para ver series y pesos
        </span>
      </div>

      {/* Lista de Ejercicios Seleccionados (Reordenables y Acordeón) */}
      <div className="selected-exercises-list">
        {selected.length === 0 ? (
          <div className="empty-selected-state">
            <p>Aún no agregaste ejercicios a la rutina.</p>
            <p className="empty-hint">Hacé clic en el botón de abajo para explorar y agregar ejercicios.</p>
          </div>
        ) : (
          selected.map((selItem, index) => {
            const exObj = exercises.find((e) => e.id === selItem.id);
            const name = exObj ? exObj.name : `Ejercicio #${selItem.id}`;
            const muscleGroup = exObj ? exObj.muscleGroup : null;
            const isExpanded = expandedIds.includes(selItem.id);
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <div
                key={selItem.id}
                className={`selected-exercise-card ${isExpanded ? "expanded" : ""} ${
                  isDragging ? "dragging" : ""
                } ${isDragOver ? "drag-over" : ""}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                {/* Cabecera del Ejercicio (Nombre + Flecha + Acciones) */}
                <div className="exercise-card-header">
                  <div className="drag-handle" title="Arrastrar para cambiar el orden">
                    ⠿
                  </div>
                  <span className="exercise-order-badge">#{index + 1}</span>

                  <div
                    className="exercise-info-toggle"
                    onClick={() => toggleExpand(selItem.id)}
                    title={isExpanded ? "Ocultar detalle de series" : "Ver detalle de series"}
                  >
                    <span className="exercise-name">{name}</span>
                    {muscleGroup && (
                      <span className="group-tag">
                        {MUSCLE_GROUP_LABELS[muscleGroup] || muscleGroup}
                      </span>
                    )}
                  </div>

                  <div className="card-header-actions">
                    <button
                      type="button"
                      className="btn-toggle-accordion"
                      onClick={() => toggleExpand(selItem.id)}
                      title={isExpanded ? "Contraer" : "Desplegar series y pesos"}
                    >
                      {isExpanded ? "▲" : "▼"}
                    </button>
                    <button
                      type="button"
                      className="btn-remove-exercise"
                      onClick={() => onToggle(selItem.id)}
                      title="Quitar ejercicio de la rutina"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Acordeón Desplegable (Detalle de Series, Reps, Peso y Descanso) */}
                {isExpanded && (
                  <div className="exercise-config advanced-config">
                    <div className="config-header">
                      <label>
                        Descanso entre series (seg):
                        <input
                          type="number"
                          min="0"
                          step="15"
                          value={selItem.restSeconds}
                          onChange={(e) =>
                            onUpdateConfig(selItem.id, "restSeconds", parseInt(e.target.value) || 0)
                          }
                        />
                      </label>
                    </div>

                    <div className="sets-list">
                      {selItem.sets.map((set, setIdx) => (
                        <div key={setIdx} className="set-row">
                          <span className="set-number">Serie {setIdx + 1}</span>
                          <label>
                            Reps:
                            <input
                              type="number"
                              min="1"
                              value={set.reps}
                              onChange={(e) =>
                                onUpdateSet(selItem.id, setIdx, "reps", parseInt(e.target.value) || 0)
                              }
                            />
                          </label>
                          <label>
                            Peso (Kg):
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              placeholder="0"
                              value={set.weightKg}
                              onChange={(e) =>
                                onUpdateSet(selItem.id, setIdx, "weightKg", e.target.value)
                              }
                            />
                          </label>
                          {selItem.sets.length > 1 && (
                            <button
                              type="button"
                              className="btn-remove-set"
                              onClick={() => onRemoveSet(selItem.id, setIdx)}
                              title="Eliminar Serie"
                            >
                              ❌
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="btn-add-set"
                      onClick={() => onAddSet(selItem.id)}
                    >
                      ➕ Añadir Serie
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Botón para Abrir Catálogo de Ejercicios */}
      <button
        type="button"
        className="btn-open-catalog"
        onClick={() => setIsCatalogOpen(true)}
      >
        ➕ Agregar ejercicio
      </button>

      {/* Modal / Selector de Catálogo de Ejercicios */}
      {isCatalogOpen && (
        <div className="catalog-modal-overlay" onClick={() => setIsCatalogOpen(false)}>
          <div
            className="catalog-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="catalog-modal-header">
              <div>
                <h4>➕ Agregar Ejercicios</h4>
                <p className="catalog-modal-subtitle">
                  Seleccioná los ejercicios en el orden que quieras sumarlos a la rutina
                </p>
              </div>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setIsCatalogOpen(false)}
              >
                ✖
              </button>
            </div>

            {/* Barra de Búsqueda y Filtro */}
            <div className="catalog-filters">
              <input
                type="text"
                placeholder="🔍 Buscar ejercicio por nombre..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="catalog-search-input"
              />
              <select
                value={catalogMuscle}
                onChange={(e) => setCatalogMuscle(e.target.value)}
                className="catalog-muscle-select"
              >
                <option value="all">Todos los músculos</option>
                <option value="cuadriceps">Cuádriceps</option>
                <option value="isquiotibiales">Isquiotibiales</option>
                <option value="gluteos">Glúteos</option>
                <option value="gemelos">Gemelos</option>
                <option value="pecho">Pecho</option>
                <option value="espalda">Espalda</option>
                <option value="hombros">Hombros</option>
                <option value="biceps">Bíceps</option>
                <option value="triceps">Tríceps</option>
                <option value="abdomen">Abdomen</option>
                <option value="cardio">Cardio</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* Lista de Ejercicios del Catálogo */}
            <div className="catalog-exercises-grid">
              {filteredCatalogExercises.length === 0 ? (
                <p className="no-catalog-results">
                  No se encontraron ejercicios con los filtros seleccionados.
                </p>
              ) : (
                filteredCatalogExercises.map((ex) => {
                  const isSelected = selectedIds.includes(ex.id);
                  const selectedIndex = selected.findIndex((s) => s.id === ex.id);

                  return (
                    <div
                      key={ex.id}
                      className={`catalog-exercise-card ${isSelected ? "already-added" : ""}`}
                      onClick={() => onToggle(ex.id)}
                    >
                      <div className="catalog-card-info">
                        <span className="catalog-exercise-name">{ex.name}</span>
                        {ex.muscleGroup && (
                          <span className="group-tag">
                            {MUSCLE_GROUP_LABELS[ex.muscleGroup] || ex.muscleGroup}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className={`btn-select-catalog ${isSelected ? "selected" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggle(ex.id);
                        }}
                      >
                        {isSelected ? `✓ Agregado (#${selectedIndex + 1})` : "➕ Agregar"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Modal */}
            <div className="catalog-modal-footer">
              <span className="catalog-count-info">
                {selected.length} ejercicio(s) en la rutina
              </span>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsCatalogOpen(false)}
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExercisesSelector;

