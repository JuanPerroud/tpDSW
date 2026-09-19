import MuscleGroupLabels from "../../constants/MuscleGroupLabels";
import SortOptions from "../../constants/SortOptions";

// Se definen los grupos musculares una sola vez fuera del componente para evitar re-cálculos en cada render
const DEFAULT_MUSCLE_GROUPS = Object.entries(MuscleGroupLabels).map(([value, label]) => ({
    value,
    label
}));

const FilterSidebar = ({
    title = "Filtros y Orden",
    className = "filter-sidebar",
    idPrefix = "filter",
    muscularGroupSelected,
    handleOnCheckbox,
    sortBy,
    setSortBy,
    sortOptions = SortOptions,
    muscleGroups = DEFAULT_MUSCLE_GROUPS,
}) => {
    return (
        <aside className={className}>
            <h3>{title}</h3>
            <div className="filter-group">
                <h4>Grupo Muscular</h4>
                <div className="filters-container">
                    {muscleGroups.map(({ value, label }) => (
                        <div className="checkbox-container" key={value}>
                            <input
                                onChange={handleOnCheckbox}
                                type="checkbox"
                                name="muscularGroup"
                                value={value}
                                id={`${idPrefix}-${value}`}
                                checked={muscularGroupSelected[value] || false}
                            />
                            <label htmlFor={`${idPrefix}-${value}`}>{label}</label>
                        </div>
                    ))}
                </div>

                <div className="order-selector">
                    <label htmlFor={`${idPrefix}-sort`}>Ordenar por: </label>
                    <select
                        id={`${idPrefix}-sort`}
                        onChange={(e) => setSortBy(e.target.value)}
                        value={sortBy}
                    >
                        {sortOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;