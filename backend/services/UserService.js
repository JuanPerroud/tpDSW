const { Op } = require("sequelize");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const sanitizeUser = require("../utils/sanitizeUser");
const { hashPassword, verifyPassword } = require("../utils/password");
const { signToken } = require("../utils/token");

// Los administradores no se pueden eliminar ni desactivar
const findManageableTarget = async (id, accion) => {
  const target = await User.findByPk(id);
  if (!target) throw new ApiError(404, "Usuario no encontrado");
  if (target.isAdmin) {
    throw new ApiError(400, `No se puede ${accion} a un usuario administrador`);
  }
  return target;
};

const UserService = {
  async list(search) {
    const where = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};
    const users = await User.findAll({ where, attributes: { exclude: ["password"] } });
    return users;
  },

  async getById(id, actor) {
    if (!actor.isAdmin && actor.id !== id) {
      throw new ApiError(403, "No tenés permisos para ver este usuario");
    }
    const user = await User.findByPk(id);
    if (!user) throw new ApiError(404, "Usuario no encontrado");
    return sanitizeUser(user);
  },

  // El rol (isAdmin) y el estado nunca se toman del body: se evita la escalada de privilegios
  async register({ name, surname, age, email, password }) {
    const existing = await User.findOne({ where: { email } });
    if (existing) throw new ApiError(400, "El usuario ya existe");

    const user = await User.create({
      name,
      surname,
      age,
      email,
      password: await hashPassword(password),
    });
    return sanitizeUser(user);
  },

  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new ApiError(404, "El usuario no existe");

    if (!user.status) {
      throw new ApiError(403, "Tu cuenta fue desactivada. Contactá al administrador.");
    }

    const { valid, needsRehash } = await verifyPassword(password, user.password);
    if (!valid) throw new ApiError(400, "Contraseña incorrecta");

    if (needsRehash) {
      await user.update({ password: await hashPassword(password) });
    }

    return { user: sanitizeUser(user), token: signToken(user) };
  },

  async update(id, data, actor) {
    if (!actor.isAdmin && actor.id !== id) {
      throw new ApiError(403, "Solo podés modificar tu propio perfil");
    }
    const user = await User.findByPk(id);
    if (!user) throw new ApiError(404, "Usuario no encontrado");

    const { name, surname, age, password } = data;
    const changes = {};
    if (name !== undefined) changes.name = name;
    if (surname !== undefined) changes.surname = surname;
    if (age !== undefined) changes.age = age;
    if (password) changes.password = await hashPassword(password);

    await user.update(changes);
    return sanitizeUser(user);
  },

  async changePassword(actor, password) {
    await actor.update({ password: await hashPassword(password) });
  },


  async toggleActive(id) {
    const target = await findManageableTarget(id, "desactivar");
    await target.update({ status: !target.status });
    return sanitizeUser(target);
  },
};

module.exports = UserService;
