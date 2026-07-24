const Exercise = require("../models/Exercise");

const ExerciseController = {
  getAll: async (req, res) => {
    try {
      const exercises = await Exercise.findAll();
      res.json(exercises);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const exercise = await Exercise.findByPk(req.params.id);
      if (!exercise) {
        return res.status(404).json({ mensaje: "Ejercicio no encontrado" });
      }
      res.json(exercise);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const newExercise = await Exercise.create(req.body);
      res.json(newExercise);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const exercise = await Exercise.findByPk(req.params.id);
      if (!exercise) {
        return res.status(404).json({ mensaje: "Ejercicio no encontrado" });
      }
      await exercise.update(req.body);
      res.json({ mensaje: "Ejercicio actualizado ✓" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const exercise = await Exercise.findByPk(req.params.id);
      if (!exercise) {
        return res.status(404).json({ mensaje: "Ejercicio no encontrado" });
      }
      await exercise.destroy();
      res.json({ mensaje: "Ejercicio eliminado ✓" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = ExerciseController;
