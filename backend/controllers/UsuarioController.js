const Usuario = require('../models/Usuario');

const UsuarioController = {
    getAll: (req, res) => {
        Usuario.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        });
    },

    getById: (req, res) => {
        Usuario.getById(req.params.id, (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json(result[0]);
        });
    },

    create: (req, res) => {
        Usuario.create(req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ id: result.insertId, ...req.body });
        });
    },

    update: (req, res) => {
        Usuario.update(req.params.id, req.body, (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ mensaje: 'Usuario actualizado ✓' });
        });
    },

    delete: (req, res) => {
        Usuario.delete(req.params.id, (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ mensaje: 'Usuario eliminado ✓' });
        });
    }
};

module.exports = UsuarioController;