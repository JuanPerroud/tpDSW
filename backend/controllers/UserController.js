const UserService = require("../services/UserService");

const toId = (value) => Number(value);

const UserController = {
  getAll: async (req, res) => {
    const search = req.query.search || req.query.q;
    res.json(await UserService.list(search));
  },

  getById: async (req, res) => {
    res.json(await UserService.getById(toId(req.params.id), req.user));
  },

  create: async (req, res) => {
    res.status(201).json(await UserService.register(req.body));
  },

  update: async (req, res) => {
    const user = await UserService.update(toId(req.params.id), req.body, req.user);
    res.json({ mensaje: "Usuario actualizado exitosamente", user });
  },

  delete: async (req, res) => {
    await UserService.remove(toId(req.params.id));
    res.json({ mensaje: "Usuario eliminado" });
  },

  toggleActive: async (req, res) => {
    const user = await UserService.toggleActive(toId(req.params.id));
    res.json({
      mensaje: user.status ? "Usuario activado" : "Usuario desactivado",
      user,
    });
  },

  login: async (req, res) => {
    const { user, token } = await UserService.login(req.body);
    res.json({ mensaje: "Inicio de sesión exitoso", user, token });
  },

  changePassword: async (req, res) => {
    await UserService.changePassword(req.user, req.body.password);
    res.json({ mensaje: "Contraseña modificada con éxito" });
  },
};

module.exports = UserController;
