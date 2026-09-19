import { useEffect, useRef } from "react";
import RoutineList from "../../components/Routines/RoutineList/RoutineList";
import RoutineForm from "../../components/Routines/RoutineForm/RoutineForm";
import FilterSidebar from "../../components/shared/FilterSidebar";
import SortOptions from "../../constants/SortOptions";
import { useRoutines } from "../../hooks/useRoutines";
import "./Routines.css";


const Routines = ({ mode = "my", currentUser }) => {
  const {
    activeTab,
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
  } = useRoutines(mode, currentUser);

  const formRef = useRef(null);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm, editingRoutine]);

  const handleEditClick = (routine) => {
    setEditingRoutine(routine);
    setShowForm(true);
  };

  return (
    <div className="routines-page">
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
            <FilterSidebar
              title="Ordenar Rutinas"
              className="routines-sidebar"
              idPrefix="rtn"
              muscularGroupSelected={muscularGroupSelected}
              handleOnCheckbox={handleOnCheckbox}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOptions={SortOptions}
            />
            <main className="routines-main">
              <RoutineList
                routines={sortedCommunityRoutines}
                isMine={false}
                onSaveToMine={handleSaveCommunityRoutine}
              />
              <div className="container-info-selected"></div>
            </main>
          </div>
        </section>
      )}
    </div>
  );
}

export default Routines;
