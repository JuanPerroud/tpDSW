const User = require('../models/User');

const UserController = {
    getAll: async (req, res) => {
        try {
            const results = await User.findAll();
            res.json(results);
        } catch (err) {
            res.status(500).json({ error: err.message || err });
        }
    },

    getById: async (req, res) => {
        try {
            const result = await User.findByPk(req.params.id);
            if (!result) return res.status(404).json({ mensaje: 'User not found' });
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: err.message || err });
        }
    },

    create: async (req, res) => {
        try {
            const { email } = req.body;
            const findUser = await User.findOne({ where: { email } });
            if (findUser) {
                return res.status(400).json({ error: "email exist, try again whit other"});
            }
            const newUser = await User.create(req.body);
            res.status(201).json(newUser);
        } catch (err) {
            res.status(500).json({ error: err.message || err });
        }
    },

    //hacer el json como alert en el createUser.jsx para mostrarlo en pantalla (utilizar Yup #mensaje en rojo)

    update: async (req, res) => {
        try {
            const [updatedRows] = await User.update(req.body, {
                where: { id: req.params.id }
            });
            if (updatedRows === 0) return res.status(404).json({ mensaje: 'User not found' });
            res.json({ mensaje: 'User updated ✓' });
        } catch (err) {
            res.status(500).json({ error: err.message || err });
        }
    },

    delete: async (req, res) => {
        try {
            const deletedRows = await User.destroy({
                where: { id: req.params.id }
            });
            if (deletedRows === 0) return res.status(404).json({ mensaje: 'User not found' });
            res.json({ mensaje: 'User deleted ✓' });
        } catch (err) {
            res.status(500).json({ error: err.message || err });
        }
    }
}; 

module.exports = UserController;