const { Op } = require("sequelize");
const User = require("../models/User");

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

      const { name, surname, age, password } = req.body;
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (surname !== undefined) updateData.surname = surname;
      if (age !== undefined && age !== "") updateData.age = age;
      if (password && password.trim() !== "") updateData.password = password;

      await user.update(updateData);
      res.json({ mensaje: "Usuario actualizado exitosamente", user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const adminId = parseInt(req.query.adminId);
      if (isNaN(adminId)) {
        return res.status(400).json({ mensaje: "ID de administrador no válido" });
      }

      const adminUser = await User.findByPk(adminId);
      if (!adminUser || !adminUser.isAdmin) {
        return res.status(403).json({ mensaje: "No tenés permisos para esta acción" });
      }

      const userId = parseInt(req.params.id);
      const targetUser = await User.findByPk(userId);
      if (!targetUser) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      if (targetUser.isAdmin) {
        return res.status(400).json({ mensaje: "No se puede eliminar a un usuario administrador" });
      }

      await targetUser.destroy();
      res.json({ mensaje: "Usuario eliminado" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  toggleActive: async (req, res) => {
    try {
      const adminId = parseInt(req.query.adminId);
      if (isNaN(adminId)) {
        return res.status(400).json({ mensaje: "ID de administrador no válido" });
      }

      const adminUser = await User.findByPk(adminId);
      if (!adminUser || !adminUser.isAdmin) {
        return res.status(403).json({ mensaje: "No tenés permisos para esta acción" });
      }

      const userId = parseInt(req.params.id);
      const targetUser = await User.findByPk(userId);
      if (!targetUser) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      if (targetUser.isAdmin) {
        return res.status(400).json({ mensaje: "No se puede desactivar a un usuario administrador" });
      }

      await targetUser.update({ status: !targetUser.status });
      res.json({
        mensaje: targetUser.status ? "Usuario activado" : "Usuario desactivado",
        user: targetUser,
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

  changePassword: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ mensaje: "El correo y la nueva contraseña son obligatorios" });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ mensaje: "No existe ningún usuario registrado con ese correo" });
      }

      await user.update({ password });
      return res.json({ mensaje: "Contraseña modificada con éxito" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};

module.exports = UserController;
