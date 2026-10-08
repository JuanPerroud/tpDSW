const RoutineService = require("../services/RoutineService");

const RoutineController = {
  getAll: async (req, res) => {
    res.json(await RoutineService.list());
  },

  getById: async (req, res) => {
    res.json(await RoutineService.getById(Number(req.params.id)));
  },

  create: async (req, res) => {
    res.status(201).json(await RoutineService.create(req.body, req.user));
  },

  update: async (req, res) => {
    await RoutineService.update(Number(req.params.id), req.body, req.user);
    res.json({ mensaje: "Rutina actualizada ✓" });
  },

  delete: async (req, res) => {
    await RoutineService.remove(Number(req.params.id), req.user);
    res.json({ mensaje: "Rutina eliminada" });
  },
};

module.exports = RoutineController;
