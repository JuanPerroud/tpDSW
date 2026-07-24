const Routine = require("../models/Routine");

const RoutineController = {
  getAll: async (req, res) => {
    try {
      const routine = await Routine.findAll();
      res.json(routine);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const routine = await Routine.findByPk(req.params.id);
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
      const newRoutine = await Routine.create(req.body);
      res.json(newRoutine);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const routine = await Routine.findByPk(req.params.id);
      if (!routine) {
        return res.status(404).json({ mensaje: "Rutina no encontrada" });
      }
      await routine.update(req.body);
      res.json({ mensaje: "Rutina actualizada ✓" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const routine = await Routine.findByPk(req.params.id);
      if (!routine) {
        return res.status(404).json({ mensaje: "Rutina no encontrada" });
      }
      await routine.destroy();
      res.json({ mensaje: "Rutina eliminada ✓" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = RoutineController;
