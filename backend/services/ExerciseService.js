const { Op } = require("sequelize");
const Exercise = require("../models/Exercise");
const ApiError = require("../utils/ApiError");

// Reglas de negocio: un ejercicio global (público) solo lo gestiona un admin;
// uno privado solo lo gestiona su creador.
const assertCanModify = (exercise, actor, accion) => {
  if (exercise.isPublic) {
    if (!actor.isAdmin) {
      throw new ApiError(403, `Solo un administrador puede ${accion} ejercicios globales`);
    }
  } else if (exercise.creatorId !== actor.id) {
    throw new ApiError(403, `No podés ${accion} un ejercicio que no es tuyo`);
  }
};

const ExerciseService = {
  // Ejercicios públicos + los privados del usuario autenticado
  list(actor) {
    return Exercise.findAll({
      where: {
        [Op.or]: [{ isPublic: true }, { isPublic: false, creatorId: actor.id }],
      },
    });
  },

  async getById(id, actor) {
    const exercise = await Exercise.findByPk(id);
    if (!exercise) throw new ApiError(404, "Ejercicio no encontrado");
    if (!exercise.isPublic && exercise.creatorId !== actor.id && !actor.isAdmin) {
      throw new ApiError(403, "No tenés acceso a este ejercicio");
    }
    return exercise;
  },

  create({ name, description, muscleGroup }, actor) {
    return Exercise.create({
      name,
      description,
      muscleGroup,
      isPublic: actor.isAdmin === true,
      creatorId: actor.id,
    });
  },

  async update(id, { name, description, muscleGroup }, actor) {
    const exercise = await Exercise.findByPk(id);
    if (!exercise) throw new ApiError(404, "Ejercicio no encontrado");
    assertCanModify(exercise, actor, "editar");

    await exercise.update({ name, description, muscleGroup });
    return exercise;
  },

  async remove(id, actor) {
    const exercise = await Exercise.findByPk(id);
    if (!exercise) throw new ApiError(404, "Ejercicio no encontrado");
    assertCanModify(exercise, actor, "eliminar");

    await exercise.destroy();
  },
};

module.exports = ExerciseService;
