const sequelize = require("../config/db");
const Routine = require("../models/Routine");
const RoutineExercise = require("../models/RoutineExercise");
const Exercise = require("../models/Exercise");
const ExerciseSet = require("../models/ExerciseSet");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

// Rutina + ejercicios (con su definición del catálogo) + series + creador (sin datos sensibles)
const fullInclude = () => [
  {
    model: RoutineExercise,
    include: [Exercise, ExerciseSet],
  },
  { model: User, as: "creator", attributes: ["id", "name", "surname"] },
];

const fullOrder = () => [
  [RoutineExercise, "orderIndex", "ASC"],
  [RoutineExercise, ExerciseSet, "setNumber", "ASC"],
];

const assertOwner = (routine, actor, accion) => {
  if (routine.creatorId !== actor.id && !actor.isAdmin) {
    throw new ApiError(403, `No podés ${accion} una rutina que no es tuya`);
  }
};

const RoutineService = {
  list() {
    return Routine.findAll({ include: fullInclude(), order: fullOrder() });
  },

  async getById(id) {
    const routine = await Routine.findByPk(id, { include: fullInclude(), order: fullOrder() });
    if (!routine) throw new ApiError(404, "Rutina no encontrada");
    return routine;
  },

  // El dueño siempre es el usuario autenticado (no se acepta creatorId del cliente)
  create({ name, description, muscleGroup, RoutineExercises }, actor) {
    return Routine.create(
      {
        name,
        description,
        muscleGroup,
        creatorId: actor.id,
        RoutineExercises: RoutineExercises || [],
      },
      { include: [{ model: RoutineExercise, include: [ExerciseSet] }] },
    );
  },

  async update(id, { name, description, muscleGroup, RoutineExercises }, actor) {
    const routine = await Routine.findByPk(id);
    if (!routine) throw new ApiError(404, "Rutina no encontrada");
    assertOwner(routine, actor, "editar");

    const t = await sequelize.transaction();
    try {
      const changes = Object.fromEntries(
        Object.entries({ name, description, muscleGroup }).filter(([, v]) => v !== undefined),
      );
      await routine.update(changes, { transaction: t });

      if (RoutineExercises) {
        await RoutineExercise.destroy({ where: { routineId: routine.id }, transaction: t });

        for (const re of RoutineExercises) {
          const created = await RoutineExercise.create(
            {
              routineId: routine.id,
              exerciseId: re.exerciseId,
              orderIndex: re.orderIndex || 1,
              restSeconds: re.restSeconds ?? 90,
            },
            { transaction: t },
          );

          if (re.ExerciseSets && re.ExerciseSets.length > 0) {
            await ExerciseSet.bulkCreate(
              re.ExerciseSets.map((set) => ({
                routineExerciseId: created.id,
                setNumber: set.setNumber,
                reps: set.reps,
                weightKg: set.weightKg,
              })),
              { transaction: t },
            );
          }
        }
      }

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  async remove(id, actor) {
    const routine = await Routine.findByPk(id);
    if (!routine) throw new ApiError(404, "Rutina no encontrada");
    assertOwner(routine, actor, "eliminar");

    await routine.destroy();
  },
};

module.exports = RoutineService;
