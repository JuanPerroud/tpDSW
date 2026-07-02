<<<<<<< HEAD
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
=======
const User = require("../models/User");

const UserController = {
  getAll: async (req, res) => {
    try {
      const user = await User.findAll();
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { email } = res.body;
      const findUser = await User.findOne({ where: { email } });
      if (findUser) {
        return res.status(400).json({ mensaje: "El usuario ya existe" });
      }
      const newUser = await User.create(req.body);
      res.json(newUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
      await user.update(req.body);
      res.json({ mensaje: "Usuario actualizado ✓" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
      await user.destroy();
      res.json({ mensaje: "Usuario eliminado ✓" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = UserController;
>>>>>>> origin/feature/JuaniPerroud
