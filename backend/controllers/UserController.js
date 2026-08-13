const { Op } = require("sequelize");
const User = require("../models/User");

const ADMIN_ID = 1;

const UserController = {
  getAll: async (req, res) => {
    try {
      const search = req.query.search || req.query.q;
      const whereClause = search
        ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
          ]
        }
        : {};

      const users = await User.findAll({ where: whereClause });
      res.json(users);
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
      const { email } = req.body;
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
      res.json({ mensaje: "Usuario actualizado " });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const adminId = parseInt(req.query.adminId);
      if (adminId !== ADMIN_ID) {
        return res.status(403).json({ mensaje: "No tenés permisos para esta acción" });
      }

      const userId = parseInt(req.params.id);
      if (userId === ADMIN_ID) {
        return res.status(400).json({ mensaje: "No se puede eliminar al administrador" });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
      await user.destroy();
      res.json({ mensaje: "Usuario eliminado " });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  toggleActive: async (req, res) => {
    try {
      const adminId = parseInt(req.query.adminId);
      if (adminId !== ADMIN_ID) {
        return res.status(403).json({ mensaje: "No tenés permisos para esta acción" });
      }

      const userId = parseInt(req.params.id);
      if (userId === ADMIN_ID) {
        return res.status(400).json({ mensaje: "No se puede desactivar al administrador" });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      await user.update({ status: !user.status });
      res.json({
        mensaje: user.status ? "Usuario activado" : "Usuario desactivado",
        user,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ mensaje: "El usuario no existe" });
      }

      if (!user.status) {
        return res.status(403).json({ mensaje: "Tu cuenta fue desactivada. Contactá al administrador." });
      }

      if (user.password !== password) {
        return res.status(400).json({ mensaje: "Contraseña incorrecta" });
      }

      return res.json({ mensaje: "Inicio de sesión exitoso", user });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};

module.exports = UserController;
