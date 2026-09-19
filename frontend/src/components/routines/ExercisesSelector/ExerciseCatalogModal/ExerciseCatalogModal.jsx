import { useState } from "react";
import MuscleGroupLabels from "../../../../constants/MuscleGroupLabels";
import SearchBar from "../../../Shared/SearchBar";
import "./ExerciseCatalogModal.css";

const ExerciseCatalogModal = ({ isOpen, onClose, exercises, selected, onToggle }) => {
    const [catalogSearch, setCatalogSearch] = useState("");
    const [catalogMuscle, setCatalogMuscle] = useState("all");

    if (!isOpen) return null;

    const selectedIds = selected.map((s) => s.id);

    const filteredCatalogExercises = exercises.filter((ex) => {
        const matchesSearch = ex.name.toLowerCase().includes(catalogSearch.toLowerCase());
        const matchesMuscle =
            catalogMuscle === "all" ||
            (ex.muscleGroup && ex.muscleGroup.toLowerCase() === catalogMuscle.toLowerCase());
        return matchesSearch && matchesMuscle;
    });

    return (
        <div className="catalog-modal-overlay" onClick={onClose}>
            <div className="catalog-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="catalog-modal-header">
                    <div>
                        <h4>➕ Agregar Ejercicios</h4>
                        <p className="catalog-modal-subtitle">
                            Seleccioná los ejercicios en el orden que quieras sumarlos a la rutina
                        </p>
                    </div>
                    <button type="button" className="btn-close-modal" onClick={onClose}>✖</button>
                </div>

                <div className="catalog-filters">
                    <SearchBar
                        onSearch={setCatalogSearch}
                        placeholder="🔍 Buscar ejercicio por nombre..."
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
                    </select>
                </div>

                <div className="catalog-exercises-grid">
                    {filteredCatalogExercises.length === 0 ? (
                        <p className="no-catalog-results">No se encontraron ejercicios con los filtros seleccionados.</p>
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
                                                {MuscleGroupLabels[ex.muscleGroup] || ex.muscleGroup}
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

                <div className="catalog-modal-footer">
                    <span className="catalog-count-info">{selected.length} ejercicio(s) en la rutina</span>
                    <button type="button" className="btn btn-primary" onClick={onClose}>Listo</button>
                </div>
            </div>
        </div>
    );
};

export default ExerciseCatalogModal;