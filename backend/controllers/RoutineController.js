const Routine = require("../models/Routine");

const RoutineController = {
  getAll: async (req, res) => {
    try {
      const routine = await Routine.findAll({
        include: [
          {
            model: require("../models/RoutineExercise"),
            include: [
              require("../models/Exercise"),
              require("../models/ExerciseSet"),
            ],
          },
        ],
      });
      res.json(routine);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const routine = await Routine.findByPk(req.params.id, {
        include: [
          {
            model: require("../models/RoutineExercise"),
            include: [
              require("../models/Exercise"),
              require("../models/ExerciseSet"),
            ],
          },
        ],
      });
      if (!routine) {
        return res.status(404).json({ mensaje: "Rutina no encontrada" });
      }
      res.json(routine);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { name, description, muscularGroup, creatorId, RoutineExercises } = req.body;
      const newRoutine = await Routine.create({
        name,
        description,
        muscularGroup,
        creatorId,
        RoutineExercises: RoutineExercises || []
      }, {
        include: [
          {
            model: require("../models/RoutineExercise"),
            include: [require("../models/ExerciseSet")]
          }
        ]
      });
      res.status(201).json(newRoutine);
    } catch (err) {
      console.error("Ocurrió un error al crear la rutina:", err);
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    const sequelize = require("../config/db");
    const t = await sequelize.transaction();
    try {
      const routine = await Routine.findByPk(req.params.id);
      if (!routine) {
        await t.rollback();
        return res.status(404).json({ mensaje: "Rutina no encontrada" });
      }

      const { name, description, muscularGroup, RoutineExercises } = req.body;
      await routine.update({ name, description, muscularGroup }, { transaction: t });

      if (RoutineExercises) {
        const RoutineExerciseModel = require("../models/RoutineExercise");
        const ExerciseSetModel = require("../models/ExerciseSet");

        await RoutineExerciseModel.destroy({ where: { routineId: routine.id }, transaction: t });

        for (const re of RoutineExercises) {
          const newRe = await RoutineExerciseModel.create({
            routineId: routine.id,
            exerciseId: re.exerciseId,
            orderIndex: re.orderIndex || 1,
            restSeconds: re.restSeconds || 90
          }, { transaction: t });

          if (re.ExerciseSets && re.ExerciseSets.length > 0) {
            const setsToCreate = re.ExerciseSets.map(set => ({
              routineExerciseId: newRe.id,
              setNumber: set.setNumber,
              reps: set.reps,
              weightKg: set.weightKg
            }));
            await ExerciseSetModel.bulkCreate(setsToCreate, { transaction: t });
          }
        }
      }

      await t.commit();
      res.json({ mensaje: "Rutina actualizada " });
    } catch (err) {
      await t.rollback();
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const routine = await Routine.findByPk(req.params.id);
      if (!routine) {
        return res.status(404).json({ mensaje: "Rutina no encontrada " });
      }
      await routine.destroy();
      res.json({ mensaje: "Rutina eliminada " });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = RoutineController;
