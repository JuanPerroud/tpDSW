const ExerciseService = require("../services/ExerciseService");

const ExerciseController = {
  getAll: async (req, res) => {
    res.json(await ExerciseService.list(req.user));
  },

  getById: async (req, res) => {
    res.json(await ExerciseService.getById(Number(req.params.id), req.user));
  },

  create: async (req, res) => {
    res.status(201).json(await ExerciseService.create(req.body, req.user));
  },

  update: async (req, res) => {
    const exercise = await ExerciseService.update(Number(req.params.id), req.body, req.user);
    res.json({ mensaje: "Ejercicio actualizado ✓", exercise });
  },

  delete: async (req, res) => {
    await ExerciseService.remove(Number(req.params.id), req.user);
    res.json({ mensaje: "Ejercicio eliminado ✓" });
  },
};

module.exports = ExerciseController;
