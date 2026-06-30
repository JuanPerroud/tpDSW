const Ejercicio = require('../models/Ejercicio');

const EjercicioController = {
    getAll: (req, res) => {
        Ejercicio.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        });
    },

    getById: (req, res) => {
        Ejercicio.getById(req.params.id, (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json(result[0]);
        });
    },

    create: (req, res) => {
        Ejercicio.create(req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ id: result.insertId, ...req.body });
        });
    },

    update: (req, res) => {
        Ejercicio.update(req.params.id, req.body, (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ mensaje: 'Ejercicio actualizado ✓' });
        });
    },

    delete: (req, res) => {
        Ejercicio.delete(req.params.id, (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ mensaje: 'Ejercicio eliminado ✓' });
        });
    }
};

module.exports = EjercicioController;