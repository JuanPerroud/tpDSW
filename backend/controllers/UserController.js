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
