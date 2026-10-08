const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { verifyToken } = require("../utils/token");

// Valida el JWT (Authorization: Bearer <token>) y carga el usuario actual en req.user.
// Se consulta la BD en cada request para que desactivar un usuario tenga efecto inmediato.
const authenticate = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Debés iniciar sesión para realizar esta acción");
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, "Sesión inválida o expirada. Iniciá sesión nuevamente");
  }

  const user = await User.findByPk(payload.id);
  if (!user) {
    throw new ApiError(401, "El usuario de la sesión ya no existe");
  }
  if (!user.status) {
    throw new ApiError(403, "Tu cuenta fue desactivada. Contactá al administrador.");
  }

  req.user = user;
  next();
};

// Nivel de acceso 2: solo administradores
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.isAdmin !== true) {
    throw new ApiError(403, "No tenés permisos para esta acción");
  }
  next();
};

module.exports = { authenticate, requireAdmin };
