<<<<<<< HEAD
const Exercise = require('../models/Exercise');

const ExerciseController = {
    getAll: (req, res) => {
        Exercise.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        });
    },

    getById: (req, res) => {
        Exercise.getById(req.params.id, (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json(result[0]);
        });
    },

    create: (req, res) => {
        Exercise.create(req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ id: result.insertId, ...req.body });
        });
    },

    update: (req, res) => {
        Exercise.update(req.params.id, req.body, (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ mensaje: 'Ejercicio actualizado ✓' });
        });
    },

    delete: (req, res) => {
        Ejercicio.delete(req.params.id, (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ mensaje: 'Exercise delete ✓' });
        });
    }
};

module.exports = ExerciseController;
=======
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
>>>>>>> origin/feature/JuaniPerroud
