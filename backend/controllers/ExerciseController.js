const { Op } = require("sequelize");
const Exercise = require("../models/Exercise");

const ADMIN_ID = 1;

const ExerciseController = {

  getAll: async (req, res) => {
    try {
      const userId = parseInt(req.query.userId);
      let whereClause;

      if (userId) {
        // Ejercicios públicos + los privados creados por este usuario
        whereClause = {
          [Op.or]: [
            { isPublic: true },
            { isPublic: false, creatorId: userId },
          ],
        };
      } else {
        // Sin userId, solo públicos
        whereClause = { isPublic: true };
      }

      const exercises = await Exercise.findAll({ where: whereClause });
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
      const { name, description, muscleGroup, userId } = req.body;
      const creatorId = userId || null;
      const isPublic = creatorId === ADMIN_ID;

      const newExercise = await Exercise.create({
        name,
        description,
        muscleGroup,
        isPublic,
        creatorId,
      });
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

