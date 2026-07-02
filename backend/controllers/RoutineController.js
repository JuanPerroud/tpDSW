<<<<<<< HEAD
// 1. Importamos el modelo correcto de Rutinas (asegurate de que la ruta a models sea así)
const Routine = require('../models/Routine'); 

const RoutineController = {
    // Obtener todas las rutinas
    getAll: async (req, res) => {
        try {
            const results = await Routine.findAll(); // Método nativo de Sequelize
            res.json(results);
        } catch (err) {
            res.status(500).json({ error: err.message || err });
        }
    },

    // Obtener rutina por ID
    getById: async (req, res) => {
        try {
            // Buscamos por la clave primaria usando el nombre exacto del parámetro de tu ruta
            const result = await Routine.findByPk(req.params.idRutinas); 
            if (!result) return res.status(404).json({ error: 'Routine not find' });
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: err.message || err });
        }
    },

    // Crear una nueva rutina (El que usa tu formulario)
    create: async (req, res) => {
        try {
            // Sequelize mapea automáticamente el req.body con los campos de tu tabla
            const newRoutine = await Routine.create(req.body); 
            res.status(201).json(newRoutine);
        } catch (err) {
            res.status(500).json({ error: err.message || err });
        }
    },

    // Actualizar rutina
    update: async (req, res) => {
        try {
            const [updated] = await Routine.update(req.body, {
                where: { id: req.params.id } // Ajustá 'id' si tu clave primaria se llama distinto en la BD
            });
            res.json({ mensaje: 'Routine update ✓' });
        } catch (err) {
            res.status(500).json({ error: err.message || err });
        }
    },

    // Eliminar rutina
    delete: async (req, res) => {
        try {
            await Routine.destroy({
                where: { id: req.params.id } // Ajustá 'id' si tu clave primaria se llama distinto
            });
            res.json({ mensaje: 'Routine deleted ✓' });
        } catch (err) {
            res.status(500).json({ error: err.message || err });
        }
    }
};

module.exports = RoutineController;
=======
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
>>>>>>> origin/feature/JuaniPerroud
