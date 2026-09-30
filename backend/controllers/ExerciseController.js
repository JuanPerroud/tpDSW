const { Op } = require("sequelize");
const Exercise = require("../models/Exercise");
const User = require("../models/User");

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

      if (!userId) {
        return res.status(400).json({ mensaje: "Se requiere userId para crear un ejercicio" });
      }

      // Buscar al usuario para determinar su rol real
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      const isPublic = user.isAdmin === true;

      const newExercise = await Exercise.create({
        name,
        description,
        muscleGroup,
        isPublic,
        creatorId: userId,
      });
      res.json(newExercise);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const { userId, name, description, muscleGroup } = req.body;

      if (!userId) {
        return res.status(400).json({ mensaje: "Se requiere userId para editar un ejercicio" });
      }

      const exercise = await Exercise.findByPk(req.params.id);
      if (!exercise) {
        return res.status(404).json({ mensaje: "Ejercicio no encontrado" });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      // Ejercicio público (global) → solo un admin puede editarlo
      if (exercise.isPublic) {
        if (!user.isAdmin) {
          return res.status(403).json({ mensaje: "Solo un administrador puede editar ejercicios globales" });
        }
      } else {
        // Ejercicio privado → solo su creador puede editarlo
        if (exercise.creatorId !== userId) {
          return res.status(403).json({ mensaje: "No podés editar un ejercicio que no es tuyo" });
        }
      }

      await exercise.update({ name, description, muscleGroup });
      res.json({ mensaje: "Ejercicio actualizado ✓", exercise });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const userId = parseInt(req.query.userId);

      if (!userId || isNaN(userId)) {
        return res.status(400).json({ mensaje: "Se requiere userId para eliminar un ejercicio" });
      }

      const exercise = await Exercise.findByPk(req.params.id);
      if (!exercise) {
        return res.status(404).json({ mensaje: "Ejercicio no encontrado" });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      // Ejercicio público (global) → solo un admin puede eliminarlo
      if (exercise.isPublic) {
        if (!user.isAdmin) {
          return res.status(403).json({ mensaje: "Solo un administrador puede eliminar ejercicios globales" });
        }
      } else {
        // Ejercicio privado → solo su creador puede eliminarlo
        if (exercise.creatorId !== userId) {
          return res.status(403).json({ mensaje: "No podés eliminar un ejercicio que no es tuyo" });
        }
      }

      await exercise.destroy();
      res.json({ mensaje: "Ejercicio eliminado ✓" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = ExerciseController;
