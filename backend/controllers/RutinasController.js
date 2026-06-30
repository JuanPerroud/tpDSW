const Rutinas = require('../models/Usuario');

const RutinasController = {
    getAll: (req, res) => {
        Rutinas.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        });
    },

    getById: (req, res) => {
        Rutinas.getById(req.params.idRutina, (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json(result[0]);
        });
    },

    create: (req, res) => {
        Rutinas.create(req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ idRutina: result.insertId, ...req.body });
        });
    },

    update: (req, res) => {
        Rutinas.update(req.params.idRutina, req.body, (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ mensaje: 'Rutina actualizada ✓' });
        });
    },

    delete: (req, res) => {
        Rutinas.delete(req.params.idRutina, (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ mensaje: 'Rutina eliminada ✓' });
        });
    }
};

module.exports = RutinasController;