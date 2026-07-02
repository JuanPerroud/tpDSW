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